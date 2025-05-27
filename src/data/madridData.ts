
// Datos mock realistas para el Dashboard Urbano de Madrid
export interface District {
  id: string;
  name: string;
  population: number;
  area: number; // km²
  neighborhoods: string[];
  coordinates: [number, number]; // [lat, lng]
}

export interface UrbanIndicators {
  districtId: string;
  districtName: string;
  // Demografía
  population: number;
  populationDensity: number;
  foreignPopulation: number;
  averageAge: number;
  // Vivienda
  averagePriceM2: number;
  residentialUnits: number;
  commercialUnits: number;
  greenSpaceM2PerCapita: number;
  // Transporte
  metroStations: number;
  busStops: number;
  averageCommuteTime: number;
  // Servicios
  schools: number;
  healthCenters: number;
  culturalCenters: number;
  // Economía
  averageIncome: number;
  unemploymentRate: number;
  commercialSpaces: number;
}

export const madridDistricts: District[] = [
  {
    id: "centro",
    name: "Centro",
    population: 131928,
    area: 5.23,
    neighborhoods: ["Palacio", "Embajadores", "Cortes", "Justicia", "Universidad", "Sol"],
    coordinates: [40.4168, -3.7038]
  },
  {
    id: "arganzuela",
    name: "Arganzuela",
    population: 151965,
    area: 6.79,
    neighborhoods: ["Imperial", "Acacias", "La Chopera", "Legazpi", "Delicias", "Palos de Moguer", "Atocha"],
    coordinates: [40.3947, -3.6948]
  },
  {
    id: "retiro",
    name: "Retiro",
    population: 118202,
    area: 5.38,
    neighborhoods: ["Pacífico", "Adelfas", "Estrella", "Ibiza", "Jerónimos", "Niño Jesús"],
    coordinates: [40.4095, -3.6807]
  },
  {
    id: "salamanca",
    name: "Salamanca",
    population: 146112,
    area: 5.38,
    neighborhoods: ["Recoletos", "Goya", "Parque de las Avenidas", "Fuente del Berro", "Guindalera", "Lista"],
    coordinates: [40.4278, -3.6815]
  },
  {
    id: "chamartin",
    name: "Chamartín",
    population: 140782,
    area: 9.18,
    neighborhoods: ["El Viso", "Prosperidad", "Ciudad Jardín", "Hispanoamérica", "Nueva España", "Castilla"],
    coordinates: [40.4647, -3.6793]
  },
  {
    id: "tetuan",
    name: "Tetuán",
    population: 154478,
    area: 5.37,
    neighborhoods: ["Bellas Vistas", "Cuatro Caminos", "Castillejos", "Almenara", "Valdeacederas", "Berruguete"],
    coordinates: [40.4596, -3.6993]
  },
  {
    id: "chamberi",
    name: "Chamberí",
    population: 139553,
    area: 4.69,
    neighborhoods: ["Gaztambide", "Arapiles", "Trafalgar", "Almagro", "Ríos Rosas", "Vallehermoso"],
    coordinates: [40.4383, -3.7015]
  },
  {
    id: "fuencarral-el-pardo",
    name: "Fuencarral-El Pardo",
    population: 245723,
    area: 307.79,
    neighborhoods: ["El Pardo", "Fuentelarreina", "Peñagrande", "Barrio del Pilar", "La Paz", "Valverde", "Mirasierra", "El Goloso"],
    coordinates: [40.5033, -3.7393]
  },
  {
    id: "moncloa-aravaca",
    name: "Moncloa-Aravaca",
    population: 118654,
    area: 46.22,
    neighborhoods: ["Casa de Campo", "Argüelles", "Ciudad Universitaria", "Valdezarza", "Valdemarín", "El Plantío", "Aravaca"],
    coordinates: [40.4378, -3.7278]
  },
  {
    id: "latina",
    name: "Latina",
    population: 229668,
    area: 25.21,
    neighborhoods: ["Los Cármenes", "Puerta del Ángel", "Lucero", "Aluche", "Las Águilas", "Campamento", "Cuatro Vientos"],
    coordinates: [40.3928, -3.7493]
  },
  {
    id: "carabanchel",
    name: "Carabanchel",
    population: 253678,
    area: 34.62,
    neighborhoods: ["Comillas", "Opañel", "San Isidro", "Vista Alegre", "Puerta Bonita", "Buenavista", "Abrantes"],
    coordinates: [40.3728, -3.7368]
  },
  {
    id: "usera",
    name: "Usera",
    population: 135138,
    area: 9.86,
    neighborhoods: ["Orcasitas", "Orcasur", "San Fermín", "Almendrales", "Moscardó", "Zofío", "Pradolongo"],
    coordinates: [40.3678, -3.7068]
  }
];

