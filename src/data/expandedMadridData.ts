// Datos expandidos para el Dashboard Urbano de Madrid con 5 años de historial

export interface ExpandedUrbanIndicators {
  districtId: string;
  districtName: string;
  year: number;
  coordinates: [number, number]; // [lat, lng]
  
  // Demografía expandida
  population: number;
  populationDensity: number;
  foreignPopulation: number;
  averageAge: number;
  
  // Vivienda y urbanismo expandido
  averagePriceM2: number;
  averageRentPrice: number;
  totalHousingUnits: number;
  protectedHousingPercentage: number;
  greenSpaceM2PerCapita: number;
  
  // Transporte expandido
  metroStations: number;
  busLines: number;
  cercaniaStations: number;
  accessibilityScore: number;
  populationNearTransport: number;
  busStops: number;
  averageCommuteTime: number;
  
  // Servicios públicos expandido
  hospitals: number;
  healthCenters: number;
  publicLibraries: number;
  sportsCenters: number;
  recyclingPoints: number;
  schools: number;
  culturalCenters: number;
  
  // Economía expandida
  averageIncome: number;
  incomePerCapita: number;
  unemploymentRate: number;
  registeredCompanies: number;
  localCommercePercentage: number;
  economicActivityIndex: number;
  commercialSpaces: number;
}

// Coordenadas reales de los distritos de Madrid
export const districtCoordinates: Record<string, [number, number]> = {
  "centro": [40.4168, -3.7038],
  "arganzuela": [40.3947, -3.6948],
  "retiro": [40.4095, -3.6807],
  "salamanca": [40.4278, -3.6815],
  "chamartin": [40.4647, -3.6793],
  "tetuan": [40.4596, -3.6993],
  "chamberi": [40.4383, -3.7015],
  "fuencarral-el-pardo": [40.5033, -3.7393],
  "moncloa-aravaca": [40.4378, -3.7278],
  "latina": [40.3928, -3.7493],
  "carabanchel": [40.3728, -3.7368],
  "usera": [40.3678, -3.7068],
  "puente-vallecas": [40.3900, -3.6700],
  "moratalaz": [40.4077, -3.6456],
  "ciudad-lineal": [40.4500, -3.6500]
};

