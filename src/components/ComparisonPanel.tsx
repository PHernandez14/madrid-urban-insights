import React, { useMemo, useState } from 'react';
import { ExpandedUrbanIndicators, expandedKpiCategories, expandedMetricLabels } from '../data/expandedMadridData';
import { datosEconomicosOficialesMadrid } from '../data/datosEconomicosOficialesMadrid';
import { preciosOficialesMadrid } from '../data/preciosOficialesMadrid';
import BarChart from './BarChart';
import ScatterPlot from './ScatterPlot';
import datosComerciales from '../data/datosComercialesMadrid';

type CategoryKey = keyof typeof expandedKpiCategories;

interface ComparisonPanelProps {
  data: ExpandedUrbanIndicators[];
  year: number;
  selectedDistricts: string[];
  onDistrictSelect: (districtId: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
}

const MAX_SELECTED = 4;

function formatMetricValue(value: number, metricKey: string): string {
  const customMetricLabels: Record<string, { label: string; unit: string; format?: string }> = {
    // Economía
    rentaMediaPersona: { label: 'Renta media por persona', unit: '€/año' },
    tasaParo: { label: 'Tasa de paro', unit: '%', format: 'percentage' },
    localesComerciales: { label: 'Locales comerciales', unit: 'locales' },
    // Vivienda
    precioVentaM2: { label: 'Precio venta m²', unit: '€/m²' },
    precioAlquilerM2: { label: 'Precio alquiler m²', unit: '€/m²' },
    // Comercio
    totalLocales: { label: 'Locales totales', unit: 'locales' },
    localesAbiertos: { label: 'Locales abiertos', unit: 'locales' },
    licenciasConcedidas: { label: 'Licencias concedidas', unit: 'licencias' },
    licenciasEnTramite: { label: 'Licencias en trámite', unit: 'licencias' },
    licenciasDenegadas: { label: 'Licencias denegadas', unit: 'licencias' },
    terrazasTotal: { label: 'Terrazas', unit: 'unidades' },
    terrazasSuperficieTotal: { label: 'Superficie terrazas', unit: 'm²' },
    terrazasMesasTotales: { label: 'Mesas terrazas', unit: 'mesas' },
    terrazasSillasTotales: { label: 'Sillas terrazas', unit: 'sillas' },
    // Turismo
    numeroVUTs: { label: 'Viviendas Turísticas (VUTs)', unit: 'viviendas' },
    // Demografía y otros (del expandedData)
    averageIncome: { label: 'Renta media', unit: '€' },
    averagePriceM2: { label: 'Precio medio m²', unit: '€/m²' },
    populationDensity: { label: 'Densidad poblacional', unit: 'hab/km²' },
    unemploymentRate: { label: 'Tasa de desempleo', unit: '%', format: 'percentage' },
  };
  const meta = expandedMetricLabels[metricKey] || customMetricLabels[metricKey];
  if (!meta) return String(value);
  if (meta.format === 'percentage') {
    return `${Number(value).toFixed(1)}%`;
  }
  // Formato amigable para magnitudes grandes
  if (typeof value === 'number') {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return value.toLocaleString('es-ES');
    return `${value}`;
  }
  return String(value);
}

const ComparisonPanel: React.FC<ComparisonPanelProps> = ({
  data,
  year,
  selectedDistricts,
  onDistrictSelect,
  selectedCategory,
  onCategoryChange,
}) => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'comparison' | 'statistics' | 'assistant'>('comparison');

  const allowedCategoryKeys = (Object.keys(expandedKpiCategories).filter(k => k !== 'services') as CategoryKey[]);
  
  // Todas las métricas disponibles para la categoría "Libre"
  const allAvailableMetrics = [
    // Economía
    'rentaMediaPersona', 'tasaParo', 'localesComerciales',
    // Vivienda
    'precioVentaM2', 'precioAlquilerM2',
    // Comercio
    'totalLocales', 'localesAbiertos', 'licenciasConcedidas', 'licenciasEnTramite', 'licenciasDenegadas',
    'terrazasTotal', 'terrazasSuperficieTotal', 'terrazasMesasTotales', 'terrazasSillasTotales',
    // Turismo
    'numeroVUTs',
    // Demografía (algunas métricas del expandedData que existen)
    'averageIncome', 'averagePriceM2', 'populationDensity', 'unemploymentRate'
  ];

  // Categorías personalizadas (fuentes oficiales fuera de expandedUrbanIndicators)
  const customCategories: Record<string, { name: string; metrics: string[] }> = {
    libre: {
      name: 'Libre',
      metrics: allAvailableMetrics,
    },
    commerce: {
      name: 'Comercio',
      metrics: [
        'totalLocales',
        'localesAbiertos',
        'licenciasConcedidas',
        'licenciasEnTramite',
        'licenciasDenegadas',
        'terrazasTotal',
        'terrazasSuperficieTotal',
        'terrazasMesasTotales',
        'terrazasSillasTotales',
      ],
    },
    tourism: {
      name: 'Turismo',
      metrics: ['numeroVUTs'],
    },
  };
  const isCustomCategory = selectedCategory === 'commerce' || selectedCategory === 'tourism' || selectedCategory === 'libre';
  const categoryKey = (
    selectedCategory && !isCustomCategory && allowedCategoryKeys.includes(selectedCategory as CategoryKey)
      ? (selectedCategory as CategoryKey)
      : allowedCategoryKeys[0]
  );
  const category = expandedKpiCategories[categoryKey] || expandedKpiCategories.economy;
  // Adaptar métricas a las fuentes de Análisis cuando aplique
  let categoryMetrics = category.metrics as string[];
  if (categoryKey === 'economy') {
    // Limitar a métricas disponibles en datosEconomicosOficialesMadrid
    categoryMetrics = ['rentaMediaPersona', 'tasaParo', 'localesComerciales'];
  }
  if (categoryKey === 'housing') {
    // Usar precios oficiales por distrito
    categoryMetrics = ['precioVentaM2', 'precioAlquilerM2'];
  }
  if (selectedCategory === 'libre') {
    categoryMetrics = customCategories.libre.metrics;
  }
  if (selectedCategory === 'commerce') {
    categoryMetrics = customCategories.commerce.metrics;
  }
  if (selectedCategory === 'tourism') {
    categoryMetrics = customCategories.tourism.metrics;
  }

  const [xMetric, setXMetric] = useState<string>(categoryMetrics[0] || 'averageIncome');
  const [yMetric, setYMetric] = useState<string>(categoryMetrics[1] || 'averagePriceM2');

  // Limitar valores de X/Y a métricas de la categoría actual
  React.useEffect(() => {
    if (categoryMetrics.length === 0) return;
    if (!categoryMetrics.includes(xMetric)) setXMetric(categoryMetrics[0]);
    if (!categoryMetrics.includes(yMetric)) setYMetric(categoryMetrics[1] || categoryMetrics[0]);
  }, [selectedCategory]);

  // Métricas disponibles para la dispersión (sólo si existen en expanded data)
  const scatterMetrics = useMemo(() => {
    // Para categorías oficiales (economía/vivienda) usaremos datasets oficiales; para custom, también, no expanded
    if (categoryKey === 'economy') return ['rentaMediaPersona', 'tasaParo'];
    if (categoryKey === 'housing') return ['precioVentaM2', 'precioAlquilerM2'];
    if (selectedCategory === 'libre') {
      // En modo libre, permitir todas las métricas que tengan datos
      return allAvailableMetrics.slice(0, 10); // Limitar a las primeras 10 para no saturar la UI
    }
    if (selectedCategory === 'commerce') return ['totalLocales', 'localesAbiertos'];
    if (selectedCategory === 'tourism') return ['numeroVUTs'];
    // Por defecto, filtrar las que existan en expanded
    const metricExists = (m: string) => data.some(d => Number.isFinite(Number((d as any)[m])));
    return categoryMetrics.filter(metricExists);
  }, [categoryMetrics, data, categoryKey, selectedCategory, allAvailableMetrics]);

  React.useEffect(() => {
    if (scatterMetrics.length === 0) return;
    if (!scatterMetrics.includes(xMetric)) setXMetric(scatterMetrics[0]);
    if (!scatterMetrics.includes(yMetric)) setYMetric(scatterMetrics[1] || scatterMetrics[0]);
  }, [scatterMetrics]);

  const allDistricts = useMemo(
    () => Array.from(new Set(data.map(d => ({ id: d.districtId, name: d.districtName })))).sort((a, b) => a.name.localeCompare(b.name, 'es')),
    [data]
  );

  const filteredDistricts = useMemo(
    () => allDistricts.filter(d => d.name.toLowerCase().includes(search.toLowerCase())),
    [allDistricts, search]
  );

  const selectedData = useMemo(
    () => data.filter(d => selectedDistricts.includes(d.districtId)),
    [data, selectedDistricts]
  );

  // Mapas oficiales por nombre (para economía y vivienda)
  const econByName = useMemo(() => new Map(datosEconomicosOficialesMadrid.map(e => [e.distritoNombre.toLowerCase(), e])), []);
  const priceByName = useMemo(() => new Map(preciosOficialesMadrid.map(p => [p.distritoNombre.toLowerCase(), p])), []);



  const customMetricLabels: Record<string, { label: string; unit: string; format?: string }> = {
    // Economía
    rentaMediaPersona: { label: 'Renta media por persona', unit: '€/año' },
    tasaParo: { label: 'Tasa de paro', unit: '%', format: 'percentage' },
    localesComerciales: { label: 'Locales comerciales', unit: 'locales' },
    // Vivienda
    precioVentaM2: { label: 'Precio venta m²', unit: '€/m²' },
    precioAlquilerM2: { label: 'Precio alquiler m²', unit: '€/m²' },
    // Comercio
    totalLocales: { label: 'Locales totales', unit: 'locales' },
    localesAbiertos: { label: 'Locales abiertos', unit: 'locales' },
    licenciasConcedidas: { label: 'Licencias concedidas', unit: 'licencias' },
    licenciasEnTramite: { label: 'Licencias en trámite', unit: 'licencias' },
    licenciasDenegadas: { label: 'Licencias denegadas', unit: 'licencias' },
    terrazasTotal: { label: 'Terrazas', unit: 'unidades' },
    terrazasSuperficieTotal: { label: 'Superficie terrazas', unit: 'm²' },
    terrazasMesasTotales: { label: 'Mesas terrazas', unit: 'mesas' },
    terrazasSillasTotales: { label: 'Sillas terrazas', unit: 'sillas' },
    // Turismo
    numeroVUTs: { label: 'Viviendas Turísticas (VUTs)', unit: 'viviendas' },
    // Demografía y otros (del expandedData)
    averageIncome: { label: 'Renta media', unit: '€' },
    averagePriceM2: { label: 'Precio medio m²', unit: '€/m²' },
    populationDensity: { label: 'Densidad poblacional', unit: 'hab/km²' },
    unemploymentRate: { label: 'Tasa de desempleo', unit: '%', format: 'percentage' },
  };

