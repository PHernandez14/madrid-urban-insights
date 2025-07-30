import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { preciosIdealistaMadrid, getPreciosIdealistaPorDistrito } from '../data/preciosIdealistaMadrid';

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

    // Crear mapa de precios por código de distrito usando datos de Idealista
    const preciosPorDistrito: Record<string, number> = {};
    preciosIdealistaMadrid.forEach(distrito => {
      preciosPorDistrito[distrito.codigoDistrito] = distrito.precioVentaM2;
      console.log(`Mapeando ${distrito.distritoNombre} (${distrito.distritoId}) -> código ${distrito.codigoDistrito}: ${distrito.precioVentaM2}€/m²`);
    });

    console.log('Precios Idealista por distrito:', preciosPorDistrito);

    // Función para obtener color según el precio (usando los mismos colores que la leyenda)
    const getColorByPrecio = (precio: number) => {
      if (precio >= 5000) return '#dc2626'; // Rojo oscuro - muy caro
      if (precio >= 4000) return '#f97316'; // Naranja - caro
      if (precio >= 3000) return '#eab308'; // Amarillo - medio-alto
      if (precio >= 2000) return '#86efac'; // Verde claro - medio
      if (precio >= 1000) return '#22c55e'; // Verde - barato
      return '#15803d'; // Verde oscuro - muy barato
    };

    // Función para obtener el estilo del polígono
    const getStyle = (feature: any) => {
      const codDistrito = feature.properties.CODDIS || feature.properties.COD_DIS || feature.properties.COD_DIS_TX;
      const precio = preciosPorDistrito[codDistrito];
      
      console.log(`Distrito ${codDistrito}: precio = ${precio}€/m²`);
      
      return {
        fillColor: precio ? getColorByPrecio(precio) : '#e5e7eb',
        weight: 2,
        opacity: 1,
        color: 'white',
        fillOpacity: precio ? 0.8 : 0.3
      };
    };

    // Función para crear el tooltip con datos de Idealista
    const createTooltip = (feature: any) => {
      const codDistrito = feature.properties.CODDIS || feature.properties.COD_DIS || feature.properties.COD_DIS_TX;
      const nombreDistrito = feature.properties.NOMDIS || feature.properties.NOMBRE || feature.properties.NOMBRE_DIS || feature.properties.nombre_distrito;
      const precio = preciosPorDistrito[codDistrito];
      
      if (!precio) {
        return `<div class="tooltip-content">
          <strong>${nombreDistrito}</strong><br/>
          <span class="text-gray-500">Sin datos de precios</span>
        </div>`;
      }
      
      // Buscar datos de Idealista del distrito
      const distritoData = preciosIdealistaMadrid.find(d => d.codigoDistrito === codDistrito);
      
      if (!distritoData) {
        return `<div class="tooltip-content">
          <strong>${nombreDistrito}</strong><br/>
          <span class="text-blue-600">Precio: ${precio.toLocaleString()} €/m²</span>
        </div>`;
      }
      
      return `<div class="tooltip-content">
        <strong>${nombreDistrito}</strong><br/>
        <span class="text-blue-600">Precio venta: ${distritoData.precioVentaM2.toLocaleString()} €/m²</span><br/>
        <span class="text-green-600">Alquiler: ${distritoData.precioAlquilerMensual.toLocaleString()} €/mes</span><br/>
        <span class="text-purple-600">Variación venta: ${distritoData.variacionAnualVenta}%</span><br/>
        <span class="text-orange-600">Variación alquiler: ${distritoData.variacionAnualAlquiler}%</span>
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

        console.log('Distritos agrupados:', Object.keys(distritosAgrupados));

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