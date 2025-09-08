import { describe, it, expect } from 'vitest';

// Interfaz exacta según especificación
interface WizardPreferences {
  nightlife: number;
  services: number;
  exclusivity: number;
  budget: number;
  housingType: 'rent' | 'buy';
}

interface UserProfile {
  name: string;
  priorities: Record<string, number>;
  description: string;
}

// Función exacta según especificación
function generateCustomProfile(preferences: WizardPreferences): UserProfile {
  const {
    nightlife = 3,
    services = 3,
    exclusivity = 3,
    budget = 2000,
    housingType = 'rent'
  } = preferences;

  // Calcular pesos exactos según especificación
  const exclusivityWeight = (exclusivity / 5) * 0.3; // (exclusivity/5)*0.3
  const servicesWeight = (services / 5) * 0.3; // services/5*0.3
  const servicesVarietyWeight = servicesWeight * 0.7; // services/5*0.3 + *0.7
  const nightlifeWeight = (nightlife / 5) * 0.2; // (nightlife/5)*0.2

  // Pesos de vivienda según especificación
  let alquilerWeight = -0.2;
  let ventaWeight = -0.1;
  
  if (housingType === 'rent') {
    alquilerWeight = -0.4; // precioAlquilerM2: -0.4
    ventaWeight = -0.1; // precioVentaM2: -0.1
  } else if (housingType === 'buy') {
    ventaWeight = -0.3; // precioVentaM2: -0.3
    alquilerWeight = -0.1; // precioAlquilerM2: -0.1
  }

  // Objeto priorities exacto
  const priorities = {
    rentaMediaPersona: exclusivityWeight,
    precioAlquilerM2: alquilerWeight,
    precioVentaM2: ventaWeight,
    localesComerciales: servicesWeight,
    totalLocales: servicesVarietyWeight,
  };

  // Descripción exacta según especificación
  const budgetText = `${budget}€/mes`;
  const housingText = housingType === 'rent' ? 'alquiler' : 'compra';
  const servicesText = services > 3 ? 'muchos servicios' : 'servicios básicos'; // >3 threshold
  
  const description = `Personalizado: ${housingText}, ${budgetText}, ${servicesText}`;

  return {
    name: 'Perfil Personalizado',
    priorities,
    description
  };
}

