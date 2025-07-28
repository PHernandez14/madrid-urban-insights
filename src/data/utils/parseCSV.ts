import Papa from 'papaparse';
import { PoblacionBarrio, PiramidePoblacional } from '../types/demografia';

export function parsePoblacionCSV(csvText: string): PoblacionBarrio[] {
  const { data } = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
  });
  return data as PoblacionBarrio[];
}

export function parsePiramideCSV(csvText: string): PiramidePoblacional[] {
  const { data } = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
    delimiter: ';',
  });
  return data as PiramidePoblacional[];
}

// Calcula el porcentaje de envejecimiento (mayores de 65 años) por barrio
export function getEnvejecimientoPorBarrio(piramide: PiramidePoblacional[]): Record<string, number> {
  console.log('Procesando datos de envejecimiento...');
  console.log('Primeras 5 filas de datos:', piramide.slice(0, 5));
  
  // Agrupar por barrio
  const barrios: Record<string, { total: number; mayores65: number }> = {};
  piramide.forEach(row => {
    const key = row.DESC_BARRIO;
    if (!key) {
      console.warn('Fila sin DESC_BARRIO:', row);
      return;
    }
    
    const totalEdad = (row.ESPANOLESHOMBRES || 0) + (row.ESPANOLESMUJERES || 0) + (row.EXTRANJEROSHOMBRES || 0) + (row.EXTRANJEROSMUJERES || 0);
    if (!barrios[key]) barrios[key] = { total: 0, mayores65: 0 };
    barrios[key].total += totalEdad;
    if (row.COD_EDAD_INT >= 65) {
      barrios[key].mayores65 += totalEdad;
    }
  });
  
  // Calcular porcentaje
  const resultado: Record<string, number> = {};
  Object.entries(barrios).forEach(([barrio, datos]) => {
    resultado[barrio] = datos.total > 0 ? (datos.mayores65 / datos.total) * 100 : 0;
  });
  
  console.log('Barrios únicos encontrados:', Object.keys(barrios).length);
  console.log('Primeros 10 barrios con envejecimiento:', Object.entries(resultado).slice(0, 10));
  
  // Verificar algunos barrios específicos
  const barriosEspecificos = ['PALACIO', 'EMBAJADORES', 'SOL', 'CHOPERA'];
  barriosEspecificos.forEach(barrio => {
    if (resultado[barrio] !== undefined) {
      console.log(`✅ ${barrio}: ${resultado[barrio].toFixed(1)}%`);
    } else {
      console.log(`❌ ${barrio}: No encontrado`);
    }
  });
  
  return resultado;
}

// Calcula el porcentaje de población extranjera por barrio
export function getInmigracionPorBarrio(csvText: string): Record<string, number> {
  const lines = csvText.split('\n').slice(1); // Saltar header
  const inmigracion: Record<string, number> = {};
  
  // Crear un mapeo de secciones a barrios basado en el código de sección
  // Los códigos de sección tienen el formato: distrito (2 dígitos) + sección (2 dígitos)
  // Los códigos de barrio tienen el formato: distrito (2 dígitos) + barrio (3 dígitos)
  
  lines.forEach(line => {
    if (line.trim()) {
      const [distrito, codigo_seccion, habitantes, todos_espanoles, todos_extranjeros, mixto] = line.split(',');
      
      // Extraer código de distrito (formato: "01. Centro" -> "01")
      const codDistrito = distrito.split('.')[0].trim();
      
      // Calcular porcentaje de extranjeros
      const totalHabitantes = parseFloat(habitantes);
      const totalExtranjeros = parseFloat(todos_extranjeros) + (parseFloat(mixto) / 2); // Asumimos que en hogares mixtos la mitad son extranjeros
      const porcentajeExtranjeros = totalHabitantes > 0 ? (totalExtranjeros / totalHabitantes) * 100 : 0;
      
      // Usar código de sección como clave temporal
      const clave = `${codDistrito}_${codigo_seccion}`;
      inmigracion[clave] = porcentajeExtranjeros;
    }
  });
  
  return inmigracion;
}

