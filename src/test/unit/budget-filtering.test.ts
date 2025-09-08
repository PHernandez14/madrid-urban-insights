import { describe, it, expect } from 'vitest';

// Funciones exactas según especificación
function getBudgetSegment(budget: number): string {
  if (budget < 1500) return 'low';
  if (budget < 2500) return 'medium';
  return 'high';
}

function calculateMonthlyCost(pricePerM2: number, housingType: 'rent' | 'buy', sizeMm2: number = 50): number {
  if (!pricePerM2 || pricePerM2 <= 0) return 0;
  
  if (housingType === 'rent') {
    return pricePerM2 * sizeMm2; // Multiplicación × 50m²
  } else {
    return (pricePerM2 * sizeMm2) / 300; // División ÷ 300 (25 años)
  }
}

function filterByBudget(districts: any[], budget: number, housingType: 'rent' | 'buy' = 'rent') {
  return districts.map(district => {
    const price = housingType === 'rent' ? district.precioAlquilerM2 : district.precioVentaM2;
    const monthlyPrice = calculateMonthlyCost(price, housingType);
    const isAffordable = monthlyPrice === 0 || monthlyPrice <= budget;
    const budgetPercentage = Math.min((budget / (monthlyPrice || 1)) * 100, 200);
    
    return {
      ...district,
      monthlyPrice,
      isAffordable,
      budgetPercentage
    };
  });
}

function calculateScoreWithBudgetFilter(district: any, profile: any, budget: number): number {
  if (!district.isAffordable) {
    return 0; // !isAffordable → 0
  }
  
  let baseScore = 5;
  const budgetSegment = getBudgetSegment(budget);
  
  if (budgetSegment === 'low') {
    // Bonus eficiencia presupuestaria - FALLO ESPERADO: 4.33 < 5
    if (district.budgetPercentage > 150) {
      baseScore += 1.0;
    }
  } else if (budgetSegment === 'medium') {
    // Bonus value-for-money
    if (district.budgetPercentage > 120 && district.budgetPercentage <= 180) {
      baseScore += 0.5; // +0.5 bonus
    }
  } else if (budgetSegment === 'high') {
    // Bonus premium areas
    if (district.monthlyPrice > 2000) {
      baseScore += 1.5; // +1.5 bonus total
    }
  }
  
  return Math.max(0, Math.min(10, baseScore));
}

// Mock data exacto según especificación
const mockDistricts = [
  {
    name: 'Centro',
    precioAlquilerM2: 25,
    precioVentaM2: 6500,
    rentaMediaPersona: 35000,
    localesComerciales: 800
  },
  {
    name: 'Arganzuela',
    precioAlquilerM2: 18,
    precioVentaM2: 4200,
    rentaMediaPersona: 28000,
    localesComerciales: 450
  },
  {
    name: 'Retiro',
    precioAlquilerM2: 22,
    precioVentaM2: 5800,
    rentaMediaPersona: 40000,
    localesComerciales: 600
  }
];