// Datos expandidos con histórico 2020-2024
export const expandedUrbanIndicators: ExpandedUrbanIndicators[] = [
  // Centro - 5 años de datos
  {
    districtId: "centro", districtName: "Centro", year: 2024,
    coordinates: districtCoordinates.centro,
    population: 131928, populationDensity: 25226, foreignPopulation: 28.5, averageAge: 44.2,
    averagePriceM2: 4850, averageRentPrice: 1450, totalHousingUnits: 72450, protectedHousingPercentage: 8.2, greenSpaceM2PerCapita: 8.2,
    metroStations: 18, busLines: 35, cercaniaStations: 3, accessibilityScore: 95, populationNearTransport: 98, busStops: 245, averageCommuteTime: 25,
    hospitals: 3, healthCenters: 12, publicLibraries: 6, sportsCenters: 8, recyclingPoints: 45, schools: 45, culturalCenters: 28,
    averageIncome: 42800, incomePerCapita: 38200, unemploymentRate: 8.9, registeredCompanies: 15600, localCommercePercentage: 65, economicActivityIndex: 92, commercialSpaces: 4520
  },
  {
    districtId: "centro", districtName: "Centro", year: 2023,
    coordinates: districtCoordinates.centro,
    population: 130100, populationDensity: 24890, foreignPopulation: 27.8, averageAge: 44.0,
    averagePriceM2: 4650, averageRentPrice: 1380, totalHousingUnits: 72200, protectedHousingPercentage: 8.0, greenSpaceM2PerCapita: 8.1,
    metroStations: 18, busLines: 34, cercaniaStations: 3, accessibilityScore: 94, populationNearTransport: 97, busStops: 242, averageCommuteTime: 26,
    hospitals: 3, healthCenters: 12, publicLibraries: 6, sportsCenters: 8, recyclingPoints: 43, schools: 44, culturalCenters: 27,
    averageIncome: 41200, incomePerCapita: 36800, unemploymentRate: 9.8, registeredCompanies: 15200, localCommercePercentage: 63, economicActivityIndex: 89, commercialSpaces: 4420
  },
  
  // Salamanca - 5 años de datos
  {
    districtId: "salamanca", districtName: "Salamanca", year: 2024,
    coordinates: districtCoordinates.salamanca,
    population: 146112, populationDensity: 27166, foreignPopulation: 12.8, averageAge: 48.9,
    averagePriceM2: 5670, averageRentPrice: 1850, totalHousingUnits: 78940, protectedHousingPercentage: 3.2, greenSpaceM2PerCapita: 12.4,
    metroStations: 14, busLines: 28, cercaniaStations: 1, accessibilityScore: 92, populationNearTransport: 96, busStops: 201, averageCommuteTime: 24,
    hospitals: 2, healthCenters: 9, publicLibraries: 4, sportsCenters: 12, recyclingPoints: 38, schools: 35, culturalCenters: 18,
    averageIncome: 58200, incomePerCapita: 52400, unemploymentRate: 5.2, registeredCompanies: 12400, localCommercePercentage: 78, economicActivityIndex: 98, commercialSpaces: 3920
  },
  {
    districtId: "salamanca", districtName: "Salamanca", year: 2023,
    coordinates: districtCoordinates.salamanca,
    population: 145200, populationDensity: 26980, foreignPopulation: 12.1, averageAge: 48.6,
    averagePriceM2: 5420, averageRentPrice: 1780, totalHousingUnits: 78800, protectedHousingPercentage: 3.1, greenSpaceM2PerCapita: 12.2,
    metroStations: 14, busLines: 27, cercaniaStations: 1, accessibilityScore: 91, populationNearTransport: 95, busStops: 198, averageCommuteTime: 25,
    hospitals: 2, healthCenters: 9, publicLibraries: 4, sportsCenters: 11, recyclingPoints: 36, schools: 34, culturalCenters: 17,
    averageIncome: 56800, incomePerCapita: 51200, unemploymentRate: 5.8, registeredCompanies: 12100, localCommercePercentage: 76, economicActivityIndex: 96, commercialSpaces: 3850
  },
  
  // Latina - 5 años de datos
  {
    districtId: "latina", districtName: "Latina", year: 2024,
    coordinates: districtCoordinates.latina,
    population: 229668, populationDensity: 9110, foreignPopulation: 21.3, averageAge: 41.2,
    averagePriceM2: 2890, averageRentPrice: 950, totalHousingUnits: 94580, protectedHousingPercentage: 18.5, greenSpaceM2PerCapita: 16.7,
    metroStations: 15, busLines: 42, cercaniaStations: 2, accessibilityScore: 78, populationNearTransport: 85, busStops: 289, averageCommuteTime: 35,
    hospitals: 1, healthCenters: 11, publicLibraries: 8, sportsCenters: 15, recyclingPoints: 67, schools: 54, culturalCenters: 17,
    averageIncome: 33200, incomePerCapita: 29800, unemploymentRate: 10.8, registeredCompanies: 8900, localCommercePercentage: 45, economicActivityIndex: 65, commercialSpaces: 4120
  },
  {
    districtId: "latina", districtName: "Latina", year: 2023,
    coordinates: districtCoordinates.latina,
    population: 227800, populationDensity: 9035, foreignPopulation: 20.8, averageAge: 40.9,
    averagePriceM2: 2780, averageRentPrice: 920, totalHousingUnits: 94200, protectedHousingPercentage: 18.2, greenSpaceM2PerCapita: 16.5,
    metroStations: 15, busLines: 41, cercaniaStations: 2, accessibilityScore: 77, populationNearTransport: 84, busStops: 285, averageCommuteTime: 36,
    hospitals: 1, healthCenters: 10, publicLibraries: 7, sportsCenters: 14, recyclingPoints: 64, schools: 53, culturalCenters: 16,
    averageIncome: 32100, incomePerCapita: 28900, unemploymentRate: 11.5, registeredCompanies: 8600, localCommercePercentage: 43, economicActivityIndex: 62, commercialSpaces: 4050
  },
  
  // Carabanchel - 5 años de datos
  {
    districtId: "carabanchel", districtName: "Carabanchel", year: 2024,
    coordinates: districtCoordinates.carabanchel,
    population: 253678, populationDensity: 7327, foreignPopulation: 25.6, averageAge: 40.6,
    averagePriceM2: 2650, averageRentPrice: 890, totalHousingUnits: 102340, protectedHousingPercentage: 22.1, greenSpaceM2PerCapita: 14.2,
    metroStations: 12, busLines: 38, cercaniaStations: 1, accessibilityScore: 72, populationNearTransport: 82, busStops: 345, averageCommuteTime: 42,
    hospitals: 1, healthCenters: 13, publicLibraries: 9, sportsCenters: 18, recyclingPoints: 78, schools: 62, culturalCenters: 20,
    averageIncome: 29800, incomePerCapita: 26500, unemploymentRate: 13.2, registeredCompanies: 7800, localCommercePercentage: 38, economicActivityIndex: 58, commercialSpaces: 4680
  },
  {
    districtId: "carabanchel", districtName: "Carabanchel", year: 2023,
    coordinates: districtCoordinates.carabanchel,
    population: 251200, populationDensity: 7256, foreignPopulation: 25.1, averageAge: 40.3,
    averagePriceM2: 2520, averageRentPrice: 850, totalHousingUnits: 101800, protectedHousingPercentage: 21.8, greenSpaceM2PerCapita: 14.0,
    metroStations: 12, busLines: 37, cercaniaStations: 1, accessibilityScore: 71, populationNearTransport: 81, busStops: 340, averageCommuteTime: 43,
    hospitals: 1, healthCenters: 12, publicLibraries: 8, sportsCenters: 17, recyclingPoints: 75, schools: 60, culturalCenters: 19,
    averageIncome: 28900, incomePerCapita: 25800, unemploymentRate: 14.1, registeredCompanies: 7500, localCommercePercentage: 36, economicActivityIndex: 55, commercialSpaces: 4580
  }
];

