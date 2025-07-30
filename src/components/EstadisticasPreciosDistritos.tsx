import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { preciosOficialesMadrid } from '../data/preciosOficialesMadrid';

interface EstadisticasPreciosDistritosProps {
  selectedYear: number;
}

const EstadisticasPreciosDistritos: React.FC<EstadisticasPreciosDistritosProps> = ({ selectedYear }) => {
  const [viewMode, setViewMode] = useState<'venta' | 'alquiler'>('venta');

  const data = preciosOficialesMadrid.map(d => ({
    name: d.distritoNombre,
    venta: d.precioVentaM2,
    alquiler: d.precioAlquilerM2,
  }));

  const sortedData = [...data].sort((a, b) => (viewMode === 'venta' ? b.venta - a.venta : b.alquiler - a.alquiler));
  const top5Data = sortedData.slice(0, 5);
  
  const promedioVenta = Math.round(data.reduce((sum, d) => sum + d.venta, 0) / data.length);
  const promedioAlquiler = Math.round(data.reduce((sum, d) => sum + d.alquiler, 0) * 10) / 10;

  return (
    <div className="space-y-8">
      {/* Selector y KPIs */}
      <div className="flex justify-between items-start">
        <div className="flex space-x-2 bg-gray-200 p-1 rounded-lg">
          <button onClick={() => setViewMode('venta')} className={`px-4 py-1 rounded-md text-sm font-medium ${viewMode === 'venta' ? 'bg-white text-blue-600 shadow' : 'text-gray-600'}`}>Venta</button>
          <button onClick={() => setViewMode('alquiler')} className={`px-4 py-1 rounded-md text-sm font-medium ${viewMode === 'alquiler' ? 'bg-white text-green-600 shadow' : 'text-gray-600'}`}>Alquiler</button>
        </div>
        <div className="text-right">
          <p className="font-semibold">{viewMode === 'venta' ? 'Precio Promedio Venta' : 'Precio Promedio Alquiler'}</p>
          <p className="text-2xl font-bold text-gray-800">
            {viewMode === 'venta' ? `${promedioVenta.toLocaleString()} €/m²` : `${promedioAlquiler.toLocaleString()} €/m²`}
          </p>
        </div>
      </div>

      {/* Gráfico */}
      <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
        <h4 className="text-md font-semibold text-gray-800 mb-4 text-center">
          Top 5 Distritos por Precio de {viewMode === 'venta' ? 'Venta' : 'Alquiler'}
        </h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={top5Data} layout="vertical" margin={{ left: 100 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={100} />
            <Tooltip formatter={(value: number) => `${value.toLocaleString()} €/m²`} />
            <Bar dataKey={viewMode} fill={viewMode === 'venta' ? '#3B82F6' : '#10B981'} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EstadisticasPreciosDistritos; 