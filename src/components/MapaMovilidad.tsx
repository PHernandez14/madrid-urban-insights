import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Loader2, Bike, Zap, ParkingSquare, AlertTriangle, TrainFront } from 'lucide-react';

import puntosRecargaData from '../data/puntosRecargaMadrid.json';
import aparcamientosData from '../data/aparcamientosMadrid.json';
import accidentesData from '../data/accidentesMadrid.json';
import metroData from '../data/metroEstaciones.json';


// Solución para el problema del icono por defecto en Leaflet
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- Interfaces de datos ---
interface BiciMADStation {
  id: string; name: string; latitude: number; longitude: number;
  free_bikes: number; empty_slots: number; timestamp: string;
}
interface PuntoRecarga {
  id: number; direccion: string; distrito: string; plazas: number;
  caracteristicas: string; operador: string; latitud: number; longitud: number;
}
interface Aparcamiento {
    id: number; nombre: string; direccion: string; latitud: number; longitud: number;
}
interface Accidente {
    id: string; fecha: string; hora: string; distrito: string;
    tipo_accidente: string; lesividad: string; latitud: number; longitud: number;
}
interface MetroStation {
    id: string; nombre: string; latitud: number; longitud: number;
}


// --- Iconos personalizados ---
const createBiciMADIcon = (freeBikes: number) => {
  const color = freeBikes >= 5 ? '#22c55e' : freeBikes > 0 ? '#f97316' : '#ef4444';
  const html = `<div style="background-color: ${color}; width: 1rem; height: 1rem; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5);"></div>`;
  return L.divIcon({ html, className: 'station-icon', iconSize: [16, 16], iconAnchor: [8, 8] });
};

const createPuntoRecargaIcon = () => {
  const html = `<div style="background-color: #3b82f6; width: 1rem; height: 1rem; display: flex; justify-content: center; align-items: center; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5);"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zap"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg></div>`;
  return L.divIcon({ html, className: 'station-icon', iconSize: [16, 16], iconAnchor: [8, 8] });
};

const createAparcamientoIcon = () => {
    const html = `<div style="background-color: #6d28d9; width: 1rem; height: 1rem; display: flex; justify-content: center; align-items: center; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5);"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-parking-square"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg></div>`;
    return L.divIcon({ html, className: 'station-icon', iconSize: [16, 16], iconAnchor: [8, 8] });
}

const createAccidenteIcon = () => {
    const html = `<div style="color: #ef4444; font-size: 1.5rem; line-height: 1.5rem;">•</div>`;
    return L.divIcon({ html, className: 'accidente-icon', iconSize: [24, 24], iconAnchor: [12, 12] });
}

const createMetroIcon = () => {
    const html = `<div style="background-color: #0096d6; width: 1.2rem; height: 1.2rem; display: flex; justify-content: center; align-items: center; border-radius: 20%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5);"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-subway"><path d="M12 22a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M8 18V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v12"/><path d="M18 18V6a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v12"/><path d="M8 12h8"/><circle cx="12" cy="4" r="2"/></svg></div>`;
    return L.divIcon({ html, className: 'station-icon', iconSize: [20, 20], iconAnchor: [10, 10] });
}


