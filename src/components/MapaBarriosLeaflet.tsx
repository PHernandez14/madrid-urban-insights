import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { Info } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import 'leaflet/dist/leaflet.css';
import './MapaBarriosLeaflet.css'; // Para las animaciones CSS

interface BarrioProperties {
  NOMBRE: string;
  NOMDIS: string;
  COD_BAR: string;
  CODDIS: string;
  [key: string]: any;
}

type MetricType = 'densidad' | 'envejecimiento' | 'inmigracion' | null;

interface MapaBarriosLeafletProps {
  colorBy?: (props: BarrioProperties) => string;
  legend?: React.ReactNode;
  densidadPorBarrio?: Record<string, number>;
  envejecimientoPorBarrio?: Record<string, number>;
  detallesEnvejecimientoPorBarrio?: Record<string, { porcentaje: number, mayores65: number, total: number }>;
  inmigracionPorBarrio?: Record<string, number>;
  poblacionPorBarrio?: Record<string, number>;
  superficiePorBarrio?: Record<string, number>;
  onMetricChange?: (metric: MetricType) => void;
}

const GEOJSON_URL = '/barrios_madrid.geojson';

function getClaveBarrioEnvejecimiento(nombre: string, detalles: Record<string, any>) {
  console.log('🔍 Buscando clave para:', nombre);
  console.log('📊 Claves disponibles:', Object.keys(detalles).slice(0, 10));
  
  const nombreNormalizado = nombre
    .toLocaleLowerCase('es-ES')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/\s+/g, ' ')
    .replace(/\./g, '') // quitar puntos abreviaturas H.
    .replace(/\s*h\s*/g, ' historico ')
    .trim();
  
  console.log('🔤 Nombre normalizado:', nombreNormalizado);
  
  const mapeoManual: Record<string, string> = {
    'casco historico de vallecas': 'CASCO H.VALLECAS',
    'casco historico de vicalvaro': 'CASCO H.VICALVARO',
    'casco historico de barajas': 'CASCO H.BARAJAS',
    'penagrande': 'PEÑA GRANDE',
    'peñagrande': 'PEÑA GRANDE',
    'pena grande': 'PEÑA GRANDE',
    // Alias habituales
    'villaverde alto': 'san andres',
  };
  
  // 1. Normalizado
  if (detalles[nombreNormalizado]) {
    console.log('✅ Encontrado por normalización:', nombreNormalizado);
    return nombreNormalizado;
  }
  
  // 2. Mayúsculas
  const nombreMayusculas = nombre.trim().toUpperCase();
  if (detalles[nombreMayusculas]) {
    console.log('✅ Encontrado por mayúsculas:', nombreMayusculas);
    return nombreMayusculas;
  }
  
  // 3. Mapeo manual
  const nombreMapeado = mapeoManual[nombreNormalizado];
  if (nombreMapeado && detalles[nombreMapeado]) {
    console.log('✅ Encontrado por mapeo manual:', nombreMapeado);
    return nombreMapeado;
  }
  
  // 4. Búsqueda parcial
  const todasLasClaves = Object.keys(detalles);
  const claveEncontrada = todasLasClaves.find(clave =>
    clave.toLowerCase().includes(nombreNormalizado) ||
    nombreNormalizado.includes(clave.toLowerCase())
  );
  if (claveEncontrada) {
    console.log('✅ Encontrado por búsqueda parcial:', claveEncontrada);
    return claveEncontrada;
  }
  
  console.log('❌ No se encontró clave para:', nombre);
  return null;
}