  const minMaxByMetric = useMemo(() => {
    const result: Record<string, { min: number; max: number }> = {};
    const fromOfficial = (m: string): number[] => {
      // En modo libre, obtener datos de la fuente apropiada según la métrica
      if (selectedCategory === 'libre') {
        // Económicas
        if (['rentaMediaPersona', 'tasaParo', 'localesComerciales'].includes(m)) {
          return datosEconomicosOficialesMadrid.map(e => Number((e as any)[m])).filter(Number.isFinite);
        }
        // Vivienda
        if (['precioVentaM2', 'precioAlquilerM2'].includes(m)) {
          return preciosOficialesMadrid.map(p => Number((p as any)[m])).filter(Number.isFinite);
        }
        // Comercio
        if (['totalLocales', 'localesAbiertos', 'licenciasConcedidas', 'licenciasEnTramite', 'licenciasDenegadas', 'terrazasTotal', 'terrazasSuperficieTotal', 'terrazasMesasTotales', 'terrazasSillasTotales'].includes(m)) {
          return datosComerciales.map(dc => {
            const mapRow: Record<string, number> = {
              totalLocales: dc.totalLocales,
              localesAbiertos: dc.localesAbiertos,
              licenciasConcedidas: dc.licencias?.concedidas ?? 0,
              licenciasEnTramite: dc.licencias?.enTramite ?? 0,
              licenciasDenegadas: dc.licencias?.denegadas ?? 0,
              terrazasTotal: dc.terrazas?.total ?? 0,
              terrazasSuperficieTotal: dc.terrazas?.superficieTotal ?? 0,
              terrazasMesasTotales: dc.terrazas?.mesasTotales ?? 0,
              terrazasSillasTotales: dc.terrazas?.sillasTotales ?? 0,
            };
            return Number(mapRow[m] ?? NaN);
          }).filter(Number.isFinite);
        }
        // Resto (expandedData)
        return data.map(d => Number(d[m as keyof ExpandedUrbanIndicators] as number)).filter(Number.isFinite);
      }
      
      if (categoryKey === 'economy') return datosEconomicosOficialesMadrid.map(e => Number((e as any)[m])).filter(Number.isFinite);
      if (categoryKey === 'housing') return preciosOficialesMadrid.map(p => Number((p as any)[m])).filter(Number.isFinite);
      if (selectedCategory === 'commerce') {
        return datosComerciales.map(dc => {
          const mapRow: Record<string, number> = {
            totalLocales: dc.totalLocales,
            localesAbiertos: dc.localesAbiertos,
            licenciasConcedidas: dc.licencias?.concedidas ?? 0,
            licenciasEnTramite: dc.licencias?.enTramite ?? 0,
            licenciasDenegadas: dc.licencias?.denegadas ?? 0,
            terrazasTotal: dc.terrazas?.total ?? 0,
            terrazasSuperficieTotal: dc.terrazas?.superficieTotal ?? 0,
            terrazasMesasTotales: dc.terrazas?.mesasTotales ?? 0,
            terrazasSillasTotales: dc.terrazas?.sillasTotales ?? 0,
          };
          return Number(mapRow[m] ?? NaN);
        }).filter(Number.isFinite);
      }
      if (selectedCategory === 'tourism') return []; // para heatmap si se usa, lo evitaremos
      return data.map(d => Number(d[m as keyof ExpandedUrbanIndicators] as number)).filter(Number.isFinite);
    };
    categoryMetrics.forEach(m => {
      const values = fromOfficial(m);
      const min = values.length ? Math.min(...values) : 0;
      const max = values.length ? Math.max(...values) : 1;
      result[m] = { min, max };
    });
    return result;
  }, [data, categoryMetrics, categoryKey, selectedCategory]);



  // --- Estadísticas descriptivas (media, mediana, moda, etc.) ---
  const [statsMetric, setStatsMetric] = useState<string>(categoryMetrics[0] || 'averageIncome');

  React.useEffect(() => {
    if (!categoryMetrics.includes(statsMetric)) setStatsMetric(categoryMetrics[0] || 'averageIncome');
  }, [selectedCategory]);


  function computeStats(values: number[]) {
    const arr = values.filter(v => Number.isFinite(v)).slice().sort((a, b) => a - b);
    const n = arr.length;
    if (n === 0) return null;
    const mean = arr.reduce((s, v) => s + v, 0) / n;
    const median = n % 2 ? arr[(n - 1) / 2] : (arr[n / 2 - 1] + arr[n / 2]) / 2;
    const min = arr[0];
    const max = arr[n - 1];
    const p = (q: number) => {
      const pos = (n - 1) * q;
      const base = Math.floor(pos);
      const rest = pos - base;
      return arr[base] + (arr[base + 1] !== undefined ? rest * (arr[base + 1] - arr[base]) : 0);
    };
    const p25 = p(0.25);
    const p75 = p(0.75);
    const variance = arr.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / n;
    const stdDev = Math.sqrt(variance);
    // Moda: valor más frecuente; si no hay repeticiones, devolver null
    const freq = new Map<number, number>();
    arr.forEach(v => freq.set(v, (freq.get(v) || 0) + 1));
    let modeValue = arr[0];
    let modeCount = 0;
    freq.forEach((c, v) => { if (c > modeCount) { modeCount = c; modeValue = v; } });
    const mode = modeCount > 1 ? modeValue : null;
    return { n, mean, median, mode, min, max, p25, p75, stdDev };
  }

  const statsData = useMemo(() => {
    let values: number[] = [];
    let unit = '';
    let format: string | undefined = undefined;
    
    // CAMBIO CLAVE: Solo calcular estadísticas sobre los distritos seleccionados
    const selectedDistrictNames = selectedData.map(d => d.districtName.toLowerCase());
    
    if (selectedCategory === 'libre') {
      // En modo libre, obtener datos de la fuente apropiada según la métrica
      if (['rentaMediaPersona', 'tasaParo', 'localesComerciales'].includes(statsMetric)) {
        values = datosEconomicosOficialesMadrid
          .filter(e => selectedDistrictNames.includes(e.distritoNombre.toLowerCase()))
          .map(e => Number((e as any)[statsMetric]))
          .filter(Number.isFinite);
      } else if (['precioVentaM2', 'precioAlquilerM2'].includes(statsMetric)) {
        values = preciosOficialesMadrid
          .filter(p => selectedDistrictNames.includes(p.distritoNombre.toLowerCase()))
          .map(p => Number((p as any)[statsMetric]))
          .filter(Number.isFinite);
      } else if (['totalLocales', 'localesAbiertos', 'licenciasConcedidas', 'licenciasEnTramite', 'licenciasDenegadas', 'terrazasTotal', 'terrazasSuperficieTotal', 'terrazasMesasTotales', 'terrazasSillasTotales'].includes(statsMetric)) {
        values = datosComerciales
          .filter(dc => dc.nombre && selectedDistrictNames.includes(dc.nombre.toLowerCase()))
          .map(dc => {
            const mapRow: Record<string, number> = {
              totalLocales: dc.totalLocales,
              localesAbiertos: dc.localesAbiertos,
              licenciasConcedidas: dc.licencias?.concedidas ?? 0,
              licenciasEnTramite: dc.licencias?.enTramite ?? 0,
              licenciasDenegadas: dc.licencias?.denegadas ?? 0,
              terrazasTotal: dc.terrazas?.total ?? 0,
              terrazasSuperficieTotal: dc.terrazas?.superficieTotal ?? 0,
              terrazasMesasTotales: dc.terrazas?.mesasTotales ?? 0,
              terrazasSillasTotales: dc.terrazas?.sillasTotales ?? 0,
            };
            return Number(mapRow[statsMetric] ?? NaN);
          }).filter(Number.isFinite);
      } else {
        values = selectedData.map(d => Number(d[statsMetric as keyof ExpandedUrbanIndicators] as number)).filter(Number.isFinite);
      }
      // Obtener unidad y formato desde customMetricLabels
      unit = customMetricLabels[statsMetric]?.unit || expandedMetricLabels[statsMetric]?.unit || '';
      format = customMetricLabels[statsMetric]?.format || expandedMetricLabels[statsMetric]?.format;
    } else if (categoryKey === 'economy') {
      values = datosEconomicosOficialesMadrid
        .filter(e => selectedDistrictNames.includes(e.distritoNombre.toLowerCase()))
        .map(e => Number((e as any)[statsMetric]))
        .filter(Number.isFinite);
      if (statsMetric === 'tasaParo') { unit = '%'; format = 'percentage'; }
      if (statsMetric === 'rentaMediaPersona') { unit = '€'; }
      if (statsMetric === 'localesComerciales') { unit = 'locales'; }
    } else if (categoryKey === 'housing') {
      values = preciosOficialesMadrid
        .filter(p => selectedDistrictNames.includes(p.distritoNombre.toLowerCase()))
        .map(p => Number((p as any)[statsMetric]))
        .filter(Number.isFinite);
      if (statsMetric === 'precioVentaM2' || statsMetric === 'precioAlquilerM2') { unit = '€/m²'; }
    } else {
      values = selectedData.map(d => Number(d[statsMetric as keyof ExpandedUrbanIndicators] as number)).filter(Number.isFinite);
      unit = expandedMetricLabels[statsMetric]?.unit || '';
      format = expandedMetricLabels[statsMetric]?.format;
    }
    return { values, unit, format } as { values: number[]; unit: string; format?: string };
  }, [statsMetric, selectedData, categoryKey, selectedCategory]);

