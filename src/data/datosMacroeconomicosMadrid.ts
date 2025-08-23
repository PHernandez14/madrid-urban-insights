export interface DatoMacroAnual {
  ano: number;
  pib_nominal_miles_euros: number;
  pib_per_capita_euros: number;
  crecimiento_pib_porcentaje: number;
}

export const datosMacroMadrid: DatoMacroAnual[] = [
  {
    ano: 2018,
    pib_nominal_miles_euros: 230795000,
    pib_per_capita_euros: 35041,
    crecimiento_pib_porcentaje: 3.1,
  },
  {
    ano: 2019,
    pib_nominal_miles_euros: 242079000,
    pib_per_capita_euros: 36563,
    crecimiento_pib_porcentaje: 2.5,
  },
  {
    ano: 2020,
    pib_nominal_miles_euros: 219030504,
    pib_per_capita_euros: 32742,
    crecimiento_pib_porcentaje: -10.4,
  },
  {
    ano: 2021,
    pib_nominal_miles_euros: 237540292,
    pib_per_capita_euros: 35141,
    crecimiento_pib_porcentaje: 6.0,
  },
  {
    ano: 2022,
    pib_nominal_miles_euros: 261713090,
    pib_per_capita_euros: 38435,
    crecimiento_pib_porcentaje: 7.2,
  },
    {
    ano: 2023,
    pib_nominal_miles_euros: 293069000,
    pib_per_capita_euros: 42198,
    crecimiento_pib_porcentaje: 2.5,
  }
];

// Fuente: Instituto Nacional de Estadística (INE), Contabilidad Regional de España.
// Los datos pueden tener ligeras variaciones con respecto a otras fuentes debido a revisiones.








