import React, { useMemo, useState } from 'react';
import { ExpandedUrbanIndicators, expandedKpiCategories, expandedMetricLabels } from '../data/expandedMadridData';
import { datosEconomicosOficialesMadrid } from '../data/datosEconomicosOficialesMadrid';
import { preciosOficialesMadrid } from '../data/preciosOficialesMadrid';
import BarChart from './BarChart';
import ScatterPlot from './ScatterPlot';
import datosComerciales from '../data/datosComercialesMadrid.json';

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
      {/* Controles */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Comparación</h2>
            <p className="text-xs text-gray-500">Año {year} · Seleccionados {selectedDistricts.length}/{MAX_SELECTED}</p>
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

      {/* Sistema de Recomendaciones Inteligentes */}
      {selectedData.length > 0 && (
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

  // Perfiles de usuario con sus prioridades
  const userProfiles = {
    families: {
      name: 'Familias',
      priorities: {
        rentaMediaPersona: 0.3,
        precioAlquilerM2: -0.25, // Negativo = menor es mejor
        precioVentaM2: -0.2,
        localesComerciales: 0.15,
        totalLocales: 0.1,
      },
      description: 'Priorizan poder adquisitivo, precios asequibles y servicios cercanos'
    },
    young: {
      name: 'Jóvenes Profesionales',
      priorities: {
        precioAlquilerM2: -0.35,
        rentaMediaPersona: 0.2,
        localesComerciales: 0.25,
        totalLocales: 0.2,
      },
      description: 'Buscan alquileres asequibles y vida social activa'
    },
    seniors: {
      name: 'Seniors',
      priorities: {
        rentaMediaPersona: 0.25,
        precioVentaM2: -0.15,
        localesComerciales: 0.3,
        totalLocales: 0.3,
      },
      description: 'Valoran estabilidad económica y servicios accesibles'
    },
    investors: {
      name: 'Inversores',
      priorities: {
        precioVentaM2: 0.4,
        rentaMediaPersona: 0.3,
        localesComerciales: 0.2,
        totalLocales: 0.1,
      },
      description: 'Buscan potencial de revalorización y demanda'
    }
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

  // Calcular puntuaciones y ordenar distritos
  const districtScores = selectedData.map(district => ({
    ...district,
    score: calculateDistrictScore(district, userProfiles[selectedProfile as keyof typeof userProfiles])
  })).sort((a, b) => b.score - a.score);

  // Generar insights automáticos
  const generateInsights = (district: any) => {
    const insights: string[] = [];
    
    // Económicos
    const econ = econByName.get(district.districtName.toLowerCase());
    if (econ) {
      const renta = Number(econ.rentaMediaPersona ?? 0);
      if (renta > 30000) insights.push('Renta alta');
      else if (renta < 20000) insights.push('Renta asequible');
      
      const paro = Number(econ.tasaParo ?? 0);
      if (paro < 8) insights.push('Bajo desempleo');
      else if (paro > 15) insights.push('Desempleo elevado');
    }

    // Vivienda
    const price = priceByName.get(district.districtName.toLowerCase());
    if (price) {
      const alquiler = Number(price.precioAlquilerM2 ?? 0);
      if (alquiler < 15) insights.push('Alquiler asequible');
      else if (alquiler > 25) insights.push('Zona premium');
    }

    // Comercial
    const commercial = datosComerciales.find(d => d.nombre?.toLowerCase() === district.districtName.toLowerCase());
    if (commercial) {
      const locales = Number(commercial.totalLocales ?? 0);
      if (locales > 1000) insights.push('Zona comercial activa');
      else if (locales < 300) insights.push('Zona residencial');
    }

    return insights.slice(0, 3); // Máximo 3 insights
  };

  const currentProfile = userProfiles[selectedProfile as keyof typeof userProfiles];

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

      <p className="text-sm text-gray-600 mb-4"><strong>Perfil seleccionado:</strong> {currentProfile.description}</p>

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


