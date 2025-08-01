const fs = require('fs');
const Papa = require('papaparse');
const path = require('path');

const FICHEROS_DIR = path.join(__dirname, '../ficheros/google_transit_M4');
const DATA_DIR = path.join(__dirname, '../src/data');

const STOPS_FILE = path.join(FICHEROS_DIR, 'stops.txt');
const OUTPUT_FILE = path.join(DATA_DIR, 'metroEstaciones.json');

const cleanHeader = (header) => header.trim().replace(/^\uFEFF/, '');

const run = async () => {
    try {
        console.log("Iniciando procesamiento de estaciones de Metro...");
        const fileContent = fs.readFileSync(STOPS_FILE, 'utf-8');
        
        const results = Papa.parse(fileContent, {
            header: true,
            delimiter: ',',
            skipEmptyLines: true,
            transformHeader: cleanHeader,
        });

        const estaciones = results.data.map((row, index) => {
            const lat = parseFloat(row.stop_lat);
            const lon = parseFloat(row.stop_lon);

            if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
                return null;
            }

            return {
                id: row.stop_id || index,
                nombre: row.stop_name,
                latitud: lat,
                longitud: lon
            };
        }).filter(Boolean); // Eliminar nulos

        // Filtramos para quedarnos con registros únicos por nombre de estación, para no pintar varias veces la misma.
        const estacionesUnicas = Array.from(new Map(estaciones.map(item => [item.nombre, item])).values());


        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(estacionesUnicas, null, 2));
        console.log(`Datos de estaciones de Metro procesados y guardados en ${OUTPUT_FILE} (${estacionesUnicas.length} estaciones únicas).`);

    } catch (error) {
        console.error("Error procesando el fichero de estaciones de Metro:", error);
    }
};

run();
