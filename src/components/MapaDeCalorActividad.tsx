import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat'; // Import for side-effects, it extends L
import localesData from '../data/localesComerciales';

// Solución para el problema del icono por defecto en Leaflet con Webpack/Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;


const MapaDeCalorActividad: React.FC = () => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);

    useEffect(() => {
        if (mapContainer.current && !mapInstance.current) {
            mapInstance.current = L.map(mapContainer.current).setView([40.416775, -3.703790], 12);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mapInstance.current);

            const heatPoints = localesData.features.map((feature) => {
                const [lng, lat] = feature.geometry.coordinates;
                // Formato para leaflet-heat: [lat, lng, intensity]
                return [lat, lng, 0.5]; 
            });

            // L.heatLayer is attached to L by the 'leaflet.heat' import.
            // We use '(L as any)' to bypass TypeScript type checking for this plugin.
            (L as any).heatLayer(heatPoints, { 
                radius: 20,
                blur: 15,
                maxZoom: 10,
            }).addTo(mapInstance.current);
        }
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Mapa de Calor de la Actividad Comercial</CardTitle>
            </CardHeader>
            <CardContent>
                <div ref={mapContainer} style={{ height: '500px', width: '100%' }} />
            </CardContent>
        </Card>
    );
};

export default MapaDeCalorActividad;
