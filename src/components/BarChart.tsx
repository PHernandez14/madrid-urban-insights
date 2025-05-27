
import React from 'react';

interface BarChartProps {
  data: Array<{
    name: string;
    value: number;
    color?: string;
  }>;
  title: string;
  height?: number;
  unit?: string;
}

const BarChart: React.FC<BarChartProps> = ({ 
  data, 
  title, 
  height = 300, 
  unit = '' 
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  const formatValue = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toLocaleString();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
      
      <div className="space-y-4" style={{ height: height - 80 }}>
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-24 text-sm font-medium text-gray-700 truncate">
              {item.name}
            </div>
            
            <div className="flex-1 relative">
              <div className="bg-gray-100 rounded-full h-6 relative overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${(item.value / maxValue) * 100}%`,
                    backgroundColor: item.color || '#3B82F6',
                    animation: `barGrow 0.7s ease-out ${index * 0.1}s both`
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-end pr-2">
                  <span className="text-xs font-medium text-gray-900">
                    {formatValue(item.value)}{unit}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes barGrow {
          from {
            width: 0%;
          }
          to {
            width: ${(100)}%;
          }
        }
      `}</style>
    </div>
  );
};

export default BarChart;
