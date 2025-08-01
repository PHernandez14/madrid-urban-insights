const fs = require('fs');
const Papa = require('papaparse');
const path = require('path');
const proj4 = require('proj4');

const FICHEROS_DIR = path.join(__dirname, '../ficheros');
const DATA_DIR = path.join(__dirname, '../src/data');

const ACTIVIDAD_FILE = path.join(FICHEROS_DIR, 'actividadeconomica202507.csv');
const LICENCIAS_FILE = path.join(FICHEROS_DIR, 'licencias202507.csv');
const TERRAZAS_FILE = path.join(FICHEROS_DIR, 'terrazas202507.csv');

const OUTPUT_FILE = path.join(DATA_DIR, 'datosComercialesMadrid.json');
const GEOJSON_OUTPUT_FILE = path.join(DATA_DIR, 'localesComerciales.json');

// Proyección de coordenadas del Ayto. de Madrid (ETRS89 / UTM zone 30N)
const utmProjection = '+proj=utm +zone=30 +ellps=GRS80 +units=m +no_defs';
// Proyección estándar de latitud/longitud
const wgs84Projection = '+proj=longlat +datum=WGS84 +no_defs';
const converter = proj4(utmProjection, wgs84Projection);

const cleanHeader = (header) => header.trim().replace(/^\uFEFF/, '');

// Función para procesar un CSV y devolver un mapa de datos
const processCSVToMap = (filePath, keyColumn) => {
    return new Promise((resolve, reject) => {
        const dataMap = new Map();
        const fileStream = fs.createReadStream(filePath);

        Papa.parse(fileStream, {
            header: true,
            delimiter: ';',
            skipEmptyLines: true,
            transformHeader: cleanHeader,
            step: (results) => {
                const row = results.data;
                const key = row[keyColumn];
                if (key) {
                    if (!dataMap.has(key)) {
                        dataMap.set(key, []);
                    }
                    dataMap.get(key).push(row);
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

        const licenciasPromise = processCSVToMap(LICENCIAS_FILE, 'id_local');
        const terrazasPromise = processCSVToMap(TERRAZAS_FILE, 'id_local');
        
        const [licenciasData, terrazasData] = await Promise.all([licenciasPromise, terrazasPromise]);
        
        const datosAgregados = {};
        const geojsonFeatures = [];
        const MAX_GEOJSON_FEATURES = 20000; // Limitar para no sobrecargar el mapa

        const fileStream = fs.createReadStream(ACTIVIDAD_FILE);
        
        await new Promise((resolve, reject) => {
            Papa.parse(fileStream, {
                header: true,
                delimiter: ';',
                skipEmptyLines: true,
                transformHeader: cleanHeader,
                step: (results) => {
                    const local = results.data;
                    const distrito = local.desc_distrito_local ? local.desc_distrito_local.trim() : null;
                    if (!distrito) return;

                    if (!datosAgregados[distrito]) {
                        datosAgregados[distrito] = {
                            nombre: distrito,
                            totalLocales: 0,
                            localesAbiertos: 0,
                            tiposActividad: {},
                            licencias: { concedidas: 0, denegadas: 0, enTramite: 0, total: 0 },
                            terrazas: { total: 0, superficieTotal: 0, mesasTotales: 0, sillasTotales: 0 }
                        };
                    }
                    
                    // Procesamiento para datos agregados (sin cambios)
                    // ...
                     const distritoData = datosAgregados[distrito];
                    distritoData.totalLocales++;

                    if (local.desc_situacion_local && local.desc_situacion_local.trim() === 'Abierto') {
                        distritoData.localesAbiertos++;
                    }

                    const actividad = local.desc_epigrafe ? local.desc_epigrafe.trim() : 'No especificada';
                    distritoData.tiposActividad[actividad] = (distritoData.tiposActividad[actividad] || 0) + 1;
                    
                    const localId = local.id_local;
                    if (localId) {
                        const licencias = licenciasData.get(localId) || [];
                        licencias.forEach(lic => {
                            distritoData.licencias.total++;
                            if (lic.desc_tipo_situacion_licencia) {
                                const situacion = lic.desc_tipo_situacion_licencia.toLowerCase();
                                if (situacion.includes('concedida')) distritoData.licencias.concedidas++;
                                else if (situacion.includes('denegada')) distritoData.licencias.denegadas++;
                                else if (situacion.includes('tramitaci')) distritoData.licencias.enTramite++;
                            }
                        });

                        const terrazas = terrazasData.get(localId) || [];
                         if (terrazas.length > 0) {
                            distritoData.terrazas.total += terrazas.length;
                            terrazas.forEach(terraza => {
                                distritoData.terrazas.superficieTotal += parseFloat(terraza.Superficie_ES) || parseFloat(terraza.Superficie_RA) || 0;
                                distritoData.terrazas.mesasTotales += parseInt(terraza.mesas_es) || parseInt(terraza.mesas_ra) || 0;
                                distritoData.terrazas.sillasTotales += parseInt(terraza.sillas_es) || parseInt(terraza.sillas_ra) || 0;
                            });
                        }
                    }

                    // Nuevo: Procesamiento para GeoJSON
                    if (geojsonFeatures.length < MAX_GEOJSON_FEATURES) {
                        const x = parseFloat(local.coordenada_x_local);
                        const y = parseFloat(local.coordenada_y_local);

                        if (x && y && x > 0 && y > 0) {
                            const [longitude, latitude] = converter.forward([x, y]);
                            const feature = {
                                type: 'Feature',
                                geometry: {
                                    type: 'Point',
                                    coordinates: [longitude, latitude]
                                },
                                properties: {
                                    rotulo: local.rotulo,
                                    actividad: local.desc_epigrafe,
                                    distrito: distrito
                                }
                            };
                            geojsonFeatures.push(feature);
                        }
                    }
                },
                complete: () => {
                     console.log(`Procesado ${path.basename(ACTIVIDAD_FILE)}`);
                     resolve();
                },
                 error: (error) => reject(error)
            });
        });
        
        // Guardar JSON agregado
        const resultadoFinal = Object.values(datosAgregados).map(distrito => {
            const topActividades = Object.entries(distrito.tiposActividad)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
            
            return { ...distrito, tiposActividad: topActividades };
        });
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(resultadoFinal, null, 2));
        console.log(`Datos agregados guardados en ${OUTPUT_FILE}`);

        // Guardar GeoJSON
        const geojsonObject = {
            type: 'FeatureCollection',
            features: geojsonFeatures
        };
        fs.writeFileSync(GEOJSON_OUTPUT_FILE, JSON.stringify(geojsonObject));
        console.log(`GeoJSON de locales guardado en ${GEOJSON_OUTPUT_FILE} con ${geojsonFeatures.length} registros.`);


    } catch (error) {
        console.error("Error procesando los ficheros:", error);
    }
};

run();
