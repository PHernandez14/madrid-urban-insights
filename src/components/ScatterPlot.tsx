
import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';
import { ExpandedUrbanIndicators, expandedMetricLabels } from '../data/expandedMadridData';

interface ScatterPlotProps {
  data: ExpandedUrbanIndicators[];
  xMetric: string;
  yMetric: string;
  title: string;
  selectedDistricts?: string[];
  // Etiquetas opcionales para métricas no definidas en expandedMetricLabels
  metricLabels?: Record<string, { label: string; unit: string; format?: string }>;
  // Permite pasar puntos ya calculados (por ejemplo, desde datasets oficiales)
  points?: Array<{ name: string; x: number; y: number; isSelected?: boolean }>;
}

const ScatterPlot: React.FC<ScatterPlotProps> = ({ 
  data, 
  xMetric, 
  yMetric, 
  title,
  selectedDistricts = [],
  metricLabels,
  points
}) => {
  const formatValue = (value: number, metric: string): string => {
    const metricInfo = metricLabels?.[metric] || expandedMetricLabels[metric];
    if (metricInfo?.format === 'percentage') {
      return `${value}%`;
    }
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toLocaleString();
  };

  const scatterData = points && points.length
    ? points.map(p => ({ ...p, isSelected: !!p.isSelected }))
    : data.map(district => ({
        x: district[xMetric as keyof ExpandedUrbanIndicators] as number,
        y: district[yMetric as keyof ExpandedUrbanIndicators] as number,
        name: district.districtName,
        isSelected: selectedDistricts.includes(district.districtId)
      }));

  // Calculate correlation coefficient
  const calculateCorrelation = () => {
    const n = scatterData.length;
    const sumX = scatterData.reduce((sum, d) => sum + d.x, 0);
    const sumY = scatterData.reduce((sum, d) => sum + d.y, 0);
    const sumXY = scatterData.reduce((sum, d) => sum + d.x * d.y, 0);
    const sumX2 = scatterData.reduce((sum, d) => sum + d.x * d.x, 0);
    const sumY2 = scatterData.reduce((sum, d) => sum + d.y * d.y, 0);
    
    const correlation = (n * sumXY - sumX * sumY) / 
      Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    return isNaN(correlation) ? 0 : correlation;
  };

  const correlation = calculateCorrelation();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">
            {expandedMetricLabels[xMetric]?.label}: {formatValue(data.x, xMetric)} {expandedMetricLabels[xMetric]?.unit}
          </p>
          <p className="text-sm text-gray-600">
            {expandedMetricLabels[yMetric]?.label}: {formatValue(data.y, yMetric)} {expandedMetricLabels[yMetric]?.unit}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">
            Correlación: {correlation.toFixed(3)} 
            <span className={`ml-2 px-2 py-1 rounded text-xs ${
              Math.abs(correlation) > 0.7 ? 'bg-red-100 text-red-800' : 
              Math.abs(correlation) > 0.4 ? 'bg-yellow-100 text-yellow-800' : 
              'bg-green-100 text-green-800'
            }`}>
              {Math.abs(correlation) > 0.7 ? 'Fuerte' : 
               Math.abs(correlation) > 0.4 ? 'Moderada' : 'Débil'}
            </span>
          </p>
        </div>
      </div>
      
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              type="number" 
              dataKey="x"
              name={(metricLabels?.[xMetric] || expandedMetricLabels[xMetric])?.label}
              tick={{ fontSize: 12, fill: '#6B7280' }}
            >
              <Label 
                value={`${(metricLabels?.[xMetric] || expandedMetricLabels[xMetric])?.label} (${(metricLabels?.[xMetric] || expandedMetricLabels[xMetric])?.unit || ''})`}
                position="bottom"
                style={{ textAnchor: 'middle', fontSize: '12px', fill: '#6B7280' }}
              />
            </XAxis>
            <YAxis 
              type="number" 
              dataKey="y"
              name={(metricLabels?.[yMetric] || expandedMetricLabels[yMetric])?.label}
              tick={{ fontSize: 12, fill: '#6B7280' }}
            >
              <Label 
                value={`${(metricLabels?.[yMetric] || expandedMetricLabels[yMetric])?.label} (${(metricLabels?.[yMetric] || expandedMetricLabels[yMetric])?.unit || ''})`}
                angle={-90}
                position="insideLeft"
                style={{ textAnchor: 'middle', fontSize: '12px', fill: '#6B7280' }}
              />
            </YAxis>
            <Tooltip content={<CustomTooltip />} />
            
            <Scatter 
              data={scatterData.filter(d => !d.isSelected)} 
              fill="#10B981"
              opacity={0.6}
              r={6}
            />
            <Scatter 
              data={scatterData.filter(d => d.isSelected)} 
              fill="#3B82F6"
              opacity={0.8}
              r={8}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ScatterPlot;
