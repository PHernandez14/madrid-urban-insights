const fs = require('fs');
const Papa = require('papaparse');
const path = require('path');
const proj4 = require('proj4');

const FICHEROS_DIR = path.join(__dirname, '../ficheros');
const DATA_DIR = path.join(__dirname, '../src/data');

const APARCAMIENTOS_FILE = path.join(FICHEROS_DIR, 'aparcamientosPublicos.csv');
const OUTPUT_FILE = path.join(DATA_DIR, 'aparcamientosMadrid.json');

// Proyecciones
const utmProjection = '+proj=utm +zone=30 +ellps=GRS80 +units=m +no_defs';
const wgs84Projection = '+proj=longlat +datum=WGS84 +no_defs';
const converter = proj4(utmProjection, wgs84Projection);

const cleanHeader = (header) => header.trim().replace(/^\uFEFF/, '');

const run = async () => {
    try {
        console.log("Iniciando procesamiento de aparcamientos...");
        // Leemos el fichero con la codificación 'latin1'
        const fileContent = fs.readFileSync(APARCAMIENTOS_FILE, 'latin1');
        
        const results = Papa.parse(fileContent, {
            header: true,
            delimiter: ';',
            skipEmptyLines: true,
            transformHeader: cleanHeader,
        });

        if (results.errors.length > 0) {
            console.error("Errores de parseo detectados, pero se intentará continuar:", results.errors);
        }
        
        // Mapeamos las posibles variantes de nombres de columna que hemos visto en otros ficheros
        const aparcamientos = results.data.map((row, index) => {
            const x = parseFloat(String(row.COORDENADA_X || row['COORDENADA-X'] || row.coordenada_x || '0').replace(',', '.'));
            const y = parseFloat(String(row.COORDENADA_Y || row['COORDENADA-Y'] || row.coordenada_y || '0').replace(',', '.'));

            if (!x || !y || isNaN(x) || isNaN(y)) {
                return null;
            }

            const [longitude, latitude] = converter.forward([x, y]);

            return {
                id: row.ID || index,
                nombre: row.NOMBRE || 'Nombre no disponible',
                direccion: 'N/A',
                plazas: 0,
                tipo: 'No disponible',
                distrito: row.DISTRITO || 'Distrito no disponible',
                latitud: latitude,
                longitud: longitude,
            };
        }).filter(Boolean);

        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(aparcamientos, null, 2));
        console.log(`Datos de aparcamientos procesados y guardados en ${OUTPUT_FILE} (${aparcamientos.length} registros).`);

    } catch (error) {
        console.error("Error procesando el fichero de aparcamientos:", error);
    }
};

run();
