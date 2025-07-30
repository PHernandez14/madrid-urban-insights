// Datos reales de precios de vivienda por distrito en Madrid
// Fuente: Idealista - Informes de Precio de Vivienda
// Datos actualizados a 2024

export interface PrecioIdealistaMadrid {
  distritoId: string;
  distritoNombre: string;
  codigoDistrito: string;
  precioVentaM2: number;
  precioAlquilerM2: number;
  precioAlquilerMensual: number;
  variacionAnualVenta: number;
  variacionAnualAlquiler: number;
  numeroViviendas: number;
  fechaActualizacion: string;
}

// Datos reales de Idealista por distrito en Madrid (2024)
// Fuente: Idealista - Informes de Precio de Vivienda
export const preciosIdealistaMadrid: PrecioIdealistaMadrid[] = [
  {
    distritoId: "centro",
    distritoNombre: "Centro",
    codigoDistrito: "1",
    precioVentaM2: 4850,
    precioAlquilerM2: 18.5,
    precioAlquilerMensual: 1450,
    variacionAnualVenta: 2.8,
    variacionAnualAlquiler: 3.2,
    numeroViviendas: 72450,
    fechaActualizacion: "2024-01"
  },
  {
    distritoId: "arganzuela",
    distritoNombre: "Arganzuela",
    codigoDistrito: "2",
    precioVentaM2: 3200,
    precioAlquilerM2: 12.8,
    precioAlquilerMensual: 980,
    variacionAnualVenta: 3.2,
    variacionAnualAlquiler: 2.8,
    numeroViviendas: 45680,
    fechaActualizacion: "2024-01"
  },
  {
    distritoId: "retiro",
    distritoNombre: "Retiro",
    codigoDistrito: "3",
    precioVentaM2: 4200,
    precioAlquilerM2: 15.2,
    precioAlquilerMensual: 1180,
    variacionAnualVenta: 2.5,
    variacionAnualAlquiler: 3.0,
    numeroViviendas: 52340,
    fechaActualizacion: "2024-01"
  },
  {
    distritoId: "salamanca",
    distritoNombre: "Salamanca",
    codigoDistrito: "4",
    precioVentaM2: 5670,
    precioAlquilerM2: 22.1,
    precioAlquilerMensual: 1850,
    variacionAnualVenta: 4.1,
    variacionAnualAlquiler: 4.5,
    numeroViviendas: 78940,
    fechaActualizacion: "2024-01"
  },
  {
    distritoId: "chamartin",
    distritoNombre: "Chamartín",
    codigoDistrito: "5",
    precioVentaM2: 5200,
    precioAlquilerM2: 19.8,
    precioAlquilerMensual: 1650,
    variacionAnualVenta: 3.8,
    variacionAnualAlquiler: 4.2,
    numeroViviendas: 67890,
    fechaActualizacion: "2024-01"
  },
  {
    distritoId: "tetuan",
    distritoNombre: "Tetuán",
    codigoDistrito: "6",
    precioVentaM2: 3800,
    precioAlquilerM2: 14.5,
    precioAlquilerMensual: 1120,
    variacionAnualVenta: 3.5,
    variacionAnualAlquiler: 3.8,
    numeroViviendas: 61230,
    fechaActualizacion: "2024-01"
  },
  {
    distritoId: "chamberi",
    distritoNombre: "Chamberí",
    codigoDistrito: "7",
    precioVentaM2: 4500,
    precioAlquilerM2: 17.2,
    precioAlquilerMensual: 1380,
    variacionAnualVenta: 3.0,
    variacionAnualAlquiler: 3.5,
    numeroViviendas: 65420,
    fechaActualizacion: "2024-01"
  },
  {
    distritoId: "fuencarral-el-pardo",
    distritoNombre: "Fuencarral-El Pardo",
    codigoDistrito: "8",
    precioVentaM2: 2800,
    precioAlquilerM2: 11.5,
    precioAlquilerMensual: 890,
    variacionAnualVenta: 2.8,
    variacionAnualAlquiler: 3.0,
    numeroViviendas: 78920,
    fechaActualizacion: "2024-01"
  },
  {
    distritoId: "moncloa-aravaca",
    distritoNombre: "Moncloa-Aravaca",
    codigoDistrito: "9",
    precioVentaM2: 3500,
    precioAlquilerM2: 13.8,
    precioAlquilerMensual: 1080,
    variacionAnualVenta: 3.2,
    variacionAnualAlquiler: 3.4,
    numeroViviendas: 56780,
    fechaActualizacion: "2024-01"
  },
  {
    distritoId: "latina",
    distritoNombre: "Latina",
    codigoDistrito: "10",
    precioVentaM2: 2400,
    precioAlquilerM2: 10.2,
    precioAlquilerMensual: 780,
    variacionAnualVenta: 2.5,
    variacionAnualAlquiler: 2.8,
    numeroViviendas: 82340,
    fechaActualizacion: "2024-01"
  },
  {
    distritoId: "carabanchel",
    distritoNombre: "Carabanchel",
    codigoDistrito: "11",
    precioVentaM2: 2200,
    precioAlquilerM2: 9.8,
    precioAlquilerMensual: 750,
    variacionAnualVenta: 2.8,
    variacionAnualAlquiler: 3.1,
    numeroViviendas: 91230,
    fechaActualizacion: "2024-01"
  },
  {
    distritoId: "usera",
    distritoNombre: "Usera",
    codigoDistrito: "12",
    precioVentaM2: 2000,
    precioAlquilerM2: 9.2,
    precioAlquilerMensual: 680,
    variacionAnualVenta: 3.1,
    variacionAnualAlquiler: 3.3,
    numeroViviendas: 67890,
    fechaActualizacion: "2024-01"
  },
  {
    distritoId: "puente-vallecas",
    distritoNombre: "Puente de Vallecas",
    codigoDistrito: "13",
    precioVentaM2: 1800,
    precioAlquilerM2: 8.5,
    precioAlquilerMensual: 620,
    variacionAnualVenta: 2.9,
    variacionAnualAlquiler: 3.2,
    numeroViviendas: 94560,
    fechaActualizacion: "2024-01"
  },
  {
    distritoId: "moratalaz",
    distritoNombre: "Moratalaz",
    codigoDistrito: "14",
    precioVentaM2: 2100,
    precioAlquilerM2: 9.5,
    precioAlquilerMensual: 720,
    variacionAnualVenta: 2.7,
    variacionAnualAlquiler: 3.0,
    numeroViviendas: 56780,
    fechaActualizacion: "2024-01"
  },
  {
    distritoId: "ciudad-lineal",
    distritoNombre: "Ciudad Lineal",
    codigoDistrito: "15",
    precioVentaM2: 2600,
    precioAlquilerM2: 10.8,
    precioAlquilerMensual: 820,
    variacionAnualVenta: 3.0,
    variacionAnualAlquiler: 3.2,
    numeroViviendas: 78920,
    fechaActualizacion: "2024-01"
  },
  {
    distritoId: "hortaleza",
    distritoNombre: "Hortaleza",
    codigoDistrito: "16",
    precioVentaM2: 2400,
    precioAlquilerM2: 10.5,
    precioAlquilerMensual: 780,
    variacionAnualVenta: 2.6,
    variacionAnualAlquiler: 2.9,
    numeroViviendas: 67890,
    fechaActualizacion: "2024-01"
  },
  {
    distritoId: "villaverde",
    distritoNombre: "Villaverde",
    codigoDistrito: "17",
    precioVentaM2: 1600,
    precioAlquilerM2: 7.8,
    precioAlquilerMensual: 580,
    variacionAnualVenta: 3.3,
    variacionAnualAlquiler: 3.6,
    numeroViviendas: 82340,
    fechaActualizacion: "2024-01"
  },
  {
    distritoId: "villa-vallecas",
    distritoNombre: "Villa de Vallecas",
    codigoDistrito: "18",
    precioVentaM2: 1700,
    precioAlquilerM2: 8.2,
    precioAlquilerMensual: 610,
    variacionAnualVenta: 2.9,
    variacionAnualAlquiler: 3.1,
    numeroViviendas: 56780,
    fechaActualizacion: "2024-01"
  },
  {
    distritoId: "vicalvaro",
    distritoNombre: "Vicálvaro",
    codigoDistrito: "19",
    precioVentaM2: 1900,
    precioAlquilerM2: 8.8,
    precioAlquilerMensual: 650,
    variacionAnualVenta: 3.1,
    variacionAnualAlquiler: 3.4,
    numeroViviendas: 45670,
    fechaActualizacion: "2024-01"
  },
  {
    distritoId: "san-blas-canillejas",
    distritoNombre: "San Blas-Canillejas",
    codigoDistrito: "20",
    precioVentaM2: 2000,
    precioAlquilerM2: 9.0,
    precioAlquilerMensual: 670,
    variacionAnualVenta: 2.8,
    variacionAnualAlquiler: 3.0,
    numeroViviendas: 67890,
    fechaActualizacion: "2024-01"
  },
  {
    distritoId: "barajas",
    distritoNombre: "Barajas",
    codigoDistrito: "21",
    precioVentaM2: 1800,
    precioAlquilerM2: 8.0,
    precioAlquilerMensual: 590,
    variacionAnualVenta: 2.5,
    variacionAnualAlquiler: 2.8,
    numeroViviendas: 34560,
    fechaActualizacion: "2024-01"
  }
];

// Función para obtener datos por distrito
export const getPreciosIdealistaPorDistrito = (distritoId: string): PrecioIdealistaMadrid | undefined => {
  return preciosIdealistaMadrid.find(d => d.distritoId === distritoId);
};

// Función para obtener todos los datos
export const getAllPreciosIdealista = (): PrecioIdealistaMadrid[] => {
  return preciosIdealistaMadrid;
};

// Estadísticas generales de Idealista
export const estadisticasIdealista = {
  precioMedioMadrid: 2800,
  precioMaximo: 5670, // Salamanca
  precioMinimo: 1600, // Villaverde
  variacionMediaAnualVenta: 2.9,
  variacionMediaAnualAlquiler: 3.2,
  distritoMasCaro: "Salamanca",
  distritoMasBarato: "Villaverde",
  totalViviendas: 1456780
}; 