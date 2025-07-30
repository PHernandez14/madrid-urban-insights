import React, { useEffect, useRef, useState } from 'react';
import L, { FeatureGroup } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { preciosOficialesMadrid } from '../data/preciosOficialesMadrid';

// Definimos una interfaz más específica para nuestras features del GeoJSON
interface FeatureProperties {
  CODDIS: string;
  NOMDIS: string;
}

interface FeatureWithProps extends GeoJSON.Feature<GeoJSON.Geometry, FeatureProperties> {}

interface MapaPreciosDistritosProps {
  selectedYear: number;
}

const MapaPreciosDistritos: React.FC<MapaPreciosDistritosProps> = ({ selectedYear }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
  const [viewMode, setViewMode] = useState<'venta' | 'alquiler'>('venta');

  const preciosVenta: Record<number, number> = {};
  const preciosAlquiler: Record<number, number> = {};
  preciosOficialesMadrid.forEach(d => {
    const distritoId = parseInt(d.codigoDistrito, 10);
    preciosVenta[distritoId] = d.precioVentaM2;
    preciosAlquiler[distritoId] = d.precioAlquilerM2;
  });

  const getColor = (precio: number) => {
    if (viewMode === 'venta') {
      if (precio < 2500) return '#a5f3fc';
      if (precio < 4000) return '#06b6d4';
      if (precio < 6000) return '#0e7490';
      return '#164e63';
    } else { // Alquiler
      if (precio < 15) return '#a7f3d0';
      if (precio < 18) return '#34d399';
      if (precio < 21) return '#059669';
      return '#047857';
    }
  };
  
  const updateMap = () => {
    if (!geoJsonLayerRef.current) return;
    geoJsonLayerRef.current.eachLayer(layer => {
      const feature = (layer as L.GeoJSON<FeatureProperties>).feature as FeatureWithProps;
      if (!feature || !feature.properties) return;

      const codDistrito = parseInt(feature.properties.CODDIS, 10);
      const precio = viewMode === 'venta' ? preciosVenta[codDistrito] : preciosAlquiler[codDistrito];
      
      (layer as L.Path).setStyle({
        fillColor: precio ? getColor(precio) : '#e5e7eb',
      });

      layer.bindTooltip(`
        <div class="p-2 bg-white rounded shadow-lg border">
          <h3 class="font-bold text-lg">${feature.properties.NOMDIS}</h3>
          <p>${viewMode === 'venta' ? 'Venta' : 'Alquiler'}: <strong>${precio?.toLocaleString()} €/m²</strong></p>
        </div>
      `);
    });
  };

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    
    const map = L.map(mapRef.current).setView([40.4168, -3.7038], 11);
    mapInstanceRef.current = map;
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    fetch('/barrios_madrid.geojson').then(res => res.json()).then(data => {
      geoJsonLayerRef.current = L.geoJSON(data, {
        style: (feature?: GeoJSON.Feature<GeoJSON.Geometry, FeatureProperties>) => {
          if (!feature) return {};
          return { weight: 1, opacity: 1, color: 'white', fillOpacity: 0.7 };
        }
      }).addTo(map);
      updateMap();
    });
  }, []);
  
  useEffect(() => {
    updateMap();
  }, [viewMode]);

  return (
    <div className="relative">
      <div className="absolute top-2 right-2 z-[1000] flex space-x-1 bg-gray-200 p-1 rounded-lg">
        <button onClick={() => setViewMode('venta')} className={`px-3 py-1 text-sm rounded-md ${viewMode === 'venta' ? 'bg-white shadow' : ''}`}>Venta</button>
        <button onClick={() => setViewMode('alquiler')} className={`px-3 py-1 text-sm rounded-md ${viewMode === 'alquiler' ? 'bg-white shadow' : ''}`}>Alquiler</button>
      </div>
      <div ref={mapRef} className="h-[500px] w-full rounded-lg shadow-md" />
    </div>
  );
};

export default MapaPreciosDistritos; 