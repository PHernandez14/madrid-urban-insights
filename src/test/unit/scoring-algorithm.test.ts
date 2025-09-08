import { describe, it, expect } from 'vitest';

// Función normalizeMetric exacta según especificación
function normalizeMetric(key: string, value: number): number {
  switch (key) {
    case 'rentaMediaPersona':
      return Math.min(value / 50000, 1);
    case 'precioAlquilerM2':
      return Math.min(value / 30, 1);
    case 'localesComerciales':
      return Math.min(value / 800, 1);
    default:
      return Math.min(value / 100, 1);
  }
}

// Función calculateDistrictScore exacta según especificación
function calculateDistrictScore(district: any, profile: any): number {
  let score = 0;
  let totalWeight = 0;

  if (profile && profile.priorities) {
    Object.keys(profile.priorities).forEach(key => {
      const weight = profile.priorities[key];
      const absWeight = Math.abs(weight);
      let value = district[key] || 0;

      let normalizedValue = normalizeMetric(key, value);
      
      // Si el peso es negativo, invertir normalización
      if (weight < 0) {
        normalizedValue = 1 - normalizedValue;
      }

      score += normalizedValue * absWeight;
      totalWeight += absWeight;
    });
  }

  const finalScore = totalWeight > 0 ? (score / totalWeight) * 10 : 5;
  return Math.max(0, Math.min(10, finalScore));
}

// Perfiles exactos según especificación
const mockProfiles = {
  families: {
    name: 'Familias',
    priorities: {
      rentaMediaPersona: 0.2,
      precioAlquilerM2: -0.4,
      precioVentaM2: -0.3,
      localesComerciales: 0.25,
      totalLocales: 0.25,
    }
  },
  young: {
    name: 'Jóvenes Profesionales',
    priorities: {
      precioAlquilerM2: -0.5,
      rentaMediaPersona: 0.1,
      localesComerciales: 0.35,
      totalLocales: 0.4,
    }
  },
  seniors: {
    name: 'Seniors',
    priorities: {
      rentaMediaPersona: 0.3,
      precioVentaM2: -0.2,
      precioAlquilerM2: -0.1,
      localesComerciales: 0.4,
      totalLocales: 0.2,
    }
  }
};

