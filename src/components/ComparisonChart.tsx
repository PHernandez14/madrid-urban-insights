
import React from 'react';
import { UrbanIndicators, metricLabels } from '../data/madridData';

interface ComparisonChartProps {
  districts: UrbanIndicators[];
  metrics: string[];
  title: string;
}

const ComparisonChart: React.FC<ComparisonChartProps> = ({ districts, metrics, title }) => {
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const normalizeValue = (value: number, metric: string, allValues: number[]) => {
    const max = Math.max(...allValues);
    const min = Math.min(...allValues);
    if (max === min) return 0.5;
    return (value - min) / (max - min);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
      
      <div className="space-y-6">
        {metrics.map((metric, metricIndex) => {
          const allValues = districts.map(d => d[metric as keyof UrbanIndicators] as number);
          const metricInfo = metricLabels[metric];
          
          return (
            <div key={metric} className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">
                {metricInfo.label}
              </h4>
              
              <div className="space-y-2">
                {districts.map((district, districtIndex) => {
                  const value = district[metric as keyof UrbanIndicators] as number;
                  const normalizedWidth = normalizeValue(value, metric, allValues) * 100;
                  
                  return (
                    <div key={district.districtId} className="flex items-center space-x-3">
                      <div className="w-20 text-xs text-gray-600 truncate">
                        {district.districtName}
                      </div>
                      
                      <div className="flex-1 relative">
                        <div className="bg-gray-100 rounded h-4 relative overflow-hidden">
                          <div
                            className="h-full rounded transition-all duration-500"
                            style={{
                              width: `${normalizedWidth}%`,
                              backgroundColor: colors[districtIndex % colors.length],
                              animation: `slideIn 0.5s ease-out ${districtIndex * 0.1}s both`
                            }}
                          />
                        </div>
                        <div className="absolute right-2 top-0 h-4 flex items-center">
                          <span className="text-xs font-medium text-gray-700">
                            {value.toLocaleString()} {metricInfo.unit}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            width: 0%;
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default ComparisonChart;
