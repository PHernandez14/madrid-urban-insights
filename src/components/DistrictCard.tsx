
import React from 'react';
import { MapPin, Users, Home, TrendingUp } from 'lucide-react';
import { ExpandedUrbanIndicators } from '../data/expandedMadridData';

interface DistrictCardProps {
  district: ExpandedUrbanIndicators;
  onSelect: (districtId: string) => void;
  isSelected: boolean;
}

const DistrictCard: React.FC<DistrictCardProps> = ({ district, onSelect, isSelected }) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toLocaleString();
  };

  return (
    <div 
      className={`bg-white rounded-xl shadow-sm border transition-all duration-200 cursor-pointer hover:shadow-md ${
        isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => onSelect(district.districtId)}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">{district.districtName}</h3>
          </div>
          {isSelected && (
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Población</p>
                <p className="font-semibold">{formatNumber(district.population)}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Home className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Precio m²</p>
                <p className="font-semibold">{formatNumber(district.averagePriceM2)}€</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Renta Media</p>
                <p className="font-semibold">{formatNumber(district.averageIncome)}€</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600">Densidad</p>
              <p className="font-semibold">{formatNumber(district.populationDensity)} hab/km²</p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Metro: {district.metroStations}</span>
            <span>Zonas verdes: {district.greenSpaceM2PerCapita}m²/hab</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistrictCard;