describe('Filtrado Presupuestario', () => {
  describe('Segmentación Presupuestaria', () => {
    it('debe clasificar presupuestos en segmentos correctos', () => {
      // Caso 1: Categorización automática
      expect(getBudgetSegment(1000)).toBe('low');
      expect(getBudgetSegment(2000)).toBe('medium');
      expect(getBudgetSegment(5000)).toBe('high');
    });

    it('debe manejar casos límite de segmentación', () => {
      // Caso 2: Valores exactos fronteras
      expect(getBudgetSegment(1500)).toBe('medium');
      expect(getBudgetSegment(2500)).toBe('high');
    });
  });

  describe('Cálculo Coste Mensual', () => {
    it('debe calcular coste alquiler correctamente (50m²)', () => {
      // Caso 3: Transformación €/m² → real
      expect(calculateMonthlyCost(25, 'rent')).toBe(1250); // 25€/m² * 50m² = 1250€
      expect(calculateMonthlyCost(18, 'rent')).toBe(900);  // 18€/m² * 50m² = 900€
      expect(calculateMonthlyCost(22, 'rent')).toBe(1100); // 22€/m² * 50m² = 1100€
    });

    it('debe calcular coste compra correctamente (hipoteca)', () => {
      // Caso 4: Aproximación financiación
      expect(calculateMonthlyCost(6500, 'buy')).toBeCloseTo(1083, 0); // 6500€/m² * 50m² ÷ 300 = 1083€ mensual
      expect(calculateMonthlyCost(4200, 'buy')).toBe(700);  // 4200€/m² * 50m² ÷ 300 = 700€ mensual
    });

    it('debe manejar datos faltantes sin errores', () => {
      // Caso 5: Graceful degradation
      expect(calculateMonthlyCost(0, 'rent')).toBe(0); // 0€, isAffordable=true
      expect(calculateMonthlyCost(null as any, 'rent')).toBe(0);
      expect(calculateMonthlyCost(undefined as any, 'buy')).toBe(0);
    });
  });

  describe('Filtrado de Asequibilidad', () => {
    it('debe filtrar correctamente por presupuesto bajo', () => {
      // Caso 6: Filtro eliminatorio estricto
      const budget = 1000;
      const filtered = filterByBudget(mockDistricts, budget, 'rent');
      
      const affordable = filtered.filter(d => d.isAffordable);
      expect(affordable.length).toBe(1); // Solo Arganzuela (900€)
      expect(affordable[0].name).toBe('Arganzuela');
    });

    it('debe filtrar correctamente por presupuesto medio', () => {
      // Caso 7: Flexibilidad clase media
      const budget = 1500;
      const filtered = filterByBudget(mockDistricts, budget, 'rent');
      
      const affordable = filtered.filter(d => d.isAffordable);
      expect(affordable.length).toBe(3); // Todos asequibles
    });

    it('debe filtrar correctamente por presupuesto alto', () => {
      // Caso 8: Sin restricciones, calidad
      const budget = 3000;
      const filtered = filterByBudget(mockDistricts, budget, 'rent');
      
      const affordable = filtered.filter(d => d.isAffordable);
      expect(affordable.length).toBe(3); // Todos + foco premium
    });
  });

  describe('Cálculo Porcentaje Presupuesto', () => {
    it('debe calcular porcentaje de presupuesto usado correctamente', () => {
      // Caso 9: Fórmula eficiencia
      const budget = 1200;
      const filtered = filterByBudget(mockDistricts, budget, 'rent');
      
      const arganzuela = filtered.find(d => d.name === 'Arganzuela');
      expect(arganzuela?.budgetPercentage).toBeCloseTo(133.33, 1); // (budget/cost)*100
    });

    it('debe aplicar cap de 200% al porcentaje presupuesto', () => {
      // Caso 10: Prevención distorsiones
      const budget = 5000;
      const filtered = filterByBudget(mockDistricts, budget, 'rent');
      
      const arganzuela = filtered.find(d => d.name === 'Arganzuela');
      expect(arganzuela?.budgetPercentage).toBe(200); // Math.min(%, 200)
    });
  });

  describe('Scoring con Filtrado Presupuestario', () => {
    it('debe asignar score 0 a distritos no asequibles', () => {
      // Caso 11: Eliminación automática
      const budget = 800;
      const filtered = filterByBudget(mockDistricts, budget, 'rent');
      const distrito = filtered.find(d => d.name === 'Centro'); // No asequible
      
      const score = calculateScoreWithBudgetFilter(distrito!, {}, budget);
      expect(score).toBe(0); // score = 0
    });

    it('debe aplicar bonus eficiencia para presupuesto bajo', () => {
      // Caso 12: Premio uso eficiente - FALLO ESPERADO: 4.33 < 5
      const budget = 1200;
      const filtered = filterByBudget(mockDistricts, budget, 'rent');
      const distrito = filtered.find(d => d.name === 'Arganzuela');
      
      const score = calculateScoreWithBudgetFilter(distrito!, {}, budget);
      expect(score).toBeGreaterThan(5); // score > 5
    });

    it('debe aplicar bonus value-for-money para presupuesto medio', () => {
      // Caso 13: Bonus <80% presupuesto
      const budget = 1500;
      const filtered = filterByBudget(mockDistricts, budget, 'rent');
      const distrito = filtered.find(d => d.name === 'Arganzuela');
      
      const score = calculateScoreWithBudgetFilter(distrito!, {}, budget);
      expect(score).toBeGreaterThan(5); // +0.5 bonus
    });

    it('debe aplicar bonus premium para presupuesto alto', () => {
      // Caso 14: Bonus zonas premium
      const budget = 3000;
      const filtered = filterByBudget(mockDistricts, budget, 'rent');
      const distrito = filtered.find(d => d.name === 'Centro'); // >2500€ zona cara
      
      const score = calculateScoreWithBudgetFilter(distrito!, {}, budget);
      expect(score).toBeGreaterThan(6); // +1.5 bonus total
    });
  });

  describe('Casos Extremos', () => {
    it('debe manejar presupuesto cero', () => {
      // Caso 15: Caso límite inferior
      const budget = 0;
      const filtered = filterByBudget(mockDistricts, budget, 'rent');
      
      const affordable = filtered.filter(d => d.isAffordable);
      expect(affordable.length).toBe(0); // Ninguno asequible
    });

    it('debe manejar presupuesto infinito', () => {
      // Caso 16: Caso límite superior
      const budget = Infinity;
      const filtered = filterByBudget(mockDistricts, budget, 'rent');
      
      const affordable = filtered.filter(d => d.isAffordable);
      expect(affordable.length).toBe(3); // Todos asequibles
    });

    it('debe ser consistente entre tipo alquiler y compra', () => {
      // Caso 17: Coherencia modalidades
      const budget = 1500;
      const filteredRent = filterByBudget(mockDistricts, budget, 'rent');
      const filteredBuy = filterByBudget(mockDistricts, budget, 'buy');
      
      expect(filteredRent.length).toBe(filteredBuy.length); // Estructura igual
      // Precios diferentes pero estructura igual
      expect(filteredRent[0].monthlyPrice).not.toBe(filteredBuy[0].monthlyPrice); // precios ≠
    });
  });
});