function getClaveBarrioInmigracion(nombre: string, inmigracion: Record<string, any>, codDistrito?: string | number, codBarrio?: string | number) {
  console.log('🔍 Buscando clave de inmigración para:', nombre);
  console.log('📊 inmigracionPorBarrio disponible:', !!inmigracion);
  console.log('📊 Claves de inmigración disponibles:', Object.keys(inmigracion).slice(0, 10));
  
  // 1. Probar con clave compuesta (codDistrito_codBarrio)
  if (codDistrito !== undefined && codBarrio !== undefined) {
    const claveCompuesta = `${String(codDistrito).padStart(2, '0')}_${String(codBarrio).padStart(3, '0')}`;
    if (inmigracion[claveCompuesta] !== undefined) {
      console.log('✅ Encontrado por clave compuesta (inmigración):', claveCompuesta);
      return claveCompuesta;
    }
  }
  
  const nombreNormalizado = nombre
    .toLocaleLowerCase('es-ES')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  console.log('🔤 Nombre normalizado para inmigración:', nombreNormalizado);
  
  const mapeoManual: Record<string, string> = {
    'casco historico de vallecas': 'CASCO H.VALLECAS',
    'casco historico de vicalvaro': 'CASCO H.VICALVARO',
    'casco historico de barajas': 'CASCO H.BARAJAS',
    'penagrande': 'PEÑA GRANDE',
    'peñagrande': 'PEÑA GRANDE',
  };
  
  // 1. Normalizado
  if (inmigracion[nombreNormalizado]) {
    console.log('✅ Encontrado por normalización (inmigración):', nombreNormalizado);
    return nombreNormalizado;
  }
  
  // 2. Mayúsculas
  const nombreMayusculas = nombre.trim().toUpperCase();
  if (inmigracion[nombreMayusculas]) {
    console.log('✅ Encontrado por mayúsculas (inmigración):', nombreMayusculas);
    return nombreMayusculas;
  }
  
  // 3. Mapeo manual
  const nombreMapeado = mapeoManual[nombreNormalizado];
  if (nombreMapeado && inmigracion[nombreMapeado]) {
    console.log('✅ Encontrado por mapeo manual (inmigración):', nombreMapeado);
    return nombreMapeado;
  }
  
  // 4. Búsqueda parcial
  const todasLasClaves = Object.keys(inmigracion);
  const claveEncontrada = todasLasClaves.find(clave =>
    clave.toLowerCase().includes(nombreNormalizado) ||
    nombreNormalizado.includes(clave.toLowerCase())
  );
  if (claveEncontrada) {
    console.log('✅ Encontrado por búsqueda parcial (inmigración):', claveEncontrada);
    return claveEncontrada;
  }
  
  // Verificar si el distrito tiene datos disponibles
  if (codDistrito !== undefined) {
    const distritoStr = String(codDistrito).padStart(2, '0');
    const distritosConDatos = new Set<string>();
    Object.keys(inmigracion).forEach(clave => {
      if (clave.includes('_')) {
        const distrito = clave.split('_')[0];
        distritosConDatos.add(distrito);
      }
    });
    
    if (!distritosConDatos.has(distritoStr)) {
      console.log(`❌ Distrito ${distritoStr} no tiene datos de inmigración disponibles`);
      console.log(`📊 Distritos con datos: ${Array.from(distritosConDatos).sort().join(', ')}`);
    }
  }
  
  console.log('❌ No se encontró clave de inmigración para:', nombre);
  return null;
}

