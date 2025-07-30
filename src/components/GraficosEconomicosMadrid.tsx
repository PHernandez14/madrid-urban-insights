import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, Label } from 'recharts';
import { datosEconomicosOficialesMadrid } from '../data/datosEconomicosOficialesMadrid';

interface GraficosEconomicosMadridProps {
  selectedYear: number;
}

const GraficosEconomicosMadrid: React.FC<GraficosEconomicosMadridProps> = ({ selectedYear }) => {

  const topRenta = [...datosEconomicosOficialesMadrid]
    .sort((a, b) => b.rentaMediaPersona - a.rentaMediaPersona)
    .slice(0, 5)
    .map(d => ({ name: d.distritoNombre, value: d.rentaMediaPersona }));

  const topParo = [...datosEconomicosOficialesMadrid]
    .sort((a, b) => a.tasaParo - b.tasaParo)
    .slice(0, 5)
    .map(d => ({ name: d.distritoNombre, value: d.tasaParo }));

  const correlacionData = datosEconomicosOficialesMadrid.map(d => ({
    x: d.rentaMediaPersona,
    y: d.tasaParo,
    name: d.distritoNombre,
  }));

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h4 className="text-md font-semibold text-gray-800 mb-4 text-center">Top 5 Distritos con Mayor Renta Media</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topRenta} layout="vertical" margin={{ left: 100 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip formatter={(value: number) => `${value.toLocaleString()} €`} />
              <Bar dataKey="value" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h4 className="text-md font-semibold text-gray-800 mb-4 text-center">Top 5 Distritos con Menor Tasa de Paro</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topParo} layout="vertical" margin={{ left: 100 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip formatter={(value: number) => `${value}%`} />
              <Bar dataKey="value" fill="#EC4899" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
        <h4 className="text-md font-semibold text-gray-800 mb-4 text-center">Correlación Renta Media vs. Tasa de Paro</h4>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid />
            <XAxis type="number" dataKey="x" name="Renta Media por Persona" unit="€">
              <Label value="Renta Media por Persona (€)" offset={-15} position="insideBottom" />
            </XAxis>
            <YAxis type="number" dataKey="y" name="Tasa de Paro" unit="%">
              <Label value="Tasa de Paro (%)" angle={-90} position="insideLeft" />
            </YAxis>
            <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(value, name) => (name === 'Renta Media por Persona' ? `${(value as number).toLocaleString()} €` : `${value}%`)} />
            <Scatter name="Distritos" data={correlacionData} fill="#7C3AED" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GraficosEconomicosMadrid; 