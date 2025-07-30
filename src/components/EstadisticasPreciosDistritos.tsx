import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { preciosIdealistaMadrid, estadisticasIdealista } from '../data/preciosIdealistaMadrid';

interface EstadisticasPreciosDistritosProps {
  selectedYear?: number;
}

const EstadisticasPreciosDistritos: React.FC<EstadisticasPreciosDistritosProps> = ({ selectedYear = 2024 }) => {
  // Usar datos de Idealista
  const precios = preciosIdealistaMadrid.map(d => d.precioVentaM2);
  const alquileres = preciosIdealistaMadrid.map(d => d.precioAlquilerMensual);
  
  const precioPromedio = Math.round(precios.reduce((a, b) => a + b, 0) / precios.length);
  const precioMaximo = Math.max(...precios);
  const precioMinimo = Math.min(...precios);
  
  const alquilerPromedio = Math.round(alquileres.reduce((a, b) => a + b, 0) / alquileres.length);
  const alquilerMaximo = Math.max(...alquileres);
  const alquilerMinimo = Math.min(...alquileres);

  // Top 10 distritos más caros
  const topDistritosCaros = preciosIdealistaMadrid
    .sort((a, b) => b.precioVentaM2 - a.precioVentaM2)
    .slice(0, 10)
    .map(distrito => ({
      nombre: distrito.distritoNombre,
      precio: distrito.precioVentaM2,
      alquiler: distrito.precioAlquilerMensual,
      variacionVenta: distrito.variacionAnualVenta,
      variacionAlquiler: distrito.variacionAnualAlquiler
    }));

  // Correlación precio vs variación anual
  const correlacionPrecioVariacion = preciosIdealistaMadrid
    .map(distrito => ({
      nombre: distrito.distritoNombre,
      precio: distrito.precioVentaM2,
      variacionVenta: distrito.variacionAnualVenta,
      variacionAlquiler: distrito.variacionAnualAlquiler
    }))
    .sort((a, b) => b.precio - a.precio);

  return (
    <div className="space-y-6">
      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Precio Promedio</h3>
          <p className="text-2xl font-bold text-blue-600">{precioPromedio.toLocaleString()} €/m²</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Precio Máximo</h3>
          <p className="text-2xl font-bold text-red-600">{precioMaximo.toLocaleString()} €/m²</p>
          <p className="text-xs text-gray-500">{estadisticasIdealista.distritoMasCaro}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Precio Mínimo</h3>
          <p className="text-2xl font-bold text-green-600">{precioMinimo.toLocaleString()} €/m²</p>
          <p className="text-xs text-gray-500">{estadisticasIdealista.distritoMasBarato}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Alquiler Promedio</h3>
          <p className="text-2xl font-bold text-purple-600">{alquilerPromedio.toLocaleString()} €/mes</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 gap-6">
        {/* Top 10 distritos más caros */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 10 Distritos Más Caros</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topDistritosCaros}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nombre" angle={-45} textAnchor="end" height={80} fontSize={10} />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} €/m²`, 'Precio']} />
              <Bar dataKey="precio" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Correlación precio vs variación anual */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Precio vs Variación Anual</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={correlacionPrecioVariacion}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nombre" angle={-45} textAnchor="end" height={80} fontSize={10} />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip formatter={(value, name) => [
              name === 'precio' ? `${value} €/m²` : `${value}%`,
              name === 'precio' ? 'Precio' : 'Variación Venta'
            ]} />
            <Bar yAxisId="left" dataKey="precio" fill="#3b82f6" name="precio" />
            <Bar yAxisId="right" dataKey="variacionVenta" fill="#f59e0b" name="variacionVenta" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Información adicional */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">Información del Mercado Inmobiliario</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
          <div>
            <strong>Rango de precios:</strong> {precioMinimo.toLocaleString()} - {precioMaximo.toLocaleString()} €/m²
          </div>
          <div>
            <strong>Diferencia máxima:</strong> {(precioMaximo - precioMinimo).toLocaleString()} €/m²
          </div>
          <div>
            <strong>Variación media venta:</strong> {estadisticasIdealista.variacionMediaAnualVenta}%
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-blue-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
            <div>
              <strong>Variación media alquiler:</strong> {estadisticasIdealista.variacionMediaAnualAlquiler}%
            </div>
            <div>
              <strong>Total viviendas:</strong> {estadisticasIdealista.totalViviendas.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstadisticasPreciosDistritos; 