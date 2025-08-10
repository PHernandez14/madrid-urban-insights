export type EquipamientoCategoria =
  | 'hospital'
  | 'centro_salud'
  | 'biblioteca'
  | 'deporte'
  | 'punto_limpio'
  | 'escuela'
  | 'centro_cultural';

export type Equipamiento = {
  id: string;
  nombre: string;
  categoria: EquipamientoCategoria;
  distrito: string;
  barrio?: string;
  lat: number;
  lon: number;
};

export const categoriaLabels: Record<EquipamientoCategoria, string> = {
  hospital: 'Hospitales',
  centro_salud: 'Centros de salud',
  biblioteca: 'Bibliotecas',
  deporte: 'Instalaciones deportivas',
  punto_limpio: 'Puntos limpios',
  escuela: 'Centros educativos',
  centro_cultural: 'Centros culturales',
};

export const categoriaColors: Record<EquipamientoCategoria, string> = {
  hospital: '#ef4444',
  centro_salud: '#f97316',
  biblioteca: '#3b82f6',
  deporte: '#10b981',
  punto_limpio: '#84cc16',
  escuela: '#8b5cf6',
  centro_cultural: '#f59e0b',
};

// Datos de ejemplo (sustituir por ingesta oficial cuando esté listo)
export const equipamientosDemo: Equipamiento[] = [
  {
    id: 'h-lapaz',
    nombre: 'Hospital Universitario La Paz',
    categoria: 'hospital',
    distrito: 'Fuencarral-El Pardo',
    lat: 40.4776,
    lon: -3.6879,
  },
  {
    id: 'h-gregorio',
    nombre: 'Hospital General Universitario Gregorio Marañón',
    categoria: 'hospital',
    distrito: 'Retiro',
    lat: 40.4217,
    lon: -3.6722,
  },
  {
    id: 'cs-centro',
    nombre: 'Centro de Salud Justicia',
    categoria: 'centro_salud',
    distrito: 'Centro',
    lat: 40.4229,
    lon: -3.6993,
  },
  {
    id: 'b-ivanvargas',
    nombre: 'Biblioteca Pública Iván de Vargas',
    categoria: 'biblioteca',
    distrito: 'Centro',
    lat: 40.4139,
    lon: -3.7116,
  },
  {
    id: 'd-vicente-bosque',
    nombre: 'CDM Vicente del Bosque',
    categoria: 'deporte',
    distrito: 'Fuencarral-El Pardo',
    lat: 40.4789,
    lon: -3.6973,
  },
  {
    id: 'pl-mendez-alvaro',
    nombre: 'Punto limpio Méndez Álvaro',
    categoria: 'punto_limpio',
    distrito: 'Arganzuela',
    lat: 40.3958,
    lon: -3.6797,
  },
  {
    id: 'ee-conde-orgaz',
    nombre: 'CEIP Conde de Orgaz',
    categoria: 'escuela',
    distrito: 'Hortaleza',
    lat: 40.4555,
    lon: -3.6398,
  },
  {
    id: 'cc-conde-duque',
    nombre: 'Centro Cultural Conde Duque',
    categoria: 'centro_cultural',
    distrito: 'Centro',
    lat: 40.4277,
    lon: -3.7096,
  },
];