export const urbanIndicators: UrbanIndicators[] = [
  {
    districtId: "centro",
    districtName: "Centro",
    population: 131928,
    populationDensity: 25226,
    foreignPopulation: 28.5,
    averageAge: 44.2,
    averagePriceM2: 4850,
    residentialUnits: 72450,
    commercialUnits: 8920,
    greenSpaceM2PerCapita: 8.2,
    metroStations: 18,
    busStops: 245,
    averageCommuteTime: 25,
    schools: 45,
    healthCenters: 12,
    culturalCenters: 28,
    averageIncome: 42800,
    unemploymentRate: 8.9,
    commercialSpaces: 4520
  },
  {
    districtId: "arganzuela",
    districtName: "Arganzuela",
    population: 151965,
    populationDensity: 22388,
    foreignPopulation: 18.7,
    averageAge: 43.1,
    averagePriceM2: 3920,
    residentialUnits: 78230,
    commercialUnits: 5640,
    greenSpaceM2PerCapita: 15.8,
    metroStations: 12,
    busStops: 189,
    averageCommuteTime: 28,
    schools: 38,
    healthCenters: 8,
    culturalCenters: 15,
    averageIncome: 38500,
    unemploymentRate: 9.2,
    commercialSpaces: 2890
  },
  {
    districtId: "retiro",
    districtName: "Retiro",
    population: 118202,
    populationDensity: 21970,
    foreignPopulation: 15.3,
    averageAge: 47.8,
    averagePriceM2: 4580,
    residentialUnits: 61820,
    commercialUnits: 4210,
    greenSpaceM2PerCapita: 45.6,
    metroStations: 8,
    busStops: 156,
    averageCommuteTime: 22,
    schools: 28,
    healthCenters: 6,
    culturalCenters: 12,
    averageIncome: 48900,
    unemploymentRate: 6.8,
    commercialSpaces: 2340
  },
  {
    districtId: "salamanca",
    districtName: "Salamanca",
    population: 146112,
    populationDensity: 27166,
    foreignPopulation: 12.8,
    averageAge: 48.9,
    averagePriceM2: 5670,
    residentialUnits: 78940,
    commercialUnits: 6850,
    greenSpaceM2PerCapita: 12.4,
    metroStations: 14,
    busStops: 201,
    averageCommuteTime: 24,
    schools: 35,
    healthCenters: 9,
    culturalCenters: 18,
    averageIncome: 58200,
    unemploymentRate: 5.2,
    commercialSpaces: 3920
  },
  {
    districtId: "chamartin",
    districtName: "Chamartín",
    population: 140782,
    populationDensity: 15336,
    foreignPopulation: 16.2,
    averageAge: 45.6,
    averagePriceM2: 4890,
    residentialUnits: 72680,
    commercialUnits: 5470,
    greenSpaceM2PerCapita: 18.9,
    metroStations: 11,
    busStops: 178,
    averageCommuteTime: 26,
    schools: 42,
    healthCenters: 8,
    culturalCenters: 14,
    averageIncome: 52400,
    unemploymentRate: 6.1,
    commercialSpaces: 3140
  },
  {
    districtId: "tetuan",
    districtName: "Tetuán",
    population: 154478,
    populationDensity: 28771,
    foreignPopulation: 24.9,
    averageAge: 42.3,
    averagePriceM2: 3680,
    residentialUnits: 82450,
    commercialUnits: 4920,
    greenSpaceM2PerCapita: 9.7,
    metroStations: 9,
    busStops: 198,
    averageCommuteTime: 32,
    schools: 36,
    healthCenters: 7,
    culturalCenters: 11,
    averageIncome: 34800,
    unemploymentRate: 11.4,
    commercialSpaces: 2680
  },
  {
    districtId: "chamberi",
    districtName: "Chamberí",
    population: 139553,
    populationDensity: 29756,
    foreignPopulation: 14.6,
    averageAge: 46.7,
    averagePriceM2: 4790,
    residentialUnits: 73920,
    commercialUnits: 5630,
    greenSpaceM2PerCapita: 11.8,
    metroStations: 13,
    busStops: 167,
    averageCommuteTime: 23,
    schools: 31,
    healthCenters: 8,
    culturalCenters: 16,
    averageIncome: 51200,
    unemploymentRate: 6.8,
    commercialSpaces: 3450
  },
  {
    districtId: "fuencarral-el-pardo",
    districtName: "Fuencarral-El Pardo",
    population: 245723,
    populationDensity: 799,
    foreignPopulation: 22.1,
    averageAge: 40.8,
    averagePriceM2: 3420,
    residentialUnits: 98650,
    commercialUnits: 6240,
    greenSpaceM2PerCapita: 95.3,
    metroStations: 7,
    busStops: 312,
    averageCommuteTime: 38,
    schools: 58,
    healthCenters: 12,
    culturalCenters: 19,
    averageIncome: 41600,
    unemploymentRate: 8.7,
    commercialSpaces: 3890
  },
  {
    districtId: "moncloa-aravaca",
    districtName: "Moncloa-Aravaca",
    population: 118654,
    populationDensity: 2567,
    foreignPopulation: 19.4,
    averageAge: 44.9,
    averagePriceM2: 4560,
    residentialUnits: 52340,
    commercialUnits: 3980,
    greenSpaceM2PerCapita: 78.4,
    metroStations: 8,
    busStops: 143,
    averageCommuteTime: 29,
    schools: 35,
    healthCenters: 6,
    culturalCenters: 13,
    averageIncome: 56800,
    unemploymentRate: 5.9,
    commercialSpaces: 2340
  },
  {
    districtId: "latina",
    districtName: "Latina",
    population: 229668,
    populationDensity: 9110,
    foreignPopulation: 21.3,
    averageAge: 41.2,
    averagePriceM2: 2890,
    residentialUnits: 94580,
    commercialUnits: 6780,
    greenSpaceM2PerCapita: 16.7,
    metroStations: 15,
    busStops: 289,
    averageCommuteTime: 35,
    schools: 54,
    healthCenters: 11,
    culturalCenters: 17,
    averageIncome: 33200,
    unemploymentRate: 10.8,
    commercialSpaces: 4120
  },
  {
    districtId: "carabanchel",
    districtName: "Carabanchel",
    population: 253678,
    populationDensity: 7327,
    foreignPopulation: 25.6,
    averageAge: 40.6,
    averagePriceM2: 2650,
    residentialUnits: 102340,
    commercialUnits: 7240,
    greenSpaceM2PerCapita: 14.2,
    metroStations: 12,
    busStops: 345,
    averageCommuteTime: 42,
    schools: 62,
    healthCenters: 13,
    culturalCenters: 20,
    averageIncome: 29800,
    unemploymentRate: 13.2,
    commercialSpaces: 4680
  },
  {
    districtId: "usera",
    districtName: "Usera",
    population: 135138,
    populationDensity: 13706,
    foreignPopulation: 31.2,
    averageAge: 39.4,
    averagePriceM2: 2340,
    residentialUnits: 56780,
    commercialUnits: 3890,
    greenSpaceM2PerCapita: 12.8,
    metroStations: 6,
    busStops: 178,
    averageCommuteTime: 39,
    schools: 32,
    healthCenters: 8,
    culturalCenters: 12,
    averageIncome: 27600,
    unemploymentRate: 15.1,
    commercialSpaces: 2450
  }
];

