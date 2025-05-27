
import React, { useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Info } from 'lucide-react';
import { ExpandedUrbanIndicators, madridDistrictsGeoJSON, expandedMetricLabels } from '../data/expandedMadridData';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface InteractiveMapProps {
  data: ExpandedUrbanIndicators[];
  selectedMetric: string;
  selectedDistricts: string[];
  onDistrictSelect: (districtId: string) => void;
  selectedYear: number;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ 
  data, 
  selectedMetric, 
  selectedDistricts, 
  onDistrictSelect, 
  selectedYear 
}) => {
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);

  // Filter data by selected year
  const currentYearData = data.filter(d => d.year === selectedYear);

  // Get metric values for color scaling
  const metricValues = currentYearData.map(d => d[selectedMetric as keyof ExpandedUrbanIndicators] as number);
  const maxValue = Math.max(...metricValues);
  const minValue = Math.min(...metricValues);

  const getMetricValue = (districtId: string) => {
    const district = currentYearData.find(d => d.districtId === districtId);
    return district ? district[selectedMetric as keyof ExpandedUrbanIndicators] as number : 0;
  };

  const getIntensity = (value: number) => {
    if (maxValue === minValue) return 0.5;
    return (value - minValue) / (maxValue - minValue);
  };

  const getDistrictColor = (districtId: string) => {
    const value = getMetricValue(districtId);
    const intensity = getIntensity(value);
    
    if (selectedDistricts.includes(districtId)) {
      return `rgba(59, 130, 246, ${0.7 + intensity * 0.3})`;
    }
    return `rgba(34, 197, 94, ${0.3 + intensity * 0.5})`;
  };

  const formatValue = (value: number, metric: string) => {
    const metricInfo = expandedMetricLabels[metric];
    if (metricInfo?.format === 'percentage') {
      return `${value}%`;
    }
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toLocaleString();
  };

  const onEachFeature = (feature: any, layer: any) => {
    const districtId = feature.properties.id;
    const districtData = currentYearData.find(d => d.districtId === districtId);
    
    layer.on({
      mouseover: () => setHoveredDistrict(districtId),
      mouseout: () => setHoveredDistrict(null),
      click: () => onDistrictSelect(districtId)
    });

    if (districtData) {
      const value = getMetricValue(districtId);
      layer.bindTooltip(
        `<div class="font-semibold">${feature.properties.name}</div>
         <div>${expandedMetricLabels[selectedMetric]?.label}: ${formatValue(value, selectedMetric)} ${expandedMetricLabels[selectedMetric]?.unit}</div>`,
        { sticky: true }
      );
    }
  };

  const geoJsonStyle = (feature?: any) => {
    const districtId = feature?.properties?.id;
    const isSelected = selectedDistricts.includes(districtId);
    const isHovered = hoveredDistrict === districtId;

    return {
      fillColor: getDistrictColor(districtId),
      weight: isSelected ? 3 : isHovered ? 2 : 1,
      opacity: 1,
      color: isSelected ? '#3B82F6' : isHovered ? '#059669' : '#64748B',
      fillOpacity: 0.7
    };
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-96">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Mapa Interactivo de Madrid</h3>
          <p className="text-sm text-gray-600">
            Métrica: {expandedMetricLabels[selectedMetric]?.label} ({selectedYear})
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Info className="w-4 h-4" />
          <span>Haz clic para seleccionar distritos</span>
        </div>
      </div>

      <div className="h-80 rounded-lg overflow-hidden">
        <MapContainer
          center={[40.4168, -3.7038]}
          zoom={11}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <GeoJSON
            data={madridDistrictsGeoJSON as any}
            style={geoJsonStyle}
            onEachFeature={onEachFeature}
            key={`geojson-${selectedYear}`}
          />

          {currentYearData.map(district => (
            <Marker
              key={`marker-${district.districtId}-${selectedYear}`}
              position={district.coordinates}
              icon={L.divIcon({
                html: `<div class="w-3 h-3 rounded-full ${
                  selectedDistricts.includes(district.districtId) 
                    ? 'bg-blue-600 ring-2 ring-blue-200' 
                    : 'bg-green-600'
                }"></div>`,
                className: 'custom-div-icon',
                iconSize: [12, 12],
                iconAnchor: [6, 6]
              })}
            >
              <Popup>
                <div className="p-2">
                  <h4 className="font-semibold text-gray-900">{district.districtName}</h4>
                  <p className="text-sm text-gray-600">
                    {expandedMetricLabels[selectedMetric]?.label}: {formatValue(district[selectedMetric as keyof ExpandedUrbanIndicators] as number, selectedMetric)} {expandedMetricLabels[selectedMetric]?.unit}
                  </p>
                  <button
                    onClick={() => onDistrictSelect(district.districtId)}
                    className="mt-2 text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                  >
                    {selectedDistricts.includes(district.districtId) ? 'Deseleccionar' : 'Seleccionar'}
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default InteractiveMap;