// Nueva función para mapear secciones censales a barrios
export function getInmigracionPorBarrioMapeado(csvText: string, estadisticasText: string): Record<string, number> {
  const lines = csvText.split('\n').slice(1); // Saltar header
  const estadisticas = estadisticasText.split('\n').slice(1); // Saltar header
  
  // Crear mapeo de sección a barrio desde estadísticas
  const mapeoSeccionBarrio: Record<string, { claveBarrio: string; nombreBarrio: string }> = {};
  estadisticas.forEach(line => {
    if (line.trim()) {
      const campos = line.split(';');
      if (campos.length >= 8) {
        const codDistrito = campos[0];
        const codBarrio = campos[4];
        const codSeccion = campos[6]; // El código de sección está en la posición 6 (COD_SECCION)
        const nombreBarrio = campos[3].trim(); // Nombre del barrio (DESC_BARRIO) - limpiar espacios
        
        // Crear clave de sección y barrio
        const claveSeccion = `${codDistrito}_${codSeccion}`;
        const claveBarrio = `${codDistrito}_${codBarrio}`;
        
        mapeoSeccionBarrio[claveSeccion] = { claveBarrio, nombreBarrio };
      }
    }
  });
  
  console.log('Mapeo de secciones creado:', Object.keys(mapeoSeccionBarrio).length, 'secciones');
  console.log('Primeras 10 secciones:', Object.entries(mapeoSeccionBarrio).slice(0, 10));
  
  // Verificar secciones de Valdebernardo
  const seccionesValdebernardo = Object.entries(mapeoSeccionBarrio).filter(([seccion, mapeo]) => 
    mapeo.nombreBarrio === 'VALDEBERNARDO'
  );
  console.log('Secciones de Valdebernardo:', seccionesValdebernardo.slice(0, 5));
  
  // Procesar datos de inmigración y mapear a barrios
  const inmigracionPorSeccion: Record<string, { total: number; extranjeros: number }> = {};
  
  // Extraer distritos disponibles en datos de inmigración
  const distritosInmigracion = new Set<string>();
  
  lines.forEach(line => {
    if (line.trim()) {
      const [distrito, codigo_seccion, habitantes, todos_espanoles, todos_extranjeros, mixto] = line.split(',');
      
      const codDistrito = distrito.split('.')[0].trim();
      distritosInmigracion.add(codDistrito);
      
      // El código de sección en el archivo de inmigración tiene formato 19001, necesitamos extraer solo la sección
      const seccion = codigo_seccion.substring(2); // Extraer los últimos 3 dígitos (001, 002, etc.)
      const claveSeccion = `${codDistrito}_${seccion}`;
      
      const totalHabitantes = parseFloat(habitantes);
      const totalExtranjeros = parseFloat(todos_extranjeros) + (parseFloat(mixto) / 2);
      
      if (!inmigracionPorSeccion[claveSeccion]) {
        inmigracionPorSeccion[claveSeccion] = { total: 0, extranjeros: 0 };
      }
      
      inmigracionPorSeccion[claveSeccion].total += totalHabitantes;
      inmigracionPorSeccion[claveSeccion].extranjeros += totalExtranjeros;
    }
  });
  
  console.log('Distritos con datos de inmigración disponibles:', Array.from(distritosInmigracion).sort());
  console.log('Secciones de inmigración procesadas:', Object.keys(inmigracionPorSeccion).length);
  
  // Verificar secciones de inmigración de Vicálvaro
  const seccionesInmigracionVicalvaro = Object.keys(inmigracionPorSeccion).filter(seccion => 
    seccion.startsWith('19_')
  );
  console.log('Secciones de inmigración de Vicálvaro:', seccionesInmigracionVicalvaro.slice(0, 10));
  
  // Agregar datos por barrio
  const inmigracionPorBarrio: Record<string, { total: number; extranjeros: number }> = {};
  
  Object.entries(inmigracionPorSeccion).forEach(([claveSeccion, datos]) => {
    const mapeo = mapeoSeccionBarrio[claveSeccion];
    if (mapeo) {
      if (!inmigracionPorBarrio[mapeo.claveBarrio]) {
        inmigracionPorBarrio[mapeo.claveBarrio] = { total: 0, extranjeros: 0 };
      }
      inmigracionPorBarrio[mapeo.claveBarrio].total += datos.total;
      inmigracionPorBarrio[mapeo.claveBarrio].extranjeros += datos.extranjeros;
    }
  });
  
  console.log('Barrios con datos de inmigración mapeados:', Object.keys(inmigracionPorBarrio).length);
  
  // Calcular porcentajes finales y crear múltiples claves para cada barrio
  const resultado: Record<string, number> = {};
  Object.entries(inmigracionPorBarrio).forEach(([claveBarrio, datos]) => {
    const porcentaje = datos.total > 0 ? (datos.extranjeros / datos.total) * 100 : 0;
    
    // Agregar con clave compuesta (distrito_barrio)
    resultado[claveBarrio] = porcentaje;
    
    // Buscar el nombre del barrio correspondiente
    const mapeoEncontrado = Object.values(mapeoSeccionBarrio).find(m => m.claveBarrio === claveBarrio);
    if (mapeoEncontrado) {
      const nombreBarrio = mapeoEncontrado.nombreBarrio;
      
      // Agregar con nombre del barrio (normalizado)
      const nombreNormalizado = nombreBarrio
        .toLocaleLowerCase('es-ES')
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .replace(/\s+/g, ' ')
        .trim();
      resultado[nombreNormalizado] = porcentaje;
      
      // Agregar con nombre original
      resultado[nombreBarrio] = porcentaje;
      
      // Agregar con nombre en mayúsculas
      resultado[nombreBarrio.toUpperCase()] = porcentaje;
    }
  });
  
  console.log('Datos de inmigración mapeados:', Object.keys(resultado).length, 'claves');
  console.log('Primeras 10 claves:', Object.keys(resultado).slice(0, 10));
  
  // Verificar específicamente Valdebernardo
  const valdebernardoClaves = Object.keys(resultado).filter(k => k.toLowerCase().includes('valdebernardo'));
  console.log('Claves que contienen "valdebernardo":', valdebernardoClaves);
  
  // Verificar clave compuesta para Valdebernardo (19_002)
  console.log('Valor para clave "19_002":', resultado['19_002']);
  console.log('Valor para clave "VALDEBERNARDO":', resultado['VALDEBERNARDO']);
  console.log('Valor para clave "valdebernardo":', resultado['valdebernardo']);
  
  // Verificar secciones de Vicálvaro en el mapeo
  const seccionesVicalvaro = Object.entries(mapeoSeccionBarrio).filter(([seccion, mapeo]) => 
    seccion.startsWith('19_')
  );
  console.log('Secciones de Vicálvaro en mapeo:', seccionesVicalvaro.slice(0, 10));
  
  // Información adicional sobre cobertura de datos
  const distritosConDatos = new Set<string>();
  Object.keys(resultado).forEach(clave => {
    if (clave.includes('_')) {
      const distrito = clave.split('_')[0];
      distritosConDatos.add(distrito);
    }
  });
  
  console.log('Distritos con datos de inmigración mapeados:', Array.from(distritosConDatos).sort());
  console.log('⚠️ ADVERTENCIA: Los datos de inmigración solo están disponibles para algunos distritos. Los barrios sin datos aparecerán como "Sin dato".');
  
  return resultado;
}