export const kpiCategories = {
  demographics: {
    name: "Demografía",
    color: "#3B82F6",
    metrics: ["population", "populationDensity", "foreignPopulation", "averageAge"]
  },
  housing: {
    name: "Vivienda",
    color: "#10B981",
    metrics: ["averagePriceM2", "residentialUnits", "commercialUnits", "greenSpaceM2PerCapita"]
  },
  transport: {
    name: "Transporte",
    color: "#F59E0B",
    metrics: ["metroStations", "busStops", "averageCommuteTime"]
  },
  services: {
    name: "Servicios",
    color: "#EF4444",
    metrics: ["schools", "healthCenters", "culturalCenters"]
  },
  economy: {
    name: "Economía",
    color: "#8B5CF6",
    metrics: ["averageIncome", "unemploymentRate", "commercialSpaces"]
  }
};

export const metricLabels: Record<string, { label: string; unit: string; format?: string }> = {
  population: { label: "Población", unit: "habitantes" },
  populationDensity: { label: "Densidad Poblacional", unit: "hab/km²" },
  foreignPopulation: { label: "Población Extranjera", unit: "%", format: "percentage" },
  averageAge: { label: "Edad Media", unit: "años" },
  averagePriceM2: { label: "Precio Medio m²", unit: "€/m²" },
  residentialUnits: { label: "Viviendas Residenciales", unit: "unidades" },
  commercialUnits: { label: "Locales Comerciales", unit: "unidades" },
  greenSpaceM2PerCapita: { label: "Zonas Verdes per cápita", unit: "m²/hab" },
  metroStations: { label: "Estaciones Metro", unit: "estaciones" },
  busStops: { label: "Paradas Autobús", unit: "paradas" },
  averageCommuteTime: { label: "Tiempo Medio Desplazamiento", unit: "minutos" },
  schools: { label: "Centros Educativos", unit: "centros" },
  healthCenters: { label: "Centros Sanitarios", unit: "centros" },
  culturalCenters: { label: "Centros Culturales", unit: "centros" },
  averageIncome: { label: "Renta Media", unit: "€/año" },
  unemploymentRate: { label: "Tasa de Desempleo", unit: "%", format: "percentage" },
  commercialSpaces: { label: "Espacios Comerciales", unit: "espacios" }
};