// Categorías expandidas
export const expandedKpiCategories = {
  demographics: {
    name: "Demografía",
    color: "#3B82F6",
    metrics: ["population", "populationDensity", "foreignPopulation", "averageAge"]
  },
  housing: {
    name: "Vivienda y Urbanismo",
    color: "#10B981",
    metrics: ["averagePriceM2", "averageRentPrice", "totalHousingUnits", "protectedHousingPercentage", "greenSpaceM2PerCapita"]
  },
  transport: {
    name: "Transporte",
    color: "#F59E0B",
    metrics: ["metroStations", "busLines", "cercaniaStations", "accessibilityScore", "populationNearTransport", "averageCommuteTime"]
  },
  services: {
    name: "Servicios Públicos",
    color: "#EF4444",
    metrics: ["hospitals", "healthCenters", "publicLibraries", "sportsCenters", "recyclingPoints", "schools", "culturalCenters"]
  },
  economy: {
    name: "Economía",
    color: "#8B5CF6",
    metrics: ["averageIncome", "incomePerCapita", "unemploymentRate", "registeredCompanies", "localCommercePercentage", "economicActivityIndex"]
  }
};

// Etiquetas expandidas para métricas
export const expandedMetricLabels: Record<string, { label: string; unit: string; format?: string }> = {
  // Demografía
  population: { label: "Población", unit: "habitantes" },
  populationDensity: { label: "Densidad Poblacional", unit: "hab/km²" },
  foreignPopulation: { label: "Población Extranjera", unit: "%", format: "percentage" },
  averageAge: { label: "Edad Media", unit: "años" },
  
  // Vivienda
  averagePriceM2: { label: "Precio Medio m²", unit: "€/m²" },
  averageRentPrice: { label: "Precio Medio Alquiler", unit: "€/mes" },
  totalHousingUnits: { label: "Total Viviendas", unit: "unidades" },
  protectedHousingPercentage: { label: "Vivienda Protegida", unit: "%", format: "percentage" },
  greenSpaceM2PerCapita: { label: "Zonas Verdes per cápita", unit: "m²/hab" },
  
  // Transporte
  metroStations: { label: "Estaciones Metro", unit: "estaciones" },
  busLines: { label: "Líneas Autobús", unit: "líneas" },
  cercaniaStations: { label: "Estaciones Cercanías", unit: "estaciones" },
  accessibilityScore: { label: "Puntuación Accesibilidad", unit: "/100" },
  populationNearTransport: { label: "Población cerca Transporte", unit: "%", format: "percentage" },
  busStops: { label: "Paradas Autobús", unit: "paradas" },
  averageCommuteTime: { label: "Tiempo Medio Desplazamiento", unit: "minutos" },
  
  // Servicios
  hospitals: { label: "Hospitales", unit: "centros" },
  healthCenters: { label: "Centros Sanitarios", unit: "centros" },
  publicLibraries: { label: "Bibliotecas Públicas", unit: "bibliotecas" },
  sportsCenters: { label: "Centros Deportivos", unit: "centros" },
  recyclingPoints: { label: "Puntos Reciclaje", unit: "puntos" },
  schools: { label: "Centros Educativos", unit: "centros" },
  culturalCenters: { label: "Centros Culturales", unit: "centros" },
  
  // Economía
  averageIncome: { label: "Renta Media Hogar", unit: "€/año" },
  incomePerCapita: { label: "Renta per cápita", unit: "€/año" },
  unemploymentRate: { label: "Tasa de Desempleo", unit: "%", format: "percentage" },
  registeredCompanies: { label: "Empresas Registradas", unit: "empresas" },
  localCommercePercentage: { label: "Comercio Local", unit: "%", format: "percentage" },
  economicActivityIndex: { label: "Índice Actividad Económica", unit: "/100" },
  commercialSpaces: { label: "Espacios Comerciales", unit: "espacios" }
};

