
import React from 'react';
import { Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import { ExpandedUrbanIndicators, expandedMetricLabels } from '../data/expandedMadridData';

interface RadarChartProps {
  districts: ExpandedUrbanIndicators[];
  metrics: string[];
  title: string;
}

const RadarChart: React.FC<RadarChartProps> = ({ districts, metrics, title }) => {
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  // Normalize values to 0-100 scale for radar chart
  const normalizeData = () => {
    const data: any[] = [];
    
    metrics.forEach(metric => {
      const allValues = districts.map(d => d[metric as keyof ExpandedUrbanIndicators] as number);
      const max = Math.max(...allValues);
      const min = Math.min(...allValues);
      
      const metricData: any = {
        metric: expandedMetricLabels[metric]?.label || metric,
        fullMark: 100
      };
      
      districts.forEach((district, index) => {
        const value = district[metric as keyof ExpandedUrbanIndicators] as number;
        const normalizedValue = max === min ? 50 : ((value - min) / (max - min)) * 100;
        metricData[district.districtName] = normalizedValue;
      });
      
      data.push(metricData);
    });
    
    return data;
  };

  const radarData = normalizeData();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
      
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <RechartsRadar data={radarData}>
            <PolarGrid />
            <PolarAngleAxis 
              dataKey="metric" 
              tick={{ fontSize: 12, fill: '#6B7280' }}
              className="text-xs"
            />
            <PolarRadiusAxis 
              angle={0} 
              domain={[0, 100]} 
              tick={{ fontSize: 10, fill: '#9CA3AF' }}
            />
            
            {districts.map((district, index) => (
              <Radar
                key={district.districtId}
                name={district.districtName}
                dataKey={district.districtName}
                stroke={colors[index % colors.length]}
                fill={colors[index % colors.length]}
                fillOpacity={0.1}
                strokeWidth={2}
              />
            ))}
            
            <Legend 
              wrapperStyle={{ fontSize: '12px' }}
              iconType="line"
            />
          </RechartsRadar>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        * Valores normalizados a escala 0-100 para comparación visual
      </div>
    </div>
  );
};

export default RadarChart;