const MapaBarriosLeaflet: React.FC<MapaBarriosLeafletProps> = ({ 
  colorBy, 
  legend, 
  densidadPorBarrio, 
  envejecimientoPorBarrio,
  detallesEnvejecimientoPorBarrio,
  inmigracionPorBarrio,
  poblacionPorBarrio,
  superficiePorBarrio,
  onMetricChange 
}) => {
  const [geojson, setGeojson] = useState<any>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [barrioProps, setBarrioProps] = useState<BarrioProperties | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<MetricType>(null);

  useEffect(() => {
    fetch(GEOJSON_URL)
      .then(res => res.json())
      .then(setGeojson);
  }, []);

  const handleMetricChange = (metric: MetricType) => {
    // Si la métrica ya está seleccionada, deselecciona
    if (selectedMetric === metric) {
      setSelectedMetric(null);
      setBarrioProps(null);
      if (onMetricChange) onMetricChange(null);
      return;
    }
    setSelectedMetric(metric);
    setBarrioProps(null); // Limpiar selección al cambiar métrica
    if (onMetricChange) {
      onMetricChange(metric);
    }
  };

  const onEachFeature = (feature: any, layer: any) => {
    const props: BarrioProperties = feature.properties;
    const claveCompuesta = `${String(props.CODDIS).padStart(2, '0')}_${String(props.COD_BAR).padStart(3, '0')}`;
    layer.on({
      mouseover: (e: any) => {
        setHovered(claveCompuesta);
        layer.setStyle({ weight: 3, color: '#2563eb', fillOpacity: 0.7 });
      },
      mouseout: (e: any) => {
        setHovered(null);
        layer.setStyle({ weight: 1, color: '#3b82f6', fillOpacity: selected === props.COD_BAR ? 0.7 : 0.4 });
      },
      click: (e: any) => {
        setSelected(props.COD_BAR);
        let poblacion = poblacionPorBarrio && poblacionPorBarrio[claveCompuesta] ? poblacionPorBarrio[claveCompuesta] : undefined;
        let superficie = superficiePorBarrio && superficiePorBarrio[claveCompuesta] ? superficiePorBarrio[claveCompuesta] : undefined;
        setBarrioProps({ ...props, POBLACION: poblacion, SUPERFICIE: superficie });
      },
    });
  };

  const style = (feature: any) => {
    const props: BarrioProperties = feature.properties;
    const claveCompuesta = `${String(props.CODDIS).padStart(2, '0')}_${String(props.COD_BAR).padStart(3, '0')}`;
    let color = '#e5e7eb';
    let value = undefined;

    if (!selectedMetric) {
      color = '#e5e7eb';
    } else if (selectedMetric === 'densidad' && densidadPorBarrio && densidadPorBarrio[claveCompuesta]) {
      value = Number(densidadPorBarrio[claveCompuesta]);
      if (value < 5000) color = '#3b82f6';
      else if (value < 10000) color = '#60a5fa';
      else if (value < 15000) color = '#fbbf24';
      else if (value < 20000) color = '#f59e0b';
      else if (value < 25000) color = '#ef4444';
      else color = '#dc2626';
    } else if (selectedMetric === 'envejecimiento' && envejecimientoPorBarrio) {
      // Usar la función centralizada para buscar la clave
      console.log('🎨 Aplicando estilo para envejecimiento - Barrio:', props.NOMBRE);
      console.log('📊 envejecimientoPorBarrio disponible:', !!envejecimientoPorBarrio);
      const clave = getClaveBarrioEnvejecimiento(props.NOMBRE, envejecimientoPorBarrio);
      console.log('🔑 Clave encontrada:', clave);
      if (clave) {
        value = Number(envejecimientoPorBarrio[clave]);
        console.log('📈 Valor de envejecimiento:', value);
        if (value < 10) color = '#10b981';
        else if (value < 15) color = '#34d399';
        else if (value < 20) color = '#fbbf24';
        else if (value < 25) color = '#f59e0b';
        else if (value < 30) color = '#ef4444';
        else color = '#dc2626';
      } else {
        console.log('❌ No se pudo encontrar clave para envejecimiento');
      }
    } else if (selectedMetric === 'inmigracion' && inmigracionPorBarrio) {
      // Usar la función centralizada para buscar la clave
      console.log('🎨 Aplicando estilo para inmigración - Barrio:', props.NOMBRE);
      console.log('📊 inmigracionPorBarrio disponible:', !!inmigracionPorBarrio);
      const clave = getClaveBarrioInmigracion(props.NOMBRE, inmigracionPorBarrio, props.CODDIS, props.COD_BAR);
      console.log('🔑 Clave de inmigración encontrada:', clave);
      if (clave) {
        value = Number(inmigracionPorBarrio[clave]);
        console.log('📈 Valor de inmigración:', value);
        if (value < 5) color = '#10b981';
        else if (value < 10) color = '#34d399';
        else if (value < 15) color = '#fbbf24';
        else if (value < 20) color = '#f59e0b';
        else if (value < 25) color = '#ef4444';
        else color = '#dc2626';
      } else {
        console.log('❌ No se pudo encontrar clave para inmigración');
      }
    }

    const isHovered = hovered === claveCompuesta;
    return {
      fillColor: color,
      color: isHovered ? '#2563eb' : '#a5b4fc',
      weight: isHovered ? 3 : 1,
      fillOpacity: 0.5,
      opacity: 1,
    };
  };

  const renderMetricSelector = () => (
    <div>
      <h3 className="font-bold text-blue-700 mb-3">Seleccionar métrica</h3>
      <div className="flex flex-col gap-2">
        <button
          onClick={() => handleMetricChange('densidad')}
          className={`px-3 py-2 rounded-lg text-left transition-colors ${
            selectedMetric === 'densidad' 
              ? 'bg-blue-100 text-blue-700 border-2 border-blue-300' 
              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
          }`}
        >
          <div className="font-semibold">Densidad Poblacional</div>
          <div className="text-xs text-gray-500">Habitantes por km²</div>
        </button>
        <button
          onClick={() => handleMetricChange('envejecimiento')}
          className={`px-3 py-2 rounded-lg text-left transition-colors ${
            selectedMetric === 'envejecimiento' 
              ? 'bg-blue-100 text-blue-700 border-2 border-blue-300' 
              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
          }`}
        >
          <div className="font-semibold">Envejecimiento</div>
          <div className="text-xs text-gray-500">% población mayor de 65 años</div>
        </button>
        <button
          onClick={() => handleMetricChange('inmigracion')}
          className={`px-3 py-2 rounded-lg text-left transition-colors ${
            selectedMetric === 'inmigracion' 
              ? 'bg-blue-100 text-blue-700 border-2 border-blue-300' 
              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
          }`}
        >
          <div className="font-semibold">Población Extranjera</div>
          <div className="text-xs text-gray-500">% población extranjera</div>
        </button>
      </div>
    </div>
  );

  const renderLegend = () => {
    if (!selectedMetric) return <div className="text-gray-400 text-sm text-center py-8">Selecciona una métrica para ver la leyenda.</div>;
    if (selectedMetric === 'densidad') {
      return (
        <div className="space-y-3 flex flex-col items-center justify-center h-full">
          <div className="flex items-center gap-2 w-full justify-between">
            <span className="font-bold text-blue-700">Densidad poblacional</span>
            <Popover>
              <PopoverTrigger asChild>
                <button className="text-blue-700 hover:text-blue-900"><Info size={18} /></button>
              </PopoverTrigger>
              <PopoverContent side="right">
                <div className="mb-2 font-semibold">Rangos de colores:</div>
                <div className="flex flex-col gap-1 mb-2">
                  <div className="flex items-center gap-2"><div style={{ width: 16, height: 16, backgroundColor: '#3b82f6' }}></div><span className="text-xs">Menos de 5.000</span></div>
                  <div className="flex items-center gap-2"><div style={{ width: 16, height: 16, backgroundColor: '#60a5fa' }}></div><span className="text-xs">5.000 - 10.000</span></div>
                  <div className="flex items-center gap-2"><div style={{ width: 16, height: 16, backgroundColor: '#fbbf24' }}></div><span className="text-xs">10.000 - 15.000</span></div>
                  <div className="flex items-center gap-2"><div style={{ width: 16, height: 16, backgroundColor: '#f59e0b' }}></div><span className="text-xs">15.000 - 20.000</span></div>
                  <div className="flex items-center gap-2"><div style={{ width: 16, height: 16, backgroundColor: '#ef4444' }}></div><span className="text-xs">20.000 - 25.000</span></div>
                  <div className="flex items-center gap-2"><div style={{ width: 16, height: 16, backgroundColor: '#dc2626' }}></div><span className="text-xs">Más de 25.000</span></div>
                  <div className="flex items-center gap-2"><div style={{ width: 16, height: 16, backgroundColor: '#e5e7eb', border: '1px solid #cbd5e1' }}></div><span className="text-xs">Sin dato</span></div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center gap-2 w-full justify-between">
            <span className="text-xs font-medium">¿Cómo se calcula?</span>
            <Popover>
              <PopoverTrigger asChild>
                <button className="text-blue-700 hover:text-blue-900"><Info size={16} /></button>
              </PopoverTrigger>
              <PopoverContent side="right">
                <span>Número de habitantes dividido entre la superficie del barrio (habitantes/km²).</span>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center gap-2 w-full justify-between">
            <span className="text-xs font-medium">¿Por qué es importante?</span>
            <Popover>
              <PopoverTrigger asChild>
                <button className="text-blue-700 hover:text-blue-900"><Info size={16} /></button>
              </PopoverTrigger>
              <PopoverContent side="right">
                <span>La densidad poblacional ayuda a entender la presión sobre los servicios urbanos, la calidad de vida y la planificación de infraestructuras.</span>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      );
    } else if (selectedMetric === 'envejecimiento') {
      return (
        <div className="space-y-3 flex flex-col items-center justify-center h-full">
          <div className="flex items-center gap-2 w-full justify-between">
            <span className="font-bold text-blue-700">Envejecimiento</span>
            <Popover>
              <PopoverTrigger asChild>
                <button className="text-blue-700 hover:text-blue-900"><Info size={18} /></button>
              </PopoverTrigger>
              <PopoverContent side="right">
                <div className="mb-2 font-semibold">Rangos de colores:</div>
                <div className="flex flex-col gap-1 mb-2">
                  <div className="flex items-center gap-2"><div style={{ width: 16, height: 16, backgroundColor: '#10b981' }}></div><span className="text-xs">Menos del 10%</span></div>
                  <div className="flex items-center gap-2"><div style={{ width: 16, height: 16, backgroundColor: '#34d399' }}></div><span className="text-xs">10% - 15%</span></div>
                  <div className="flex items-center gap-2"><div style={{ width: 16, height: 16, backgroundColor: '#fbbf24' }}></div><span className="text-xs">15% - 20%</span></div>
                  <div className="flex items-center gap-2"><div style={{ width: 16, height: 16, backgroundColor: '#f59e0b' }}></div><span className="text-xs">20% - 25%</span></div>
                  <div className="flex items-center gap-2"><div style={{ width: 16, height: 16, backgroundColor: '#ef4444' }}></div><span className="text-xs">25% - 30%</span></div>
                  <div className="flex items-center gap-2"><div style={{ width: 16, height: 16, backgroundColor: '#dc2626' }}></div><span className="text-xs">Más del 30%</span></div>
                  <div className="flex items-center gap-2"><div style={{ width: 16, height: 16, backgroundColor: '#e5e7eb', border: '1px solid #cbd5e1' }}></div><span className="text-xs">Sin dato</span></div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center gap-2 w-full justify-between">
            <span className="text-xs font-medium">¿Cómo se calcula?</span>
            <Popover>
              <PopoverTrigger asChild>
                <button className="text-blue-700 hover:text-blue-900"><Info size={16} /></button>
              </PopoverTrigger>
              <PopoverContent side="right">
                <span>Porcentaje de población mayor de 65 años respecto al total del barrio.</span>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center gap-2 w-full justify-between">
            <span className="text-xs font-medium">¿Por qué es importante?</span>
            <Popover>
              <PopoverTrigger asChild>
                <button className="text-blue-700 hover:text-blue-900"><Info size={16} /></button>
              </PopoverTrigger>
              <PopoverContent side="right">
                <span>El envejecimiento poblacional indica la necesidad de servicios sanitarios, sociales y de accesibilidad específicos.</span>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      );
    } else if (selectedMetric === 'inmigracion') {
      return (
        <div className="space-y-3 flex flex-col items-center justify-center h-full">
          <div className="flex items-center gap-2 w-full justify-between">
            <span className="font-bold text-blue-700">Población extranjera</span>
            <Popover>
              <PopoverTrigger asChild>
                <button className="text-blue-700 hover:text-blue-900"><Info size={18} /></button>
              </PopoverTrigger>
              <PopoverContent side="right">
                <div className="mb-2 font-semibold">Rangos de colores:</div>
                <div className="flex flex-col gap-1 mb-2">
                  <div className="flex items-center gap-2"><div style={{ width: 16, height: 16, backgroundColor: '#10b981' }}></div><span className="text-xs">Menos del 5%</span></div>
                  <div className="flex items-center gap-2"><div style={{ width: 16, height: 16, backgroundColor: '#34d399' }}></div><span className="text-xs">5% - 10%</span></div>
                  <div className="flex items-center gap-2"><div style={{ width: 16, height: 16, backgroundColor: '#fbbf24' }}></div><span className="text-xs">10% - 15%</span></div>
                  <div className="flex items-center gap-2"><div style={{ width: 16, height: 16, backgroundColor: '#f59e0b' }}></div><span className="text-xs">15% - 20%</span></div>
                  <div className="flex items-center gap-2"><div style={{ width: 16, height: 16, backgroundColor: '#ef4444' }}></div><span className="text-xs">20% - 25%</span></div>
                  <div className="flex items-center gap-2"><div style={{ width: 16, height: 16, backgroundColor: '#dc2626' }}></div><span className="text-xs">Más del 25%</span></div>
                  <div className="flex items-center gap-2"><div style={{ width: 16, height: 16, backgroundColor: '#e5e7eb', border: '1px solid #cbd5e1' }}></div><span className="text-xs">Sin dato</span></div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center gap-2 w-full justify-between">
            <span className="text-xs font-medium">¿Cómo se calcula?</span>
            <Popover>
              <PopoverTrigger asChild>
                <button className="text-blue-700 hover:text-blue-900"><Info size={16} /></button>
              </PopoverTrigger>
              <PopoverContent side="right">
                <span>Porcentaje de población extranjera respecto al total del barrio.</span>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center gap-2 w-full justify-between">
            <span className="text-xs font-medium">¿Por qué es importante?</span>
            <Popover>
              <PopoverTrigger asChild>
                <button className="text-blue-700 hover:text-blue-900"><Info size={16} /></button>
              </PopoverTrigger>
              <PopoverContent side="right">
                <span>La diversidad cultural y la integración social son indicadores clave de la cohesión urbana y la planificación de servicios.</span>
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Nota sobre disponibilidad de datos eliminada a petición del usuario */}
        </div>
      );
    }
    return null;
  };

  const getBarrioValue = (props: BarrioProperties) => {
    const claveCompuesta = `${String(props.CODDIS).padStart(2, '0')}_${String(props.COD_BAR).padStart(3, '0')}`;
    if (selectedMetric === 'densidad' && densidadPorBarrio && densidadPorBarrio[claveCompuesta]) {
      return `${densidadPorBarrio[claveCompuesta].toLocaleString()} hab/km²`;
    } else if (selectedMetric === 'envejecimiento' && envejecimientoPorBarrio) {
      // Usar la función centralizada para buscar la clave
      console.log('📊 getBarrioValue - Buscando envejecimiento para:', props.NOMBRE);
      console.log('📊 envejecimientoPorBarrio disponible:', !!envejecimientoPorBarrio);
      const clave = getClaveBarrioEnvejecimiento(props.NOMBRE, envejecimientoPorBarrio);
      console.log('🔑 getBarrioValue - Clave encontrada:', clave);
      if (clave) {
        const envejecimiento = envejecimientoPorBarrio[clave];
        console.log('📈 getBarrioValue - Valor de envejecimiento:', envejecimiento);
        return `${envejecimiento.toFixed(1)}%`;
      } else {
        console.log('❌ getBarrioValue - No se pudo encontrar clave para envejecimiento');
      }
    } else if (selectedMetric === 'inmigracion' && inmigracionPorBarrio) {
      // Usar la función centralizada para buscar la clave
      console.log('📊 getBarrioValue - Buscando inmigración para:', props.NOMBRE);
      console.log('📊 inmigracionPorBarrio disponible:', !!inmigracionPorBarrio);
      const clave = getClaveBarrioInmigracion(props.NOMBRE, inmigracionPorBarrio, props.CODDIS, props.COD_BAR);
      console.log('🔑 getBarrioValue - Clave de inmigración encontrada:', clave);
      if (clave) {
        const inmigracion = inmigracionPorBarrio[clave];
        console.log('📈 getBarrioValue - Valor de inmigración:', inmigracion);
        return `${inmigracion.toFixed(1)}%`;
      } else {
        console.log('❌ getBarrioValue - No se pudo encontrar clave para inmigración');
      }
    }
    return 'Sin dato';
  };

  const getDistritosConDatosInmigracion = () => {
    if (!inmigracionPorBarrio) return [];
    
    const distritosConDatos = new Set<string>();
    Object.keys(inmigracionPorBarrio).forEach(clave => {
      if (clave.includes('_')) {
        const distrito = clave.split('_')[0];
        distritosConDatos.add(distrito);
      }
    });
    
    return Array.from(distritosConDatos).sort();
  };

  const getNombreDistrito = (codigo: string) => {
    const nombresDistritos: Record<string, string> = {
      '01': 'Centro',
      '02': 'Arganzuela', 
      '03': 'Retiro',
      '04': 'Salamanca',
      '05': 'Chamartín',
      '06': 'Tetuán',
      '07': 'Chamberí',
      '08': 'Fuencarral-El Pardo',
      '09': 'Moncloa-Aravaca',
      '10': 'Latina',
      '11': 'Carabanchel',
      '12': 'Usera',
      '13': 'Puente de Vallecas',
      '14': 'Moratalaz',
      '15': 'Ciudad Lineal',
      '16': 'Hortaleza',
      '17': 'Villaverde',
      '18': 'Villa de Vallecas',
      '19': 'Vicálvaro',
      '20': 'San Blas-Canillejas',
      '21': 'Barajas'
    };
    
    return nombresDistritos[codigo] || `Distrito ${codigo}`;
  };

  return (
    <div className="flex gap-6">
      <div className="relative w-full h-[600px] rounded-xl overflow-hidden shadow border">
        <MapContainer center={[40.4168, -3.7038]} zoom={12} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {geojson && (
            <GeoJSON
              data={geojson}
              style={style}
              onEachFeature={onEachFeature}
            />
          )}
        </MapContainer>
      </div>
      {/* Panel lateral simétrico con tres cajas */}
      <div className="w-80 flex flex-col gap-4">
        {/* Caja 1: Selector de métrica */}
        <div className="bg-white rounded-xl shadow p-6 border min-h-[120px] flex flex-col justify-center">
          {renderMetricSelector()}
        </div>
        {/* Caja 2: Leyenda con animación */}
        <SwitchTransition mode="out-in">
          <CSSTransition
            key={selectedMetric || 'none'}
            timeout={300}
            classNames="fade-slide"
            unmountOnExit
          >
            <div className="bg-white rounded-xl shadow p-6 border min-h-[180px] flex flex-col justify-center">
              {renderLegend()}
              <div className="mt-4 text-xs text-gray-500 text-center">
                {selectedMetric ? 'Haz clic en un barrio para ver información detallada.' : ''}
              </div>
            </div>
          </CSSTransition>
        </SwitchTransition>
        {/* Caja 3: Datos del barrio con animación */}
        <SwitchTransition mode="out-in">
          <CSSTransition
            key={barrioProps ? barrioProps.COD_BAR : 'none'}
            timeout={300}
            classNames="fade-slide"
            unmountOnExit
          >
            <div className="bg-white rounded-xl shadow p-6 border min-h-[140px] flex flex-col justify-center">
              {barrioProps ? (
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-bold text-blue-700 mb-2">{barrioProps.NOMBRE}</h3>
                  <div className="text-sm text-gray-700 mb-1">Distrito: <span className="font-semibold">{barrioProps.NOMDIS}</span></div>
                  <div className="text-xs text-gray-500 mb-2">Código: {barrioProps.COD_BAR}</div>
                  {/* Mostrar habitantes siempre */}
                  <div className="text-sm text-gray-700 mb-1">
                    <span className="font-semibold">Habitantes:</span> {barrioProps.POBLACION ? barrioProps.POBLACION.toLocaleString() : 'Sin dato'}
                  </div>
                  {/* Mostrar variable dependiente de la métrica */}
                  {selectedMetric === 'densidad' && (
                    <div className="text-sm text-gray-700 mb-1">
                      <span className="font-semibold">Superficie:</span> {barrioProps.SUPERFICIE ? barrioProps.SUPERFICIE.toLocaleString(undefined, { maximumFractionDigits: 2 }) + ' km²' : 'Sin dato'}
                    </div>
                  )}
                  {selectedMetric === 'envejecimiento' && detallesEnvejecimientoPorBarrio && (
                    (() => {
                      console.log('🟦 Panel lateral: claves en detallesEnvejecimientoPorBarrio:', Object.keys(detallesEnvejecimientoPorBarrio).slice(0, 10));
                      const clave = getClaveBarrioEnvejecimiento(barrioProps.NOMBRE, detallesEnvejecimientoPorBarrio);
                      console.log('🟦 Panel lateral: clave encontrada:', clave);
                      const detalles = clave ? detallesEnvejecimientoPorBarrio[clave] : undefined;
                      console.log('🟦 Panel lateral: detalles encontrados:', detalles);
                      return (
                        <div className="text-sm text-gray-700 mb-1">
                          <span className="font-semibold">Mayores de 65 años:</span> {detalles ? detalles.mayores65.toLocaleString() : 'Sin dato'}
                        </div>
                      );
                    })()
                  )}
                  {selectedMetric === 'inmigracion' && (
                    (() => {
                      console.log('🟦 Panel lateral: claves en inmigracionPorBarrio:', Object.keys(inmigracionPorBarrio || {}).slice(0, 10));
                      const clave = getClaveBarrioInmigracion(barrioProps.NOMBRE, inmigracionPorBarrio || {}, barrioProps.CODDIS, barrioProps.COD_BAR);
                      console.log('🟦 Panel lateral: clave de inmigración encontrada:', clave);
                      const porcentajeInmigracion = clave ? inmigracionPorBarrio?.[clave] : undefined;
                      console.log('🟦 Panel lateral: porcentaje de inmigración encontrado:', porcentajeInmigracion);
                      const totalHabitantes = barrioProps.POBLACION;
                      const personasExtranjeras = porcentajeInmigracion && totalHabitantes ? 
                        Math.round((porcentajeInmigracion / 100) * totalHabitantes) : undefined;
                      console.log('🟦 Panel lateral: personas extranjeras calculadas:', personasExtranjeras);
                      return (
                        <div className="text-sm text-gray-700 mb-1">
                          <span className="font-semibold">Personas extranjeras:</span> {personasExtranjeras ? personasExtranjeras.toLocaleString() : 'Sin dato'}
                        </div>
                      );
                    })()
                  )}
                  <div className="text-base font-semibold text-blue-900 mb-2">
                    {selectedMetric === 'densidad' && 'Densidad poblacional: '}
                    {selectedMetric === 'envejecimiento' && 'Envejecimiento: '}
                    {selectedMetric === 'inmigracion' && 'Población extranjera: '}
                    {getBarrioValue(barrioProps)}
                  </div>
                  <button
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => setBarrioProps(null)}
                  >
                    Cerrar
                  </button>
                </div>
              ) : (
                <div className="text-gray-400 text-sm text-center py-8">Haz clic en un barrio para ver los datos.</div>
              )}
            </div>
          </CSSTransition>
        </SwitchTransition>
      </div>
    </div>
  );
};

export default MapaBarriosLeaflet; 