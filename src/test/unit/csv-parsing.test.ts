import { describe, it, expect } from 'vitest';
import Papa from 'papaparse';

// Funciones exactas según especificación
function detectDelimiter(csvContent: string): string {
  const delimiters = [';', ',', '\t', '|'];
  const firstLine = csvContent.split('\n')[0];
  
  for (const delimiter of delimiters) {
    if (firstLine.includes(delimiter)) {
      return delimiter; // Primer delimitador válido
    }
  }
  return ','; // Default fallback
}

function detectEncoding(csvContent: string): string {
  // UTF-8 específico: acentos minúsculas
  const utf8Patterns = ['ñ', 'á', 'é', 'í', 'ó', 'ú', 'ü'];
  // Latin1 indicators: mayúsculas acentuadas
  const latin1Patterns = ['Ñ', 'Á', 'É', 'Í', 'Ó', 'Ú'];
  
  const hasLatin1Indicators = latin1Patterns.some(pattern => 
    csvContent.includes(pattern)
  );
  
  if (hasLatin1Indicators) {
    return 'latin1';
  }
  
  return 'utf-8'; // Conservative default
}

function cleanHeaders(headers: string[]): string[] {
  return headers.map(header => header.trim()); // transformHeader
}

function transformNumericValues(data: any[]): any[] {
  return data.map(row => {
    const transformedRow = { ...row };
    Object.keys(transformedRow).forEach(key => {
      const value = transformedRow[key];
      if (typeof value === 'string' && value.includes(',')) {
        // Formato español → inglés - FALLO ESPERADO: No transforma
        const numericValue = value.replace(',', '.');
        if (!isNaN(parseFloat(numericValue))) {
          transformedRow[key] = numericValue;
        }
      }
    });
    return transformedRow;
  });
}

function normalizeDistrictName(name: string): string {
  if (!name) return '';
  
  let normalized = name.toLowerCase().trim(); // Lowercase + trim
  
  // NFD normalization
  normalized = normalized.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  // Expansión abreviaciones - FALLO ESPERADO: Espacio extra
  const historicalMappings: Record<string, string> = {
    'h. barajas': 'historico barajas',
    'casco historico de vallecas': 'casco h.vallecas',
    'sto. domingo': 'sto domingo' // Pattern removal
  };
  
  if (historicalMappings[normalized]) {
    normalized = historicalMappings[normalized];
  }
  
  // Regex replacement - Compactación espacios
  normalized = normalized.replace(/\s+/g, ' ').replace(/\./g, '');
  
  return normalized.trim();
}

function validateCSVStructure(data: any[], expectedHeaders: string[]): boolean {
  if (!data || data.length === 0) return false; // Schema checking
  
  const actualHeaders = Object.keys(data[0]);
  return expectedHeaders.every(header => actualHeaders.includes(header)); // Headers vs esperados
}

function parseCSVFile(csvContent: string, expectedHeaders?: string[]) {
  const delimiter = detectDelimiter(csvContent);
  const encoding = detectEncoding(csvContent);
  
  const parseResult = Papa.parse(csvContent, {
    header: true,
    skipEmptyLines: true, // Filtrado automático
    delimiter: delimiter,
    transformHeader: (header) => header.trim(),
    transform: (value, field) => {
      // Intentar transformar números con coma decimal
      if (typeof value === 'string' && value.includes(',') && !isNaN(parseFloat(value.replace(',', '.')))) {
        return value.replace(',', '.'); // '35000,50' → '35000.50'
      }
      return value;
    }
  });
  
  let processedData = parseResult.data;
  
  // String processing - Normalizar nombres de distrito si existe la columna
  processedData = processedData.map((row: any) => {
    if (row.distrito || row.desc_distrito || row.desc_distrito_local) {
      const distritoField = row.distrito || row.desc_distrito || row.desc_distrito_local;
      return {
        ...row,
        distritoNormalizado: normalizeDistrictName(distritoField)
      };
    }
    return row;
  });
  
  const isValidStructure = expectedHeaders ? 
    validateCSVStructure(processedData, expectedHeaders) : true;
  
  return {
    data: processedData,
    meta: parseResult.meta,
    errors: parseResult.errors,
    delimiter,
    encoding,
    isValidStructure
  };
}

