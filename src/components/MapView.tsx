
import React, { useState } from 'react';
import { MapPin, Info } from 'lucide-react';
import { madridDistricts, urbanIndicators, UrbanIndicators } from '../data/madridData';

interface MapViewProps {
  selectedDistricts: string[];
  onDistrictSelect: (districtId: string) => void;
  metric?: string;
}

const MapView: React.FC<MapViewProps> = ({ selectedDistricts, onDistrictSelect, metric = 'population' }) => {
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);

  const getDistrictData = (districtId: string): UrbanIndicators | undefined => {
    return urbanIndicators.find(d => d.districtId === districtId);
  };

  const getMetricValue = (districtId: string): number => {
    const data = getDistrictData(districtId);
    if (!data) return 0;
    return data[metric as keyof UrbanIndicators] as number;
  };

  const allMetricValues = madridDistricts.map(d => getMetricValue(d.id));
  const maxValue = Math.max(...allMetricValues);
  const minValue = Math.min(...allMetricValues);

  const getIntensity = (value: number): number => {
    if (maxValue === minValue) return 0.5;
    return (value - minValue) / (maxValue - minValue);
  };

  const getDistrictColor = (districtId: string): string => {
    const value = getMetricValue(districtId);
    const intensity = getIntensity(value);
    
    if (selectedDistricts.includes(districtId)) {
      return `rgba(59, 130, 246, ${0.7 + intensity * 0.3})`;
    }
    
    return `rgba(59, 130, 246, ${0.2 + intensity * 0.4})`;
  };

  const formatValue = (value: number): string => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toLocaleString();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-96">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Mapa de Distritos</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Info className="w-4 h-4" />
          <span>Haz clic para seleccionar distritos</span>
        </div>
      </div>

      {/* Simplified map visualization */}
      <div className="relative bg-gray-50 rounded-lg h-80 overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-4 gap-1 p-4">
          {madridDistricts.map((district, index) => {
            const data = getDistrictData(district.id);
            const isSelected = selectedDistricts.includes(district.id);
            const isHovered = hoveredDistrict === district.id;
            
            return (
              <div
                key={district.id}
                className={`relative rounded-lg border-2 transition-all duration-200 cursor-pointer flex flex-col justify-center items-center p-2 ${
                  isSelected 
                    ? 'border-blue-500 shadow-lg transform scale-105' 
                    : 'border-gray-300 hover:border-blue-400'
                } ${isHovered ? 'shadow-md' : ''}`}
                style={{
                  backgroundColor: getDistrictColor(district.id),
                  minHeight: '60px'
                }}
                onClick={() => onDistrictSelect(district.id)}
                onMouseEnter={() => setHoveredDistrict(district.id)}
                onMouseLeave={() => setHoveredDistrict(null)}
              >
                <MapPin className="w-4 h-4 text-gray-700 mb-1" />
                <span className="text-xs font-medium text-gray-900 text-center">
                  {district.name}
                </span>
                {data && (
                  <span className="text-xs text-gray-600">
                    {formatValue(getMetricValue(district.id))}
                  </span>
                )}
                
                {isHovered && data && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                    {district.name}: {formatValue(getMetricValue(district.id))}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-900"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-sm border p-3">
          <div className="text-xs font-medium text-gray-700 mb-2">Intensidad</div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Bajo</span>
            <div className="w-16 h-2 bg-gradient-to-r from-blue-200 to-blue-600 rounded"></div>
            <span className="text-xs text-gray-500">Alto</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
