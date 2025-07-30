import React, { useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { viviendasTuristicasMadrid } from '../data/viviendasTuristicasMadrid';

const ViviendasTuristicas: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const totalVUTs = viviendasTuristicasMadrid.reduce((sum, d) => sum + d.numeroVUTs, 0);
  const distritoMasVUTs = viviendasTuristicasMadrid.reduce((max, d) => d.numeroVUTs > max.numeroVUTs ? d : max, viviendasTuristicasMadrid[0]);
  const distritoMenosVUTs = viviendasTuristicasMadrid.reduce((min, d) => d.numeroVUTs < min.numeroVUTs ? d : min, viviendasTuristicasMadrid[0]);

  const chartData = [...viviendasTuristicasMadrid]
    .sort((a, b) => b.numeroVUTs - a.numeroVUTs)
    .map(d => ({ name: d.distritoNombre, value: d.numeroVUTs }));

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([40.4168, -3.7038], 11);
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const vutsPorDistrito: Record<number, number> = {};
    viviendasTuristicasMadrid.forEach(distrito => {
      vutsPorDistrito[parseInt(distrito.codigoDistrito, 10)] = distrito.numeroVUTs;
    });

    const getColorByVUTs = (vuts: number) => {
      if (vuts > 5000) return '#800026';
      if (vuts > 1000) return '#BD0026';
      if (vuts > 500) return '#E31A1C';
      if (vuts > 300) return '#FC4E2A';
      if (vuts > 100) return '#FD8D3C';
      if (vuts > 50) return '#FEB24C';
      return '#FFEDA0';
    };

    fetch('/barrios_madrid.geojson')
      .then(res => res.json())
      .then(data => {
        L.geoJSON(data, {
          style: (feature) => {
            const codDistrito = parseInt(feature?.properties.CODDIS, 10);
            const numVUTs = vutsPorDistrito[codDistrito] || 0;
            return {
              fillColor: getColorByVUTs(numVUTs),
              weight: 1,
              opacity: 1,
              color: 'white',
              fillOpacity: 0.7
            };
          },
          onEachFeature: (feature, layer) => {
            const codDistrito = parseInt(feature?.properties.CODDIS, 10);
            const nombreDistrito = feature?.properties.NOMDIS;
            const numVUTs = vutsPorDistrito[codDistrito] || 0;
            layer.bindTooltip(`
              <div class="p-2 bg-white rounded shadow-lg border">
                <h3 class="font-bold text-lg">${nombreDistrito}</h3>
                <p>Viviendas Turísticas: <strong>${numVUTs.toLocaleString()}</strong></p>
              </div>
            `);
          }
        }).addTo(map);
      });
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Análisis de Viviendas de Uso Turístico (VUTs)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-orange-50 p-4 rounded-lg text-center shadow-sm">
            <p className="text-sm text-orange-800 font-semibold">Total VUTs en Madrid</p>
            <p className="text-2xl font-bold text-orange-900">{totalVUTs.toLocaleString()}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg text-center shadow-sm">
            <p className="text-sm text-red-800 font-semibold">Distrito con Más VUTs</p>
            <p className="text-lg font-bold text-red-900">{distritoMasVUTs.distritoNombre} ({distritoMasVUTs.numeroVUTs.toLocaleString()})</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg text-center shadow-sm">
            <p className="text-sm text-yellow-800 font-semibold">Distrito con Menos VUTs</p>
            <p className="text-lg font-bold text-yellow-900">{distritoMenosVUTs.distritoNombre} ({distritoMenosVUTs.numeroVUTs.toLocaleString()})</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h4 className="text-md font-semibold text-gray-800 mb-4 text-center">Nº de VUTs por Distrito</h4>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip formatter={(value: number) => `${value.toLocaleString()} VUTs`} />
              <Bar dataKey="value" fill="#FC4E2A" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h4 className="text-md font-semibold text-gray-800 mb-4 text-center">Mapa de Concentración de VUTs</h4>
          <div ref={mapRef} className="h-[400px] w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default ViviendasTuristicas; 