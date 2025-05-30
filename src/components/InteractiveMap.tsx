
import React, { useState, useMemo } from 'react';
import { Info, MapPin } from 'lucide-react';
import { ExpandedUrbanIndicators, expandedMetricLabels } from '../data/expandedMadridData';

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
  const currentYearData = useMemo(() => {
    console.log('InteractiveMap - All data:', data.length);
    console.log('InteractiveMap - Selected year:', selectedYear);
    const filtered = data.filter(d => d.year === selectedYear);
    console.log('InteractiveMap - Filtered data:', filtered.length);
    return filtered;
  }, [data, selectedYear]);

  // Get metric values for color scaling
  const metricValues = useMemo(() => {
    return currentYearData.map(d => d[selectedMetric as keyof ExpandedUrbanIndicators] as number);
  }, [currentYearData, selectedMetric]);

  const { maxValue, minValue } = useMemo(() => {
    return {
      maxValue: Math.max(...metricValues),
      minValue: Math.min(...metricValues)
    };
  }, [metricValues]);

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

  console.log('InteractiveMap rendering with:', {
    dataLength: currentYearData.length,
    selectedMetric,
    selectedYear,
    selectedDistricts
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-96">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Mapa Interactivo de Madrid</h3>
          <p className="text-sm text-gray-600">
            Métrica: {expandedMetricLabels[selectedMetric]?.label || selectedMetric} ({selectedYear})
          </p>
          <p className="text-xs text-green-600">
            Datos cargados: {currentYearData.length} distritos
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Info className="w-4 h-4" />
          <span>Haz clic para seleccionar distritos</span>
        </div>
      </div>

      <div className="h-80 rounded-lg overflow-hidden bg-gray-50 relative">
        {currentYearData.length > 0 ? (
          <div className="absolute inset-0 grid grid-cols-4 gap-1 p-4">
            {currentYearData.slice(0, 16).map((district, index) => {
              const isSelected = selectedDistricts.includes(district.districtId);
              const isHovered = hoveredDistrict === district.districtId;
              const value = getMetricValue(district.districtId);
              
              return (
                <div
                  key={district.districtId}
                  className={`relative rounded-lg border-2 transition-all duration-200 cursor-pointer flex flex-col justify-center items-center p-2 ${
                    isSelected 
                      ? 'border-blue-500 shadow-lg transform scale-105' 
                      : 'border-gray-300 hover:border-blue-400'
                  } ${isHovered ? 'shadow-md' : ''}`}
                  style={{
                    backgroundColor: getDistrictColor(district.districtId),
                    minHeight: '60px'
                  }}
                  onClick={() => onDistrictSelect(district.districtId)}
                  onMouseEnter={() => setHoveredDistrict(district.districtId)}
                  onMouseLeave={() => setHoveredDistrict(null)}
                >
                  <MapPin className="w-4 h-4 text-gray-700 mb-1" />
                  <span className="text-xs font-medium text-gray-900 text-center leading-tight">
                    {district.districtName}
                  </span>
                  <span className="text-xs text-gray-600 mt-1">
                    {formatValue(value, selectedMetric)}
                  </span>
                  
                  {isHovered && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                      {district.districtName}: {formatValue(value, selectedMetric)} {expandedMetricLabels[selectedMetric]?.unit}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-900"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-500">No hay datos disponibles para el año {selectedYear}</p>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-sm border p-3">
          <div className="text-xs font-medium text-gray-700 mb-2">Intensidad</div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Bajo</span>
            <div className="w-16 h-2 bg-gradient-to-r from-green-200 to-blue-600 rounded"></div>
            <span className="text-xs text-gray-500">Alto</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;