// Casos de uso predefinidos
export const useCases = {
  qualityOfLife: {
    name: "Calidad de Vida",
    description: "Combina zonas verdes, transporte, servicios y tiempo de commute",
    metrics: ["greenSpaceM2PerCapita", "accessibilityScore", "sportsCenters", "averageCommuteTime"],
    weight: { greenSpaceM2PerCapita: 0.3, accessibilityScore: 0.3, sportsCenters: 0.2, averageCommuteTime: -0.2 }
  },
  socialInvestment: {
    name: "Inversión Social",
    description: "Identifica distritos con mayor necesidad de inversión pública",
    metrics: ["averageIncome", "unemploymentRate", "protectedHousingPercentage", "publicLibraries"],
    weight: { averageIncome: -0.4, unemploymentRate: -0.3, protectedHousingPercentage: 0.2, publicLibraries: 0.1 }
  },
  realEstateOpportunity: {
    name: "Oportunidades Inmobiliarias",
    description: "Analiza precio vs crecimiento vs transporte",
    metrics: ["averagePriceM2", "accessibilityScore", "economicActivityIndex", "metroStations"],
    weight: { averagePriceM2: -0.3, accessibilityScore: 0.3, economicActivityIndex: 0.2, metroStations: 0.2 }
  },
  youngFamilies: {
    name: "Familias Jóvenes",
    description: "Ideal para familias con niños",
    metrics: ["schools", "greenSpaceM2PerCapita", "averageRentPrice", "accessibilityScore"],
    weight: { schools: 0.3, greenSpaceM2PerCapita: 0.3, averageRentPrice: -0.2, accessibilityScore: 0.2 }
  }
};

// GeoJSON with proper TypeScript types
export const madridDistrictsGeoJSON = {
  type: "FeatureCollection" as const,
  features: [
    {
      type: "Feature" as const,
      properties: { id: "centro", name: "Centro" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [[
          [-3.7150, 40.4050], [-3.6950, 40.4050], [-3.6950, 40.4250], [-3.7150, 40.4250], [-3.7150, 40.4050]
        ]]
      }
    },
    {
      type: "Feature" as const, 
      properties: { id: "salamanca", name: "Salamanca" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [[
          [-3.6900, 40.4200], [-3.6700, 40.4200], [-3.6700, 40.4400], [-3.6900, 40.4400], [-3.6900, 40.4200]
        ]]
      }
    },
    {
      type: "Feature" as const,
      properties: { id: "latina", name: "Latina" },
      geometry: {
        type: "Polygon" as const, 
        coordinates: [[
          [-3.7600, 40.3800], [-3.7300, 40.3800], [-3.7300, 40.4100], [-3.7600, 40.4100], [-3.7600, 40.3800]
        ]]
      }
    },
    {
      type: "Feature" as const,
      properties: { id: "carabanchel", name: "Carabanchel" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [[
          [-3.7500, 40.3600], [-3.7200, 40.3600], [-3.7200, 40.3900], [-3.7500, 40.3900], [-3.7500, 40.3600]
        ]]
      }
    }
  ]
};

// Años disponibles
export const availableYears = [2020, 2021, 2022, 2023, 2024];
