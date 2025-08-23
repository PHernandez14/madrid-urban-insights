
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
  isPercentage?: boolean;
  referenceLines?: Array<{ value: number; color?: string; label?: string }>; // líneas verticales (media/mediana)
}

const BarChart: React.FC<BarChartProps> = ({ 
  data, 
  title, 
  height = 300, 
  unit = '',
  isPercentage = false,
  referenceLines = []
}) => {
  console.log('📈 BarChart recibió:', { title, isPercentage, data });
  const maxValue = isPercentage ? 100 : Math.max(1, ...data.map(d => d.value));
  
  const formatValue = (value: number) => {
    if (isPercentage) {
      return `${value.toFixed(1)}%`;
    }
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toLocaleString();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
      
      <div className="space-y-4" style={{ height: height - 80 }}>
        {data.map((item, index) => {
          const barWidth = (item.value / maxValue) * 100;
          return (
            <div key={index} className="flex items-center space-x-3">
              <div className="relative group">
                <div className="w-24 text-sm font-medium text-gray-700 truncate cursor-help">
                  {item.name}
                </div>
                <div className="absolute bottom-full left-0 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                  {item.name}
                  <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
              
              <div className="flex-1 relative">
                <div className="bg-gray-100 rounded-full h-6 relative overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${barWidth}%`,
                      backgroundColor: item.color || '#3B82F6',
                      animation: `barGrow${index} 0.7s ease-out both`
                    }}
                  />
                  {referenceLines.map((ref, i) => {
                    const pct = Math.min(100, Math.max(0, (ref.value / maxValue) * 100));
                    return (
                      <div key={i} className="absolute top-0 bottom-0" style={{ left: `${pct}%` }}>
                        <div className="h-full w-[2px]" style={{ backgroundColor: ref.color || '#111827' }} />
                      </div>
                    );
                  })}
                  <div className="absolute inset-0 flex items-center justify-end pr-2">
                    <span className="text-xs font-medium text-gray-900">
                      {formatValue(item.value)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {referenceLines.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-600">
          {referenceLines.map((ref, i) => (
            <span key={i} className="inline-flex items-center gap-1">
              <span className="inline-block w-3 h-[2px]" style={{ backgroundColor: ref.color || '#111827' }} />
              {ref.label ? `${ref.label}: ${formatValue(ref.value)}` : formatValue(ref.value)}
            </span>
          ))}
        </div>
      )}

      <style>{`
        ${data.map((item, index) => {
          const barWidth = (item.value / maxValue) * 100;
          return `
            @keyframes barGrow${index} {
              from {
                width: 0%;
              }
              to {
                width: ${barWidth}%;
              }
            }
          `;
        }).join('')}
      `}</style>
    </div>
  );
};

export default BarChart;
