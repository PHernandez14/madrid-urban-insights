const fs = require('fs');
const Papa = require('papaparse');
const path = require('path');

const STOPS_FILE = path.join(__dirname, '../ficheros/EMT/stopsemt.csv');

const run = async () => {
    try {
        console.log(`--- Iniciando diagnóstico de ${path.basename(STOPS_FILE)} ---`);
        const fileContent = fs.readFileSync(STOPS_FILE, 'utf-8');

        console.log(`\n1. Primeros 500 caracteres del fichero:`);
        console.log(fileContent.substring(0, 500));
        console.log('--------------------------------------------------');

        const results = Papa.parse(fileContent, {
            header: true,
            skipEmptyLines: true,
            // Pedimos a Papaparse que intente autodetectar el delimitador
            delimitersToGuess: [',', ';', '\t', '|'],
        });

        console.log(`\n2. Resultados del análisis de Papaparse:`);
        if (results.meta) {
            console.log(`   - Delimitador detectado: "${results.meta.delimiter}"`);
            console.log(`   - Saltos de línea: "${results.meta.linebreak}"`);
            console.log(`   - Nº de cabeceras: ${results.meta.fields.length}`);
            console.log(`   - Cabeceras: [${results.meta.fields.join(', ')}]`);
        }
        
        console.log(`\n3. Errores de parseo encontrados:`);
        if (results.errors.length > 0) {
            results.errors.slice(0, 5).forEach(err => console.log(`   - ${err.type}: ${err.message} (Fila: ${err.row})`));
            if (results.errors.length > 5) {
                 console.log(`   - ... y ${results.errors.length - 5} más.`);
            }
        } else {
            console.log("   - No se encontraron errores de parseo.");
        }

        console.log(`\n4. Total de filas de datos parseadas: ${results.data.length}`);
        console.log("\n--- Diagnóstico completado ---");

    } catch (error) {
        console.error("\nError crítico durante el diagnóstico:", error);
    }
};

run();
