const fs = require('fs');
const Papa = require('papaparse');
const path = require('path');
const proj4 = require('proj4');

const FICHEROS_DIR = path.join(__dirname, '../ficheros');
const DATA_DIR = path.join(__dirname, '../src/data');

const ACCIDENTES_FILE = path.join(FICHEROS_DIR, '2025_Accidentalidad.csv');
const OUTPUT_FILE = path.join(DATA_DIR, 'accidentesMadrid.json');

// Proyecciones
const utmProjection = '+proj=utm +zone=30 +ellps=GRS80 +units=m +no_defs';
const wgs84Projection = '+proj=longlat +datum=WGS84 +no_defs';
const converter = proj4(utmProjection, wgs84Projection);

const cleanHeader = (header) => header.trim().replace(/^\uFEFF/, '');

const run = async () => {
    try {
        console.log("Iniciando procesamiento de accidentes de tráfico...");
        const fileContent = fs.readFileSync(ACCIDENTES_FILE, 'utf-8');
        
        const results = Papa.parse(fileContent, {
            header: true,
            delimiter: ';',
            skipEmptyLines: true,
            transformHeader: cleanHeader,
        });

        const accidentes = results.data.map((row, index) => {
            const x = parseFloat(String(row.coordenada_x_utm).replace(',', '.'));
            const y = parseFloat(String(row.coordenada_y_utm).replace(',', '.'));

            if (!x || !y || isNaN(x) || isNaN(y)) {
                return null;
            }

            const [longitude, latitude] = converter.forward([x, y]);

            return {
                id: row.num_expediente || index,
                fecha: row.fecha,
                hora: row.hora,
                distrito: row.distrito,
                tipo_accidente: row.tipo_accidente,
                lesividad: row.lesividad,
                latitud: latitude,
                longitud: longitude,
                // Añadimos una intensidad base para el mapa de calor
                intensidad: 0.5 
            };
        }).filter(Boolean); // Eliminar nulos

        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(accidentes, null, 2));
        console.log(`Datos de accidentes procesados y guardados en ${OUTPUT_FILE} (${accidentes.length} registros).`);

    } catch (error)
    {
        console.error("Error procesando el fichero de accidentes:", error);
    }
};

run();
