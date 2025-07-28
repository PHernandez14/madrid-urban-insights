export interface BarrioInfo {
  nombre: string;
  distrito: string;
  descripcion: string;
  datosClave: {
    poblacion: number;
    densidad: number;
    edadMedia: number;
    inmigracion: number;
  };
}

export const barriosMadrid: Record<string, BarrioInfo> = {
  // Centro (01)
  'palacio': {
    nombre: 'Palacio',
    distrito: 'Distrito 1 - Centro',
    descripcion: 'Barrio histórico del centro de Madrid, sede de instituciones gubernamentales y culturales.',
    datosClave: { poblacion: 12500, densidad: 18500, edadMedia: 38, inmigracion: 15.2 }
  },
  'embajadores': {
    nombre: 'Embajadores',
    distrito: 'Distrito 1 - Centro',
    descripcion: 'Barrio multicultural y dinámico, conocido por su diversidad y vida nocturna.',
    datosClave: { poblacion: 15800, densidad: 22100, edadMedia: 34, inmigracion: 28.5 }
  },
  'cortes': {
    nombre: 'Cortes',
    distrito: 'Distrito 1 - Centro',
    descripcion: 'Zona parlamentaria y comercial, corazón político de Madrid.',
    datosClave: { poblacion: 8900, densidad: 16500, edadMedia: 41, inmigracion: 12.8 }
  },
  'justicia': {
    nombre: 'Justicia',
    distrito: 'Distrito 1 - Centro',
    descripcion: 'Barrio elegante con arquitectura señorial y ambiente residencial.',
    datosClave: { poblacion: 11200, densidad: 18900, edadMedia: 39, inmigracion: 18.3 }
  },
  'universidad': {
    nombre: 'Universidad',
    distrito: 'Distrito 1 - Centro',
    descripcion: 'Zona universitaria y cultural, centro de conocimiento y arte.',
    datosClave: { poblacion: 13400, densidad: 20100, edadMedia: 32, inmigracion: 22.1 }
  },
  'sol': {
    nombre: 'Sol',
    distrito: 'Distrito 1 - Centro',
    descripcion: 'Centro neurálgico de Madrid, punto de encuentro y comercio.',
    datosClave: { poblacion: 15600, densidad: 24500, edadMedia: 35, inmigracion: 25.7 }
  },

  // Arganzuela (02)
  'paseo-imperial': {
    nombre: 'Paseo Imperial',
    distrito: 'Distrito 2 - Arganzuela',
    descripcion: 'Barrio en transformación, mezcla de tradición industrial y modernidad.',
    datosClave: { poblacion: 18700, densidad: 16800, edadMedia: 36, inmigracion: 19.4 }
  },
  'acacias': {
    nombre: 'Acacias',
    distrito: 'Distrito 2 - Arganzuela',
    descripcion: 'Barrio popular con fuerte identidad vecinal y ambiente familiar.',
    datosClave: { poblacion: 22300, densidad: 19200, edadMedia: 37, inmigracion: 21.8 }
  },
  'chopera': {
    nombre: 'Chopera',
    distrito: 'Distrito 2 - Arganzuela',
    descripcion: 'Zona residencial tranquila con parques y espacios verdes.',
    datosClave: { poblacion: 19800, densidad: 17500, edadMedia: 40, inmigracion: 16.9 }
  },
  'legazpi': {
    nombre: 'Legazpi',
    distrito: 'Distrito 2 - Arganzuela',
    descripcion: 'Barrio industrial reconvertido, centro de actividad empresarial.',
    datosClave: { poblacion: 16500, densidad: 15800, edadMedia: 38, inmigracion: 18.7 }
  },
  'delicias': {
    nombre: 'Delicias',
    distrito: 'Distrito 2 - Arganzuela',
    descripcion: 'Barrio histórico con arquitectura industrial y espacios culturales.',
    datosClave: { poblacion: 14200, densidad: 16900, edadMedia: 39, inmigracion: 20.3 }
  },
  'palos-de-moguer': {
    nombre: 'Palos de Moguer',
    distrito: 'Distrito 2 - Arganzuela',
    descripcion: 'Zona residencial moderna con amplias avenidas y comercio.',
    datosClave: { poblacion: 20100, densidad: 18100, edadMedia: 35, inmigracion: 17.5 }
  },
  'atocha': {
    nombre: 'Atocha',
    distrito: 'Distrito 2 - Arganzuela',
    descripcion: 'Centro de transporte y comercio, puerta de entrada a Madrid.',
    datosClave: { poblacion: 17800, densidad: 19500, edadMedia: 33, inmigracion: 24.1 }
  },

  // Retiro (03)
  'pacifico': {
    nombre: 'Pacífico',
    distrito: 'Distrito 3 - Retiro',
    descripcion: 'Barrio tranquilo y residencial, conocido por su parque y ambiente familiar.',
    datosClave: { poblacion: 23400, densidad: 18700, edadMedia: 41, inmigracion: 14.8 }
  },
  'adelfas': {
    nombre: 'Adelfas',
    distrito: 'Distrito 3 - Retiro',
    descripcion: 'Zona residencial elegante con arquitectura clásica y espacios verdes.',
    datosClave: { poblacion: 19800, densidad: 17200, edadMedia: 43, inmigracion: 12.3 }
  },
  'estrella': {
    nombre: 'Estrella',
    distrito: 'Distrito 3 - Retiro',
    descripcion: 'Barrio tradicional con ambiente familiar y comercio local.',
    datosClave: { poblacion: 21500, densidad: 18900, edadMedia: 38, inmigracion: 16.7 }
  },
  'ibiza': {
    nombre: 'Ibiza',
    distrito: 'Distrito 3 - Retiro',
    descripcion: 'Zona residencial exclusiva con parques y ambiente tranquilo.',
    datosClave: { poblacion: 18700, densidad: 16500, edadMedia: 45, inmigracion: 11.2 }
  },
  'jeronimos': {
    nombre: 'Jerónimos',
    distrito: 'Distrito 3 - Retiro',
    descripcion: 'Barrio histórico junto al Retiro, zona cultural y residencial.',
    datosClave: { poblacion: 15600, densidad: 17800, edadMedia: 42, inmigracion: 13.9 }
  },
  'nino-jesus': {
    nombre: 'Niño Jesús',
    distrito: 'Distrito 3 - Retiro',
    descripcion: 'Zona hospitalaria y residencial, ambiente tranquilo y familiar.',
    datosClave: { poblacion: 13400, densidad: 16900, edadMedia: 40, inmigracion: 15.6 }
  },

  // Salamanca (04)
  'recoletos': {
    nombre: 'Recoletos',
    distrito: 'Distrito 4 - Salamanca',
    descripcion: 'Barrio elegante y exclusivo, centro de lujo y alta sociedad.',
    datosClave: { poblacion: 18900, densidad: 19800, edadMedia: 44, inmigracion: 8.9 }
  },
  'goya': {
    nombre: 'Goya',
    distrito: 'Distrito 4 - Salamanca',
    descripcion: 'Zona comercial de lujo con boutiques y ambiente sofisticado.',
    datosClave: { poblacion: 22300, densidad: 21200, edadMedia: 41, inmigracion: 12.4 }
  },
  'fuente-del-berro': {
    nombre: 'Fuente del Berro',
    distrito: 'Distrito 4 - Salamanca',
    descripcion: 'Barrio residencial exclusivo con parques y ambiente tranquilo.',
    datosClave: { poblacion: 16700, densidad: 18500, edadMedia: 46, inmigracion: 9.7 }
  },
  'guindalera': {
    nombre: 'Guindalera',
    distrito: 'Distrito 4 - Salamanca',
    descripcion: 'Zona residencial elegante con arquitectura señorial.',
    datosClave: { poblacion: 20100, densidad: 19200, edadMedia: 43, inmigracion: 11.8 }
  },
  'lista': {
    nombre: 'Lista',
    distrito: 'Distrito 4 - Salamanca',
    descripcion: 'Barrio comercial y residencial, centro de actividad económica.',
    datosClave: { poblacion: 24500, densidad: 22100, edadMedia: 39, inmigracion: 14.2 }
  },
  'castellana': {
    nombre: 'Castellana',
    distrito: 'Distrito 4 - Salamanca',
    descripcion: 'Avenida principal de Madrid, zona empresarial y residencial.',
    datosClave: { poblacion: 19800, densidad: 20500, edadMedia: 42, inmigracion: 10.5 }
  },

  // Chamartín (05)
  'el-viso': {
    nombre: 'El Viso',
    distrito: 'Distrito 5 - Chamartín',
    descripcion: 'Barrio residencial exclusivo con arquitectura moderna y espacios verdes.',
    datosClave: { poblacion: 15600, densidad: 16800, edadMedia: 45, inmigracion: 7.8 }
  },
  'prosperidad': {
    nombre: 'Prosperidad',
    distrito: 'Distrito 5 - Chamartín',
    descripcion: 'Barrio tradicional con ambiente familiar y comercio local.',
    datosClave: { poblacion: 23400, densidad: 18900, edadMedia: 38, inmigracion: 16.3 }
  },
  'ciudad-jardin': {
    nombre: 'Ciudad Jardín',
    distrito: 'Distrito 5 - Chamartín',
    descripcion: 'Zona residencial con amplias zonas verdes y ambiente tranquilo.',
    datosClave: { poblacion: 18700, densidad: 16500, edadMedia: 42, inmigracion: 12.9 }
  },
  'hispanoamerica': {
    nombre: 'Hispanoamérica',
    distrito: 'Distrito 5 - Chamartín',
    descripcion: 'Barrio multicultural con fuerte presencia internacional.',
    datosClave: { poblacion: 26700, densidad: 19800, edadMedia: 36, inmigracion: 24.7 }
  },
  'nueva-espana': {
    nombre: 'Nueva España',
    distrito: 'Distrito 5 - Chamartín',
    descripcion: 'Zona residencial moderna con amplias avenidas y comercio.',
    datosClave: { poblacion: 20100, densidad: 17500, edadMedia: 39, inmigracion: 18.4 }
  },
  'castilla': {
    nombre: 'Castilla',
    distrito: 'Distrito 5 - Chamartín',
    descripcion: 'Barrio residencial elegante con arquitectura clásica.',
    datosClave: { poblacion: 17800, densidad: 18200, edadMedia: 41, inmigracion: 13.6 }
  },

  // Tetuán (06)
  'bellas-vistas': {
    nombre: 'Bellas Vistas',
    distrito: 'Distrito 6 - Tetuán',
    descripcion: 'Barrio tradicional con ambiente familiar y comercio local.',
    datosClave: { poblacion: 23400, densidad: 18900, edadMedia: 38, inmigracion: 19.2 }
  },
  'cuatro-caminos': {
    nombre: 'Cuatro Caminos',
    distrito: 'Distrito 6 - Tetuán',
    descripcion: 'Centro de transporte y comercio, importante nudo de comunicaciones.',
    datosClave: { poblacion: 26700, densidad: 21200, edadMedia: 35, inmigracion: 22.8 }
  },
  'castillejos': {
    nombre: 'Castillejos',
    distrito: 'Distrito 6 - Tetuán',
    descripcion: 'Barrio residencial con arquitectura clásica y ambiente tranquilo.',
    datosClave: { poblacion: 20100, densidad: 17500, edadMedia: 41, inmigracion: 16.4 }
  },
  'almenara': {
    nombre: 'Almenara',
    distrito: 'Distrito 6 - Tetuán',
    descripcion: 'Zona residencial moderna con amplias avenidas y espacios verdes.',
    datosClave: { poblacion: 18700, densidad: 16800, edadMedia: 39, inmigracion: 18.7 }
  },
  'valdeacederas': {
    nombre: 'Valdeacederas',
    distrito: 'Distrito 6 - Tetuán',
    descripcion: 'Barrio popular con fuerte identidad vecinal y ambiente tradicional.',
    datosClave: { poblacion: 22300, densidad: 19200, edadMedia: 37, inmigracion: 21.3 }
  },
  'berruguete': {
    nombre: 'Berruguete',
    distrito: 'Distrito 6 - Tetuán',
    descripcion: 'Zona residencial tranquila con parques y ambiente familiar.',
    datosClave: { poblacion: 19800, densidad: 17800, edadMedia: 40, inmigracion: 17.9 }
  },

  // Chamberí (07)
  'gaztambide': {
    nombre: 'Gaztambide',
    distrito: 'Distrito 7 - Chamberí',
    descripcion: 'Barrio elegante con arquitectura señorial y ambiente cultural.',
    datosClave: { poblacion: 16700, densidad: 18500, edadMedia: 43, inmigracion: 13.2 }
  },
  'arapiles': {
    nombre: 'Arapiles',
    distrito: 'Distrito 7 - Chamberí',
    descripcion: 'Zona residencial exclusiva con parques y ambiente tranquilo.',
    datosClave: { poblacion: 14500, densidad: 17200, edadMedia: 45, inmigracion: 11.8 }
  },
  'trafalgar': {
    nombre: 'Trafalgar',
    distrito: 'Distrito 7 - Chamberí',
    descripcion: 'Barrio tradicional con vida cultural y gastronómica vibrante.',
    datosClave: { poblacion: 18900, densidad: 19800, edadMedia: 38, inmigracion: 16.5 }
  },
  'almagro': {
    nombre: 'Almagro',
    distrito: 'Distrito 7 - Chamberí',
    descripcion: 'Zona residencial elegante con arquitectura clásica.',
    datosClave: { poblacion: 20100, densidad: 18900, edadMedia: 42, inmigracion: 14.7 }
  },
  'rios-rosas': {
    nombre: 'Ríos Rosas',
    distrito: 'Distrito 7 - Chamberí',
    descripcion: 'Barrio universitario y cultural, centro de conocimiento.',
    datosClave: { poblacion: 17800, densidad: 19500, edadMedia: 36, inmigracion: 19.3 }
  },
  'vallehermoso': {
    nombre: 'Vallehermoso',
    distrito: 'Distrito 7 - Chamberí',
    descripcion: 'Zona residencial moderna con amplias zonas verdes.',
    datosClave: { poblacion: 16500, densidad: 18200, edadMedia: 41, inmigracion: 15.6 }
  },

  // Fuencarral-El Pardo (08)
  'el-pardo': {
    nombre: 'El Pardo',
    distrito: 'Distrito 8 - Fuencarral-El Pardo',
    descripcion: 'Barrio histórico con palacio real y amplias zonas verdes.',
    datosClave: { poblacion: 8900, densidad: 12500, edadMedia: 44, inmigracion: 8.9 }
  },
  'fuentelarreina': {
    nombre: 'Fuentelarreina',
    distrito: 'Distrito 8 - Fuencarral-El Pardo',
    descripcion: 'Zona residencial exclusiva con grandes mansiones y jardines.',
    datosClave: { poblacion: 6700, densidad: 9800, edadMedia: 47, inmigracion: 6.2 }
  },
  'penagrande': {
    nombre: 'Peñagrande',
    distrito: 'Distrito 8 - Fuencarral-El Pardo',
    descripcion: 'Barrio residencial moderno con amplias avenidas y espacios verdes.',
    datosClave: { poblacion: 12300, densidad: 14500, edadMedia: 39, inmigracion: 12.8 }
  },
  'pilar': {
    nombre: 'Pilar',
    distrito: 'Distrito 8 - Fuencarral-El Pardo',
    descripcion: 'Zona residencial tranquila con ambiente familiar y comercio local.',
    datosClave: { poblacion: 15600, densidad: 16800, edadMedia: 41, inmigracion: 14.5 }
  },
  'la-paz': {
    nombre: 'La Paz',
    distrito: 'Distrito 8 - Fuencarral-El Pardo',
    descripcion: 'Barrio tradicional con arquitectura clásica y ambiente familiar.',
    datosClave: { poblacion: 13400, densidad: 15800, edadMedia: 43, inmigracion: 13.7 }
  },
  'valverde': {
    nombre: 'Valverde',
    distrito: 'Distrito 8 - Fuencarral-El Pardo',
    descripcion: 'Zona residencial elegante con parques y ambiente tranquilo.',
    datosClave: { poblacion: 11200, densidad: 14200, edadMedia: 45, inmigracion: 11.3 }
  },
  'mirasierra': {
    nombre: 'Mirasierra',
    distrito: 'Distrito 8 - Fuencarral-El Pardo',
    descripcion: 'Barrio exclusivo con grandes mansiones y amplias zonas verdes.',
    datosClave: { poblacion: 7800, densidad: 11200, edadMedia: 48, inmigracion: 7.8 }
  },
  'el-goloso': {
    nombre: 'El Goloso',
    distrito: 'Distrito 8 - Fuencarral-El Pardo',
    descripcion: 'Zona residencial moderna con amplias avenidas y comercio.',
    datosClave: { poblacion: 14500, densidad: 16500, edadMedia: 38, inmigracion: 15.2 }
  },

  // Moncloa-Aravaca (09)
  'casa-de-campo': {
    nombre: 'Casa de Campo',
    distrito: 'Distrito 9 - Moncloa-Aravaca',
    descripcion: 'Gran parque urbano con zonas recreativas y deportivas.',
    datosClave: { poblacion: 2300, densidad: 8500, edadMedia: 42, inmigracion: 9.4 }
  },
  'arguelles': {
    nombre: 'Argüelles',
    distrito: 'Distrito 9 - Moncloa-Aravaca',
    descripcion: 'Barrio universitario y cultural, centro de conocimiento.',
    datosClave: { poblacion: 18900, densidad: 19800, edadMedia: 34, inmigracion: 18.7 }
  },
  'ciudad-universitaria': {
    nombre: 'Ciudad Universitaria',
    distrito: 'Distrito 9 - Moncloa-Aravaca',
    descripcion: 'Campus universitario con instituciones académicas y culturales.',
    datosClave: { poblacion: 12300, densidad: 16500, edadMedia: 31, inmigracion: 22.4 }
  },
  'valdezarza': {
    nombre: 'Valdezarza',
    distrito: 'Distrito 9 - Moncloa-Aravaca',
    descripcion: 'Barrio residencial moderno con amplias avenidas.',
    datosClave: { poblacion: 16700, densidad: 17800, edadMedia: 39, inmigracion: 16.8 }
  },
  'valdemarin': {
    nombre: 'Valdemarín',
    distrito: 'Distrito 9 - Moncloa-Aravaca',
    descripcion: 'Zona residencial exclusiva con grandes mansiones.',
    datosClave: { poblacion: 8900, densidad: 12500, edadMedia: 46, inmigracion: 8.9 }
  },
  'el-plantio': {
    nombre: 'El Plantío',
    distrito: 'Distrito 9 - Moncloa-Aravaca',
    descripcion: 'Barrio exclusivo con grandes propiedades y jardines.',
    datosClave: { poblacion: 6700, densidad: 9800, edadMedia: 49, inmigracion: 6.7 }
  },
  'aravaca': {
    nombre: 'Aravaca',
    distrito: 'Distrito 9 - Moncloa-Aravaca',
    descripcion: 'Barrio residencial tranquilo con ambiente familiar.',
    datosClave: { poblacion: 13400, densidad: 14500, edadMedia: 41, inmigracion: 13.5 }
  },

  // Continuar con más barrios...
  'salamanca': {
    nombre: 'Salamanca',
    distrito: 'Distrito 4 - Salamanca',
    descripcion: 'Barrio emblemático de Madrid conocido por su elegancia y exclusividad.',
    datosClave: { poblacion: 147707, densidad: 18500, edadMedia: 42, inmigracion: 8.5 }
  },
  'chamberi': {
    nombre: 'Chamberí',
    distrito: 'Distrito 7 - Chamberí',
    descripcion: 'Barrio tradicional y residencial de Madrid, conocido por su ambiente familiar.',
    datosClave: { poblacion: 134511, densidad: 16200, edadMedia: 39, inmigracion: 12.3 }
  },
  'latina': {
    nombre: 'Latina',
    distrito: 'Distrito 10 - Latina',
    descripcion: 'Barrio popular y dinámico de Madrid, conocido por su diversidad cultural.',
    datosClave: { poblacion: 233583, densidad: 19800, edadMedia: 35, inmigracion: 18.7 }
  },
  'carabanchel': {
    nombre: 'Carabanchel',
    distrito: 'Distrito 11 - Carabanchel',
    descripcion: 'Barrio histórico de Madrid con una rica tradición obrera y artesanal.',
    datosClave: { poblacion: 261118, densidad: 22100, edadMedia: 37, inmigracion: 22.1 }
  },
  'vallecas': {
    nombre: 'Puente de Vallecas',
    distrito: 'Distrito 13 - Puente de Vallecas',
    descripcion: 'Barrio con fuerte identidad vecinal y espíritu comunitario.',
    datosClave: { poblacion: 235678, densidad: 19500, edadMedia: 33, inmigracion: 25.4 }
  }
}; 