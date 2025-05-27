
import React from 'react';
import { MapPin, Users, Home, TrendingUp } from 'lucide-react';
import { UrbanIndicators } from '../data/madridData';

interface DistrictCardProps {
  district: UrbanIndicators;
  onSelect: (districtId: string) => void;
  isSelected?: boolean;
}

const DistrictCard: React.FC<DistrictCardProps> = ({ district, onSelect, isSelected = false }) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toLocaleString();
  };

  return (
    <div 
      className={`bg-white rounded-xl border-2 transition-all duration-200 cursor-pointer hover:shadow-lg ${
        isSelected 
          ? 'border-blue-500 shadow-md ring-2 ring-blue-100' 
          : 'border-gray-200 hover:border-blue-300'
      }`}
      onClick={() => onSelect(district.districtId)}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {district.districtName}
            </h3>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-1" />
              <span>Distrito de Madrid</span>
            </div>
          </div>
          {isSelected && (
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-blue-600" />
            <div>
              <p className="text-xs text-gray-500">Población</p>
              <p className="text-sm font-semibold">{formatNumber(district.population)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Home className="w-4 h-4 text-green-600" />
            <div>
              <p className="text-xs text-gray-500">Precio m²</p>
              <p className="text-sm font-semibold">{formatNumber(district.averagePriceM2)}€</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">{district.metroStations}</p>
            <p className="text-xs text-gray-500">Metro</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">{district.schools}</p>
            <p className="text-xs text-gray-500">Colegios</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">{district.averageCommuteTime}min</p>
            <p className="text-xs text-gray-500">Commute</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Renta Media</p>
              <p className="text-sm font-semibold">{formatNumber(district.averageIncome)}€</p>
            </div>
            <div className="flex items-center space-x-1 text-sm">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className={`font-medium ${
                district.unemploymentRate < 8 ? 'text-green-600' : 
                district.unemploymentRate < 12 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {district.unemploymentRate}% paro
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistrictCard;
