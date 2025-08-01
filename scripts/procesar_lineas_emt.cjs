const fs = require('fs');
const Papa = require('papaparse');
const path = require('path');

const FICHEROS_DIR = path.join(__dirname, '../ficheros/EMT');
const DATA_DIR = path.join(__dirname, '../src/data');

const LINES_FILE = path.join(FICHEROS_DIR, 'linesemt.csv');
const OUTPUT_FILE = path.join(DATA_DIR, 'emtLineas.json');

const cleanHeader = (header) => header.trim().replace(/^\uFEFF/, '');

const run = async () => {
    try {
        console.log("Iniciando procesamiento de líneas de la EMT...");
        const fileContent = fs.readFileSync(LINES_FILE, 'utf-8');
        
        const results = Papa.parse(fileContent, {
            header: true,
            delimiter: ',',
            skipEmptyLines: true,
            transformHeader: cleanHeader,
        });

        // Usamos un mapa para quedarnos solo con la última definición de cada línea, evitando duplicados
        const lineas = new Map();

        results.data.forEach(row => {
            const label = row.label;
            if (label) {
                lineas.set(label, {
                    id: label,
                    origen: row.nameFrom,
                    destino: row.nameTo,
                    nombreCompleto: `${row.nameFrom} - ${row.nameTo}`
                });
            }
        });

        const lineasArray = Array.from(lineas.values());
        
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(lineasArray, null, 2));
        console.log(`Datos de líneas de EMT procesados y guardados en ${OUTPUT_FILE} (${lineasArray.length} líneas únicas).`);

    } catch (error) {
        console.error("Error procesando el fichero de líneas de EMT:", error);
    }
};

run();
