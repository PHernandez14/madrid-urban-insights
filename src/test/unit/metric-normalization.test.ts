import { describe, it, expect } from 'vitest';

// Función normalizeMetric exacta según especificación
function normalizeMetric(key: string, value: number): number {
  switch (key) {
    case 'rentaMediaPersona':
      return Math.min(value / 50000, 1.0);
    case 'precioAlquilerM2':
      return Math.min(value / 30, 1.0);
    case 'precioVentaM2':
      return Math.min(value / 8000, 1.0);
    case 'localesComerciales':
      return Math.min(value / 800, 1.0);
    case 'totalLocales':
      return Math.min(value / 1500, 1.0);
    case 'localesAbiertos':
      return Math.min(value / 1200, 1.0);
    case 'licenciasConcedidas':
      return Math.min(value / 500, 1.0);
    case 'licenciasEnTramite':
      return Math.min(value / 200, 1.0);
    case 'licenciasDenegadas':
      return Math.min(value / 100, 1.0);
    case 'terrazasTotal':
      return Math.min(value / 300, 1.0);
    case 'numeroVUTs':
      return Math.min(value / 1000, 1.0);
    case 'populationDensity':
      return Math.min(value / 50000, 1.0);
    case 'unemploymentRate':
      return Math.min(value / 25, 1.0);
    case 'averageIncome':
      return Math.min(value / 60000, 1.0);
    case 'averagePriceM2':
      return Math.min(value / 8000, 1.0);
    default:
      // Fallback genérico para métricas desconocidas - Escala 0-100 → 0-1
      return Math.min(value / 100, 1.0);
  }
}

