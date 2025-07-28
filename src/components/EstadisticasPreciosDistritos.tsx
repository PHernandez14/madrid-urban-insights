import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { expandedUrbanIndicators } from '../data/expandedMadridData';

interface EstadisticasPreciosDistritosProps {
  selectedYear?: number;
}

const EstadisticasPreciosDistritos: React.FC<EstadisticasPreciosDistritosProps> = ({ selectedYear = 2024 }) => {
  // Obtener datos del año seleccionado
  const currentYearData = expandedUrbanIndicators.filter(d => d.year === selectedYear);
  
  // Calcular estadísticas
  const precios = currentYearData.map(d => d.averagePriceM2).filter(p => p > 0);
  const alquileres = currentYearData.map(d => d.averageRentPrice).filter(a => a > 0);
  
  const precioPromedio = precios.length > 0 ? Math.round(precios.reduce((a, b) => a + b, 0) / precios.length) : 0;
  const precioMaximo = precios.length > 0 ? Math.max(...precios) : 0;
  const precioMinimo = precios.length > 0 ? Math.min(...precios) : 0;
  
  const alquilerPromedio = alquileres.length > 0 ? Math.round(alquileres.reduce((a, b) => a + b, 0) / alquileres.length) : 0;
  const alquilerMaximo = alquileres.length > 0 ? Math.max(...alquileres) : 0;
  const alquilerMinimo = alquileres.length > 0 ? Math.min(...alquileres) : 0;

  // Top 10 distritos más caros
  const topDistritosCaros = currentYearData
    .filter(d => d.averagePriceM2 > 0)
    .sort((a, b) => b.averagePriceM2 - a.averagePriceM2)
    .slice(0, 10)
    .map(district => ({
      nombre: district.districtName,
      precio: district.averagePriceM2,
      alquiler: district.averageRentPrice,
      viviendaProtegida: district.protectedHousingPercentage
    }));

  // Top 10 distritos más baratos
  const topDistritosBaratos = currentYearData
    .filter(d => d.averagePriceM2 > 0)
    .sort((a, b) => a.averagePriceM2 - b.averagePriceM2)
    .slice(0, 10)
    .map(district => ({
      nombre: district.districtName,
      precio: district.averagePriceM2,
      alquiler: district.averageRentPrice,
      viviendaProtegida: district.protectedHousingPercentage
    }));

  // Distribución de precios por rangos
  const distribucionPrecios = [
    { rango: '< 2000€', cantidad: precios.filter(p => p < 2000).length, color: '#1a9850' },
    { rango: '2000-3000€', cantidad: precios.filter(p => p >= 2000 && p < 3000).length, color: '#91cf60' },
    { rango: '3000-4000€', cantidad: precios.filter(p => p >= 3000 && p < 4000).length, color: '#d9ef8b' },
    { rango: '4000-5000€', cantidad: precios.filter(p => p >= 4000 && p < 5000).length, color: '#fee08b' },
    { rango: '≥ 5000€', cantidad: precios.filter(p => p >= 5000).length, color: '#fc8d59' }
  ];

  // Correlación precio vs vivienda protegida
  const correlacionPrecioViviendaProtegida = currentYearData
    .filter(d => d.averagePriceM2 > 0 && d.protectedHousingPercentage > 0)
    .map(district => ({
      nombre: district.districtName,
      precio: district.averagePriceM2,
      viviendaProtegida: district.protectedHousingPercentage
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
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Precio Mínimo</h3>
          <p className="text-2xl font-bold text-green-600">{precioMinimo.toLocaleString()} €/m²</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500">Alquiler Promedio</h3>
          <p className="text-2xl font-bold text-purple-600">{alquilerPromedio.toLocaleString()} €/mes</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

        {/* Distribución de precios */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Precios</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={distribucionPrecios}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ rango, cantidad }) => `${rango}: ${cantidad}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="cantidad"
              >
                {distribucionPrecios.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, 'Distritos']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top 10 distritos más baratos */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 10 Distritos Más Baratos</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topDistritosBaratos}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nombre" angle={-45} textAnchor="end" height={80} fontSize={10} />
            <YAxis />
            <Tooltip formatter={(value) => [`${value} €/m²`, 'Precio']} />
            <Bar dataKey="precio" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Correlación precio vs vivienda protegida */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Precio vs Vivienda Protegida</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={correlacionPrecioViviendaProtegida}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nombre" angle={-45} textAnchor="end" height={80} fontSize={10} />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip formatter={(value, name) => [
              name === 'precio' ? `${value} €/m²` : `${value}%`,
              name === 'precio' ? 'Precio' : 'Vivienda Protegida'
            ]} />
            <Bar yAxisId="left" dataKey="precio" fill="#3b82f6" name="precio" />
            <Bar yAxisId="right" dataKey="viviendaProtegida" fill="#ef4444" name="viviendaProtegida" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Información adicional */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">Información del Mercado Inmobiliario ({selectedYear})</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
          <div>
            <strong>Rango de precios:</strong> {precioMinimo.toLocaleString()} - {precioMaximo.toLocaleString()} €/m²
          </div>
          <div>
            <strong>Diferencia máxima:</strong> {(precioMaximo - precioMinimo).toLocaleString()} €/m²
          </div>
          <div>
            <strong>Distritos con datos:</strong> {precios.length} de {currentYearData.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstadisticasPreciosDistritos; 