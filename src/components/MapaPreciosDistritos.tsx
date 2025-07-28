import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { expandedUrbanIndicators } from '../data/expandedMadridData';

interface MapaPreciosDistritosProps {
  selectedYear?: number;
}

const MapaPreciosDistritos: React.FC<MapaPreciosDistritosProps> = ({ selectedYear = 2024 }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Crear el mapa
    const map = L.map(mapRef.current).setView([40.4168, -3.7038], 11);
    mapInstanceRef.current = map;

    // Añadir capa de tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Obtener datos del año seleccionado
    const currentYearData = expandedUrbanIndicators.filter(d => d.year === selectedYear);
    
    // Crear mapa de precios por distrito
    const preciosPorDistrito: Record<string, number> = {};
    currentYearData.forEach(district => {
      preciosPorDistrito[district.districtId] = district.averagePriceM2;
    });

    // Función para obtener color según el precio
    const getColorByPrecio = (precio: number) => {
      if (precio >= 5000) return '#d73027'; // Rojo oscuro - muy caro
      if (precio >= 4000) return '#fc8d59'; // Naranja - caro
      if (precio >= 3000) return '#fee08b'; // Amarillo - medio-alto
      if (precio >= 2000) return '#d9ef8b'; // Verde claro - medio
      if (precio >= 1000) return '#91cf60'; // Verde - barato
      return '#1a9850'; // Verde oscuro - muy barato
    };

    // Función para obtener el estilo del polígono
    const getStyle = (feature: any) => {
      const codDistrito = feature.properties.CODDIS || feature.properties.COD_DIS || feature.properties.COD_DIS_TX;
      const precio = preciosPorDistrito[codDistrito];
      
      return {
        fillColor: precio ? getColorByPrecio(precio) : '#e5e7eb',
        weight: 2,
        opacity: 1,
        color: 'white',
        fillOpacity: precio ? 0.7 : 0.3
      };
    };

    // Función para crear el tooltip
    const createTooltip = (feature: any) => {
      const codDistrito = feature.properties.CODDIS || feature.properties.COD_DIS || feature.properties.COD_DIS_TX;
      const nombreDistrito = feature.properties.NOMBRE || feature.properties.NOMBRE_DIS || feature.properties.nombre_distrito;
      const precio = preciosPorDistrito[codDistrito];
      
      if (!precio) {
        return `<div class="tooltip-content">
          <strong>${nombreDistrito}</strong><br/>
          <span class="text-gray-500">Sin datos de precios</span>
        </div>`;
      }
      
      // Buscar datos completos del distrito
      const distritoData = currentYearData.find(d => d.districtId === codDistrito);
      
      return `<div class="tooltip-content">
        <strong>${nombreDistrito}</strong><br/>
        <span class="text-blue-600">Precio: ${precio.toLocaleString()} €/m²</span><br/>
        <span class="text-green-600">Alquiler: ${distritoData?.averageRentPrice?.toLocaleString() || 'N/A'} €/mes</span><br/>
        <span class="text-purple-600">Vivienda protegida: ${distritoData?.protectedHousingPercentage?.toFixed(1) || 'N/A'}%</span><br/>
        <span class="text-gray-600">Total viviendas: ${distritoData?.totalHousingUnits?.toLocaleString() || 'N/A'}</span>
      </div>`;
    };

    // Cargar GeoJSON de distritos
    fetch('/barrios_madrid.geojson')
      .then(response => response.json())
      .then(geojson => {
        // Agrupar features por distrito
        const distritosAgrupados: Record<string, any> = {};
        
        geojson.features.forEach((feature: any) => {
          const codDistrito = feature.properties.CODDIS || feature.properties.COD_DIS || feature.properties.COD_DIS_TX;
          if (!distritosAgrupados[codDistrito]) {
            distritosAgrupados[codDistrito] = {
              type: 'FeatureCollection',
              features: []
            };
          }
          distritosAgrupados[codDistrito].features.push(feature);
        });

        // Crear capas para cada distrito
        Object.entries(distritosAgrupados).forEach(([codDistrito, geojsonDistrito]) => {
          L.geoJSON(geojsonDistrito as any, {
            style: getStyle,
            onEachFeature: (feature, layer) => {
              layer.bindTooltip(createTooltip(feature), {
                permanent: false,
                direction: 'top',
                className: 'custom-tooltip'
              });
              
              layer.on('mouseover', function() {
                this.setStyle({
                  weight: 3,
                  fillOpacity: 0.9
                });
              });
              
              layer.on('mouseout', function() {
                this.setStyle(getStyle(feature));
              });
            }
          }).addTo(map);
        });
      })
      .catch(error => {
        console.error('Error cargando GeoJSON:', error);
      });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [selectedYear]);

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        className="w-full h-96 rounded-lg shadow-lg"
        style={{ zIndex: 1 }}
      />
      
      {/* Leyenda */}
      <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-md z-10">
        <h4 className="text-sm font-semibold mb-2">Precio por m²</h4>
        <div className="space-y-1">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-600 rounded mr-2"></div>
            <span className="text-xs">≥ 5000 €</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-orange-500 rounded mr-2"></div>
            <span className="text-xs">4000-4999 €</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-400 rounded mr-2"></div>
            <span className="text-xs">3000-3999 €</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-300 rounded mr-2"></div>
            <span className="text-xs">2000-2999 €</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
            <span className="text-xs">1000-1999 €</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-700 rounded mr-2"></div>
            <span className="text-xs">&lt; 1000 €</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapaPreciosDistritos; 