describe('Normalización de Métricas', () => {
  describe('Métricas Económicas', () => {
    it('debe normalizar renta media persona en rango 0-50k', () => {
      // Caso 1: Verificar cuartiles y precisión
      expect(normalizeMetric('rentaMediaPersona', 0)).toBe(0); // 0
      expect(normalizeMetric('rentaMediaPersona', 12500)).toBe(0.25); // 0.25
      expect(normalizeMetric('rentaMediaPersona', 25000)).toBe(0.5); // 0.5
      expect(normalizeMetric('rentaMediaPersona', 37500)).toBe(0.75); // 0.75
      expect(normalizeMetric('rentaMediaPersona', 50000)).toBe(1.0); // 1.0
    });

    it('debe aplicar cap máximo a renta media persona', () => {
      // Caso 2: Validar límite superior overflow
      expect(normalizeMetric('rentaMediaPersona', 75000)).toBe(1.0); // 75k, 100k, 999k€ → 1.0
      expect(normalizeMetric('rentaMediaPersona', 100000)).toBe(1.0);
      expect(normalizeMetric('rentaMediaPersona', 999000)).toBe(1.0);
    });

    it('debe manejar valores decimales en renta media', () => {
      // Caso 3: Confirmar precisión matemática
      expect(normalizeMetric('rentaMediaPersona', 33333.33)).toBeCloseTo(0.6667, 4); // 0.6667
      expect(normalizeMetric('rentaMediaPersona', 12345.67)).toBeCloseTo(0.2469, 4); // 0.2469
    });
  });

  describe('Métricas de Vivienda', () => {
    it('debe normalizar precio alquiler/m² en rango 0-30', () => {
      // Caso 4: Escala específica mercado Madrid
      expect(normalizeMetric('precioAlquilerM2', 0)).toBe(0); // 0, 7.5, 15, 22.5, 30€ → 0, 0.25, 0.5, 0.75, 1.0
      expect(normalizeMetric('precioAlquilerM2', 7.5)).toBe(0.25);
      expect(normalizeMetric('precioAlquilerM2', 15)).toBe(0.5);
      expect(normalizeMetric('precioAlquilerM2', 22.5)).toBe(0.75);
      expect(normalizeMetric('precioAlquilerM2', 30)).toBe(1.0);
    });

    it('debe normalizar precio venta/m² en rango 0-8000', () => {
      // Caso 5: Rango calibrado inmobiliario
      expect(normalizeMetric('precioVentaM2', 0)).toBe(0); // 0, 2k, 4k, 6k, 8k€ → 0, 0.25, 0.5, 0.75, 1.0
      expect(normalizeMetric('precioVentaM2', 2000)).toBe(0.25);
      expect(normalizeMetric('precioVentaM2', 4000)).toBe(0.5);
      expect(normalizeMetric('precioVentaM2', 6000)).toBe(0.75);
      expect(normalizeMetric('precioVentaM2', 8000)).toBe(1.0);
    });

    it('debe aplicar cap a precios extremos', () => {
      // Caso 6: Protección outliers premium
      expect(normalizeMetric('precioAlquilerM2', 45)).toBe(1.0); // 45€/m² → 1.0
      expect(normalizeMetric('precioVentaM2', 12000)).toBe(1.0); // 12k€/m² → 1.0
    });
  });

  describe('Métricas Comerciales', () => {
    it('debe normalizar total locales en rango 0-1500', () => {
      // Caso 7: Escala actividad comercial total
      expect(normalizeMetric('totalLocales', 0)).toBe(0); // 0, 375, 750, 1125, 1500 → 0, 0.25, 0.5, 0.75, 1.0
      expect(normalizeMetric('totalLocales', 375)).toBe(0.25);
      expect(normalizeMetric('totalLocales', 750)).toBe(0.5);
      expect(normalizeMetric('totalLocales', 1125)).toBe(0.75);
      expect(normalizeMetric('totalLocales', 1500)).toBe(1.0);
    });

    it('debe normalizar locales comerciales en rango 0-800', () => {
      // Caso 8: Subset específico comercios
      expect(normalizeMetric('localesComerciales', 0)).toBe(0); // 0, 200, 400, 600, 800 → 0, 0.25, 0.5, 0.75, 1.0
      expect(normalizeMetric('localesComerciales', 200)).toBe(0.25);
      expect(normalizeMetric('localesComerciales', 400)).toBe(0.5);
      expect(normalizeMetric('localesComerciales', 600)).toBe(0.75);
      expect(normalizeMetric('localesComerciales', 800)).toBe(1.0);
    });

    it('debe normalizar locales abiertos en rango 0-1200', () => {
      // Caso 9: Métrica vitalidad económica
      expect(normalizeMetric('localesAbiertos', 0)).toBe(0); // 0, 300, 600, 900, 1200 → 0, 0.25, 0.5, 0.75, 1.0
      expect(normalizeMetric('localesAbiertos', 300)).toBe(0.25);
      expect(normalizeMetric('localesAbiertos', 600)).toBe(0.5);
      expect(normalizeMetric('localesAbiertos', 900)).toBe(0.75);
      expect(normalizeMetric('localesAbiertos', 1200)).toBe(1.0);
    });

    it('debe aplicar cap a métricas comerciales extremas', () => {
      // Caso 10: Protección valores atípicos
      expect(normalizeMetric('totalLocales', 2000)).toBe(1.0); // 2000, 1200, 1800 locales → 1.0
      expect(normalizeMetric('localesComerciales', 1200)).toBe(1.0);
      expect(normalizeMetric('localesAbiertos', 1800)).toBe(1.0);
    });
  });

  describe('Fallback y Casos Especiales', () => {
    it('debe usar fallback genérico para métricas desconocidas', () => {
      // Caso 11: Robustez extensibilidad - Escala 0-100 → 0-1
      expect(normalizeMetric('metricaDesconocida', 0)).toBe(0.0);
      expect(normalizeMetric('metricaDesconocida', 25)).toBe(0.25);
      expect(normalizeMetric('metricaDesconocida', 50)).toBe(0.5);
      expect(normalizeMetric('metricaDesconocida', 75)).toBe(0.75);
      expect(normalizeMetric('metricaDesconocida', 100)).toBe(1.0);
      expect(normalizeMetric('metricaDesconocida', 150)).toBe(1.0);
    });

    it('debe manejar valores negativos como cero', () => {
      // Caso 12: Protección datos erróneos - FALLO ESPERADO: Retorna -0.02
      const result1 = normalizeMetric('rentaMediaPersona', -1000);
      const result2 = normalizeMetric('precioAlquilerM2', -5);
      const result3 = normalizeMetric('localesComerciales', -100);
      
      // Expectativa: 0.0, 0.0, 0.0 - pero FALLO ACTUAL: -0.02
      expect(result1).toBe(0.0);
      expect(result2).toBe(0.0);
      expect(result3).toBe(0.0);
    });

    it('debe manejar valores infinitos y NaN', () => {
      // Caso 13: Casos extremos sin crash
      expect(normalizeMetric('rentaMediaPersona', Infinity)).toBe(1.0); // Infinity → 1.0
      expect(isNaN(normalizeMetric('rentaMediaPersona', NaN))).toBe(true); // NaN → NaN
    });

    it('debe mantener precisión en cálculos decimales', () => {
      // Caso 14: Verificación precisión - Precisión 5 decimales
      const result = normalizeMetric('rentaMediaPersona', 33333.333333);
      expect(result).toBeCloseTo(0.66667, 5);
    });
  });

  describe('Propiedades Matemáticas', () => {
    it('debe ser monótona creciente dentro del rango', () => {
      // Caso 15: Función matemáticamente correcta - f(a) ≤ f(b) si a ≤ b
      const values = [0, 10000, 20000, 30000, 40000, 50000];
      const results = values.map(v => normalizeMetric('rentaMediaPersona', v));
      
      for (let i = 1; i < results.length; i++) {
        expect(results[i]).toBeGreaterThanOrEqual(results[i-1]);
      }
    });

    it('debe mantener proporción lineal dentro del rango', () => {
      // Caso 16: Confirma proporcionalidad - f(2x) = 2*f(x)
      const value1 = normalizeMetric('rentaMediaPersona', 10000);
      const value2 = normalizeMetric('rentaMediaPersona', 20000);
      
      expect(value2).toBeCloseTo(value1 * 2, 4);
    });

    it('debe ser idempotente para valores en el límite', () => {
      // Caso 17: Valores máximos consistentes - f(max_value) = 1.0
      expect(normalizeMetric('rentaMediaPersona', 50000)).toBe(1.0);
      expect(normalizeMetric('precioAlquilerM2', 30)).toBe(1.0);
      expect(normalizeMetric('totalLocales', 1500)).toBe(1.0);
    });
  });

  describe('Rangos Específicos Madrid', () => {
    it('debe manejar valores típicos de Madrid correctamente', () => {
      // Caso 18: Calibración datos reales - Centro vs periferia
      // Centro Madrid: renta ~35k€, alquiler ~25€/m²
      const rentaCentro = normalizeMetric('rentaMediaPersona', 35000);
      const alquilerCentro = normalizeMetric('precioAlquilerM2', 25);
      
      expect(rentaCentro).toBeCloseTo(0.7, 1); // ~0.7
      expect(alquilerCentro).toBeCloseTo(0.83, 2); // ~0.83
      
      // Periferia: renta ~22k€, alquiler ~12€/m²
      const rentaPeriferia = normalizeMetric('rentaMediaPersona', 22000);
      const alquilerPeriferia = normalizeMetric('precioAlquilerM2', 12);
      
      expect(rentaPeriferia).toBeCloseTo(0.44, 2); // ~0.44
      expect(alquilerPeriferia).toBeCloseTo(0.4, 1); // ~0.4
    });

    it('debe discriminar bien entre distritos extremos', () => {
      // Caso 19: Diferenciación significativa - Chamberí vs Villaverde
      const rentaChamberi = normalizeMetric('rentaMediaPersona', 45000);
      const rentaVillaverde = normalizeMetric('rentaMediaPersona', 18000);
      
      const diferencia = rentaChamberi - rentaVillaverde;
      expect(diferencia).toBeGreaterThan(0.5); // Diferencia >0.5
    });
  });
});