  const stats = useMemo(() => computeStats(statsData.values), [statsData.values]);

  const formatWithUnit = (value: number | null | undefined) => {
    if (value === null || value === undefined || Number.isNaN(value)) return '—';
    if (statsData.format === 'percentage') return `${Number(value).toFixed(1)}%`;
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M${statsData.unit ? ` ${statsData.unit}` : ''}`;
    if (value >= 1_000) return `${Math.round(value).toLocaleString('es-ES')}${statsData.unit ? ` ${statsData.unit}` : ''}`;
    const num = Number.isInteger(value) ? value : Number(value.toFixed(1));
    return `${num}${statsData.unit ? ` ${statsData.unit}` : ''}`;
  };

  return (
    <div className="space-y-6">
      {/* Header con pestañas */}
      <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between p-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Panel de Comparación</h2>
            <p className="text-xs text-gray-500">Año {year} · Seleccionados {selectedDistricts.length}/{MAX_SELECTED}</p>
          </div>
        </div>
        
        {/* Sistema de pestañas */}
        <div className="border-t border-gray-200">
          <nav className="flex space-x-8 px-4" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('comparison')}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'comparison'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Comparativa
            </button>
            <button
              onClick={() => setActiveTab('statistics')}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'statistics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Estadísticas
            </button>
            <button
              onClick={() => setActiveTab('assistant')}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'assistant'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Asistente Inteligente
            </button>
          </nav>
        </div>
      </div>

      {/* Contenido de la pestaña Comparativa */}
      {activeTab === 'comparison' && (
    <div className="space-y-6">
      {/* Controles */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div>
                <h3 className="text-md font-semibold text-gray-900">Configuración de Comparativa</h3>
                <p className="text-xs text-gray-500">Selecciona distritos y categorías para comparar</p>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Categoría</label>
            <select
              value={isCustomCategory ? selectedCategory : categoryKey}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm"
            >
              <option value="libre">Libre</option>
              {allowedCategoryKeys.map((k) => (
                <option key={String(k)} value={String(k)}>
                  {expandedKpiCategories[k as CategoryKey].name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar distrito…"
              className="w-full md:w-80 border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-56 overflow-auto">
            {filteredDistricts.map(d => {
              const checked = selectedDistricts.includes(d.id);
              const atLimit = !checked && selectedDistricts.length >= MAX_SELECTED;
              return (
                <label key={d.id} className={`flex items-center gap-2 p-2 rounded border ${checked ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-white'}`}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onDistrictSelect(d.id)}
                    disabled={atLimit}
                  />
                  <span className="text-sm text-gray-800">{d.name}</span>
                </label>
              );
            })}
          </div>
          {selectedDistricts.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {selectedDistricts.map(id => {
                const name = allDistricts.find(d => d.id === id)?.name || id;
                return (
                  <span key={id} className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    {name}
                    <button
                      type="button"
                      onClick={() => onDistrictSelect(id)}
                      className="ml-1 rounded-full w-4 h-4 flex items-center justify-center bg-blue-200 hover:bg-blue-300 text-blue-900"
                      aria-label={`Quitar ${name}`}
                    >
                      ×
                    </button>
                  </span>
                );
              })}
              <button
                type="button"
                onClick={() => { selectedDistricts.forEach(id => onDistrictSelect(id)); }}
                className="text-xs ml-1 px-2 py-1 border rounded-md hover:bg-gray-50"
              >
                Limpiar selección
              </button>
            </div>
          )}
        </div>
      </div>

      

      {/* Barras comparativas + Dispersión */}
      {selectedData.length >= 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-sm font-semibold text-gray-900">Comparativa — {selectedCategory === 'libre' ? 'Libre' : (isCustomCategory ? (selectedCategory === 'commerce' ? 'Comercio' : 'Turismo') : expandedKpiCategories[categoryKey].name)}</h3>
              <div className="relative group">
                <div className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold cursor-help">
                  i
                </div>
                <div className="absolute left-0 top-6 w-72 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <div className="mb-2">
                    <strong>¿Qué muestra?</strong>
                  </div>
                  <p className="mb-2">
                    Muestra los valores exactos de cada métrica para los distritos seleccionados, organizados por categorías temáticas.
                  </p>
                  <p>
                    <strong>Utilidad:</strong> Te permite comparar cifras específicas entre distritos de forma rápida y directa.
                  </p>
                  <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryMetrics.slice(0, 6).map((m) => {
                const values = selectedData.map((d) => {
                  let value = 0;
                  if (selectedCategory === 'libre') {
                    if (['rentaMediaPersona', 'tasaParo', 'localesComerciales'].includes(m)) {
                    const econ = econByName.get(d.districtName.toLowerCase());
                      value = econ ? (econ as any)[m] ?? 0 : 0;
                    } else if (['precioVentaM2', 'precioAlquilerM2'].includes(m)) {
                      const p = priceByName.get(d.districtName.toLowerCase());
                      value = p ? (p as any)[m] ?? 0 : 0;
                    } else if (['totalLocales', 'localesAbiertos', 'licenciasConcedidas', 'licenciasEnTramite', 'licenciasDenegadas', 'terrazasTotal', 'terrazasSuperficieTotal', 'terrazasMesasTotales', 'terrazasSillasTotales'].includes(m)) {
                      const dc = datosComerciales.find(r => r.nombre?.toLowerCase() === d.districtName.toLowerCase());
                      const mapRow: Record<string, number> = {
                        totalLocales: dc?.totalLocales ?? 0,
                        localesAbiertos: dc?.localesAbiertos ?? 0,
                        licenciasConcedidas: dc?.licencias?.concedidas ?? 0,
                        licenciasEnTramite: dc?.licencias?.enTramite ?? 0,
                        licenciasDenegadas: dc?.licencias?.denegadas ?? 0,
                        terrazasTotal: dc?.terrazas?.total ?? 0,
                        terrazasSuperficieTotal: dc?.terrazas?.superficieTotal ?? 0,
                        terrazasMesasTotales: dc?.terrazas?.mesasTotales ?? 0,
                        terrazasSillasTotales: dc?.terrazas?.sillasTotales ?? 0,
                      };
                      value = mapRow[m] ?? 0;
                    } else {
                      value = (d[m as keyof ExpandedUrbanIndicators] as number) ?? 0;
                    }
                  } else if (categoryKey === 'economy') {
                    const econ = econByName.get(d.districtName.toLowerCase());
                    value = econ ? (econ as any)[m] ?? 0 : 0;
                } else if (categoryKey === 'housing') {
                    const p = priceByName.get(d.districtName.toLowerCase());
                    value = p ? (p as any)[m] ?? 0 : 0;
                } else {
                    value = (d[m as keyof ExpandedUrbanIndicators] as number) ?? 0;
                  }
                  return { district: d.districtName, value: Number(value) };
                });

                return (
                  <div key={m} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      {customMetricLabels[m]?.label || expandedMetricLabels[m]?.label || m}
                    </h4>
                    <div className="space-y-2">
                      {values.map((item) => (
                        <div key={item.district} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 truncate max-w-[120px]">{item.district}</span>
                          <span className="text-sm font-semibold text-gray-900">
                            {formatMetricValue(item.value, m)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            {scatterMetrics.length >= 2 ? (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <label className="text-sm text-gray-600">X</label>
                  <select value={xMetric} onChange={(e) => setXMetric(e.target.value)} className="border border-gray-300 rounded-md px-2 py-1 text-sm">
                    {scatterMetrics.map(m => (<option key={m} value={m}>{expandedMetricLabels[m]?.label || customMetricLabels[m]?.label || m}</option>))}
                  </select>
                  <label className="text-sm text-gray-600 ml-2">Y</label>
                  <select value={yMetric} onChange={(e) => setYMetric(e.target.value)} className="border border-gray-300 rounded-md px-2 py-1 text-sm">
                    {scatterMetrics.map(m => (<option key={m} value={m}>{expandedMetricLabels[m]?.label || customMetricLabels[m]?.label || m}</option>))}
                  </select>
                </div>
                {(() => {
                  let points: Array<{ name: string; x: number; y: number; isSelected?: boolean }> = [];
                  if (categoryKey === 'economy') {
                    points = selectedData.map(d => {
                      const e = econByName.get(d.districtName.toLowerCase());
                      return { name: d.districtName, x: Number((e as any)?.[xMetric] ?? NaN), y: Number((e as any)?.[yMetric] ?? NaN), isSelected: selectedDistricts.includes(d.districtId) };
                    }).filter(p => Number.isFinite(p.x) && Number.isFinite(p.y));
                  } else if (categoryKey === 'housing') {
                    points = selectedData.map(d => {
                      const p = priceByName.get(d.districtName.toLowerCase());
                      return { name: d.districtName, x: Number((p as any)?.[xMetric] ?? NaN), y: Number((p as any)?.[yMetric] ?? NaN), isSelected: selectedDistricts.includes(d.districtId) };
                    }).filter(p => Number.isFinite(p.x) && Number.isFinite(p.y));
                  } else if (selectedCategory === 'commerce') {
                    points = selectedData.map(d => {
                      const dc = datosComerciales.find(r => r.nombre?.toLowerCase() === d.districtName.toLowerCase());
                      const mapRow: Record<string, number | undefined> = {
                        totalLocales: dc?.totalLocales,
                        localesAbiertos: dc?.localesAbiertos,
                        licenciasConcedidas: dc?.licencias?.concedidas,
                        licenciasEnTramite: dc?.licencias?.enTramite,
                        licenciasDenegadas: dc?.licencias?.denegadas,
                        terrazasTotal: dc?.terrazas?.total,
                        terrazasSuperficieTotal: dc?.terrazas?.superficieTotal,
                        terrazasMesasTotales: dc?.terrazas?.mesasTotales,
                        terrazasSillasTotales: dc?.terrazas?.sillasTotales,
                      };
                      return { name: d.districtName, x: Number(mapRow[xMetric] ?? NaN), y: Number(mapRow[yMetric] ?? NaN), isSelected: selectedDistricts.includes(d.districtId) };
                    }).filter(p => Number.isFinite(p.x) && Number.isFinite(p.y));
                                    }
                  return (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <h4 className="text-sm font-semibold text-gray-900">Correlación — {selectedCategory === 'libre' ? 'Libre' : (isCustomCategory ? (selectedCategory === 'commerce' ? 'Comercio' : 'Turismo') : expandedKpiCategories[categoryKey].name)}</h4>
                        <div className="relative group">
                          <div className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold cursor-help">
                            i
                          </div>
                          <div className="absolute left-0 top-6 w-72 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                            <div className="mb-2">
                              <strong>¿Qué muestra?</strong>
                            </div>
                            <p className="mb-2">
                              Gráfico de dispersión que muestra la relación entre dos métricas. Cada punto representa un distrito.
                            </p>
                            <p>
                              <strong>Utilidad:</strong> Identifica patrones y correlaciones, como si los distritos caros tienen más servicios.
                            </p>
                            <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                          </div>
                        </div>
                </div>
                <ScatterPlot
                  data={selectedData}
                  xMetric={xMetric}
                  yMetric={yMetric}
                        title=""
                  selectedDistricts={selectedDistricts}
                        metricLabels={customMetricLabels}
                        points={points}
                />
                    </div>
                  );
                })()}
              </>
            ) : (
              <div className="text-sm text-gray-600">Correlación no disponible para esta categoría.</div>
            )}
          </div>
        </div>
      )}

      {/* Estadísticas descriptivas */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-sm font-semibold text-gray-900">Estadísticas</h3>
          <div className="relative group">
            <div className="w-4 h-4 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold cursor-help">
              i
            </div>
            <div className="absolute left-0 top-6 w-72 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <div className="mb-2">
                <strong>¿Qué muestra?</strong>
              </div>
              <p className="mb-2">
                Estadísticas descriptivas calculadas sobre los distritos seleccionados para la métrica elegida (media, mediana, máximos, etc.).
              </p>
              <p>
                <strong>Utilidad:</strong> Te da una visión estadística completa para entender la distribución de valores entre tus distritos.
              </p>
              <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-900 transform rotate-45"></div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Indicador</label>
            <select
              value={statsMetric}
              onChange={(e) => setStatsMetric(e.target.value)}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm"
            >
              {categoryMetrics.map(m => (
                <option key={m} value={m}>{customMetricLabels[m]?.label || expandedMetricLabels[m]?.label || m}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatTile label="N" value={stats?.n ?? 0} />
          <StatTile label="Media" value={formatWithUnit(stats?.mean)} />
          <StatTile label="Mediana" value={formatWithUnit(stats?.median)} />
          <StatTile label="Moda" value={stats?.mode !== null && stats?.mode !== undefined ? formatWithUnit(stats?.mode) : '—'} />
          <StatTile label="P25" value={formatWithUnit(stats?.p25)} />
          <StatTile label="P75" value={formatWithUnit(stats?.p75)} />
          <StatTile label="Mín" value={formatWithUnit(stats?.min)} />
          <StatTile label="Máx" value={formatWithUnit(stats?.max)} />
          <StatTile label="Desv. Típica" value={formatWithUnit(stats?.stdDev)} />
        </div>


          </div>
        </div>
      )}

      {/* Contenido de la pestaña Estadísticas */}
      {activeTab === 'statistics' && selectedData.length > 0 && (
        <IntelligentRecommendations 
          selectedData={selectedData}
          econByName={econByName}
          priceByName={priceByName}
          datosComerciales={datosComerciales}
          selectedCategory={selectedCategory}
          categoryKey={categoryKey}
          isCustomCategory={isCustomCategory}
        />
      )}

      {/* Contenido de la pestaña Asistente Inteligente */}
      {activeTab === 'assistant' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900">Asistente Inteligente de Decisiones</h3>
              <div className="relative group">
                <div className="w-5 h-5 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold cursor-help">
                  i
                </div>
                <div className="absolute left-0 top-7 w-80 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <p className="mb-2">
                    <strong>Asistente independiente:</strong> Analiza TODOS los distritos de Madrid según tus preferencias personales.
                  </p>
                  <p>
                    <strong>Utilidad:</strong> Te ayuda a encontrar el distrito perfecto según tu perfil y presupuesto, sin limitarte a la selección actual.
                  </p>
                  <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                </div>
              </div>
        </div>
      </div>

          <AssistantInteligente 
            allDistricts={data}
            econByName={econByName}
            priceByName={priceByName}
          />
        </div>
      )}
    </div>
  );
};

// --- Asistente Inteligente de Decisiones ---
interface AssistantInteligenteProps {
  allDistricts: ExpandedUrbanIndicators[];
  econByName: Map<string, any>;
  priceByName: Map<string, any>;
}

const AssistantInteligente: React.FC<AssistantInteligenteProps> = ({
  allDistricts,
  econByName,
  priceByName
}) => {
  // Estados del asistente
  const [selectedProfile, setSelectedProfile] = useState<string>('families');
  const [showWizard, setShowWizard] = useState<boolean>(false);
  const [customProfile, setCustomProfile] = useState<any>(null);
  const [budget, setBudget] = useState<number>(2000);
  const [housingType, setHousingType] = useState<'rent' | 'buy'>('rent');
  
  // Estados del wizard
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardPreferences, setWizardPreferences] = useState({
    nightlife: 3,
    services: 3,
    exclusivity: 3,
    budget: 2000,
    housingType: 'rent' as 'rent' | 'buy'
  });

  // Segmentación inteligente por presupuesto
  const getBudgetSegment = (budget: number) => {
    if (budget < 1500) return 'low';
    if (budget < 2500) return 'medium';
    return 'high';
  };

  // Perfiles dinámicos que se adaptan al presupuesto
  const getDynamicUserProfiles = (budgetSegment: string) => {
    const baseProfiles = {
      families: {
        name: 'Familias',
        low: {
          priorities: {
            averagePriceM2: -0.40, // Crítico: precios muy asequibles
            educationCenters: 0.30,
            safetyIndex: 0.20,
            healthCenters: 0.10,
          },
          description: 'Priorizan máximo ahorro con colegios y seguridad básica'
        },
        medium: {
          priorities: {
            educationCenters: 0.30,
            safetyIndex: 0.25,
            averagePriceM2: -0.25,
            healthCenters: 0.20,
          },
          description: 'Balance entre precio y calidad educativa/sanitaria'
        },
        high: {
          priorities: {
            educationCenters: 0.35,
            safetyIndex: 0.30,
            healthCenters: 0.20,
            parkArea: 0.15,
          },
          description: 'Priorizan la mejor educación y seguridad para los niños'
        }
      },
      young: {
        name: 'Jóvenes',
        low: {
          priorities: {
            averagePriceM2: -0.45, // Súper crítico
            publicTransport: 0.30,
            nightlifeSpots: 0.25,
          },
          description: 'Máximo ahorro en alquiler, transporte y diversión'
        },
        medium: {
          priorities: {
            publicTransport: 0.30,
            nightlifeSpots: 0.25,
            averagePriceM2: -0.25,
            culturalCenters: 0.20,
          },
          description: 'Balance entre precio, transporte y vida social'
        },
        high: {
          priorities: {
            nightlifeSpots: 0.30,
            culturalCenters: 0.25,
            publicTransport: 0.25,
            safetyIndex: 0.20,
          },
          description: 'Priorizan calidad de vida, cultura y entretenimiento'
        }
      },
      seniors: {
        name: 'Mayores',
        low: {
          priorities: {
            averagePriceM2: -0.35,
            healthCenters: 0.35,
            safetyIndex: 0.30,
          },
          description: 'Equilibrio entre ahorro, salud y seguridad'
        },
        medium: {
          priorities: {
            healthCenters: 0.35,
            safetyIndex: 0.30,
            walkability: 0.20,
            averagePriceM2: -0.15,
          },
          description: 'Priorizan salud, seguridad y movilidad'
        },
        high: {
          priorities: {
            healthCenters: 0.35,
            safetyIndex: 0.30,
            walkability: 0.20,
            parkArea: 0.15,
          },
          description: 'Máxima calidad en servicios de salud y entorno tranquilo'
        }
      },
      investors: {
        name: 'Inversores',
        low: {
          priorities: {
            averagePriceM2: -0.40, // Buscan gangas
            populationGrowth: 0.30,
            publicTransport: 0.30,
          },
          description: 'Buscan oportunidades baratas con potencial'
        },
        medium: {
          priorities: {
            averagePriceM2: -0.30,
            publicTransport: 0.30,
            populationGrowth: 0.25,
            averageIncome: 0.15,
          },
          description: 'Balance entre precio y potencial de revalorización'
        },
        high: {
          priorities: {
            publicTransport: 0.30,
            averageIncome: 0.25,
            businessDistricts: 0.25,
            populationGrowth: 0.20,
          },
          description: 'Invierten en distritos premium con máximo potencial'
        }
      }
    };

    return Object.fromEntries(
      Object.entries(baseProfiles).map(([key, profile]) => [
        key, 
        profile[budgetSegment as keyof typeof profile]
      ])
    );
  };

  const userProfiles = getDynamicUserProfiles(getBudgetSegment(budget));

  // Función para resetear el wizard
  const handleOpenWizard = () => {
    setWizardStep(1);
    setWizardPreferences({
      nightlife: 3,
      services: 3,
      exclusivity: 3,
      budget: 2000,
      housingType: 'rent'
    });
    setShowWizard(true);
  };

  // Generar perfil personalizado
  const generateCustomProfile = (preferences: any) => {
    const weights = {
      nightlife: preferences.nightlife / 5,
      services: preferences.services / 5,
      exclusivity: preferences.exclusivity / 5
    };

    return {
      name: 'Perfil Personalizado',
      priorities: {
        nightlifeSpots: weights.nightlife * 0.3,
        culturalCenters: weights.nightlife * 0.2,
        healthCenters: weights.services * 0.25,
        educationCenters: weights.services * 0.2,
        publicTransport: weights.services * 0.15,
        averageIncome: weights.exclusivity * 0.3,
        averagePriceM2: -(0.2 + (1 - weights.exclusivity) * 0.2), // Más exclusivo = menos importa el precio
        safetyIndex: 0.15,
      },
      description: 'Configurado según tus preferencias personales'
    };
  };

  // Calcular puntuación de distrito con lógica inteligente
  const calculateDistrictScore = (district: any, profile: any) => {
    const budgetSegment = getBudgetSegment(budget);
    let score = 5; // Puntuación base
    const priorities = profile.priorities;

    // PASO 1: Filtro de accesibilidad
    if (!district.isAffordable) {
      return 0; // Descartamos completamente los que no puede permitirse
    }

    // PASO 2: Ajuste por segmento de presupuesto
    if (budgetSegment === 'low') {
      // Presupuesto bajo: premio por eficiencia económica
      const efficiency = 1 - (district.budgetPercentage / 100);
      score += efficiency * 2;
    } else if (budgetSegment === 'medium') {
      // Presupuesto medio: balance, ligero premio por value-for-money
      if (district.budgetPercentage < 80) {
        score += 0.5; // Pequeño bonus por no usar todo el presupuesto
      }
    } else {
      // Presupuesto alto: priorizar calidad sobre precio
      // BONUS por características premium
      const priceData = priceByName.get(district.districtName.toLowerCase());
      const priceM2 = priceData ? priceData.precioAlquilerM2 : 0;
      
      // Premio por distritos de calidad (precio alto suele indicar calidad)
      if (priceM2 > 20) score += 1;   // Distritos premium
      if (priceM2 > 22) score += 0.5; // Distritos muy premium
    }

    Object.keys(priorities).forEach(metric => {
      const weight = priorities[metric];
      let value = 0;
      let normalizedValue = 0;

      // Obtener valor según la métrica
      if (metric === 'averagePriceM2') {
        const priceData = priceByName.get(district.districtName.toLowerCase());
        value = priceData ? (priceData.precioAlquilerM2 ?? 0) : 0;
        
        // Lógica de precio ajustada por segmento
        if (budgetSegment === 'low') {
          // Presupuesto bajo: menor precio = mejor
          normalizedValue = Math.max(0, 1 - (value / 25));
        } else if (budgetSegment === 'medium') {
          // Presupuesto medio: buscar value-for-money (ni muy caro ni muy barato)
          const optimalRange = value >= 16 && value <= 20;
          normalizedValue = optimalRange ? 1 : 0.7;
        } else {
          // Presupuesto alto: mayor precio puede indicar mejor calidad
          normalizedValue = Math.min(value / 18, 1); // Normalizar hacia arriba
        }
      } else if (metric === 'averageIncome') {
        const econData = econByName.get(district.districtName.toLowerCase());
        value = econData ? (econData.rentaMediaPersona ?? 0) : 0;
        normalizedValue = Math.min(value / 50000, 1);
      } else {
        value = (district as any)[metric] ?? 0;
        const maxValue = metric === 'educationCenters' ? 50 :
                        metric === 'healthCenters' ? 30 :
                        metric === 'publicTransport' ? 10 :
                        metric === 'safetyIndex' ? 10 :
                        metric === 'nightlifeSpots' ? 20 :
                        metric === 'culturalCenters' ? 15 :
                        metric === 'parkArea' ? 100 :
                        metric === 'walkability' ? 10 :
                        metric === 'noisePollution' ? 100 :
                        metric === 'averageAge' ? 50 :
                        metric === 'populationGrowth' ? 10 :
                        metric === 'businessDistricts' ? 10 : 100;
        
        normalizedValue = Math.min(value / maxValue, 1);
        
        if (metric === 'noisePollution' || metric === 'averageAge') {
          normalizedValue = 1 - normalizedValue;
        }
      }

      // Aplicar peso ajustado por segmento de presupuesto
      let adjustedWeight = Math.abs(weight);
      if (metric === 'averagePriceM2' && budgetSegment === 'high') {
        adjustedWeight *= 0.3; // Reducir importancia del precio con presupuesto alto
      }

      score += normalizedValue * adjustedWeight * 3;
    });

    return Math.max(0, Math.min(10, score));
  };

  // Filtrar por presupuesto
  const filterByBudget = (districts: ExpandedUrbanIndicators[]) => {
    return districts.map(district => {
      const priceData = priceByName.get(district.districtName.toLowerCase());
      const pricePerM2 = housingType === 'rent' 
        ? (priceData?.precioAlquilerM2 ?? 0)
        : (priceData?.precioVentaM2 ?? 0) / 300; // Conversión aproximada mensual

      const monthlyPrice = pricePerM2 * 70; // 70m2 promedio
      const isAffordable = monthlyPrice <= budget;
      const budgetPercentage = (monthlyPrice / budget) * 100;

      return {
        ...district,
        monthlyPrice,
        isAffordable,
        budgetPercentage
      };
    });
  };

  // Generar insights más específicos
  const generateInsights = (district: any, rank: number) => {
    const insights = [];
    
    // Información cualitativa basada en el perfil y características
    const budgetSegment = getBudgetSegment(budget);
    const econ = econByName.get(district.districtName.toLowerCase());
    const price = priceByName.get(district.districtName.toLowerCase());
    
    // Insight sobre compatibilidad económica
    if (district.isAffordable) {
      if (budgetSegment === 'high') {
        insights.push('💎 Excelente relación calidad-precio');
      } else if (budgetSegment === 'medium') {
        insights.push('⚖️ Equilibrio perfecto para tu perfil');
      } else {
        insights.push('💰 Opción económica inteligente');
      }
    } else {
      if (budgetSegment === 'low') {
        insights.push('🔺 Considera opciones más económicas');
      } else {
        insights.push('🎯 Inversión premium a considerar');
      }
    }
    
    // Insight específico del perfil seleccionado
    if (selectedProfile === 'families') {
      if (econ && Number(econ.rentaMediaPersona) > 35000) {
        insights.push('👨‍👩‍👧‍👦 Entorno familiar estable');
      }
    } else if (selectedProfile === 'young') {
      const commercial = datosComerciales?.find(d => d.nombre?.toLowerCase() === district.districtName.toLowerCase());
      if (commercial && Number(commercial.totalLocales) > 800) {
        insights.push('🎉 Zona dinámica y social');
      }
    } else if (selectedProfile === 'seniors') {
      if (price && Number(price.precioAlquilerM2) < 20) {
        insights.push('🏘️ Tranquilo y accesible');
      }
    } else if (selectedProfile === 'investors') {
      if (price && Number(price.precioVentaM2) > 4500) {
        insights.push('📈 Alto potencial de revalorización');
      }
    }

    // Información adicional basada en características del distrito
    if (rank === 1) {
      insights.push('Mejor opción para ti');
    } else if (rank <= 3) {
      insights.push('Opción excelente');
    } else if (district.safetyIndex > 7) {
      insights.push('Zona muy segura');
    } else if (district.publicTransport > 8) {
      insights.push('Excelente transporte');
    } else if (district.educationCenters > 20) {
      insights.push('Muchos colegios');
    } else if (district.healthCenters > 15) {
      insights.push('Bien de servicios médicos');
    }
    
    return insights.slice(0, 2).join(' • ');
  };

  // Perfil actual
  const currentProfile = selectedProfile === 'custom' ? customProfile : userProfiles[selectedProfile as keyof typeof userProfiles];

  // Calcular puntuaciones
  const districtScores = useMemo(() => {
    if (!currentProfile) return [];

    const districtsWithBudget = filterByBudget(allDistricts);
    
    const scored = districtsWithBudget.map(district => ({
      ...district,
      score: calculateDistrictScore(district, currentProfile)
    }));

    // Ordenar: primero los que están en presupuesto, luego por puntuación
    return scored.sort((a, b) => {
      if (a.isAffordable && !b.isAffordable) return -1;
      if (!a.isAffordable && b.isAffordable) return 1;
      return b.score - a.score;
    });
  }, [currentProfile, allDistricts, budget, housingType]);

  // Componente Wizard
  const PreferencesWizard = () => {
    const questions = [
      {
        id: 'budget',
        title: '¿Cuál es tu presupuesto mensual para vivienda?',
        type: 'range',
        min: 800,
        max: 4000,
        step: 100,
        unit: '€'
      },
      {
        id: 'housingType',
        title: '¿Estás buscando para alquilar o comprar?',
        type: 'choice',
        options: [
          { value: 'rent', label: 'Alquilar' },
          { value: 'buy', label: 'Comprar' }
        ]
      },
      {
        id: 'nightlife',
        title: '¿Qué importancia tiene la vida nocturna y ocio?',
        type: 'scale',
        min: 1,
        max: 5,
        labels: ['Para nada', 'Poco', 'Moderado', 'Bastante', 'Absolutamente']
      },
      {
        id: 'services',
        title: '¿Qué importancia tienen los servicios públicos?',
        type: 'scale',
        min: 1,
        max: 5,
        labels: ['Para nada', 'Poco', 'Moderado', 'Bastante', 'Absolutamente']
      },
      {
        id: 'exclusivity',
        title: '¿Prefieres zonas exclusivas o más populares?',
        type: 'scale',
        min: 1,
        max: 5,
        labels: ['Para nada', 'Poco', 'Moderado', 'Bastante', 'Absolutamente']
      }
    ];

    const currentQuestion = questions[wizardStep - 1];

    const handleNext = () => {
      if (wizardStep < questions.length) {
        setWizardStep(wizardStep + 1);
      } else {
        const newProfile = generateCustomProfile(wizardPreferences);
        setCustomProfile(newProfile);
        setBudget(wizardPreferences.budget);
        setHousingType(wizardPreferences.housingType);
        setSelectedProfile('custom');
        setShowWizard(false);
      }
    };

    const handlePrev = () => {
      if (wizardStep > 1) setWizardStep(wizardStep - 1);
    };

    const updatePreference = (key: string, value: any) => {
      setWizardPreferences(prev => ({ ...prev, [key]: value }));
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Asistente de Preferencias</h3>
            <button
              onClick={() => setShowWizard(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Paso {wizardStep} de {questions.length}</span>
              <span>{Math.round((wizardStep / questions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(wizardStep / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">{currentQuestion.title}</h4>
            
            {currentQuestion.type === 'range' && (
              <div className="space-y-2">
                <input
                  type="range"
                  min={currentQuestion.min}
                  max={currentQuestion.max}
                  step={currentQuestion.step}
                  value={wizardPreferences[currentQuestion.id as keyof typeof wizardPreferences]}
                  onChange={(e) => updatePreference(currentQuestion.id, Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>{currentQuestion.min}{currentQuestion.unit}</span>
                  <span className="font-semibold text-purple-600">
                    {wizardPreferences[currentQuestion.id as keyof typeof wizardPreferences]}{currentQuestion.unit}
                  </span>
                  <span>{currentQuestion.max}{currentQuestion.unit}</span>
                </div>
              </div>
            )}

            {currentQuestion.type === 'choice' && (
              <div className="space-y-2">
                {currentQuestion.options?.map((option) => (
                  <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name={currentQuestion.id}
                      value={option.value}
                      checked={wizardPreferences[currentQuestion.id as keyof typeof wizardPreferences] === option.value}
                      onChange={(e) => updatePreference(currentQuestion.id, e.target.value)}
                      className="text-purple-500"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
                          </div>
            )}

            {currentQuestion.type === 'scale' && (
              <div className="space-y-2">
                <input
                  type="range"
                  min={currentQuestion.min}
                  max={currentQuestion.max}
                  value={wizardPreferences[currentQuestion.id as keyof typeof wizardPreferences]}
                  onChange={(e) => updatePreference(currentQuestion.id, Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-600">
                  {currentQuestion.labels?.map((label, index) => (
                    <span key={index} className={`${
                      wizardPreferences[currentQuestion.id as keyof typeof wizardPreferences] === index + 1 ? 'font-semibold text-purple-600' : ''
                    }`}>
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <button
              onClick={handlePrev}
              disabled={wizardStep === 1}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
            >
              {wizardStep === questions.length ? 'Finalizar' : 'Siguiente'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Explicación del Asistente Inteligente */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
            i
          </div>
          <div className="flex-1">
            <h5 className="text-sm font-medium text-purple-900 mb-2">¿Cómo funciona el Asistente Inteligente?</h5>
            <div className="text-xs text-purple-800 space-y-1">
              <p><strong>Análisis integral:</strong> Evaluamos <strong>todos los 21 distritos de Madrid</strong> según tu perfil y presupuesto:</p>
              <div className="ml-3 mt-2 space-y-1">
                <p>• <strong>Algoritmo dinámico:</strong> Los pesos de las métricas se ajustan según tu segmento de presupuesto (bajo/medio/alto)</p>
                <p>• <strong>Criterios específicos:</strong> Cada perfil prioriza diferentes aspectos (precio, servicios, estabilidad, etc.)</p>
                <p>• <strong>Datos oficiales:</strong> Basado en información real de precios, renta media y actividad comercial</p>
                <p>• <strong>Estrategia personalizada:</strong> La recomendación se adapta a tu poder adquisitivo</p>
              </div>
              <p className="mt-2 font-medium">Resultado: Ranking personalizado de los mejores distritos para TI, no limitado a una preselección.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Selector de Perfil */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">Selecciona tu perfil</h4>
        
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={handleOpenWizard}
            className="px-4 py-2 bg-purple-500 text-white text-sm rounded-md hover:bg-purple-600"
          >
            Crear Perfil Personalizado
          </button>
          
          <select
            value={selectedProfile}
            onChange={(e) => setSelectedProfile(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            {Object.entries(userProfiles).map(([key, profile]) => (
              <option key={key} value={key}>{profile.name}</option>
            ))}
            {customProfile && (
              <option value="custom">Perfil Personalizado</option>
            )}
          </select>
          </div>

        {currentProfile && (
          <div className="bg-purple-50 rounded-lg p-3">
            <p className="text-sm text-gray-700">{currentProfile.description}</p>
        </div>
      )}
      </div>

      {/* Simulador de Presupuesto */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">Simulador de Presupuesto</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de vivienda</label>
            <div className="flex rounded-md bg-gray-100 p-1">
              <button
                onClick={() => setHousingType('rent')}
                className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
                  housingType === 'rent' 
                    ? 'bg-white text-purple-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Alquiler
              </button>
              <button
                onClick={() => setHousingType('buy')}
                className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
                  housingType === 'buy' 
                    ? 'bg-white text-purple-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Compra
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Capacidad económica: {getBudgetSegment(budget) === 'low' ? 'Ajustada' : 
                getBudgetSegment(budget) === 'medium' ? 'Moderada' : 'Elevada'} ({budget}€)
            </label>
            <input
              type="range"
              min="800"
              max="4000"
              step="100"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Económico</span>
              <span>Premium</span>
            </div>
            <div className="text-xs text-gray-600 mt-2">
              {getBudgetSegment(budget) === 'low' && "Priorizamos opciones económicas y eficientes"}
              {getBudgetSegment(budget) === 'medium' && "Buscamos equilibrio entre precio y calidad"}
              {getBudgetSegment(budget) === 'high' && "Enfoque en calidad y ubicaciones premium"}
            </div>
          </div>
        </div>
      </div>

      {/* Ranking de Distritos */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-4">Ranking de Distritos</h4>
        
        <div className="space-y-3">
          {districtScores.slice(0, 10).map((district, index) => (
            <div key={district.districtName} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  index < 3 ? 'bg-yellow-400 text-yellow-900' : 'bg-gray-200 text-gray-700'
                }`}>
                  #{index + 1}
                </div>
                <div>
                  <h5 className="font-medium text-gray-900">{district.districtName}</h5>
                  <p className="text-sm text-gray-600">{generateInsights(district, index + 1)}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold text-purple-600">
                  {district.score.toFixed(1)}/10
                </div>
                <div className="text-xs text-gray-500">
                  Puntuación
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recomendación final */}
        {districtScores.length > 0 && (
          <div className="mt-6 bg-purple-50 rounded-lg p-4 border border-purple-200">
            <h5 className="font-medium text-purple-900 mb-2">Recomendación Final</h5>
            <p className="text-sm text-purple-800">
              <strong>Para tu perfil "{currentProfile?.name}" 
              ({getBudgetSegment(budget) === 'low' ? 'Prioridad económica' : 
                getBudgetSegment(budget) === 'medium' ? 'Equilibrio calidad-precio' : 'Calidad premium'}):</strong>
            </p>
            <div className="mt-2 text-sm text-purple-800">
              {getBudgetSegment(budget) === 'low' && (
                <p className="mb-2 bg-blue-100 p-2 rounded text-blue-800">
                  🎯 <strong>Estrategia:</strong> Maximizamos tu ahorro priorizando distritos económicos con buenos servicios básicos.
                </p>
              )}
              {getBudgetSegment(budget) === 'medium' && (
                <p className="mb-2 bg-blue-100 p-2 rounded text-blue-800">
                  ⚖️ <strong>Estrategia:</strong> Balance entre precio y calidad, buscando la mejor relación calidad-precio.
                </p>
              )}
              {getBudgetSegment(budget) === 'high' && (
                <p className="mb-2 bg-blue-100 p-2 rounded text-blue-800">
                  ⭐ <strong>Estrategia:</strong> Priorizamos calidad y ubicaciones premium. El precio es secundario.
                </p>
              )}
              
              <p className="mt-3">
                <strong>Nuestra recomendación:</strong> <strong>{districtScores[0]?.districtName}</strong>
                <br />
                📊 <strong>Puntuación:</strong> {districtScores[0]?.score.toFixed(1)}/10 para tu perfil
                <br />
                🎯 <strong>Fortalezas:</strong> {generateInsights(districtScores[0], 1)}
              </p>

              {districtScores.length > 1 && (
                <p className="mt-2 text-xs">
                  <strong>Alternativas:</strong> {districtScores.slice(1, 3).map(d => d.districtName).join(', ')}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Wizard Modal */}
      {showWizard && <PreferencesWizard />}
    </div>
  );
};

export default ComparisonPanel;

// --- Ranking con ordenación y export CSV ---
interface RankingRow { id: string; name: string; data: any; }
const RankingTable: React.FC<{ rows: RankingRow[]; metrics: string[]; labels: Record<string, { label: string; unit: string; format?: string }> }> = ({ rows, metrics, labels }) => {
  const [sortBy, setSortBy] = useState<string>(metrics[0]);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const sorted = useMemo(() => {
    const arr = [...rows];
    arr.sort((a, b) => {
      const va = a.data[sortBy as keyof ExpandedUrbanIndicators] as number;
      const vb = b.data[sortBy as keyof ExpandedUrbanIndicators] as number;
      return sortDir === 'asc' ? va - vb : vb - va;
    });
    return arr;
  }, [rows, sortBy, sortDir]);

  const toggleSort = (m: string) => {
    if (sortBy === m) setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    else { setSortBy(m); setSortDir('desc'); }
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs text-gray-500">Ordenado por: {labels[sortBy]?.label || expandedMetricLabels[sortBy]?.label || sortBy} ({sortDir === 'asc' ? 'asc' : 'desc'})</div>
      </div>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500">
            <th className="py-2 pr-4">Distrito</th>
            {metrics.map(m => (
              <th key={m} className="py-2 pr-6 whitespace-nowrap cursor-pointer" onClick={() => toggleSort(m)}>
                {labels[m]?.label || expandedMetricLabels[m]?.label || m}{(labels[m]?.unit || expandedMetricLabels[m]?.unit) ? ` (${labels[m]?.unit || expandedMetricLabels[m]?.unit})` : ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map(r => (
            <tr key={r.id} className="border-t border-gray-100">
              <td className="py-2 pr-4 font-medium text-gray-900 whitespace-nowrap">{r.name}</td>
              {metrics.map(m => (
                <td key={m} className="py-2 pr-6 text-gray-800">{formatMetricValue(r.data[m] as number, m)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// --- Subcomponentes simples de UI para estadísticas ---
const StatTile: React.FC<{ label: string; value: any }> = ({ label, value }) => (
  <div className="rounded-md border border-gray-200 p-3 bg-white">
    <div className="text-[11px] uppercase tracking-wide text-gray-500">{label}</div>
    <div className="text-sm font-semibold text-gray-900 mt-1">{value}</div>
  </div>
);

const HighlightedValue: React.FC<{ label: string; value: any }> = ({ label, value }) => (
  <div className="inline-flex items-baseline gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-2">
    <span className="text-xs text-blue-700">{label}</span>
    <span className="text-base font-semibold text-blue-900">{value}</span>
  </div>
);

// --- Sistema de Recomendaciones Inteligentes ---
interface IntelligentRecommendationsProps {
  selectedData: ExpandedUrbanIndicators[];
  econByName: Map<string, any>;
  priceByName: Map<string, any>;
  datosComerciales: any[];
  selectedCategory: string;
  categoryKey: string;
  isCustomCategory: boolean;
}

const IntelligentRecommendations: React.FC<IntelligentRecommendationsProps> = ({
  selectedData,
  econByName,
  priceByName,
  datosComerciales,
  selectedCategory,
  categoryKey,
  isCustomCategory
}) => {
  const [selectedProfile, setSelectedProfile] = useState<string>('families');

  // Perfiles de usuario con sus prioridades diferenciadas
  const userProfiles = {
    families: {
      name: 'Familias',
      priorities: {
        rentaMediaPersona: 0.2,        // Estabilidad económica moderada
        precioAlquilerM2: -0.4,        // Precio es muy importante (negativo = menor mejor)
        precioVentaM2: -0.3,           // También important para compra
        localesComerciales: 0.25,      // Servicios importantes para familias
        totalLocales: 0.25,            // Variedad de servicios
      },
      description: 'Priorizan precios asequibles y servicios para familias'
    },
    young: {
      name: 'Jóvenes Profesionales',
      priorities: {
        precioAlquilerM2: -0.5,        // Precio de alquiler es crítico
        rentaMediaPersona: 0.1,        // Menos importante la renta media
        localesComerciales: 0.35,      // Vida social y entretenimiento
        totalLocales: 0.4,             // Mucha variedad de locales
      },
      description: 'Buscan alquileres asequibles y vida social activa'
    },
    seniors: {
      name: 'Seniors',
      priorities: {
        rentaMediaPersona: 0.3,        // Zona estable económicamente
        precioVentaM2: -0.2,           // Precio moderadamente importante
        precioAlquilerM2: -0.1,        // Menos relevante si ya tienen vivienda
        localesComerciales: 0.4,       // Servicios esenciales muy importantes
        totalLocales: 0.2,             // Menos variedad, más esenciales
      },
      description: 'Valoran estabilidad económica y servicios esenciales accesibles'
    },
    investors: {
      name: 'Inversores',
      priorities: {
        precioVentaM2: 0.5,            // Valor de la propiedad es clave
        rentaMediaPersona: 0.4,        // Demanda solvente es importante
        localesComerciales: 0.15,      // Actividad comercial genera demanda
        totalLocales: 0.1,             // Menos importante la variedad
        precioAlquilerM2: 0.2,         // Potencial de renta
      },
      description: 'Buscan potencial de revalorización, demanda solvente y rentabilidad'
    }
  };

  // Función para resetear el wizard cuando se abre
  const handleOpenWizard = () => {
    setWizardStep(1);
    setWizardPreferences({
      nightlife: 3,
      services: 3,
      exclusivity: 3,
      budget: 2000,
      housingType: 'rent'
    });
    setShowWizard(true);
  };

  // Componente Wizard de Preferencias
  const PreferencesWizard = () => {

    const questions = [
      {
        id: 'budget',
        title: '💰 ¿Cuál es tu presupuesto mensual para vivienda?',
        type: 'range',
        min: 500,
        max: 5000,
        step: 100,
        unit: '€/mes'
      },
      {
        id: 'housingType',
        title: '🏠 ¿Prefieres comprar o alquilar?',
        type: 'choice',
        options: [
          { value: 'rent', label: 'Alquilar', icon: '🔑' },
          { value: 'buy', label: 'Comprar', icon: '🏡' }
        ]
      },
      {
        id: 'nightlife',
        title: '🌃 ¿Qué tan importante es la vida nocturna y ocio?',
        type: 'scale',
        min: 1,
        max: 5,
        labels: ['Nada importante', 'Poco importante', 'Moderado', 'Importante', 'Muy importante']
      },
      {
        id: 'services',
        title: '🛍️ ¿Necesitas muchos servicios y comercios cerca?',
        type: 'scale',
        min: 1,
        max: 5,
        labels: ['Nada importante', 'Poco importante', 'Moderado', 'Importante', 'Muy importante']
      },
      {
        id: 'exclusivity',
        title: '⭐ ¿Prefieres zonas exclusivas aunque sean más caras?',
        type: 'scale',
        min: 1,
        max: 5,
        labels: ['Para nada', 'Poco', 'Moderado', 'Bastante', 'Absolutamente']
      }
    ];

    const currentQuestion = questions[wizardStep - 1];

    const handleNext = () => {
      if (wizardStep < questions.length) {
        setWizardStep(wizardStep + 1);
      } else {
        // Generar perfil personalizado
        const newProfile = generateCustomProfile(wizardPreferences);
        setCustomProfile(newProfile);
        setBudget(wizardPreferences.budget);
        setHousingType(wizardPreferences.housingType);
        setSelectedProfile('custom');
        setShowWizard(false);
      }
    };

    const handlePrev = () => {
      if (wizardStep > 1) setWizardStep(wizardStep - 1);
    };

    const updatePreference = (key: string, value: any) => {
      setWizardPreferences(prev => ({ ...prev, [key]: value }));
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Personaliza tus preferencias</h3>
            <button
              onClick={() => setShowWizard(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Paso {wizardStep} de {questions.length}</span>
              <span>{Math.round((wizardStep / questions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(wizardStep / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">{currentQuestion.title}</h4>
            
            {currentQuestion.type === 'range' && (
              <div>
                <input
                  type="range"
                  min={currentQuestion.min}
                  max={currentQuestion.max}
                  step={currentQuestion.step}
                  value={wizardPreferences[currentQuestion.id as keyof typeof wizardPreferences]}
                  onChange={(e) => updatePreference(currentQuestion.id, Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>{currentQuestion.min}{currentQuestion.unit}</span>
                  <span className="font-semibold text-blue-600">
                    {wizardPreferences[currentQuestion.id as keyof typeof wizardPreferences]}{currentQuestion.unit}
                  </span>
                  <span>{currentQuestion.max}{currentQuestion.unit}</span>
                </div>
              </div>
            )}

            {currentQuestion.type === 'choice' && (
              <div className="space-y-3">
                {currentQuestion.options?.map((option) => (
                  <label key={option.value} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name={currentQuestion.id}
                      value={option.value}
                      checked={wizardPreferences[currentQuestion.id as keyof typeof wizardPreferences] === option.value}
                      onChange={(e) => updatePreference(currentQuestion.id, e.target.value)}
                      className="mr-3"
                    />
                    <span className="text-lg mr-2">{option.icon}</span>
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            )}

            {currentQuestion.type === 'scale' && (
              <div>
                <input
                  type="range"
                  min={currentQuestion.min}
                  max={currentQuestion.max}
                  value={wizardPreferences[currentQuestion.id as keyof typeof wizardPreferences]}
                  onChange={(e) => updatePreference(currentQuestion.id, Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-2">
                  {currentQuestion.labels?.map((label, index) => (
                    <span key={index} className={`text-center ${wizardPreferences[currentQuestion.id as keyof typeof wizardPreferences] === index + 1 ? 'text-blue-600 font-semibold' : ''}`}>
                      {label}
                    </span>
                  ))}
                </div>
                <div className="text-center mt-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    {currentQuestion.labels?.[wizardPreferences[currentQuestion.id as keyof typeof wizardPreferences] as number - 1]}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <button
              onClick={handlePrev}
              disabled={wizardStep === 1}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              {wizardStep === questions.length ? 'Finalizar' : 'Siguiente'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Función para generar perfil personalizado basado en preferencias
  const generateCustomProfile = (prefs: any) => {
    const budgetWeight = prefs.housingType === 'rent' ? -0.4 : -0.3;
    const exclusivityWeight = prefs.exclusivity / 5 * 0.3;
    const servicesWeight = prefs.services / 5 * 0.3;
    const nightlifeWeight = prefs.nightlife / 5 * 0.2;

    return {
      name: 'Perfil Personalizado',
      priorities: {
        rentaMediaPersona: exclusivityWeight,
        precioAlquilerM2: prefs.housingType === 'rent' ? budgetWeight : -0.1,
        precioVentaM2: prefs.housingType === 'buy' ? budgetWeight : -0.1,
        localesComerciales: servicesWeight,
        totalLocales: servicesWeight * 0.7,
      },
      description: `Personalizado: ${prefs.housingType === 'rent' ? 'alquiler' : 'compra'}, ${prefs.budget}€/mes, ${prefs.services > 3 ? 'muchos servicios' : 'servicios básicos'}`
    };
  };

  // Función para filtrar distritos por presupuesto
  const filterByBudget = (districts: any[]) => {
    return districts.map(district => {
      const price = priceByName.get(district.districtName.toLowerCase());
      const monthlyPrice = housingType === 'rent' 
        ? Number(price?.precioAlquilerM2 ?? 0) * 50 // Asumiendo 50m² promedio
        : Number(price?.precioVentaM2 ?? 0) * 50 / 300; // Hipoteca a 25 años aprox

      const isAffordable = monthlyPrice <= budget;
      const budgetPercentage = monthlyPrice > 0 ? (budget / monthlyPrice) * 100 : 0;

      return {
        ...district,
        monthlyPrice,
        isAffordable,
        budgetPercentage: Math.min(budgetPercentage, 200) // Cap at 200%
      };
    });
  };

  // Función para calcular puntuación por distrito según el perfil
  const calculateDistrictScore = (district: ExpandedUrbanIndicators, profile: any) => {
    let score = 0;
    let totalWeight = 0;

    Object.entries(profile.priorities).forEach(([metric, weight]) => {
      let value = 0;
      
      // Obtener valor según la métrica
      if (['rentaMediaPersona', 'tasaParo', 'localesComerciales'].includes(metric)) {
        const econ = econByName.get(district.districtName.toLowerCase());
        value = econ ? Number((econ as any)[metric] ?? 0) : 0;
      } else if (['precioVentaM2', 'precioAlquilerM2'].includes(metric)) {
        const price = priceByName.get(district.districtName.toLowerCase());
        value = price ? Number((price as any)[metric] ?? 0) : 0;
      } else if (['totalLocales', 'localesAbiertos'].includes(metric)) {
        const commercial = datosComerciales.find(d => d.nombre?.toLowerCase() === district.districtName.toLowerCase());
        value = commercial ? Number((commercial as any)[metric] ?? 0) : 0;
      } else {
        value = Number((district as any)[metric] ?? 0);
      }

      if (value > 0) {
        // Normalizar valor (simple escala 0-1)
        const normalizedValue = Math.min(value / 100000, 1); // Ajustar según rango típico
        score += normalizedValue * Math.abs(weight as number);
        totalWeight += Math.abs(weight as number);
      }
    });

    return totalWeight > 0 ? (score / totalWeight) * 10 : 0; // Escala 0-10
  };

  // Obtener perfil actual
  const currentProfile = userProfiles[selectedProfile as keyof typeof userProfiles];

  // Calcular scores diferenciados para los distritos seleccionados
  const districtScores = selectedData.map(district => {
    let score = 0;
    let totalWeight = 0;
    
    if (currentProfile) {
      Object.keys(currentProfile.priorities).forEach(key => {
        const weight = currentProfile.priorities[key]; // Mantener signo original
        const absWeight = Math.abs(weight);
        let value = 0;

        // Obtener valor de la métrica
        if (['rentaMediaPersona', 'tasaParo'].includes(key)) {
          const econ = econByName.get(district.districtName.toLowerCase());
          value = econ ? Number((econ as any)[key] ?? 0) : 0;
        } else if (['precioVentaM2', 'precioAlquilerM2'].includes(key)) {
          const p = priceByName.get(district.districtName.toLowerCase());
          value = p ? Number((p as any)[key] ?? 0) : 0;
        } else if (['totalLocales', 'localesAbiertos', 'localesComerciales'].includes(key)) {
          const dc = datosComerciales.find(r => r.nombre?.toLowerCase() === district.districtName.toLowerCase());
          const mapRow: Record<string, number> = {
            totalLocales: dc?.totalLocales ?? 0,
            localesAbiertos: dc?.localesAbiertos ?? 0,
            localesComerciales: dc?.localesComerciales ?? 0
          };
          value = Number(mapRow[key] ?? 0);
        } else {
          value = Number(district[key as keyof typeof district] ?? 0);
        }

        // Normalizar según el tipo de métrica (0-1)
        let normalizedValue = 0;
        if (key === 'rentaMediaPersona') {
          normalizedValue = Math.min(value / 50000, 1); // Normalizar hasta 50k
        } else if (key === 'precioAlquilerM2') {
          normalizedValue = Math.min(value / 30, 1); // Normalizar hasta 30€/m²
        } else if (key === 'precioVentaM2') {
          normalizedValue = Math.min(value / 8000, 1); // Normalizar hasta 8000€/m²
        } else if (key === 'totalLocales') {
          normalizedValue = Math.min(value / 1500, 1); // Normalizar hasta 1500 locales
        } else if (key === 'localesComerciales') {
          normalizedValue = Math.min(value / 800, 1); // Normalizar hasta 800 locales
        } else if (key === 'localesAbiertos') {
          normalizedValue = Math.min(value / 1200, 1); // Normalizar hasta 1200 locales
        } else {
          normalizedValue = Math.min(value / 100, 1); // Fallback genérico
        }

        // Para pesos negativos, invertir el valor (menor es mejor)
        if (weight < 0) {
          normalizedValue = 1 - normalizedValue;
        }
        
        // Acumular score ponderado
        score += normalizedValue * absWeight;
        totalWeight += absWeight;
      });
    }

    // Escalar a 0-10
    const finalScore = totalWeight > 0 ? (score / totalWeight) * 10 : 5;

    return {
      ...district,
      score: Math.max(0, Math.min(10, finalScore))
    };
  }).sort((a, b) => b.score - a.score);

  // Generar insights específicos por perfil
  const generateInsights = (district: any) => {
    const insights = [];
    
    // Evaluación general basada en score
    if (district.score >= 8) insights.push('⭐ Excelente para tu perfil');
    else if (district.score >= 6) insights.push('👍 Buena opción');
    else if (district.score >= 4) insights.push('⚠️ Opción moderada');
    else insights.push('❌ No recomendado');

    // Obtener datos del distrito
    const econ = econByName.get(district.districtName.toLowerCase());
    const price = priceByName.get(district.districtName.toLowerCase());
    const commercial = datosComerciales.find(d => d.nombre?.toLowerCase() === district.districtName.toLowerCase());

    // Insights específicos por perfil
    if (selectedProfile === 'families') {
      if (price && Number(price.precioAlquilerM2) < 18) insights.push('💰 Alquiler familiar');
      if (commercial && Number(commercial.localesComerciales) > 400) insights.push('🛒 Buenos servicios');
    } else if (selectedProfile === 'young') {
      if (price && Number(price.precioAlquilerM2) < 20) insights.push('🏠 Precio joven');
      if (commercial && Number(commercial.totalLocales) > 800) insights.push('🎯 Zona vibrante');
    } else if (selectedProfile === 'seniors') {
      if (econ && Number(econ.rentaMediaPersona) > 30000) insights.push('🏛️ Zona estable');
      if (commercial && Number(commercial.localesComerciales) > 500) insights.push('🏥 Servicios cerca');
    } else if (selectedProfile === 'investors') {
      if (price && Number(price.precioVentaM2) > 4000) insights.push('📈 Alto valor');
      if (econ && Number(econ.rentaMediaPersona) > 35000) insights.push('💎 Demanda premium');
    }

    return insights.slice(0, 3);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-900">Recomendaciones Inteligentes</h3>
          <div className="relative group">
            <div className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold cursor-help">
              i
            </div>
            <div className="absolute left-0 top-7 w-80 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <div className="mb-2">
                <strong>¿Cómo funciona?</strong>
              </div>
              <p className="mb-2">
                Analiza automáticamente los datos de los distritos seleccionados y los evalúa según diferentes perfiles de usuario. 
                Cada distrito recibe una puntuación del 1 al 10 basada en las métricas más relevantes.
              </p>
              <p>
                <strong>Utilidad:</strong> Te ayuda a tomar decisiones informadas sobre dónde vivir, invertir o establecerte.
              </p>
              {/* Flecha del tooltip */}
              <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-900 transform rotate-45"></div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedProfile}
            onChange={(e) => setSelectedProfile(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            {Object.entries(userProfiles).map(([key, profile]) => (
              <option key={key} value={key}>{profile.name}</option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4"><strong>Perfil seleccionado:</strong> {currentProfile.description}</p>

      {/* Explicación del cálculo de puntuaciones */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
            ?
          </div>
          <div className="flex-1">
            <h5 className="text-sm font-medium text-blue-900 mb-2">¿Cómo se calculan las puntuaciones?</h5>
            <div className="text-xs text-blue-800 space-y-1">
              <p><strong>Metodología:</strong> Cada distrito recibe una puntuación de 0 a 10 basada en métricas ponderadas según tu perfil:</p>
              <div className="ml-3 mt-2 space-y-1">
                {selectedProfile === 'families' && (
                  <>
                    <p>• <strong>Precio alquiler/compra (60% peso):</strong> Menor precio = mayor puntuación</p>
                    <p>• <strong>Servicios comerciales (50% peso):</strong> Más locales = mejor para familias</p>
                    <p>• <strong>Renta media (20% peso):</strong> Estabilidad económica del área</p>
                  </>
                )}
                {selectedProfile === 'young' && (
                  <>
                    <p>• <strong>Precio alquiler (50% peso):</strong> Accesibilidad económica prioritaria</p>
                    <p>• <strong>Vida social (75% peso):</strong> Variedad y cantidad de locales</p>
                    <p>• <strong>Renta media (10% peso):</strong> Poder adquisitivo de la zona</p>
                  </>
                )}
                {selectedProfile === 'seniors' && (
                  <>
                    <p>• <strong>Servicios esenciales (60% peso):</strong> Comercios y servicios básicos</p>
                    <p>• <strong>Estabilidad económica (30% peso):</strong> Renta media del área</p>
                    <p>• <strong>Precios moderados (30% peso):</strong> Equilibrio calidad-precio</p>
                  </>
                )}
                {selectedProfile === 'investors' && (
                  <>
                    <p>• <strong>Valor inmobiliario (50% peso):</strong> Precio de venta y potencial</p>
                    <p>• <strong>Demanda solvente (40% peso):</strong> Renta media alta</p>
                    <p>• <strong>Actividad comercial (35% peso):</strong> Dynamismo de la zona</p>
                  </>
                )}
              </div>
              <p className="mt-2 font-medium">Los distritos se ordenan de mayor a menor puntuación para tu perfil específico.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ranking de distritos */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700">Ranking para tu perfil</h4>
        
        {districtScores.map((district, index) => {
          const insights = generateInsights(district);
          
          return (
            <div key={district.districtId} className={`rounded-lg p-4 border-2 ${
              index === 0 ? 'border-yellow-300 bg-yellow-50' : 
              index === 1 ? 'border-gray-300 bg-gray-50' : 
              index === 2 ? 'border-orange-300 bg-orange-50' : 
              'border-gray-200 bg-white'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                  <span className="font-medium text-gray-900">{district.districtName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Puntuación:</span>
                  <span className="font-bold text-lg text-blue-600">{district.score.toFixed(1)}/10</span>
                </div>
              </div>

              {/* Insights */}
              {insights.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {insights.map((insight, i) => (
                    <span key={i} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      {insight}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Recomendación final */}
      {districtScores.length > 0 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Nuestra recomendación</h4>
          <p className="text-sm text-blue-800">
            Para el perfil <strong>{currentProfile.name}</strong>, recomendamos <strong>{districtScores[0].districtName}</strong> 
            {districtScores.length > 1 && (
              <span> como primera opción, seguido de <strong>{districtScores[1].districtName}</strong></span>
            )}
            . Esta elección se basa en el análisis de los indicadores más relevantes para tus necesidades.
          </p>
        </div>
      )}
    </div>
  );
};