const MapaMovilidad: React.FC = () => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);
    const layerGroup = useRef<L.LayerGroup | null>(null);

    const [bicimadStations, setBicimadStations] = useState<BiciMADStation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeLayer, setActiveLayer] = useState<'bicimad' | 'recarga' | 'aparcamientos' | 'accidentes' | 'metro'>('bicimad');

    const accidentesSample = useMemo(() => {
        return accidentesData.sort(() => 0.5 - Math.random()).slice(0, 500);
    }, []);

    useEffect(() => {
        const fetchStations = async () => {
            try {
                const response = await fetch('https://api.citybik.es/v2/networks/bicimad');
                if (!response.ok) throw new Error('No se pudo obtener la información de BiciMAD');
                const data = await response.json();
                setBicimadStations(data.network.stations);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido');
            } finally {
                setIsLoading(false);
            }
        };
        fetchStations();
    }, []);

    useEffect(() => {
        if (mapContainer.current && !mapInstance.current) {
            mapInstance.current = L.map(mapContainer.current).setView([40.416775, -3.703790], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mapInstance.current);
            layerGroup.current = L.layerGroup().addTo(mapInstance.current);
        }

        if (layerGroup.current) {
            layerGroup.current.clearLayers();

            if (activeLayer === 'bicimad' && bicimadStations.length > 0) {
                bicimadStations.forEach(station => {
                    const marker = L.marker([station.latitude, station.longitude], { icon: createBiciMADIcon(station.free_bikes) });
                    marker.bindPopup(`<b>${station.name}</b><br>Bicis disponibles: ${station.free_bikes}<br>Anclajes libres: ${station.empty_slots}`);
                    marker.addTo(layerGroup.current!);
                });
            } else if (activeLayer === 'recarga') {
                puntosRecargaData.forEach(punto => {
                    const marker = L.marker([punto.latitud, punto.longitud], { icon: createPuntoRecargaIcon() });
                    marker.bindPopup(`<b>${punto.direccion}</b><br>Operador: ${punto.operador}<br>Plazas: ${punto.plazas}<br>Info: ${punto.caracteristicas}`);
                    marker.addTo(layerGroup.current!);
                });
            } else if (activeLayer === 'aparcamientos') {
                (aparcamientosData as Aparcamiento[]).forEach(aparcamiento => {
                    const marker = L.marker([aparcamiento.latitud, aparcamiento.longitud], { icon: createAparcamientoIcon() });
                    marker.bindPopup(`<b>${aparcamiento.nombre}</b>`);
                    marker.addTo(layerGroup.current!);
                });
            } else if (activeLayer === 'accidentes') {
                accidentesSample.forEach(accidente => {
                    const marker = L.marker([accidente.latitud, accidente.longitud], { icon: createAccidenteIcon() });
                    marker.bindPopup(`
                        <b>Accidente</b><br>
                        <b>Fecha:</b> ${accidente.fecha}<br>
                        <b>Hora:</b> ${accidente.hora}<br>
                        <b>Tipo:</b> ${accidente.tipo_accidente}<br>
                        <b>Distrito:</b> ${accidente.distrito}<br>
                        <b>Lesividad:</b> ${accidente.lesividad || 'No disponible'}
                    `);
                    marker.addTo(layerGroup.current!);
                });
            } else if (activeLayer === 'metro') {
                metroData.forEach(station => {
                    const marker = L.marker([station.latitud, station.longitud], { icon: createMetroIcon() });
                    marker.bindPopup(`<b>Estación de Metro</b><br>${station.nombre}`);
                    marker.addTo(layerGroup.current!);
                });
            }
        }
    }, [activeLayer, bicimadStations, accidentesSample]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Mapa de Movilidad y Seguridad Vial</CardTitle>
                <div className="flex justify-between items-center flex-wrap gap-2 mt-2">
                    <CardDescription>
                        Selecciona una capa para visualizar en el mapa.
                    </CardDescription>
                    <div className="flex gap-2 flex-wrap">
                        <Button variant={activeLayer === 'bicimad' ? 'default' : 'outline'} size="sm" onClick={() => setActiveLayer('bicimad')}>
                            <Bike className="mr-2 h-4 w-4" /> BiciMAD
                        </Button>
                        <Button variant={activeLayer === 'metro' ? 'default' : 'outline'} size="sm" onClick={() => setActiveLayer('metro')}>
                            <TrainFront className="mr-2 h-4 w-4" /> Metro
                        </Button>
                        <Button variant={activeLayer === 'recarga' ? 'default' : 'outline'} size="sm" onClick={() => setActiveLayer('recarga')}>
                            <Zap className="mr-2 h-4 w-4" /> P. Recarga
                        </Button>
                         <Button variant={activeLayer === 'aparcamientos' ? 'default' : 'outline'} size="sm" onClick={() => setActiveLayer('aparcamientos')}>
                            <ParkingSquare className="mr-2 h-4 w-4" /> Aparcamientos
                        </Button>
                        <Button variant={activeLayer === 'accidentes' ? 'default' : 'outline'} size="sm" onClick={() => setActiveLayer('accidentes')}>
                            <AlertTriangle className="mr-2 h-4 w-4" /> Accidentes
                        </Button>
                    </div>
                </div>
                {activeLayer === 'accidentes' && (
                    <div className="text-xs text-gray-500 mt-2 p-2 bg-gray-50 rounded-md border">
                        <b>Nota:</b> Se muestra una muestra aleatoria de 500 de los {accidentesData.length.toLocaleString('es-ES')} accidentes totales para garantizar un rendimiento fluido del mapa.
                    </div>
                )}
            </CardHeader>
            <CardContent className="relative pt-2">
                {isLoading && activeLayer === 'bicimad' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <span className="ml-2">Cargando datos de BiciMAD...</span>
                    </div>
                )}
                {error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-red-100 z-10">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}
                <div ref={mapContainer} style={{ height: '600px', width: '100%' }} />
            </CardContent>
        </Card>
    );
};

export default MapaMovilidad;
