import React, { useState, useEffect } from 'react';
import { Users, Home, MapPin, TrendingUp, Brain, ChevronDown, Bot, Send, AlertTriangle, Sparkles, MessageSquare, Wand2 } from 'lucide-react';
import { chatWithOllama, listOllamaModels, pingOllama } from './lib/aiClient';
import Header from './components/Header';
import KPICard from './components/KPICard';
import DistrictCard from './components/DistrictCard';
import BarChart from './components/BarChart';
import InteractiveMap from './components/InteractiveMap';
import RadarChart from './components/RadarChart';
import ScatterPlot from './components/ScatterPlot';
import { 
  expandedUrbanIndicators, 
  expandedKpiCategories, 
  expandedMetricLabels,
  useCases,
  type ExpandedUrbanIndicators
} from './data/expandedMadridData';
import DemografiaPoblacion from './components/DemografiaPoblacion';
import PiramidePoblacional from './components/PiramidePoblacional';
import MapaBarriosLeaflet from './components/MapaBarriosLeaflet';
import { parsePiramideCSV, getEnvejecimientoPorBarrio, getDetallesEnvejecimientoPorBarrio, parsePoblacionCSV, getInmigracionPorBarrio, getInmigracionPorBarrioMapeado } from './data/utils/parseCSV';
import * as turf from '@turf/turf';
import NoticiasRotativas from './components/NoticiasRotativas';
import MapaPreciosDistritos from './components/MapaPreciosDistritos';
import EstadisticasPreciosDistritos from './components/EstadisticasPreciosDistritos';
import EvolucionPreciosMadrid from './components/EvolucionPreciosMadrid';
import DatosEconomicosMadrid from './components/DatosEconomicosMadrid';
import IndicadoresMacro from './components/IndicadoresMacro';
import GraficosEconomicosMadrid from './components/GraficosEconomicosMadrid';
import ViviendasTuristicas from './components/ViviendasTuristicas';
import ActividadComercialDistrito from './components/ActividadComercialDistrito';
import LicenciasDistrito from './components/LicenciasDistrito';
import TerrazasDistrito from './components/TerrazasDistrito';
import MapaDeCalorActividad from './components/MapaDeCalorActividad';
import MapaMovilidad from './components/MapaMovilidad';
import EstadisticasBiciMAD from './components/EstadisticasBiciMAD';
import ComparisonPanel from './components/ComparisonPanel';


const PIRAMIDE_CSV_URL = '/ficheros/demo/estadisticas202506.csv';
const POBLACION_CSV_URL = '/ficheros/demo/poblacion_limpio.csv';
const INMIGRACION_CSV_URL = '/ficheros/demo/tipo_nacionalidad_hogar_limpio.csv';

const GEOJSON_URL = '/barrios_madrid.geojson';

