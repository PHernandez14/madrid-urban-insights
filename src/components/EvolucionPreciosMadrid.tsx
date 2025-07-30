import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';
import { evolucionPreciosOficialesMadrid, estadisticasEvolucionOficial } from '../data/evolucionPreciosOficialesMadrid';

interface EvolucionPreciosMadridProps {
  selectedYear?: number;
}

const EvolucionPreciosMadrid: React.FC<EvolucionPreciosMadridProps> = ({ selectedYear = 2024 }) => {
  const datosGrafico = evolucionPreciosOficialesMadrid;

  const precioInicial = datosGrafico[0]?.precioMedioMadrid || 0;
  const precioFinal = datosGrafico[datosGrafico.length - 1]?.precioMedioMadrid || 0;
  const incrementoTotal = ((precioFinal - precioInicial) / precioInicial) * 100;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-xl font-bold text-blue-900 mb-2">Evolución Histórica del Precio de Vivienda</h3>
        <p className="text-sm text-blue-800">
          Esta gráfica muestra la evolución del precio medio del metro cuadrado en la Comunidad de Madrid, según datos oficiales del INE.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
          <p className="text-sm text-gray-600">Incremento (2000-{selectedYear})</p>
          <p className="text-2xl font-bold text-green-600">{incrementoTotal.toFixed(1)}%</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
          <p className="text-sm text-gray-600">Año con Precio Máximo</p>
          <p className="text-2xl font-bold text-red-600">{estadisticasEvolucionOficial.añoMaximo}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
          <p className="text-sm text-gray-600">Año con Precio Mínimo</p>
          <p className="text-2xl font-bold text-blue-600">{estadisticasEvolucionOficial.añoMinimo}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={datosGrafico}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="año" />
            <YAxis 
              tickFormatter={(value) => `${value.toLocaleString()} €`}
              width={80}
            />
            <Tooltip 
              formatter={(value: number) => [`${value.toLocaleString()} €/m²`, 'Precio Medio']} 
            />
            <Legend />
            <Area type="monotone" dataKey="precioMedioMadrid" name="Precio Medio (Com. Madrid)" stroke="#1d4ed8" fill="#60a5fa" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EvolucionPreciosMadrid; 