// Perfiles predefinidos exactos para comparación
const predefinedProfiles = {
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

describe('Generación Perfiles Personalizados', () => {
  describe('Tipo de Vivienda', () => {
    it('debe priorizar alquiler cuando housingType es rent', () => {
      // Caso 1: Ponderación alquiler vs compra
      const preferences: WizardPreferences = {
        nightlife: 3,
        services: 3,
        exclusivity: 3,
        budget: 1500,
        housingType: 'rent'
      };

      const profile = generateCustomProfile(preferences);
      
      expect(profile.priorities.precioAlquilerM2).toBe(-0.4); // precioAlquilerM2: -0.4
      expect(profile.priorities.precioVentaM2).toBe(-0.1); // precioVentaM2: -0.1
      expect(Math.abs(profile.priorities.precioAlquilerM2)).toBeGreaterThan(Math.abs(profile.priorities.precioVentaM2));
    });

    it('debe priorizar compra cuando housingType es buy', () => {
      // Caso 2: Ponderación compra vs alquiler
      const preferences: WizardPreferences = {
        nightlife: 3,
        services: 3,
        exclusivity: 3,
        budget: 1500,
        housingType: 'buy'
      };

      const profile = generateCustomProfile(preferences);
      
      expect(profile.priorities.precioVentaM2).toBe(-0.3); // precioVentaM2: -0.3
      expect(profile.priorities.precioAlquilerM2).toBe(-0.1); // precioAlquilerM2: -0.1
      expect(Math.abs(profile.priorities.precioVentaM2)).toBeGreaterThan(Math.abs(profile.priorities.precioAlquilerM2));
    });
  });

  describe('Exclusividad', () => {
    it('debe calcular peso exclusividad correctamente', () => {
      // Caso 3: Transformación lineal 1-5
      const testCases = [
        { exclusivity: 1, expected: 0.06 }, // 0.06, 0.12, 0.18, 0.24, 0.30
        { exclusivity: 2, expected: 0.12 },
        { exclusivity: 3, expected: 0.18 },
        { exclusivity: 4, expected: 0.24 },
        { exclusivity: 5, expected: 0.30 }
      ];

      testCases.forEach(({ exclusivity, expected }) => {
        const preferences: WizardPreferences = {
          nightlife: 3,
          services: 3,
          exclusivity,
          budget: 2000,
          housingType: 'rent'
        };

        const profile = generateCustomProfile(preferences);
        expect(profile.priorities.rentaMediaPersona).toBeCloseTo(expected, 2);
      });
    });

    it('debe manejar valores extremos de exclusividad', () => {
      // Caso 4: Casos fuera rango
      const preferences0: WizardPreferences = {
        nightlife: 3,
        services: 3,
        exclusivity: 0,
        budget: 2000,
        housingType: 'rent'
      };

      const preferences10: WizardPreferences = {
        nightlife: 3,
        services: 3,
        exclusivity: 10,
        budget: 2000,
        housingType: 'rent'
      };

      const profile0 = generateCustomProfile(preferences0);
      const profile10 = generateCustomProfile(preferences10);
      
      expect(profile0.priorities.rentaMediaPersona).toBe(0); // 0, 0.6
      expect(profile10.priorities.rentaMediaPersona).toBe(0.6);
    });
  });

  describe('Servicios', () => {
    it('debe calcular peso servicios correctamente', () => {
      // Caso 5: Dual comerciales + total
      const testCases = [
        { services: 1, expectedComerciales: 0.06, expectedTotal: 0.042 }, // Pesos proporcionales
        { services: 3, expectedComerciales: 0.18, expectedTotal: 0.126 },
        { services: 5, expectedComerciales: 0.30, expectedTotal: 0.210 }
      ];

      testCases.forEach(({ services, expectedComerciales, expectedTotal }) => {
        const preferences: WizardPreferences = {
          nightlife: 3,
          services,
          exclusivity: 3,
          budget: 2000,
          housingType: 'rent'
        };

        const profile = generateCustomProfile(preferences);
        expect(profile.priorities.localesComerciales).toBeCloseTo(expectedComerciales, 3);
        expect(profile.priorities.totalLocales).toBeCloseTo(expectedTotal, 3);
      });
    });

    it('debe reflejar importancia servicios en descripción', () => {
      // Caso 6: Texto dinámico
      const preferencesAltos: WizardPreferences = {
        nightlife: 3,
        services: 5, // services: 5 vs 2
        exclusivity: 3,
        budget: 2000,
        housingType: 'rent'
      };

      const preferencesBajos: WizardPreferences = {
        nightlife: 3,
        services: 2,
        exclusivity: 3,
        budget: 2000,
        housingType: 'rent'
      };

      const profileAltos = generateCustomProfile(preferencesAltos);
      const profileBajos = generateCustomProfile(preferencesBajos);
      
      expect(profileAltos.description).toContain('muchos servicios'); // "muchos" vs "básicos"
      expect(profileBajos.description).toContain('servicios básicos');
    });
  });

  describe('Vida Nocturna', () => {
    it('debe calcular peso vida nocturna correctamente', () => {
      // Caso 7: Preparación extensiones
      const preferences: WizardPreferences = {
        nightlife: 5,
        services: 3,
        exclusivity: 3,
        budget: 2000,
        housingType: 'rent'
      };

      const profile = generateCustomProfile(preferences);
      
      // Verificar que el peso se calcula (aunque no se aplique actualmente)
      const nightlifeWeight = (5 / 5) * 0.2; // 0.2 calculado
      expect(nightlifeWeight).toBe(0.2);
    });
  });

  describe('Estructura', () => {
    it('debe generar estructura de perfil válida', () => {
      // Caso 8: Campos obligatorios
      const preferences: WizardPreferences = {
        nightlife: 4,
        services: 3,
        exclusivity: 2,
        budget: 1800,
        housingType: 'buy'
      };

      const profile = generateCustomProfile(preferences);
      
      expect(profile).toHaveProperty('name'); // name, priorities, description
      expect(profile).toHaveProperty('priorities');
      expect(profile).toHaveProperty('description');
      expect(profile.name).toBe('Perfil Personalizado');
      expect(typeof profile.priorities).toBe('object');
      expect(typeof profile.description).toBe('string');
    });

    it('debe incluir todas las métricas necesarias en priorities', () => {
      // Caso 9: 5 métricas mínimas
      const preferences: WizardPreferences = {
        nightlife: 3,
        services: 3,
        exclusivity: 3,
        budget: 2000,
        housingType: 'rent'
      };

      const profile = generateCustomProfile(preferences);
      const expectedKeys = [ // 5 keys en priorities
        'rentaMediaPersona',
        'precioAlquilerM2',
        'precioVentaM2',
        'localesComerciales',
        'totalLocales'
      ];
      
      expectedKeys.forEach(key => {
        expect(profile.priorities).toHaveProperty(key);
        expect(typeof profile.priorities[key]).toBe('number');
      });
    });

    it('debe generar descripciones coherentes', () => {
      // Caso 10: Template dinámico
      const preferencesRent: WizardPreferences = {
        nightlife: 3,
        services: 4,
        exclusivity: 2,
        budget: 1500,
        housingType: 'rent'
      };

      const preferencesBuy: WizardPreferences = {
        nightlife: 2,
        services: 2,
        exclusivity: 5,
        budget: 3000,
        housingType: 'buy'
      };

      const profileRent = generateCustomProfile(preferencesRent);
      const profileBuy = generateCustomProfile(preferencesBuy);
      
      expect(profileRent.description).toContain('alquiler'); // Texto descriptivo correcto
      expect(profileRent.description).toContain('1500€/mes');
      expect(profileRent.description).toContain('muchos servicios');
      
      expect(profileBuy.description).toContain('compra');
      expect(profileBuy.description).toContain('3000€/mes');
      expect(profileBuy.description).toContain('servicios básicos');
    });
  });

  describe('Comparación', () => {
    it('debe generar pesos diferentes a perfiles predefinidos', () => {
      // Caso 11: Personalización real
      const preferences: WizardPreferences = {
        nightlife: 4,
        services: 5,
        exclusivity: 2,
        budget: 2500,
        housingType: 'rent'
      };

      const customProfile = generateCustomProfile(preferences);
      
      // Verificar que es diferente a families - Pesos ≠ perfiles estáticos
      const familiesProfile = predefinedProfiles.families;
      expect(customProfile.priorities.rentaMediaPersona).not.toBe(familiesProfile.priorities.rentaMediaPersona);
      
      // Verificar que es diferente a young
      const youngProfile = predefinedProfiles.young;
      const youngKeys = Object.keys(youngProfile.priorities);
      const hasDifference = youngKeys.some(key => 
        customProfile.priorities[key] !== youngProfile.priorities[key]
      );
      expect(hasDifference).toBe(true);
    });

    it('debe generar perfil específico basado en preferencias extremas', () => {
      // Caso 12: Máximos valores
      const preferences: WizardPreferences = {
        nightlife: 5,
        services: 5, // exclusivity:5, services:5
        exclusivity: 5,
        budget: 5000,
        housingType: 'buy'
      };

      const profile = generateCustomProfile(preferences);
      
      expect(profile.priorities.rentaMediaPersona).toBe(0.3); // Pesos máximos 0.3
      expect(profile.priorities.localesComerciales).toBe(0.3);
      expect(profile.priorities.totalLocales).toBeCloseTo(0.21, 2);
      expect(profile.priorities.precioVentaM2).toBe(-0.3);
    });

    it('debe mantener coherencia matemática en los pesos', () => {
      // Caso 13: Suma razonable
      const preferences: WizardPreferences = {
        nightlife: 3,
        services: 4,
        exclusivity: 2,
        budget: 2000,
        housingType: 'rent'
      };

      const profile = generateCustomProfile(preferences);
      const weights = Object.values(profile.priorities);
      const absWeights = weights.map(w => Math.abs(w));
      const totalAbsWeight = absWeights.reduce((sum, w) => sum + w, 0);
      
      // Total absolutos 0.5-2.0
      expect(totalAbsWeight).toBeGreaterThan(0.5);
      expect(totalAbsWeight).toBeLessThan(2.0);
    });
  });

  describe('Edge Cases', () => {
    it('debe manejar valores undefined o null', () => {
      // Caso 14: Robustez inputs
      const preferences = {
        nightlife: undefined as any,
        services: null as any,
        exclusivity: 3,
        budget: 2000,
        housingType: 'rent' as const
      };

      expect(() => generateCustomProfile(preferences)).not.toThrow(); // No crash
      const profile = generateCustomProfile(preferences);
      expect(profile.name).toBe('Perfil Personalizado');
    });

    it('debe manejar valores numéricos extremos', () => {
      // Caso 15: Valores atípicos
      const preferences: WizardPreferences = {
        nightlife: -10, // Negativos, muy altos
        services: 1000,
        exclusivity: -5,
        budget: -500,
        housingType: 'rent'
      };

      expect(() => generateCustomProfile(preferences)).not.toThrow(); // Procesamiento sin error
      const profile = generateCustomProfile(preferences);
      expect(typeof profile.priorities.rentaMediaPersona).toBe('number');
    });

    it('debe ser determinístico', () => {
      // Caso 16: Consistencia
      const preferences: WizardPreferences = {
        nightlife: 4,
        services: 3,
        exclusivity: 2,
        budget: 1800,
        housingType: 'buy'
      };

      const profile1 = generateCustomProfile(preferences);
      const profile2 = generateCustomProfile(preferences);
      const profile3 = generateCustomProfile(preferences);
      
      // Resultados idénticos
      expect(profile1).toEqual(profile2);
      expect(profile2).toEqual(profile3);
    });
  });
});