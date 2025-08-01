const fs = require('fs');
const Papa = require('papaparse');
const path = require('path');
const proj4 = require('proj4');

const FICHEROS_DIR = path.join(__dirname, '../ficheros');
const DATA_DIR = path.join(__dirname, '../src/data');

const PUNTOS_RECARGA_FILE = path.join(FICHEROS_DIR, 'puntosdecarga.csv');
const OUTPUT_FILE = path.join(DATA_DIR, 'puntosRecargaMadrid.json');

// Proyección de coordenadas del Ayto. de Madrid (ETRS89 / UTM zone 30N)
const utmProjection = '+proj=utm +zone=30 +ellps=GRS80 +units=m +no_defs';
// Proyección estándar de latitud/longitud
const wgs84Projection = '+proj=longlat +datum=WGS84 +no_defs';
const converter = proj4(utmProjection, wgs84Projection);

const cleanHeader = (header) => header.trim().replace(/^\uFEFF/, '');

const run = async () => {
    try {
        console.log("Iniciando procesamiento de puntos de recarga...");
        const fileContent = fs.readFileSync(PUNTOS_RECARGA_FILE, 'utf-8');
        
        const results = Papa.parse(fileContent, {
            header: true,
            delimiter: ';',
            skipEmptyLines: true,
            transformHeader: cleanHeader,
        });

        const puntosRecarga = results.data.map((row, index) => {
            const x = parseFloat(String(row.POINT_X).replace(',', '.'));
            const y = parseFloat(String(row.POINT_Y).replace(',', '.'));

            if (!x || !y) {
                return null;
            }

            const [longitude, latitude] = converter.forward([x, y]);

            return {
                id: index,
                direccion: row.UBICACIÓN,
                distrito: row.DISTRITO,
                plazas: parseInt(row.Nº_EQUIPO) || 0,
                caracteristicas: row.CARACTERÍ,
                operador: row.OPERADOR,
                latitud: latitude,
                longitud: longitude,
            };
        }).filter(Boolean); // Eliminar nulos

        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(puntosRecarga, null, 2));
        console.log(`Datos de puntos de recarga procesados y guardados en ${OUTPUT_FILE} (${puntosRecarga.length} registros).`);

    } catch (error) {
        console.error("Error procesando el fichero de puntos de recarga:", error);
    }
};

run();