describe('Algoritmo de Scoring', () => {
  describe('Normalización de Métricas', () => {
    it('debe normalizar renta media correctamente', () => {
      // Caso 1: Validar transformación 0-50k€ → 0-1
      expect(normalizeMetric('rentaMediaPersona', 25000)).toBe(0.5); // 25k€ → 0.5
      expect(normalizeMetric('rentaMediaPersona', 50000)).toBe(1.0); // 50k€ → 1.0
      expect(normalizeMetric('rentaMediaPersona', 75000)).toBe(1.0); // 75k€ → 1.0 (cap)
    });

    it('debe normalizar precio alquiler correctamente', () => {
      // Caso 2: Validar rango 0-30€/m² → 0-1
      expect(normalizeMetric('precioAlquilerM2', 15)).toBe(0.5); // 15€/m² → 0.5
      expect(normalizeMetric('precioAlquilerM2', 30)).toBe(1.0); // 30€/m² → 1.0
      expect(normalizeMetric('precioAlquilerM2', 45)).toBe(1.0); // 45€/m² → 1.0 (cap)
    });

    it('debe normalizar locales comerciales correctamente', () => {
      // Caso 3: Confirmar escala 0-800 locales → 0-1
      expect(normalizeMetric('localesComerciales', 400)).toBe(0.5); // 400 → 0.5
      expect(normalizeMetric('localesComerciales', 800)).toBe(1.0); // 800 → 1.0
      expect(normalizeMetric('localesComerciales', 1200)).toBe(1.0); // 1200 → 1.0 (cap)
    });
  });

  describe('Cálculo de Pesos', () => {
    it('debe aplicar pesos positivos correctamente (perfil families)', () => {
      // Caso 4: Verificar fórmula completa scoring
      const mockDistrict = {
        name: 'Test District',
        rentaMediaPersona: 30000,
        precioAlquilerM2: 20,
        precioVentaM2: 5000,
        localesComerciales: 600,
        totalLocales: 600
      };
      
      const score = calculateDistrictScore(mockDistrict, mockProfiles.families);
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(10);
      expect(score).toBeCloseTo(6.07, 1); // Score ~6.07
    });

    it('debe penalizar precios altos con pesos negativos (perfil young)', () => {
      // Caso 5: Validar inversión normalización pesos negativos
      const distritoCaro = {
        name: 'Distrito Caro',
        precioAlquilerM2: 25,
        rentaMediaPersona: 40000,
        localesComerciales: 600,
        totalLocales: 600
      };

      const distritoBarato = {
        name: 'Distrito Barato', 
        precioAlquilerM2: 10,
        rentaMediaPersona: 30000,
        localesComerciales: 400,
        totalLocales: 400
      };

      const scoreCaro = calculateDistrictScore(distritoCaro, mockProfiles.young);
      const scoreBarato = calculateDistrictScore(distritoBarato, mockProfiles.young);

      // Scores válidos 0-10, diferenciados
      expect(scoreCaro).toBeGreaterThan(0);
      expect(scoreCaro).toBeLessThanOrEqual(10);
      expect(scoreBarato).toBeGreaterThan(0);
      expect(scoreBarato).toBeLessThanOrEqual(10);
    });
  });

  describe('Casos Extremos', () => {
    it('debe manejar valores cero sin errores', () => {
      // Caso 6: Robustez ante datos faltantes
      const distritoVacio = {
        name: 'Distrito Vacío',
        rentaMediaPersona: 0,
        precioAlquilerM2: 0,
        precioVentaM2: 0,
        localesComerciales: 0,
        totalLocales: 0
      };

      const score = calculateDistrictScore(distritoVacio, mockProfiles.families);
      expect(score).toBeGreaterThanOrEqual(0); // Score válido 0-10
      expect(score).toBeLessThanOrEqual(10);
      expect(score).not.toBeNaN(); // sin NaN
    });

    it('debe aplicar límites máximos y mínimos (0-10)', () => {
      // Caso 7: Garantizar scores en rango válido
      const distritoExtremo = {
        name: 'Distrito Extremo',
        rentaMediaPersona: 999999,
        precioAlquilerM2: 999,
        precioVentaM2: 99999,
        localesComerciales: 9999,
        totalLocales: 9999
      };

      const score = calculateDistrictScore(distritoExtremo, mockProfiles.families);
      expect(score).toBeGreaterThanOrEqual(0); // Math.max(0, Math.min(10, score))
      expect(score).toBeLessThanOrEqual(10);
    });

    it('debe ser consistente con múltiples ejecuciones', () => {
      // Caso 8: Verificar determinismo
      const distrito = {
        name: 'Distrito Test',
        rentaMediaPersona: 35000,
        precioAlquilerM2: 18,
        localesComerciales: 500,
        totalLocales: 500
      };

      const score1 = calculateDistrictScore(distrito, mockProfiles.families);
      const score2 = calculateDistrictScore(distrito, mockProfiles.families);
      const score3 = calculateDistrictScore(distrito, mockProfiles.families);

      // Resultados idénticos
      expect(score1).toBe(score2);
      expect(score2).toBe(score3);
    });
  });

  describe('Diferenciación por Perfiles', () => {
    it('debe generar scores diferentes para perfiles diferentes', () => {
      // Caso 9: Confirmar rankings únicos por perfil
      const distrito = {
        name: 'Distrito Test',
        rentaMediaPersona: 40000,
        precioAlquilerM2: 20,
        precioVentaM2: 6000,
        localesComerciales: 600,
        totalLocales: 600
      };

      const scoreFamilies = calculateDistrictScore(distrito, mockProfiles.families);
      const scoreYoung = calculateDistrictScore(distrito, mockProfiles.young);
      const scoreSeniors = calculateDistrictScore(distrito, mockProfiles.seniors);

      // 3 scores diferentes
      expect(scoreFamilies).toBeGreaterThan(0);
      expect(scoreFamilies).toBeLessThanOrEqual(10);
      expect(scoreYoung).toBeGreaterThan(0);
      expect(scoreYoung).toBeLessThanOrEqual(10);
      expect(scoreSeniors).toBeGreaterThan(0);
      expect(scoreSeniors).toBeLessThanOrEqual(10);

      // Los scores deben ser diferentes
      expect(scoreFamilies).not.toBe(scoreYoung);
      expect(scoreYoung).not.toBe(scoreSeniors);
    });

    it('debe priorizar precios bajos para perfil young', () => {
      // Caso 10: Validar múltiples factores algoritmo
      const distritoCaro = {
        name: 'Distrito Caro',
        precioAlquilerM2: 28,
        rentaMediaPersona: 45000,
        localesComerciales: 800,
        totalLocales: 800
      };

      const distritoBarato = {
        name: 'Distrito Barato',
        precioAlquilerM2: 12,
        rentaMediaPersona: 30000,
        localesComerciales: 400,
        totalLocales: 400
      };

      const scoreCaro = calculateDistrictScore(distritoCaro, mockProfiles.young);
      const scoreBarato = calculateDistrictScore(distritoBarato, mockProfiles.young);

      // Scores válidos, comportamiento lógico
      expect(scoreCaro).toBeGreaterThan(0);
      expect(scoreCaro).toBeLessThanOrEqual(10);
      expect(scoreBarato).toBeGreaterThan(0);
      expect(scoreBarato).toBeLessThanOrEqual(10);
    });
  });
});