// Devuelve detalles de envejecimiento: porcentaje, mayores65 y total habitantes
export function getDetallesEnvejecimientoPorBarrio(piramide: PiramidePoblacional[]): Record<string, { porcentaje: number, mayores65: number, total: number }> {
  const barrios: Record<string, { total: number; mayores65: number }> = {};
  piramide.forEach(row => {
    const key = row.DESC_BARRIO;
    if (!key) return;
    const totalEdad = (row.ESPANOLESHOMBRES || 0) + (row.ESPANOLESMUJERES || 0) + (row.EXTRANJEROSHOMBRES || 0) + (row.EXTRANJEROSMUJERES || 0);
    if (!barrios[key]) barrios[key] = { total: 0, mayores65: 0 };
    barrios[key].total += totalEdad;
    if (row.COD_EDAD_INT >= 65) {
      barrios[key].mayores65 += totalEdad;
    }
  });
  const resultado: Record<string, { porcentaje: number, mayores65: number, total: number }> = {};
  Object.entries(barrios).forEach(([barrio, datos]) => {
    resultado[barrio] = {
      porcentaje: datos.total > 0 ? (datos.mayores65 / datos.total) * 100 : 0,
      mayores65: datos.mayores65,
      total: datos.total
    };
  });
  return resultado;
} 

 