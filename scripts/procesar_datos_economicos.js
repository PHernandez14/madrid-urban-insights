const fs = require('fs');
const Papa = require('papaparse');
const path = require('path');

const FICHEROS_DIR = path.join(__dirname, '../ficheros');
const DATA_DIR = path.join(__dirname, '../src/data');

const ACTIVIDAD_FILE = path.join(FICHEROS_DIR, 'actividadeconomica202507.csv');
const LICENCIAS_FILE = path.join(FICHEROS_DIR, 'licencias202507.csv');
const TERRAZAS_FILE = path.join(FICHEROS_DIR, 'terrazas202507.csv');
const LOCALES_FILE = path.join(FICHEROS_DIR, 'locales202507.csv');

const OUTPUT_FILE = path.join(DATA_DIR, 'datosComercialesMadrid.json');

// Función para procesar un CSV y devolver un mapa de datos
const processCSV = (filePath, keyColumn, valueColumns) => {
    return new Promise((resolve, reject) => {
        const dataMap = new Map();
        const fileStream = fs.createReadStream(filePath);

        Papa.parse(fileStream, {
            header: true,
            delimiter: ';',
            skipEmptyLines: true,
            step: (results) => {
                const row = results.data;
                const key = row[keyColumn];
                if (key) {
                    if (!dataMap.has(key)) {
                        dataMap.set(key, []);
                    }
                    const values = {};
                    valueColumns.forEach(col => {
                        values[col] = row[col];
                    });
                    dataMap.get(key).push(values);
                }
            },
            complete: () => {
                console.log(`Procesado ${path.basename(filePath)}`);
                resolve(dataMap);
            },
            error: (error) => {
                reject(error);
            }
        });
    });
};


const run = async () => {
    try {
        console.log("Iniciando procesamiento de datos comerciales...");

        const actividadPromise = processCSV(ACTIVIDAD_FILE, 'desc_distrito_local', ['id_local', 'desc_epigrafe', 'desc_situacion_local']);
        const licenciasPromise = processCSV(LICENCIAS_FILE, 'id_local', ['desc_tipo_licencia', 'desc_tipo_situacion_licencia']);
        const terrazasPromise = processCSV(TERRAZAS_FILE, 'id_local', ['Superficie_ES', 'mesas_es', 'sillas_es']);
        
        const [actividadData, licenciasData, terrazasData] = await Promise.all([actividadPromise, licenciasPromise, terrazasPromise]);

        const datosAgregados = {};

        // Agregamos por distrito desde el fichero de actividad
        for (const [distrito, locales] of actividadData.entries()) {
            const distritoLimpio = distrito.trim();
            if (!datosAgregados[distritoLimpio]) {
                datosAgregados[distritoLimpio] = {
                    nombre: distritoLimpio,
                    totalLocales: 0,
                    localesAbiertos: 0,
                    tiposActividad: {},
                    licencias: {
                        concedidas: 0,
                        denegadas: 0,
                        enTramite: 0,
                        total: 0
                    },
                    terrazas: {
                        total: 0,
                        superficieTotal: 0,
                        mesasTotales: 0,
                        sillasTotales: 0
                    }
                };
            }
            
            datosAgregados[distritoLimpio].totalLocales += locales.length;

            locales.forEach(local => {
                // Conteo de locales abiertos
                if (local.desc_situacion_local && local.desc_situacion_local.trim() === 'Abierto') {
                    datosAgregados[distritoLimpio].localesAbiertos++;
                }

                // Conteo de tipos de actividad
                const actividad = local.desc_epigrafe ? local.desc_epigrafe.trim() : 'No especificada';
                datosAgregados[distritoLimpio].tiposActividad[actividad] = (datosAgregados[distritoLimpio].tiposActividad[actividad] || 0) + 1;
                
                // Procesar licencias para el local
                const licencias = licenciasData.get(local.id_local) || [];
                licencias.forEach(lic => {
                    datosAgregados[distritoLimpio].licencias.total++;
                    if (lic.desc_tipo_situacion_licencia) {
                         const situacion = lic.desc_tipo_situacion_licencia.toLowerCase();
                         if (situacion.includes('concedida')) {
                            datosAgregados[distritoLimpio].licencias.concedidas++;
                         } else if (situacion.includes('denegada')) {
                            datosAgregados[distritoLimpio].licencias.denegadas++;
                         } else if (situacion.includes('tramitaci')) { // "en tramitacion" o "tramitando"
                            datosAgregados[distritoLimpio].licencias.enTramite++;
                         }
                    }
                });

                // Procesar terrazas para el local
                const terrazas = terrazasData.get(local.id_local) || [];
                terrazas.forEach(terraza => {
                    datosAgregados[distritoLimpio].terrazas.total++;
                    datosAgregados[distritoLimpio].terrazas.superficieTotal += parseFloat(terraza.Superficie_ES) || 0;
                    datosAgregados[distritoLimpio].terrazas.mesasTotales += parseInt(terraza.mesas_es) || 0;
                    datosAgregados[distritoLimpio].terrazas.sillasTotales += parseInt(terraza.sillas_es) || 0;
                });
            });
        }
        
        // Convertir el objeto a un array y ordenar los tipos de actividad
        const resultadoFinal = Object.values(datosAgregados).map(distrito => {
            const topActividades = Object.entries(distrito.tiposActividad)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
            
            return {
                ...distrito,
                tiposActividad: topActividades
            };
        });

        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(resultadoFinal, null, 2));
        console.log(`Datos procesados y guardados en ${OUTPUT_FILE}`);

    } catch (error) {
        console.error("Error procesando los ficheros:", error);
    }
};

run();


