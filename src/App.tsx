import React, { useState, useEffect } from 'react';
import { Users, Home, MapPin, TrendingUp, Brain } from 'lucide-react';
import Header from './components/Header';
import KPICard from './components/KPICard';
import DistrictCard from './components/DistrictCard';
import BarChart from './components/BarChart';
import InteractiveMap from './components/InteractiveMap';
import RadarChart from './components/RadarChart';
import ScatterPlot from './components/ScatterPlot';
import FilterPanel from './components/FilterPanel';
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
      geojson.features.forEach((feature) => {
        const cod_distrito = feature.properties.CODDIS || feature.properties.COD_DIS || feature.properties.COD_DIS_TX;
        const cod_barrio = feature.properties.COD_BAR || feature.properties.CODBAR || feature.properties.COD_BARRIO || feature.properties.cod_barrio;
        const clave = claveBarrio(cod_distrito, cod_barrio);
        const area = turf.area(feature) / 1e6; // m² a km²
        superficies[clave] = area;
        
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
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Población Total"
          value={totalPopulation}
          unit="habitantes"
          icon={<Users className="w-4 h-4" />}
          color="#3B82F6"
          trend={{ value: 2.1, isPositive: true }}
        />
        <KPICard
          title="Precio Medio m²"
          value={averagePrice}
          unit="€"
          icon={<Home className="w-4 h-4" />}
          color="#10B981"
          trend={{ value: 3.8, isPositive: true }}
        />
        <KPICard
          title="Estaciones Metro"
          value={totalMetroStations}
          unit="estaciones"
          icon={<MapPin className="w-4 h-4" />}
          color="#F59E0B"
        />
        <KPICard
          title="Renta Media"
          value={averageIncome}
          unit="€/año"
          icon={<TrendingUp className="w-4 h-4" />}
          color="#8B5CF6"
          trend={{ value: 1.5, isPositive: true }}
        />
      </div>

      {/* Mapa de barrios de Madrid */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 text-blue-700">Mapa interactivo de barrios de Madrid</h2>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de población - constante */}
        <BarChart
          data={getTopBarriosPoblacion()}
          title="Top 5 Barrios por Población"
        />
        
        {/* Gráfico variable - inmigración/envejecimiento */}
        <div className="relative">
          <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            <BarChart
              data={mostrarInmigracion ? getTopBarriosInmigracion() : getTopBarriosEnvejecimiento()}
              title={mostrarInmigracion ? "Top 5 Barrios por Inmigración" : "Top 5 Barrios por Envejecimiento"}
              isPercentage={true}
            />
          </div>
          <div className="absolute top-2 right-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
              mostrarInmigracion 
                ? 'bg-red-100 text-red-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {mostrarInmigracion ? '🌍 Inmigración' : '👴 Envejecimiento'}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <PiramidePoblacional />
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
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Mapa de Precios por Metro Cuadrado (Datos Reales por Distrito)</h3>
            <MapaPreciosDistritos selectedYear={selectedYear} />
          </div>
          
          {/* Estadísticas de precios por distrito */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Estadísticas del Mercado Inmobiliario (Datos Reales)</h3>
            <EstadisticasPreciosDistritos selectedYear={selectedYear} />
          </div>
        </div>
      </div>

      {/* Sección de Economía - Placeholder */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
          Economía
        </h2>
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <TrendingUp className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Análisis Económico</h3>
          <p className="text-gray-500">Próximamente: Análisis de renta, actividad económica y empleo</p>
        </div>
      </div>

      {/* Sección de Transporte - Placeholder */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-orange-600" />
          Transporte y Movilidad
        </h2>
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <MapPin className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Análisis de Transporte</h3>
          <p className="text-gray-500">Próximamente: Análisis de estaciones de metro, accesibilidad y movilidad</p>
        </div>
      </div>
    </div>
  );

  const renderComparison = () => {
    const selectedData = currentYearData.filter(d => selectedDistricts.includes(d.districtId));
    const selectedCategoryMetrics = selectedUseCase 
      ? useCases[selectedUseCase as keyof typeof useCases]?.metrics || []
      : expandedKpiCategories[selectedCategory as keyof typeof expandedKpiCategories]?.metrics || [];

    return (
      <div className="space-y-8">
        {/* Cuadro descriptivo */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
          <div className="flex items-center mb-3">
            <Users className="w-6 h-6 text-green-600 mr-3" />
            <h2 className="text-xl font-bold text-green-900">Comparación de Métricas</h2>
          </div>
          <p className="text-green-800 leading-relaxed">
            Compara hasta 4 distritos de Madrid simultáneamente. Selecciona los distritos que desees analizar 
            y visualiza sus métricas en gráficos de radar, diagramas de dispersión y tablas comparativas. 
            Ideal para identificar patrones y diferencias entre barrios.
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            Selecciona hasta 4 distritos para comparar. Actualmente seleccionados: {selectedDistricts.length}/4
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <InteractiveMap
            data={expandedUrbanIndicators}
            selectedMetric={selectedMetric}
            selectedDistricts={selectedDistricts}
            onDistrictSelect={handleDistrictSelect}
            selectedYear={selectedYear}
          />
          
          {selectedData.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Comparación: {selectedUseCase ? useCases[selectedUseCase as keyof typeof useCases]?.name : expandedKpiCategories[selectedCategory as keyof typeof expandedKpiCategories]?.name || 'Métricas'} ({selectedYear})
              </h3>
              <div className="space-y-4">
                {selectedData.map(district => (
                  <div key={district.districtId} className="border-b border-gray-100 pb-2">
                    <h4 className="font-medium">{district.districtName}</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      {selectedCategoryMetrics.slice(0, 4).map(metric => (
                        <div key={metric}>
                          {expandedMetricLabels[metric]?.label}: {district[metric as keyof ExpandedUrbanIndicators] as number}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {selectedData.length >= 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RadarChart
              districts={selectedData}
              metrics={selectedCategoryMetrics.slice(0, 6)}
              title="Comparación Multidimensional"
            />
            
            {selectedCategoryMetrics.length >= 2 && (
              <ScatterPlot
                data={selectedData}
                xMetric={selectedCategoryMetrics[0]}
                yMetric={selectedCategoryMetrics[1]}
                title="Análisis de Correlación"
                selectedDistricts={selectedDistricts}
              />
            )}
          </div>
        )}

        {selectedData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedData.map(district => (
              <DistrictCard
                key={district.districtId}
                district={district}
                onSelect={handleDistrictSelect}
                isSelected={true}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderAI = () => {
    const selectedData = currentYearData.filter(d => selectedDistricts.includes(d.districtId));
    
    return (
      <div className="space-y-8">
        {/* Cuadro descriptivo */}
        <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center mb-3">
            <Brain className="w-6 h-6 text-purple-600 mr-3" />
            <h2 className="text-xl font-bold text-purple-900">Análisis Inteligente con IA</h2>
          </div>
          <p className="text-purple-800 leading-relaxed">
            Descubre patrones ocultos y correlaciones entre diferentes métricas urbanas usando inteligencia artificial. 
            Esta herramienta analiza automáticamente los datos para generar insights predictivos, 
            identificar tendencias emergentes y proporcionar recomendaciones basadas en datos.
          </p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-purple-900 mb-2">Análisis Inteligente con IA</h3>
          <p className="text-sm text-purple-800">
            Selecciona distritos y métricas para generar insights automáticos y patrones de correlación usando inteligencia artificial.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <InteractiveMap
            data={expandedUrbanIndicators}
            selectedMetric={selectedMetric}
            selectedDistricts={selectedDistricts}
            onDistrictSelect={handleDistrictSelect}
            selectedYear={selectedYear}
          />
          
          {currentYearData.length >= 2 && (
            <ScatterPlot
              data={currentYearData}
              xMetric="averageIncome"
              yMetric="averagePriceM2"
              title="Renta vs Precio Vivienda"
              selectedDistricts={selectedDistricts}
            />
          )}
        </div>

        {selectedData.length >= 3 && (
          <RadarChart
            districts={selectedData.slice(0, 4)}
            metrics={['population', 'averageIncome', 'accessibilityScore', 'greenSpaceM2PerCapita', 'economicActivityIndex']}
            title="Perfil Integral de Distritos Seleccionados"
          />
        )}
      </div>
    );
  };

  console.log('Current activeView:', activeView);
  console.log('Current year data length:', currentYearData.length);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeView={activeView} onViewChange={setActiveView} />
      {activeView === 'overview' && <NoticiasRotativas />}
      <FilterPanel
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedMetric={selectedMetric}
        onMetricChange={setSelectedMetric}
        selectedUseCase={selectedUseCase}
        onUseCaseChange={setSelectedUseCase}
        isOpen={filterPanelOpen}
        onToggle={() => setFilterPanelOpen(!filterPanelOpen)}
      />

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
