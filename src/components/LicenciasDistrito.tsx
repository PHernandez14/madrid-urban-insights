import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import datosComerciales from '../data/datosComercialesMadrid.json';

const LicenciasDistrito: React.FC = () => {
  const chartData = datosComerciales.map(d => ({
    name: d.nombre,
    Concedidas: d.licencias.concedidas,
    'En Trámite': d.licencias.enTramite,
    Denegadas: d.licencias.denegadas,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estado de Licencias por Distrito</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 95 }}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis 
              type="category" 
              dataKey="name" 
              width={120}
              tick={{ fontSize: 12 }}
            />
            <Tooltip />
            <Legend wrapperStyle={{ position: 'relative', marginTop: '20px' }} />
            <Bar dataKey="Concedidas" stackId="a" fill="#22c55e" />
            <Bar dataKey="En Trámite" stackId="a" fill="#f97316" />
            <Bar dataKey="Denegadas" stackId="a" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default LicenciasDistrito;

