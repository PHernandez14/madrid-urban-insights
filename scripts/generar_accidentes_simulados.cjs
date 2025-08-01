const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../src/data');
const OUTPUT_FILE = path.join(DATA_DIR, 'accidentesMadrid.json');

const getRandomCoordinates = (minLat, maxLat, minLng, maxLng) => {
    const lat = Math.random() * (maxLat - minLat) + minLat;
    const lng = Math.random() * (maxLng - minLng) + minLng;
    return [lat, lng];
};

const run = () => {
    console.log("Generando datos simulados de accidentes...");
    const accidentes = [];
    const numAccidentes = 5000; // Generemos una buena cantidad para el mapa de calor

    // Límites aproximados del municipio de Madrid
    const madridBounds = {
        minLat: 40.312,
        maxLat: 40.562,
        minLng: -3.888,
        maxLng: -3.518,
    };

    const tiposAccidente = [
        'Colisión frontal', 'Colisión lateral', 'Atropello', 'Vuelco', 'Caída', 'Otro'
    ];
    const distritos = [
        'Centro', 'Arganzuela', 'Retiro', 'Salamanca', 'Chamartín', 'Tetuán', 'Chamberí',
        'Fuencarral-El Pardo', 'Moncloa-Aravaca', 'Latina', 'Carabanchel', 'Usera',
        'Puente de Vallecas', 'Moratalaz', 'Ciudad Lineal', 'Hortaleza', 'Villaverde',
        'Villa de Vallecas', 'Vicálvaro', 'San Blas-Canillejas', 'Barajas'
    ];


    for (let i = 0; i < numAccidentes; i++) {
        const [lat, lng] = getRandomCoordinates(
            madridBounds.minLat,
            madridBounds.maxLat,
            madridBounds.minLng,
            madridBounds.maxLng
        );
        
        accidentes.push({
            id: i,
            distrito: distritos[Math.floor(Math.random() * distritos.length)],
            tipo: tiposAccidente[Math.floor(Math.random() * tiposAccidente.length)],
            latitud: lat,
            longitud: lng,
            // Añadimos una 'intensidad' para el mapa de calor
            intensidad: Math.random() * 0.5 + 0.1
        });
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(accidentes, null, 2));
    console.log(`Datos simulados de accidentes guardados en ${OUTPUT_FILE} (${accidentes.length} registros).`);
};

run();
