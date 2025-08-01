const fs = require('fs');
const Papa = require('papaparse');
const path = require('path');
const proj4 = require('proj4');

const FICHEROS_DIR = path.join(__dirname, '../ficheros/EMT');
const DATA_DIR = path.join(__dirname, '../src/data');

const STOPS_FILE = path.join(FICHEROS_DIR, 'stopsemt.csv');
const OUTPUT_FILE = path.join(DATA_DIR, 'emtParadas.json');

// Proyecciones
const utmProjection = '+proj=utm +zone=30 +ellps=GRS80 +units=m +no_defs';
const wgs84Projection = '+proj=longlat +datum=WGS84 +no_defs';
const converter = proj4(utmProjection, wgs84Projection);

const cleanHeader = (header) => header.trim().replace(/^\uFEFF/, '');

const run = async () => {
    try {
        console.log("Iniciando procesamiento de paradas de la EMT (con autodetección)...");
        const fileContent = fs.readFileSync(STOPS_FILE, 'utf-8');
        
        const results = Papa.parse(fileContent, {
            header: true,
            // Pedimos a Papaparse que intente autodetectar el delimitador
            delimitersToGuess: [',', ';', '\t', '|'],
            skipEmptyLines: true,
            transformHeader: cleanHeader,
        });

        if (results.errors.length > 0) {
            console.warn("Se encontraron errores de parseo, pero se intentará continuar:", results.errors.slice(0, 3));
        }
        
        console.log("Delimitador detectado:", results.meta.delimiter);
        console.log("Cabeceras detectadas:", results.meta.fields);

        const paradas = {};
        
        results.data.forEach(row => {
            const paradaId = row.parada;
            if (paradaId && !paradas[paradaId]) {
                 const x = parseFloat(String(row.posX).replace(',', '.'));
                 const y = parseFloat(String(row.posY).replace(',', '.'));

                if (!x || !y || isNaN(x) || isNaN(y)) {
                    return;
                }

                const [longitude, latitude] = converter.forward([x, y]);

                paradas[paradaId] = {
                    id: paradaId,
                    nombre: row.descparada,
                    latitud: latitude,
                    longitud: longitude,
                };
            }
        });
        
        const paradasArray = Object.values(paradas);
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(paradasArray, null, 2));
        console.log(`Datos de paradas de EMT procesados y guardados en ${OUTPUT_FILE} (${paradasArray.length} registros únicos).`);

    } catch (error) {
        console.error("Error procesando el fichero de paradas de EMT:", error);
    }
};

run();
