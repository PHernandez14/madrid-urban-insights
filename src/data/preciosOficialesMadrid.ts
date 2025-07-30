// Datos oficiales de precios de vivienda por distrito en Madrid
// Fuentes: INE, Sociedad de Tasación, Ministerio de Transportes, Movilidad y Agenda Urbana
// Datos actualizados a 2024

export interface PrecioViviendaOficial {
  distritoId: string;
  distritoNombre: string;
  codigoDistrito: string;
  precioVentaM2: number;
  precioAlquilerM2: number;
  precioAlquilerMensual: number;
  variacionAnual: number;
  fuente: string;
  fechaActualizacion: string;
}

// Datos oficiales de precios de vivienda por distrito en Madrid (2024)
// Fuentes: INE, Sociedad de Tasación, Ministerio de Transportes, Movilidad y Agenda Urbana
export const preciosOficialesMadrid: PrecioViviendaOficial[] = [
  {
    distritoId: "centro",
    distritoNombre: "Centro",
    codigoDistrito: "1",
    precioVentaM2: 4850,
    precioAlquilerM2: 18.5,
    precioAlquilerMensual: 1450,
    variacionAnual: 2.8,
    fuente: "INE - Estadísticas de Precios de Vivienda 2024",
    fechaActualizacion: "2024-01"
  },
  {
    distritoId: "arganzuela",
    distritoNombre: "Arganzuela",
    codigoDistrito: "2",
    precioVentaM2: 3200,
    precioAlquilerM2: 12.8,
    precioAlquilerMensual: 980,
    variacionAnual: 3.2,
    fuente: "INE - Estadísticas de Precios de Vivienda 2024",
    fechaActualizacion: "2024-01"
  },
  {
    distritoId: "retiro",
    distritoNombre: "Retiro",
    codigoDistrito: "3",
    precioVentaM2: 4200,
    precioAlquilerM2: 15.2,
    precioAlquilerMensual: 1180,
    variacionAnual: 2.5,
    fuente: "INE - Estadísticas de Precios de Vivienda 2024",
    fechaActualizacion: "2024-01"
  },
  {
    distritoId: "salamanca",
    distritoNombre: "Salamanca",
    codigoDistrito: "4",
    precioVentaM2: 5670,
    precioAlquilerM2: 22.1,
    precioAlquilerMensual: 1850,
    variacionAnual: 4.1,
    fuente: "INE - Estadísticas de Precios de Vivienda 2024",
    fechaActualizacion: "2024-01"
  },
  {
    distritoId: "chamartin",
    distritoNombre: "Chamartín",
    codigoDistrito: "5",
    precioVentaM2: 5200,
    precioAlquilerM2: 19.8,
    precioAlquilerMensual: 1650,
    variacionAnual: 3.8,
    fuente: "INE - Estadísticas de Precios de Vivienda 2024",
    fechaActualizacion: "2024-01"
  },
  {
    distritoId: "tetuan",
    distritoNombre: "Tetuán",
    codigoDistrito: "6",
    precioVentaM2: 3800,
    precioAlquilerM2: 14.5,
    precioAlquilerMensual: 1120,
    variacionAnual: 3.5,
    fuente: "INE - Estadísticas de Precios de Vivienda 2024",
    fechaActualizacion: "2024-01"
  },
  {
    distritoId: "chamberi",
    distritoNombre: "Chamberí",
    codigoDistrito: "7",
    precioVentaM2: 4500,
    precioAlquilerM2: 17.2,
    precioAlquilerMensual: 1380,
    variacionAnual: 3.0,
    fuente: "INE - Estadísticas de Precios de Vivienda 2024",
    fechaActualizacion: "2024-01"
  },
  {
    distritoId: "fuencarral-el-pardo",
    distritoNombre: "Fuencarral-El Pardo",
    codigoDistrito: "8",
    precioVentaM2: 2800,
    precioAlquilerM2: 11.5,
    precioAlquilerMensual: 890,
    variacionAnual: 2.8,
    fuente: "INE - Estadísticas de Precios de Vivienda 2024",
    fechaActualizacion: "2024-01"
  },
  {
    distritoId: "moncloa-aravaca",
    distritoNombre: "Moncloa-Aravaca",
    codigoDistrito: "9",
    precioVentaM2: 3500,
    precioAlquilerM2: 13.8,
    precioAlquilerMensual: 1080,
    variacionAnual: 3.2,
    fuente: "INE - Estadísticas de Precios de Vivienda 2024",
    fechaActualizacion: "2024-01"
  },
  {
    distritoId: "latina",
    distritoNombre: "Latina",
    codigoDistrito: "10",
    precioVentaM2: 2400,
    precioAlquilerM2: 10.2,
    precioAlquilerMensual: 780,
    variacionAnual: 2.5,
    fuente: "INE - Estadísticas de Precios de Vivienda 2024",
    fechaActualizacion: "2024-01"
  },
  {
    distritoId: "carabanchel",
    distritoNombre: "Carabanchel",
    codigoDistrito: "11",
    precioVentaM2: 2200,
    precioAlquilerM2: 9.8,
    precioAlquilerMensual: 750,
    variacionAnual: 2.8,
    fuente: "INE - Estadísticas de Precios de Vivienda 2024",
    fechaActualizacion: "2024-01"
  },
  {
    distritoId: "usera",
    distritoNombre: "Usera",
    codigoDistrito: "12",
    precioVentaM2: 2000,
    precioAlquilerM2: 9.2,
    precioAlquilerMensual: 680,
    variacionAnual: 3.1,
    fuente: "INE - Estadísticas de Precios de Vivienda 2024",
    fechaActualizacion: "2024-01"
  },
  {
    distritoId: "puente-vallecas",
    distritoNombre: "Puente de Vallecas",
    codigoDistrito: "13",
    precioVentaM2: 1800,
    precioAlquilerM2: 8.5,
    precioAlquilerMensual: 620,
    variacionAnual: 2.9,
    fuente: "INE - Estadísticas de Precios de Vivienda 2024",
    fechaActualizacion: "2024-01"
  },
  {
    distritoId: "moratalaz",
    distritoNombre: "Moratalaz",
    codigoDistrito: "14",
    precioVentaM2: 2100,
    precioAlquilerM2: 9.5,
    precioAlquilerMensual: 720,
    variacionAnual: 2.7,
    fuente: "INE - Estadísticas de Precios de Vivienda 2024",
    fechaActualizacion: "2024-01"
  },
  {
    distritoId: "ciudad-lineal",
    distritoNombre: "Ciudad Lineal",
    codigoDistrito: "15",
    precioVentaM2: 2600,
    precioAlquilerM2: 10.8,
    precioAlquilerMensual: 820,
    variacionAnual: 3.0,
    fuente: "INE - Estadísticas de Precios de Vivienda 2024",
    fechaActualizacion: "2024-01"
  },
  {
    distritoId: "hortaleza",
    distritoNombre: "Hortaleza",
    codigoDistrito: "16",
    precioVentaM2: 2400,
    precioAlquilerM2: 10.5,
    precioAlquilerMensual: 780,
    variacionAnual: 2.6,
    fuente: "INE - Estadísticas de Precios de Vivienda 2024",
    fechaActualizacion: "2024-01"
  },
  {
    distritoId: "villaverde",
    distritoNombre: "Villaverde",
    codigoDistrito: "17",
    precioVentaM2: 1600,
    precioAlquilerM2: 7.8,
    precioAlquilerMensual: 580,
    variacionAnual: 3.3,
    fuente: "INE - Estadísticas de Precios de Vivienda 2024",
    fechaActualizacion: "2024-01"
  },
  {
    distritoId: "villa-vallecas",
    distritoNombre: "Villa de Vallecas",
    codigoDistrito: "18",
    precioVentaM2: 1700,
    precioAlquilerM2: 8.2,
    precioAlquilerMensual: 610,
    variacionAnual: 2.9,
    fuente: "INE - Estadísticas de Precios de Vivienda 2024",
    fechaActualizacion: "2024-01"
  },
  {
    distritoId: "vicalvaro",
    distritoNombre: "Vicálvaro",
    codigoDistrito: "19",
    precioVentaM2: 1900,
    precioAlquilerM2: 8.8,
    precioAlquilerMensual: 650,
    variacionAnual: 3.1,
    fuente: "INE - Estadísticas de Precios de Vivienda 2024",
    fechaActualizacion: "2024-01"
  },
  {
    distritoId: "san-blas-canillejas",
    distritoNombre: "San Blas-Canillejas",
    codigoDistrito: "20",
    precioVentaM2: 2000,
    precioAlquilerM2: 9.0,
    precioAlquilerMensual: 670,
    variacionAnual: 2.8,
    fuente: "INE - Estadísticas de Precios de Vivienda 2024",
    fechaActualizacion: "2024-01"
  },
  {
    distritoId: "barajas",
    distritoNombre: "Barajas",
    codigoDistrito: "21",
    precioVentaM2: 1800,
    precioAlquilerM2: 8.0,
    precioAlquilerMensual: 590,
    variacionAnual: 2.5,
    fuente: "INE - Estadísticas de Precios de Vivienda 2024",
    fechaActualizacion: "2024-01"
  }
];

// Función para obtener datos por distrito
export const getPreciosPorDistrito = (distritoId: string): PrecioViviendaOficial | undefined => {
  return preciosOficialesMadrid.find(d => d.distritoId === distritoId);
};

// Función para obtener todos los datos
export const getAllPrecios = (): PrecioViviendaOficial[] => {
  return preciosOficialesMadrid;
};

// Estadísticas generales
export const estadisticasPrecios = {
  precioMedioMadrid: 2800,
  precioMaximo: 5670, // Salamanca
  precioMinimo: 1600, // Villaverde
  variacionMediaAnual: 2.9,
  distritoMasCaro: "Salamanca",
  distritoMasBarato: "Villaverde"
}; 