const App = () => {
  const [activeView, setActiveView] = useState<'overview' | 'analysis' | 'comparison' | 'ai'>('overview');
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('demographics');
  const [selectedMetric, setSelectedMetric] = useState<string>('population');
  const [selectedUseCase, setSelectedUseCase] = useState<string>('');
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [envejecimientoPorBarrio, setEnvejecimientoPorBarrio] = useState<Record<string, number>>({});
  const [piramideLoaded, setPiramideLoaded] = useState(false);
  const [densidadPorBarrio, setDensidadPorBarrio] = useState<Record<string, number>>({});
  const [inmigracionPorBarrio, setInmigracionPorBarrio] = useState<Record<string, number>>({});
  const [poblacionPorBarrio, setPoblacionPorBarrio] = useState<Record<string, number>>({});
  const [superficiePorBarrio, setSuperficiePorBarrio] = useState<Record<string, number>>({});
  const [detallesEnvejecimientoPorBarrio, setDetallesEnvejecimientoPorBarrio] = useState<Record<string, { porcentaje: number, mayores65: number, total: number }>>({});
  const [barriosMeta, setBarriosMeta] = useState<Array<{ clave: string; nombre: string; distrito: string }>>([]);


  // Usar año fijo 2024 para todos los datos
  const selectedYear = 2024;

  useEffect(() => {
    fetch(PIRAMIDE_CSV_URL)
      .then(res => res.text())
      .then(text => {
        console.log('CSV de pirámide cargado, longitud:', text.length);
        console.log('Primeras 500 caracteres del CSV:', text.substring(0, 500));
        
        const piramide = parsePiramideCSV(text);
        console.log('Datos de pirámide parseados:', piramide.length, 'filas');
        console.log('Primeras 3 filas:', piramide.slice(0, 3));
        
        const envejecimiento = getEnvejecimientoPorBarrio(piramide);
        console.log('Datos de envejecimiento calculados:', Object.keys(envejecimiento).length, 'barrios');
        console.log('Primeros 10 barrios con envejecimiento:', Object.entries(envejecimiento).slice(0, 10));
        
        setEnvejecimientoPorBarrio(envejecimiento);
        setPiramideLoaded(true);
        // Nuevo: detalles absolutos
        const detalles = getDetallesEnvejecimientoPorBarrio(piramide);
        setDetallesEnvejecimientoPorBarrio(detalles);
      })
      .catch(error => {
        console.error('Error cargando datos de pirámide:', error);
      });
  }, []);

  useEffect(() => {
    // Cargar y calcular densidad poblacional
    Promise.all([
      fetch(POBLACION_CSV_URL).then(res => res.text()),
      fetch(GEOJSON_URL).then(res => res.json())
    ]).then(([csvText, geojson]) => {
      const poblacion = parsePoblacionCSV(csvText);
      const ultimoAno = Math.max(...poblacion.map(p => p.año));
      console.log('Población cargada:', poblacion.length, 'filas, último año:', ultimoAno);
      
      // Generar clave compuesta para cada barrio: cod_distrito + cod_barrio
      const claveBarrio = (distrito, barrio) => {
        const distritoStr = distrito.toString().padStart(2, '0');
        const barrioStr = barrio.toString().padStart(3, '0');
        return `${distritoStr}_${barrioStr}`;
      };
      
      // Agrupar población por clave compuesta (solo barrios individuales, no distritos completos)
      const poblacionPorClave = {};
      poblacion.filter(p => p.año === ultimoAno && p.cod_barrio !== p.cod_distrito).forEach(p => {
        // Solo incluir barrios individuales (excluir filas donde cod_barrio = cod_distrito)
        const clave = claveBarrio(p.cod_distrito, p.cod_barrio);
        poblacionPorClave[clave] = p.num_personas;
        
        // Debug: verificar algunos barrios específicos
        if (p.cod_distrito === 16 && p.cod_barrio === 164) {
          console.log('🔍 Barrio 16_164 encontrado en CSV:', { cod_distrito: p.cod_distrito, cod_barrio: p.cod_barrio, clave, poblacion: p.num_personas });
        }
        // Debug: verificar todos los barrios del distrito 16
        if (p.cod_distrito === 16) {
          console.log('🔍 Barrio del distrito 16 encontrado en CSV:', { cod_distrito: p.cod_distrito, cod_barrio: p.cod_barrio, clave, poblacion: p.num_personas });
        }
      });
      console.log('Población por barrio:', Object.keys(poblacionPorClave).length, 'barrios');
      console.log('Primeras 10 claves de población:', Object.keys(poblacionPorClave).slice(0, 10));
      
      // Debug: verificar claves del distrito 16
      const clavesDistrito16 = Object.keys(poblacionPorClave).filter(clave => clave.startsWith('16_'));
      console.log('🔍 Claves del distrito 16 en población:', clavesDistrito16);
      
      // Debug: verificar todos los distritos disponibles en población
      const distritosEnPoblacion = [...new Set(Object.keys(poblacionPorClave).map(clave => clave.split('_')[0]))].sort();
      console.log('🔍 Distritos disponibles en población:', distritosEnPoblacion);
      
      // Verificar datos específicos de algunos barrios
      console.log('🔍 Verificando datos específicos:');
      console.log('Carabanchel (11_011):', poblacionPorClave['11_011']);
      console.log('Fuencarral (08_081):', poblacionPorClave['08_081']);
      console.log('Puente de Vallecas (13_013):', poblacionPorClave['13_013']);
      console.log('Latina (10_010):', poblacionPorClave['10_010']);
      console.log('Ciudad Lineal (15_015):', poblacionPorClave['15_015']);
      
      setPoblacionPorBarrio(poblacionPorClave);
      
      // Calcular superficie de cada barrio por clave compuesta
      const superficies = {};
      const meta: Array<{ clave: string; nombre: string; distrito: string }> = [];
      geojson.features.forEach((feature) => {
        const cod_distrito = feature.properties.CODDIS || feature.properties.COD_DIS || feature.properties.COD_DIS_TX;
        const cod_barrio = feature.properties.COD_BAR || feature.properties.CODBAR || feature.properties.COD_BARRIO || feature.properties.cod_barrio;
        const clave = claveBarrio(cod_distrito, cod_barrio);
        const area = turf.area(feature) / 1e6; // m² a km²
        superficies[clave] = area;
        const nombre = feature.properties.NOMBRE || feature.properties.NOM_BARRIO || feature.properties.NOMBRE_BARRIO || '';
        const distritoNombre = feature.properties.NOMDIS || feature.properties.NOMBRE_DISTRITO || feature.properties.DISTRITO || '';
        meta.push({ clave, nombre, distrito: distritoNombre });
        
        // Debug: verificar algunos barrios específicos
        if (cod_distrito === '16' && cod_barrio === '164') {
          console.log('🔍 Barrio 16_164 encontrado en GeoJSON:', { cod_distrito, cod_barrio, clave, area });
        }
        // Debug: verificar todos los barrios del distrito 16
        if (cod_distrito === '16') {
          console.log('🔍 Barrio del distrito 16 encontrado en GeoJSON:', { cod_distrito, cod_barrio, clave, area });
        }
      });
      console.log('Superficies calculadas:', Object.keys(superficies).length, 'barrios');
      console.log('Primeras 10 claves de superficie:', Object.keys(superficies).slice(0, 10));
      
      // Debug: verificar claves del distrito 16
      const clavesDistrito16Superficie = Object.keys(superficies).filter(clave => clave.startsWith('16_'));
      console.log('🔍 Claves del distrito 16 en superficie:', clavesDistrito16Superficie);
      
      // Debug: verificar todos los distritos disponibles en superficie
      const distritosEnSuperficie = [...new Set(Object.keys(superficies).map(clave => clave.split('_')[0]))].sort();
      console.log('🔍 Distritos disponibles en superficie:', distritosEnSuperficie);
      
      setSuperficiePorBarrio(superficies);
      setBarriosMeta(meta);
      
      // Calcular densidad por clave compuesta
      const densidad = {};
      let barriosSinDatos = 0;
      Object.keys(superficies).forEach(clave => {
        const pob = poblacionPorClave[clave];
        const sup = superficies[clave];
        let densidadCalc = undefined;
        if (pob && sup) {
          densidadCalc = Math.round(pob / sup);
          densidad[clave] = densidadCalc;
        } else {
          barriosSinDatos++;
          // Debug: verificar barrios sin datos
          if (clave === '16_164') {
            console.log('❌ Barrio 16_164 sin datos de densidad:', { pob, sup, clave });
          }
        }
      });
      console.log('Densidad calculada:', Object.keys(densidad).length, 'barrios');
      console.log('Barrios sin datos de densidad:', barriosSinDatos);
      console.log('Primeras 10 claves de densidad:', Object.keys(densidad).slice(0, 10));
      
      setDensidadPorBarrio(densidad);
    }).catch(error => {
      console.error('Error cargando datos de población:', error);
    });
  }, []);

  // Cargar datos de inmigración
  useEffect(() => {
    Promise.all([
      fetch(INMIGRACION_CSV_URL).then(res => res.text()),
      fetch(PIRAMIDE_CSV_URL).then(res => res.text())
    ]).then(([inmigracionText, estadisticasText]) => {
      const inmigracion = getInmigracionPorBarrioMapeado(inmigracionText, estadisticasText);
      console.log('Datos de inmigración mapeados por barrio:', Object.keys(inmigracion).length, 'barrios');
      console.log('Primeros 10 barrios con inmigración:', Object.entries(inmigracion).slice(0, 10));
      
      // Verificar específicamente algunos barrios
      console.log('🔍 Verificando barrios específicos:');
      console.log('Valor para "ROSAS":', inmigracion['ROSAS']);
      console.log('Valor para "rosas":', inmigracion['rosas']);
      console.log('Valor para "20_005":', inmigracion['20_005']);
      console.log('Valor para "VALDEBERNARDO":', inmigracion['VALDEBERNARDO']);
      console.log('Valor para "19_002":', inmigracion['19_002']);
      
      setInmigracionPorBarrio(inmigracion);
    }).catch(error => {
      console.error('Error cargando datos de inmigración:', error);
    });
  }, []);



  // Get current year data
  const currentYearData = expandedUrbanIndicators.filter(d => d.year === selectedYear);

  // Calculate totals for current year
  const totalPopulation = currentYearData.reduce((sum, d) => sum + d.population, 0);
  const averagePrice = Math.round(currentYearData.reduce((sum, d) => sum + d.averagePriceM2, 0) / currentYearData.length);
  const totalMetroStations = currentYearData.reduce((sum, d) => sum + d.metroStations, 0);
  const averageIncome = Math.round(currentYearData.reduce((sum, d) => sum + d.averageIncome, 0) / currentYearData.length);

  const handleDistrictSelect = (districtId: string) => {
    console.log('District selected:', districtId);
    if (activeView === 'comparison' || activeView === 'analysis') {
      setSelectedDistricts(prev => {
        if (prev.includes(districtId)) {
          return prev.filter(id => id !== districtId);
        } else if (prev.length < 4) {
          return [...prev, districtId];
        }
        return prev;
      });
    } else {
      setSelectedDistricts([districtId]);
    }
  };

  const getTopDistrictsData = (metric: keyof ExpandedUrbanIndicators, count: number = 5) => {
    return currentYearData
      .sort((a, b) => (b[metric] as number) - (a[metric] as number))
      .slice(0, count)
      .map(d => ({
        name: d.districtName,
        value: d[metric] as number,
        color: expandedKpiCategories[selectedCategory as keyof typeof expandedKpiCategories]?.color || '#3B82F6'
      }));
  };

  // Función para normalizar nombres de barrio (sin tildes, minúsculas, sin espacios extra)
  const normalize = (str: string) =>
    str
      .trim()
      .toLocaleLowerCase('es-ES')
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/\s+/g, ' ')
      .trim();

  // Función para buscar clave de envejecimiento (igual que en el mapa)
  const getClaveBarrioEnvejecimiento = (nombre: string, detalles: Record<string, any>) => {
    const nombreNormalizado = nombre
      .toLocaleLowerCase('es-ES')
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    const mapeoManual: Record<string, string> = {
      'casco historico de vallecas': 'CASCO H.VALLECAS',
      'casco historico de vicalvaro': 'CASCO H.VICALVARO',
      'casco historico de barajas': 'CASCO H.BARAJAS',
      'penagrande': 'PEÑA GRANDE',
      'peñagrande': 'PEÑA GRANDE',
    };
    
    // 1. Normalizado
    if (detalles[nombreNormalizado]) {
      return nombreNormalizado;
    }
    
    // 2. Mayúsculas
    const nombreMayusculas = nombre.trim().toUpperCase();
    if (detalles[nombreMayusculas]) {
      return nombreMayusculas;
    }
    
    // 3. Mapeo manual
    const nombreMapeado = mapeoManual[nombreNormalizado];
    if (nombreMapeado && detalles[nombreMapeado]) {
      return nombreMapeado;
    }
    
    // 4. Búsqueda parcial
    const todasLasClaves = Object.keys(detalles);
    const claveEncontrada = todasLasClaves.find(clave =>
      clave.toLowerCase().includes(nombreNormalizado) ||
      nombreNormalizado.includes(clave.toLowerCase())
    );
    if (claveEncontrada) {
      return claveEncontrada;
    }
    
    return null;
  };

  // Función para buscar clave de inmigración (igual que en el mapa)
  const getClaveBarrioInmigracion = (nombre: string, inmigracion: Record<string, any>, codDistrito?: string | number, codBarrio?: string | number) => {
    // 1. Probar con clave compuesta (codDistrito_codBarrio)
    if (codDistrito !== undefined && codBarrio !== undefined) {
      const claveCompuesta = `${String(codDistrito).padStart(2, '0')}_${String(codBarrio).padStart(3, '0')}`;
      if (inmigracion[claveCompuesta] !== undefined) {
        return claveCompuesta;
      }
    }
    
    const nombreNormalizado = nombre
      .toLocaleLowerCase('es-ES')
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    const mapeoManual: Record<string, string> = {
      'casco historico de vallecas': 'CASCO H.VALLECAS',
      'casco historico de vicalvaro': 'CASCO H.VICALVARO',
      'casco historico de barajas': 'CASCO H.BARAJAS',
      'penagrande': 'PEÑA GRANDE',
      'peñagrande': 'PEÑA GRANDE',
    };
    
    // 1. Normalizado
    if (inmigracion[nombreNormalizado]) {
      return nombreNormalizado;
    }
    
    // 2. Mayúsculas
    const nombreMayusculas = nombre.trim().toUpperCase();
    if (inmigracion[nombreMayusculas]) {
      return nombreMayusculas;
    }
    
    // 3. Mapeo manual
    const nombreMapeado = mapeoManual[nombreNormalizado];
    if (nombreMapeado && inmigracion[nombreMapeado]) {
      return nombreMapeado;
    }
    
    // 4. Búsqueda parcial
    const todasLasClaves = Object.keys(inmigracion);
    const claveEncontrada = todasLasClaves.find(clave =>
      clave.toLowerCase().includes(nombreNormalizado) ||
      nombreNormalizado.includes(clave.toLowerCase())
    );
    if (claveEncontrada) {
      return claveEncontrada;
    }
    
    return null;
  };

  // Función para obtener top 5 barrios por población (usando datos reales del CSV)
  const getTopBarriosPoblacion = () => {
    console.log('🔍 Datos de población disponibles:', poblacionPorBarrio);
    
    if (!poblacionPorBarrio || Object.keys(poblacionPorBarrio).length === 0) {
      console.log('❌ No hay datos de población disponibles');
      return [];
    }
    
    // Usar los datos reales del CSV (misma fuente que el mapa)
    const barriosConPoblacion = Object.entries(poblacionPorBarrio)
      .map(([clave, poblacion]) => {
        // Extraer distrito y barrio de la clave (formato: "11_111")
        const [distrito, barrio] = clave.split('_');
        return {
          clave,
          poblacion,
          distrito: parseInt(distrito),
          barrio: parseInt(barrio)
        };
      })
      .filter(item => item.poblacion > 0 && !isNaN(item.distrito) && !isNaN(item.barrio))
      .sort((a, b) => b.poblacion - a.poblacion)
      .slice(0, 5);

    console.log('📊 Top 5 barrios por población:', barriosConPoblacion);

    // Mapeo completo de nombres de barrios de Madrid con nombres más descriptivos
    const nombresBarrios = {
      // Centro (01)
      '01_001': 'Palacio',
      '01_002': 'Embajadores',
      '01_003': 'Cortes',
      '01_004': 'Justicia',
      '01_005': 'Universidad',
      '01_006': 'Sol',
      
      // Arganzuela (02)
      '02_001': 'Paseo Imperial',
      '02_002': 'Acacias',
      '02_003': 'Chopera',
      '02_004': 'Legazpi',
      '02_005': 'Delicias',
      '02_006': 'Palos de Moguer',
      '02_007': 'Atocha',
      
      // Retiro (03)
      '03_001': 'Pacífico',
      '03_002': 'Adelfas',
      '03_003': 'Estrella',
      '03_004': 'Ibiza',
      '03_005': 'Jerónimos',
      '03_006': 'Niño Jesús',
      
      // Salamanca (04)
      '04_001': 'Recoletos',
      '04_002': 'Goya',
      '04_003': 'Fuente del Berro',
      '04_004': 'Guindalera',
      '04_005': 'Lista',
      '04_006': 'Castellana',
      
      // Chamartín (05)
      '05_001': 'El Viso',
      '05_002': 'Prosperidad',
      '05_003': 'Ciudad Jardín',
      '05_004': 'Hispanoamérica',
      '05_005': 'Nueva España',
      '05_006': 'Castilla',
      
      // Tetuán (06)
      '06_001': 'Bellas Vistas',
      '06_002': 'Cuatro Caminos',
      '06_003': 'Castillejos',
      '06_004': 'Almenara',
      '06_005': 'Valdeacederas',
      '06_006': 'Berruguete',
      
      // Chamberí (07)
      '07_001': 'Gaztambide',
      '07_002': 'Arapiles',
      '07_003': 'Trafalgar',
      '07_004': 'Almagro',
      '07_005': 'Ríos Rosas',
      '07_006': 'Vallehermoso',
      
      // Fuencarral-El Pardo (08)
      '08_081': 'El Pardo',
      '08_082': 'Fuentelarreina',
      '08_083': 'Peñagrande',
      '08_084': 'Pilar',
      '08_085': 'La Paz',
      '08_086': 'Valverde',
      '08_087': 'Mirasierra',
      '08_088': 'El Goloso',
      
      // Moncloa-Aravaca (09)
      '09_001': 'Casa de Campo',
      '09_002': 'Argüelles',
      '09_003': 'Ciudad Universitaria',
      '09_004': 'Valdezarza',
      '09_005': 'Valdemarín',
      '09_006': 'El Plantío',
      '09_007': 'Aravaca',
      
      // Latina (10)
      '10_101': 'Los Cármenes',
      '10_102': 'Puerta del Ángel',
      '10_103': 'Lucero',
      '10_104': 'Aluche',
      '10_105': 'Campamento',
      '10_106': 'Cuatro Vientos',
      '10_107': 'Las Águilas',
      
      // Carabanchel (11)
      '11_111': 'Comillas',
      '11_112': 'Opañel', 
      '11_113': 'San Isidro',
      '11_114': 'Vista Alegre',
      '11_115': 'Puerta Bonita',
      '11_116': 'Buenavista',
      '11_117': 'Abrantes',
      
      // Usera (12)
      '12_001': 'Orcasitas',
      '12_002': 'Orcasur',
      '12_003': 'San Fermín',
      '12_004': 'Almendrales',
      '12_005': 'Moscardó',
      '12_006': 'Zofío',
      '12_007': 'Pradolongo',
      
      // Puente de Vallecas (13)
      '13_131': 'Entrevías',
      '13_132': 'San Diego',
      '13_133': 'Palomeras Bajas',
      '13_134': 'Palomeras Sureste',
      '13_135': 'Portazgo',
      '13_136': 'Numancia',
      
      // Moratalaz (14)
      '14_001': 'Pavones',
      '14_002': 'Horcajo',
      '14_003': 'Marroquina',
      '14_004': 'Media Legua',
      '14_005': 'Fontarrón',
      '14_006': 'Vinateros',
      
      // Ciudad Lineal (15)
      '15_151': 'Ventas',
      '15_152': 'Pueblo Nuevo',
      '15_153': 'Quintana',
      '15_154': 'Concepción',
      '15_155': 'San Pascual',
      '15_156': 'San Juan Bautista',
      '15_157': 'Colina',
      '15_158': 'Atalaya',
      '15_159': 'Costillares',
      
      // Hortaleza (16)
      '16_161': 'Palomas',
      '16_162': 'Piovera',
      '16_163': 'Canillas',
      '16_164': 'Pinar del Rey',
      '16_165': 'Apóstol Santiago',
      '16_166': 'Valdefuentes',
      
      // Villaverde (17)
      '17_001': 'San Cristóbal',
      '17_002': 'Los Rosales',
      '17_003': 'Villaverde Alto',
      '17_004': 'San Andrés',
      '17_005': 'Los Ángeles',
      '17_006': 'El Espinillo',
      
      // Villa de Vallecas (18)
      '18_181': 'Casco Histórico de Vallecas',
      '18_182': 'Santa Eugenia',
      '18_183': 'El Ensanche de Vallecas',
      '18_184': 'Arroyo del Fresno',
      '18_185': 'Los Berrocales',
      
      // Vicálvaro (19)
      '19_001': 'Casco Histórico de Vicálvaro',
      '19_002': 'Ambroz',
      '19_003': 'Valderrivas',
      '19_004': 'El Cañaveral',
      
      // San Blas-Canillejas (20)
      '20_001': 'Simancas',
      '20_002': 'Hellín',
      '20_003': 'Amposta',
      '20_004': 'Arcos',
      '20_005': 'Rosas',
      '20_006': 'Rejas',
      '20_007': 'Canillejas',
      '20_008': 'El Salvador',
      
      // Barajas (21)
      '21_001': 'Alameda de Osuna',
      '21_002': 'Aeropuerto',
      '21_003': 'Casco Histórico de Barajas',
      '21_004': 'Timón',
      '21_005': 'Corralejos'
    };

    // Nombres de distritos para casos donde no se encuentre el barrio específico
    const nombresDistritos = {
      1: 'Centro', 2: 'Arganzuela', 3: 'Retiro', 4: 'Salamanca', 5: 'Chamartín',
      6: 'Tetuán', 7: 'Chamberí', 8: 'Fuencarral-El Pardo', 9: 'Moncloa-Aravaca', 10: 'Latina',
      11: 'Carabanchel', 12: 'Usera', 13: 'Puente de Vallecas', 14: 'Moratalaz', 15: 'Ciudad Lineal',
      16: 'Hortaleza', 17: 'Villaverde', 18: 'Villa de Vallecas', 19: 'Vicálvaro', 20: 'San Blas-Canillejas', 21: 'Barajas'
    };

    const result = barriosConPoblacion.map((item, index) => {
      const nombreBarrio = nombresBarrios[item.clave];
      const nombreDistrito = nombresDistritos[item.distrito];
      
      // Si no encontramos el nombre específico del barrio, usar el distrito + número de barrio
      const nombreFinal = nombreBarrio || `${nombreDistrito} - Barrio ${item.barrio}`;
      
      return {
        name: nombreFinal,
        value: item.poblacion,
        color: '#3B82F6'
      };
    });

    console.log('📈 Resultado final población:', result);
    return result;
  };

  // Función para obtener top 5 barrios por inmigración (usando datos reales del mapa)
  const getTopBarriosInmigracion = () => {
    const barriosConInmigracion = Object.entries(inmigracionPorBarrio || {})
      .filter(([clave, porcentaje]) => clave.includes('_') && porcentaje > 0 && porcentaje < 100) // Filtrar valores realistas
      .map(([clave, porcentaje]) => {
        const [distrito, barrio] = clave.split('_');
        return {
          clave,
          porcentaje,
          distrito: parseInt(distrito),
          barrio: parseInt(barrio)
        };
      })
      .filter(item => !isNaN(item.distrito) && !isNaN(item.barrio))
      .sort((a, b) => b.porcentaje - a.porcentaje)
      .slice(0, 5);

    console.log('🔍 Datos de inmigración para gráfico:', barriosConInmigracion);

    const nombresDistritos = {
      1: 'Centro', 2: 'Arganzuela', 3: 'Retiro', 4: 'Salamanca', 5: 'Chamartín',
      6: 'Tetuán', 7: 'Chamberí', 8: 'Fuencarral-El Pardo', 9: 'Moncloa-Aravaca', 10: 'Latina',
      11: 'Carabanchel', 12: 'Usera', 13: 'Puente de Vallecas', 14: 'Moratalaz', 15: 'Ciudad Lineal',
      16: 'Hortaleza', 17: 'Villaverde', 18: 'Villa de Vallecas', 19: 'Vicálvaro', 20: 'San Blas-Canillejas', 21: 'Barajas'
    };

    const result = barriosConInmigracion.map((item, index) => ({
      name: `${nombresDistritos[item.distrito] || `Distrito ${item.distrito}`} - Barrio ${item.barrio}`,
      value: Math.round(item.porcentaje * 10) / 10,
      color: '#EF4444'
    }));

    console.log('📊 Resultado final inmigración:', result);
    return result;
  };

  // Función para obtener top 5 barrios por envejecimiento (usando datos reales del mapa)
  const getTopBarriosEnvejecimiento = () => {
    const barriosConEnvejecimiento = Object.entries(envejecimientoPorBarrio || {})
      .filter(([nombre, porcentaje]) => porcentaje > 0 && porcentaje < 100 && nombre.length > 2) // Filtrar valores realistas
      .map(([nombre, porcentaje]) => ({
        nombre: nombre.trim(),
        porcentaje
      }))
      .sort((a, b) => b.porcentaje - a.porcentaje)
      .slice(0, 5);

    console.log('🔍 Datos de envejecimiento para gráfico:', barriosConEnvejecimiento);

    const result = barriosConEnvejecimiento.map((item, index) => ({
      name: item.nombre.charAt(0).toUpperCase() + item.nombre.slice(1).toLowerCase(),
      value: Math.round(item.porcentaje * 10) / 10,
      color: '#F59E0B'
    }));

    console.log('📊 Resultado final envejecimiento:', result);
    return result;
  };

  // Normalizamos las claves del objeto de envejecimiento solo una vez (hook en el cuerpo principal)
  const envejecimientoNorm: Record<string, number> = React.useMemo(() => {
    const obj: Record<string, number> = {};
    Object.entries(envejecimientoPorBarrio).forEach(([k, v]) => {
      const normalizedKey = normalize(k);
      obj[normalizedKey] = v;
      // También agregar la versión original limpia (sin espacios extra)
      obj[k.trim()] = v;
      // Y la versión en mayúsculas
      obj[k.trim().toUpperCase()] = v;
    });
    console.log('Envejecimiento normalizado creado con', Object.keys(obj).length, 'claves');
    console.log('Primeras 10 claves:', Object.keys(obj).slice(0, 10));
    return obj;
  }, [envejecimientoPorBarrio]);

  const colorByEnvejecimiento = (props: any) => {
    const nombreNormalizado = normalize(props.NOMBRE);
    const envejecimiento = envejecimientoNorm[nombreNormalizado];
    if (envejecimiento !== undefined) {
      if (envejecimiento < 10) return '#10b981';
      else if (envejecimiento < 15) return '#34d399';
      else if (envejecimiento < 20) return '#fbbf24';
      else if (envejecimiento < 25) return '#f59e0b';
      else if (envejecimiento < 30) return '#ef4444';
      else return '#dc2626';
    }
    return '#e5e7eb';
  };

  const colorByDensidad = (props: any) => {
    const claveCompuesta = `${String(props.CODDIS).padStart(2, '0')}_${String(props.COD_BAR).padStart(3, '0')}`;
    const densidad = densidadPorBarrio[claveCompuesta];
    
    // Debug: verificar algunas claves específicas
    if (props.CODDIS === '16' && props.COD_BAR === '164') {
      console.log('🎨 colorByDensidad - Barrio 16_164:', { 
        claveCompuesta, 
        densidad, 
        densidadPorBarrioKeys: Object.keys(densidadPorBarrio).slice(0, 10),
        props 
      });
    }
    
    if (densidad !== undefined) {
      if (densidad < 5000) return '#3b82f6';
      else if (densidad < 10000) return '#60a5fa';
      else if (densidad < 15000) return '#fbbf24';
      else if (densidad < 20000) return '#f59e0b';
      else if (densidad < 25000) return '#ef4444';
      else return '#dc2626';
    }
    return '#e5e7eb';
  };

  // Estado para alternar entre inmigración y envejecimiento
  const [mostrarInmigracion, setMostrarInmigracion] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Efecto para cambiar cada 6 segundos con transición suave
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setMostrarInmigracion(prev => !prev);
        setIsTransitioning(false);
      }, 300);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const renderOverview = () => (
    <div className="space-y-10">
      {/* Héroe */}
      <section className="rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-indigo-100 p-8 md:p-12">
        <div className="max-w-3xl relative">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
            Madrid Urban Insights
          </h1>
          <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-6">
            Plataforma de inteligencia urbana para explorar, comparar y entender Madrid con datos. 
            Descubre patrones demográficos, mercado inmobiliario, actividad económica y movilidad.
          </p>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => setActiveView('analysis')} className="inline-flex items-center gap-2 rounded-md bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700 transition">
              <TrendingUp className="w-4 h-4" /> Explorar análisis
            </button>
            <button type="button" onClick={() => setActiveView('comparison')} className="inline-flex items-center gap-2 rounded-md bg-white text-gray-900 border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50 transition">
              <Users className="w-4 h-4" /> Comparar distritos
            </button>
            <button type="button" onClick={() => setActiveView('ai')} className="inline-flex items-center gap-2 rounded-md bg-purple-600 text-white px-4 py-2 text-sm font-medium hover:bg-purple-700 transition">
              <Brain className="w-4 h-4" /> IA para insights
            </button>
      </div>

          {/* Indicador de scroll sutil */}
          <div className="hidden md:flex absolute -bottom-6 left-0 right-0 justify-start">
            <div className="inline-flex items-center gap-2 text-gray-600 text-sm animate-bounce">
              <ChevronDown className="w-4 h-4" />
              Desliza para descubrir más
      </div>
          </div>
        </div>
      </section>

      {/* Banda de métricas con contador */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard label="Población total" value={3527924} suffix=" hab." color="text-blue-700" />
        <MetricCard label="Precio medio m²" value={4103} suffix=" €/m²" color="text-emerald-700" />
        <MetricCard label="Estaciones de metro" value={303} color="text-orange-700" />
        <MetricCard label="Renta media" value={17648} suffix=" €" color="text-violet-700" />
      </section>

      {/* Objetivos del proyecto */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Fines del proyecto</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <li className="flex items-start gap-3">
            <span className="mt-1 inline-block h-2 w-2 rounded-full bg-blue-600" />
            Facilitar una visión integrada de datos urbanos clave de Madrid.
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 inline-block h-2 w-2 rounded-full bg-green-600" />
            Ayudar a la toma de decisiones públicas y privadas con visualizaciones claras.
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 inline-block h-2 w-2 rounded-full bg-orange-500" />
            Detectar patrones y desigualdades territoriales entre barrios y distritos.
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 inline-block h-2 w-2 rounded-full bg-purple-600" />
            Experimentar con técnicas de IA para descubrir correlaciones e insights.
          </li>
        </ul>
      </section>

      {/* Funcionalidades */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Qué puedes hacer aquí</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-blue-700 font-semibold">
              <MapPin className="w-4 h-4" /> Mapas interactivos
          </div>
            <p className="text-sm text-gray-700 mb-4">Explora barrios y distritos con capas de densidad, envejecimiento e inmigración.</p>
            <button type="button" onClick={() => setActiveView('analysis')} className="text-sm font-medium text-blue-700 hover:text-blue-800">Abrir mapas →</button>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-green-700 font-semibold">
              <Home className="w-4 h-4" /> Vivienda y precios
        </div>
            <p className="text-sm text-gray-700 mb-4">Consulta precios m², evolución histórica y distribución por distritos.</p>
            <button type="button" onClick={() => setActiveView('analysis')} className="text-sm font-medium text-green-700 hover:text-green-800">Ver vivienda →</button>
      </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-purple-700 font-semibold">
              <TrendingUp className="w-4 h-4" /> Economía y empleo
            </div>
            <p className="text-sm text-gray-700 mb-4">Indicadores macro, renta media y análisis de actividad comercial.</p>
            <button type="button" onClick={() => setActiveView('analysis')} className="text-sm font-medium text-purple-700 hover:text-purple-800">Ver economía →</button>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-emerald-700 font-semibold">
              <Users className="w-4 h-4" /> Demografía
            </div>
            <p className="text-sm text-gray-700 mb-4">Pirámide poblacional, envejecimiento, densidad y composición.</p>
            <button type="button" onClick={() => setActiveView('analysis')} className="text-sm font-medium text-emerald-700 hover:text-emerald-800">Ver demografía →</button>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-gray-800 font-semibold">
              <Users className="w-4 h-4" /> Comparador de distritos
            </div>
            <p className="text-sm text-gray-700 mb-4">Selecciona hasta 4 distritos y compara sus métricas en paralelo.</p>
            <button type="button" onClick={() => setActiveView('comparison')} className="text-sm font-medium text-gray-800 hover:text-black">Comparar →</button>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-fuchsia-700 font-semibold">
              <Brain className="w-4 h-4" /> IA para descubrimiento
            </div>
            <p className="text-sm text-gray-700 mb-4">Explora correlaciones y patrones avanzados asistidos por IA.</p>
            <button type="button" onClick={() => setActiveView('ai')} className="text-sm font-medium text-fuchsia-700 hover:text-fuchsia-800">Probar IA →</button>
          </div>
        </div>
      </section>

      {/* Cómo usar / notas */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Cómo usar esta plataforma</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
          <li>Revisa las noticias de la parte inferior para contexto actualizado.</li>
          <li>Usa los accesos directos para ir a Análisis, Comparación o IA.</li>
          <li>Desde Análisis, explora mapas y gráficos temáticos por secciones.</li>
        </ol>
      </section>

      {/* Aviso y fuentes de datos (landing) */}
      <section className="rounded-xl border border-amber-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Aviso y fuentes de datos</h3>
        <p className="text-gray-700 mb-4">
          Esta es una versión provisional. Existen muchos más datos oficiales de la Comunidad y del
          Ayuntamiento de Madrid. Aquí se han incorporado algunos datasets de ejemplo para mostrar la interfaz
          y cómo se visualizarían los indicadores. El objetivo es integrar el máximo de fuentes oficiales con
          actualización periódica.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
          <li>
            <span className="font-semibold">Demografía</span>: pirámide y métricas de barrios.
            Fuentes objetivo: Padrón Municipal y datasets del Portal de Datos Abiertos del Ayuntamiento
            (<a className="text-blue-700 hover:underline" href="https://datos.madrid.es/portal/site/egob/" target="_blank" rel="noreferrer">datos.madrid.es</a>).
          </li>
          <li>
            <span className="font-semibold">Vivienda</span>: evolución de precios oficiales (IPV) Comunidad de Madrid — INE
            (<a className="text-blue-700 hover:underline" href="https://www.ine.es/jaxiT3/Datos.htm?t=25171" target="_blank" rel="noreferrer">enlace</a>).
          </li>
          <li>
            <span className="font-semibold">Economía</span>: Contabilidad Regional (INE) y “Distritos en cifras” del Ayuntamiento
            (<a className="text-blue-700 hover:underline" href="https://www.ine.es/" target="_blank" rel="noreferrer">ine.es</a>,
            <a className="text-blue-700 hover:underline ml-1" href="https://datos.madrid.es/portal/site/egob/" target="_blank" rel="noreferrer">datos.madrid.es</a>).
          </li>
          <li>
            <span className="font-semibold">Transporte y movilidad</span>: CRTM (GTFS y cartografía) y EMT/BiciMAD (datos abiertos)
            <a className="text-blue-700 hover:underline ml-1" href="https://www.crtm.es/atencion-al-cliente/area-de-descargas/datos-abiertos.aspx" target="_blank" rel="noreferrer">CRTM</a>,
            <a className="text-blue-700 hover:underline ml-1" href="https://datos.emtmadrid.es/" target="_blank" rel="noreferrer">EMT</a>.
          </li>
        </ul>
        <div className="mt-4 border-t pt-4">
          <h4 className="text-base font-semibold text-gray-900 mb-2">Sobre la pestaña de IA</h4>
          <p className="text-sm text-gray-700">
            Actualmente la IA funciona en local con Ollama (modelo configurable mediante <code className="bg-gray-100 px-1 py-0.5 rounded">VITE_OLLAMA_MODEL</code>).
            Las respuestas se basan en el conocimiento preentrenado del modelo y en el contexto que le aporta la propia
            aplicación; no accede automáticamente a Internet ni a los datos del panel a menos que se le inyecten.
            Uno de los objetivos a futuro es alimentar la IA con nuestros propios datos (RAG local) para ofrecer
            respuestas trazables y alineadas con las visualizaciones.
          </p>
        </div>
      </section>

      {/* Noticias al final de la landing */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Actualidad</h2>
        <NoticiasRotativas />
      </section>
    </div>
  );

  // Contador simple para números (landing)
  const CountUp: React.FC<{ value: number; duration?: number; prefix?: string; suffix?: string; className?: string }> = ({ value, duration = 1200, prefix = '', suffix = '', className = '' }) => {
    const [displayValue, setDisplayValue] = useState(0);
    useEffect(() => {
      let rafId: number;
      const start = performance.now();
      const formatter = new Intl.NumberFormat('es-ES');
      const animate = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(1, elapsed / duration);
        const current = Math.round(value * progress);
        setDisplayValue(current);
        if (progress < 1) {
          rafId = requestAnimationFrame(animate);
        }
      };
      rafId = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(rafId);
    }, [value, duration]);
    return <span className={className}>{prefix}{new Intl.NumberFormat('es-ES').format(displayValue)}{suffix}</span>;
  };

  const MetricCard: React.FC<{ label: string; value: number; prefix?: string; suffix?: string; color?: string }> = ({ label, value, prefix, suffix, color = 'text-gray-900' }) => (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">{label}</div>
      <div className={`text-2xl font-extrabold ${color}`}>
        <CountUp value={value} prefix={prefix} suffix={suffix} />
      </div>
    </div>
  );

  const renderAnalysis = () => (
    <div className="space-y-8">
      {/* Cuadro descriptivo */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-center mb-3">
          <TrendingUp className="w-6 h-6 text-blue-600 mr-3" />
          <h2 className="text-xl font-bold text-blue-900">Análisis Detallado</h2>
        </div>
        <p className="text-blue-800 leading-relaxed">
          Explora los datos urbanos de Madrid organizados por categorías temáticas. 
          En esta sección encontrarás análisis profundos de demografía, vivienda, economía y transporte, 
          con visualizaciones interactivas y mapas detallados para cada área de estudio.
        </p>
      </div>

      {/* Sección de Demografía */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Users className="w-5 h-5 mr-2 text-blue-600" />
          Demografía
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pirámide Poblacional */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Pirámide Poblacional</h3>
            <PiramidePoblacional />
          </div>
          
          {/* Demografía de Población */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Análisis Demográfico</h3>
            <DemografiaPoblacion 
              poblacionPorBarrio={poblacionPorBarrio}
              densidadPorBarrio={densidadPorBarrio}
              envejecimientoPorBarrio={envejecimientoPorBarrio}
              barriosMeta={barriosMeta}
            />
          </div>
        </div>
        
        {/* Mapa de barrios con datos demográficos */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Mapa Demográfico Interactivo</h3>
          <MapaBarriosLeaflet
            colorBy={colorByDensidad}
            densidadPorBarrio={densidadPorBarrio}
            envejecimientoPorBarrio={envejecimientoNorm}
            detallesEnvejecimientoPorBarrio={detallesEnvejecimientoPorBarrio}
            inmigracionPorBarrio={inmigracionPorBarrio}
            poblacionPorBarrio={poblacionPorBarrio}
            superficiePorBarrio={superficiePorBarrio}
          />
        </div>
      </div>

      {/* Sección de Vivienda */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <Home className="w-5 h-5 mr-2 text-green-600" />
          Vivienda y Mercado Inmobiliario
        </h2>
        
        <div className="space-y-8">
          {/* Mapa de precios de vivienda por distrito */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Mapa de Precios por Metro Cuadrado</h3>
            <MapaPreciosDistritos selectedYear={selectedYear} />
          </div>
          
          {/* Estadísticas de precios por distrito */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Estadísticas del Mercado Inmobiliario</h3>
            <EstadisticasPreciosDistritos selectedYear={selectedYear} />
          </div>

          {/* Evolución histórica de precios */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Evolución Histórica de Precios</h3>
            <EvolucionPreciosMadrid selectedYear={selectedYear} />
          </div>

          {/* Análisis de Viviendas Turísticas */}
          <div className="mt-8">
            <ViviendasTuristicas />
          </div>
        </div>
      </div>

      {/* Sección de Economía */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
          Economía y Mercado Laboral
        </h2>
        
        <div className="space-y-8">
          {/* Datos Macroeconómicos */}
          <IndicadoresMacro />
          
          {/* Datos económicos principales */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Indicadores Económicos Principales</h3>
            <DatosEconomicosMadrid selectedYear={selectedYear} />
          </div>
          
          {/* Gráficos económicos avanzados */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Análisis Gráfico y Correlaciones</h3>
            <GraficosEconomicosMadrid selectedYear={selectedYear} />
          </div>

          {/* Nueva sección de Actividad Comercial */}
          <div className="mt-8">
             <h3 className="text-lg font-semibold text-gray-800 mb-4">Análisis de Actividad Comercial</h3>
             <div className="space-y-8">
               <MapaDeCalorActividad />
               <ActividadComercialDistrito />
               <LicenciasDistrito />
               <TerrazasDistrito />
             </div>
           </div>
        </div>
      </div>

      {/* Sección de Transporte */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-orange-600" />
          Transporte y Movilidad
        </h2>
        <div className="space-y-8">
          <MapaMovilidad />
          <EstadisticasBiciMAD />
        </div>
      </div>


    </div>
  );

  const renderComparison = () => {
    return (
      <ComparisonPanel
        data={currentYearData}
        year={selectedYear}
        selectedDistricts={selectedDistricts}
        onDistrictSelect={handleDistrictSelect}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        barriosMeta={barriosMeta}
        poblacionPorBarrio={poblacionPorBarrio}
        densidadPorBarrio={densidadPorBarrio}
        envejecimientoPorBarrio={envejecimientoPorBarrio}
        inmigracionPorBarrio={inmigracionPorBarrio}
      />
    );
  };



  // --- Estado e interfaz para la pestaña de IA (chat estilo LLM)
  type AIRole = 'user' | 'assistant';
  type AIMessage = { id: string; role: AIRole; content: string };
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        '¡Hola! Soy la IA de Madrid Urban Insights (beta). Puedo ayudarte a explorar datos de demografía, vivienda, economía y movilidad. Escríbeme una pregunta o elige una sugerencia para empezar.'
    }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [aiIsSending, setAiIsSending] = useState(false);

  const aiSuggestions: string[] = [
    'Resume las diferencias entre Salamanca y Tetuán',
    '¿Qué distritos tienen mayor porcentaje de inmigración?',
    'Explica la evolución del precio del m² en la última década',
    '¿Qué relación hay entre renta media y precio de vivienda?'
  ];

  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>(import.meta.env.VITE_OLLAMA_MODEL || 'llama3.1');
  const [ollamaOnline, setOllamaOnline] = useState<boolean>(false);

  useEffect(() => {
    // detectar conectividad y modelos
    (async () => {
      const online = await pingOllama();
      setOllamaOnline(online);
      if (online) {
        const models = await listOllamaModels();
        setAvailableModels(models);
        // si el modelo por defecto no está en lista, conservar el seleccionado
      }
    })();
  }, []);

  const handleSendAI = async () => {
    const trimmed = aiInput.trim();
    if (!trimmed) return;
    const userMsg: AIMessage = { id: `u-${Date.now()}`, role: 'user', content: trimmed };
    setAiMessages(prev => [...prev, userMsg]);
    setAiInput('');
    setAiIsSending(true);
    try {
      const history = aiMessages.map(m => ({ role: m.role, content: m.content }));
      const reply = await chatWithOllama([...history, { role: 'user', content: trimmed }], selectedModel);
      const assistantMsg: AIMessage = { id: `a-${Date.now()}`, role: 'assistant', content: reply || 'Respuesta vacía.' };
      setAiMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      const assistantMsg: AIMessage = { id: `e-${Date.now()}`, role: 'assistant', content: `No se pudo conectar con Ollama: ${err?.message || err}` };
      setAiMessages(prev => [...prev, assistantMsg]);
    } finally {
      setAiIsSending(false);
    }
  };

  const renderAI = () => {
    return (
      <div className="space-y-6">
        {/* Banner Beta */}
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-700 mt-0.5" />
          <div>
            <h2 className="text-sm font-semibold text-yellow-900">IA en fase beta</h2>
            <p className="text-sm text-yellow-900/90">La funcionalidad de chat está en desarrollo.</p>
          </div>
        </div>

        {/* Sugerencias rápidas */}
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-2 text-gray-900 font-semibold mb-3">
            <Sparkles className="w-4 h-4 text-purple-600" />
            Empieza con una sugerencia
          </div>
          <div className="flex flex-wrap gap-2">
            {aiSuggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setAiInput(s)}
                className="text-sm rounded-full border border-gray-200 px-3 py-1 bg-white hover:bg-gray-50"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Zona de chat */}
        <div className="rounded-xl border border-gray-200 bg-white p-0 overflow-hidden">
          {/* Cabecera con selector de modelo y estado */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-purple-700" />
              <span className="font-medium text-gray-900">Asistente IA</span>
              <span className="ml-2 inline-flex items-center rounded-full bg-yellow-100 text-yellow-800 px-2 py-0.5 text-xs">Beta</span>
              <span className={`ml-3 inline-flex items-center rounded-full px-2 py-0.5 text-xs ${ollamaOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {ollamaOnline ? 'Ollama: Online' : 'Ollama: Offline'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <label className="text-gray-600">Modelo</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="border border-gray-200 rounded-md bg-white px-2 py-1 text-gray-900"
              >
                {[selectedModel, ...availableModels.filter(m => m !== selectedModel)].map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Mensajes */}
          <div className="h-[420px] overflow-y-auto px-4 py-4 space-y-4">
            {aiMessages.map((m) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm border ${m.role === 'user' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-900 border-gray-200'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {aiIsSending && (
              <div className="flex justify-start">
                <div className="max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm border bg-white text-gray-900 border-gray-200">
                  Escribiendo…
                </div>
              </div>
          )}
        </div>

          {/* Input */}
          <div className="border-t border-gray-100 p-3">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <textarea
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  placeholder="Pregunta algo sobre Madrid…"
                  rows={1}
                  className="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>
              <button
                type="button"
                onClick={handleSendAI}
                disabled={!aiInput.trim() || aiIsSending}
                className="inline-flex items-center gap-2 rounded-md bg-purple-600 text-white px-3 py-2 text-sm font-medium hover:bg-purple-700 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                Enviar
              </button>
            </div>
            <div className="mt-2 text-[11px] text-gray-500 flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              Evita datos sensibles. Las respuestas pueden contener errores.
            </div>
          </div>
        </div>
      </div>
    );
  };

  console.log('Current activeView:', activeView);
  console.log('Current year data length:', currentYearData.length);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeView={activeView} onViewChange={setActiveView} />
      

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'overview' && renderOverview()}
        {activeView === 'analysis' && renderAnalysis()}
        {activeView === 'comparison' && renderComparison()}
        {activeView === 'ai' && renderAI()}
      </main>
    </div>
  );
};

export default App;
