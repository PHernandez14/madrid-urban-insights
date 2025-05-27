
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
  icon?: React.ReactNode;
}

const KPICard: React.FC<KPICardProps> = ({ 
  title, 
  value, 
  unit = '', 
  trend, 
  color = '#3B82F6',
  icon 
}) => {
  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return `${(val / 1000000).toFixed(1)}M`;
      } else if (val >= 1000) {
        return `${(val / 1000).toFixed(0)}K`;
      }
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            {icon && (
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${color}20`, color }}
              >
                {icon}
              </div>
            )}
            <p className="text-sm font-medium text-gray-600">{title}</p>
          </div>
          
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-gray-900">
              {formatValue(value)}
            </span>
            {unit && (
              <span className="text-sm text-gray-500">{unit}</span>
            )}
          </div>

          {trend && (
            <div className="flex items-center mt-2">
              {trend.isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
              )}
              <span 
                className={`text-sm font-medium ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {Math.abs(trend.value)}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs año anterior</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KPICard;