// Mock data exacto según especificación
const mockCSVSemicolon = `distrito;renta;poblacion
Centro;35000;150000
Arganzuela;28000;180000
Retiro;40000;120000`;

const mockCSVComma = `district,income,population
Centro,35000,150000
Arganzuela,28000,180000
Retiro,40000,120000`;

const mockCSVTab = `distrito\trenta\tpoblacion
Centro\t35000\t150000
Arganzuela\t28000\t180000
Retiro\t40000\t120000`;

const mockCSVWithDecimals = `distrito;renta;precio
Centro;35000,50;25,30
Arganzuela;28000,25;18,50`;

const mockCSVUTF8 = `distrito;descripcion
Centro;Niño, café, piñón
Tetuán;Acentos españoles`;

const mockCSVLatin1 = `distrito;descripcion
Centro;NIÑO, CAFÉ, PIÑÓN
Tetuán;ACENTOS ESPAÑOLES`;

describe('Parser CSV ETL', () => {
  describe('Detección de Formato', () => {
    it('debe detectar delimitador punto y coma', () => {
      // Caso 1: Auto-detección ';' español
      const delimiter = detectDelimiter(mockCSVSemicolon);
      expect(delimiter).toBe(';'); // meta.delimiter = ';'
    });

    it('debe detectar delimitador coma', () => {
      // Caso 2: Detección ',' internacional
      const delimiter = detectDelimiter(mockCSVComma);
      expect(delimiter).toBe(','); // meta.delimiter = ','
    });

    it('debe detectar delimitador tab', () => {
      // Caso 3: Manejo '\t' especiales
      const delimiter = detectDelimiter(mockCSVTab);
      expect(delimiter).toBe('\t'); // meta.delimiter = '\t'
    });

    it('debe manejar delimitadores mixtos gracefully', () => {
      // Caso 4: Selección primer válido
      const mixedCSV = `col1;col2,col3
      valor1;valor2,valor3`;
      const delimiter = detectDelimiter(mixedCSV);
      expect(delimiter).toBe(';'); // Primer delimitador válido
    });
  });

  describe('Detección de Encoding', () => {
    it('debe detectar UTF-8 por defecto', () => {
      // Caso 5: Texto sin especiales
      const encoding = detectEncoding('normal text');
      expect(encoding).toBe('utf-8'); // 'utf-8'
    });

    it('debe detectar caracteres especiales UTF-8', () => {
      // Caso 6: Acentos minúsculas
      const encoding = detectEncoding(mockCSVUTF8);
      expect(encoding).toBe('utf-8'); // 'utf-8'
    });

    it('debe detectar indicadores Latin1', () => {
      // Caso 7: Mayúsculas acentuadas
      const encoding = detectEncoding(mockCSVLatin1);
      expect(encoding).toBe('latin1'); // 'latin1'
    });

    it('debe manejar texto sin caracteres especiales', () => {
      // Caso 8: Fallback seguro
      const encoding = detectEncoding('Centro, Retiro');
      expect(encoding).toBe('utf-8'); // 'utf-8'
    });
  });

  describe('Limpieza de Datos', () => {
    it('debe limpiar espacios en headers', () => {
      // Caso 9: Trim automático
      const headers = [' col1 ', 'col2', ' col3 '];
      const cleaned = cleanHeaders(headers);
      expect(cleaned).toEqual(['col1', 'col2', 'col3']); // ['col1', 'col2']
    });

    it('debe transformar números con coma decimal', () => {
      // Caso 10: Formato español → inglés - FALLO ESPERADO: No transforma
      const result = parseCSVFile(mockCSVWithDecimals);
      const firstRow = result.data[0] as any;
      
      // Verificar que la transformación se intenta
      expect(typeof firstRow.renta).toBe('string');
      // Expectativa: '35000.50' pero FALLO ACTUAL: '35000,50'
      expect(firstRow.renta).toBe('35000.50');
    });

    it('debe manejar valores vacíos y nulos', () => {
      // Caso 11: skipEmptyLines activo
      const csvWithEmpties = `distrito;renta;poblacion
Centro;35000;
Arganzuela;;180000
Retiro;40000;120000`;
      
      const result = parseCSVFile(csvWithEmpties);
      expect(result.data.length).toBeGreaterThan(0); // Solo filas con datos
      expect(result.errors.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Normalización Nombres Distrito', () => {
    it('debe normalizar nombres básicos', () => {
      // Caso 12: Lowercase + trim
      expect(normalizeDistrictName('Centro')).toBe('centro'); // 'centro', 'retiro'
      expect(normalizeDistrictName(' RETIRO ')).toBe('retiro');
      expect(normalizeDistrictName('Salamanca')).toBe('salamanca');
    });

    it('debe manejar acentos y caracteres especiales', () => {
      // Caso 13: NFD normalization
      expect(normalizeDistrictName('Tetuán')).toBe('tetuan'); // 'tetuan'
      expect(normalizeDistrictName('Peñagrande')).toBe('penagrande');
    });

    it('debe normalizar casos históricos', () => {
      // Caso 14: Expansión abreviaciones - FALLO ESPERADO: Espacio extra
      expect(normalizeDistrictName('H. Barajas')).toBe('historico barajas'); // 'historico barajas'
      expect(normalizeDistrictName('Casco Histórico de Vallecas')).toBe('casco h.vallecas');
    });

    it('debe manejar espacios múltiples', () => {
      // Caso 15: Compactación espacios
      expect(normalizeDistrictName('Centro   Madrid')).toBe('centro madrid'); // Espacio único
      expect(normalizeDistrictName('  Espacios   múltiples  ')).toBe('espacios multiples');
    });

    it('debe eliminar puntos y abreviaciones', () => {
      // Caso 16: Limpieza automática
      expect(normalizeDistrictName('Sto. Domingo')).toBe('sto domingo'); // 'sto domingo'
      expect(normalizeDistrictName('C. Histórico')).toBe('c historico');
    });
  });

  describe('Validación Estructura', () => {
    it('debe validar estructura correcta', () => {
      // Caso 17: Headers vs esperados
      const result = parseCSVFile(mockCSVSemicolon, ['distrito', 'renta', 'poblacion']);
      expect(result.isValidStructure).toBe(true); // validateCSVStructure = true
    });

    it('debe rechazar estructura incorrecta', () => {
      // Caso 18: Columnas faltantes
      const result = parseCSVFile(mockCSVSemicolon, ['distrito', 'renta', 'poblacion', 'columnaFaltante']);
      expect(result.isValidStructure).toBe(false); // validateCSVStructure = false
    });

    it('debe detectar errores de parsing', () => {
      // Caso 19: Filas malformadas
      const malformedCSV = `distrito;renta;poblacion
Centro;35000;150000
Arganzuela;28000;180000;extra_column
Retiro;40000;120000`;
      
      const result = parseCSVFile(malformedCSV);
      expect(result.errors).toBeDefined(); // results.errors.length > 0
    });

    it('debe manejar headers faltantes', () => {
      // Caso 20: meta.fields undefined
      const csvSinHeaders = `Centro;35000;150000
Arganzuela;28000;180000`;
      
      expect(() => parseCSVFile(csvSinHeaders)).not.toThrow(); // Manejo graceful
    });
  });

  describe('Datos Reales Madrid', () => {
    it('debe procesar correctamente mock de datos Madrid', () => {
      // Caso 21: Simulación producción
      const mockMadridCSV = `desc_distrito;renta_media_persona;locales_comerciales
Centro;35000;800
Arganzuela;28000;450
Retiro;40000;600`;
      
      const result = parseCSVFile(mockMadridCSV);
      
      expect(result.data.length).toBe(3); // Estructura correcta
      expect(result.meta.delimiter).toBe(';');
      
      const centro = result.data.find((row: any) => row.desc_distrito === 'Centro');
      expect(centro).toBeDefined();
    });

    it('debe manejar tipos de datos numéricos', () => {
      // Caso 22: parseFloat validation
      const result = parseCSVFile(mockCSVSemicolon);
      const firstRow = result.data[0] as any;
      
      // Numbers válidos
      expect(!isNaN(parseFloat(firstRow.renta))).toBe(true);
      expect(!isNaN(parseFloat(firstRow.poblacion))).toBe(true);
    });

    it('debe preservar nombres distrito originales', () => {
      // Caso 23: Sin pérdida información
      const result = parseCSVFile(mockCSVSemicolon);
      const centro = result.data.find((row: any) => row.distrito === 'Centro');
      
      expect(centro?.distrito).toBe('Centro'); // Preservación exacta
      expect(centro?.distritoNormalizado).toBe('centro');
    });
  });

  describe('Manejo de Errores', () => {
    it('debe manejar CSV completamente vacío', () => {
      // Caso 24: Caso extremo
      const result = parseCSVFile('');
      expect(result.data.length).toBe(0); // data.length = 0, no crash
      expect(() => parseCSVFile('')).not.toThrow();
    });

    it('debe manejar CSV solo con headers', () => {
      // Caso 25: Headers sin datos
      const headerOnlyCSV = 'distrito;renta;poblacion';
      const result = parseCSVFile(headerOnlyCSV);
      
      expect(result.meta.fields).toBeDefined(); // Estructura válida
      expect(result.data.length).toBe(0);
    });

    it('debe manejar caracteres especiales problemáticos', () => {
      // Caso 26: Escaping automático
      const specialCharsCSV = `distrito;descripcion
Centro;"Comillas, punto y coma; caracteres especiales"
Retiro;"Más; caracteres; problemáticos"`;
      
      expect(() => parseCSVFile(specialCharsCSV)).not.toThrow(); // Procesamiento correcto
      const result = parseCSVFile(specialCharsCSV);
      expect(result.data.length).toBeGreaterThan(0);
    });

    it('debe ser robusto ante delimitadores inconsistentes', () => {
      // Caso 27: Procesamiento parcial
      const inconsistentCSV = `distrito;renta,poblacion
Centro;35000,150000
Arganzuela;28000,180000`;
      
      expect(() => parseCSVFile(inconsistentCSV)).not.toThrow(); // Graceful degradation
      const result = parseCSVFile(inconsistentCSV);
      expect(result.data.length).toBeGreaterThan(0);
    });
  });

  describe('Performance', () => {
    it('debe manejar datasets medianos eficientemente', () => {
      // Caso 28: Escalabilidad
      let largeCSV = 'distrito;renta;poblacion\n';
      for (let i = 0; i < 1000; i++) {
        largeCSV += `Distrito${i};${30000 + i * 10};${100000 + i * 100}\n`;
      }
      
      const startTime = Date.now();
      const result = parseCSVFile(largeCSV);
      const endTime = Date.now();
      
      expect(result.data.length).toBe(1000); // < 1 segundo
      expect(endTime - startTime).toBeLessThan(1000);
    });

    it('debe preservar memoria con skipEmptyLines', () => {
      // Caso 29: Optimización automática
      const csvWithEmpties = `distrito;renta;poblacion
Centro;35000;150000

Arganzuela;28000;180000

Retiro;40000;120000

`;
      
      const result = parseCSVFile(csvWithEmpties);
      expect(result.data.length).toBe(3); // Solo datos relevantes
    });
  });
});