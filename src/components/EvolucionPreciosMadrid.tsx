import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';
import { evolucionPreciosMadrid, estadisticasEvolucion, getEvolucionPorDistrito } from '../data/evolucionPreciosMadrid';

interface EvolucionPreciosMadridProps {
  selectedYear?: number;
}

const EvolucionPreciosMadrid: React.FC<EvolucionPreciosMadridProps> = ({ selectedYear = 2024 }) => {
  const [distritosSeleccionados, setDistritosSeleccionados] = useState<string[]>([
    'salamanca', 'centro', 'chamartin', 'villaverde'
  ]);

  const distritosDisponibles = [
    { id: 'salamanca', nombre: 'Salamanca', color: '#ef4444', campo: 'precioSalamanca' },
    { id: 'centro', nombre: 'Centro', color: '#f97316', campo: 'precioCentro' },
    { id: 'chamartin', nombre: 'Chamartín', color: '#eab308', campo: 'precioChamartin' },
    { id: 'retiro', nombre: 'Retiro', color: '#84cc16', campo: 'precioRetiro' },
    { id: 'chamberi', nombre: 'Chamberí', color: '#22c55e', campo: 'precioChamberi' },
    { id: 'tetuan', nombre: 'Tetuán', color: '#06b6d4', campo: 'precioTetuán' },
    { id: 'arganzuela', nombre: 'Arganzuela', color: '#8b5cf6', campo: 'precioArganzuela' },
    { id: 'fuencarral-el-pardo', nombre: 'Fuencarral-El Pardo', color: '#ec4899', campo: 'precioFuencarral' },
    { id: 'moncloa-aravaca', nombre: 'Moncloa-Aravaca', color: '#f59e0b', campo: 'precioMoncloa' },
    { id: 'latina', nombre: 'Latina', color: '#10b981', campo: 'precioLatina' },
    { id: 'carabanchel', nombre: 'Carabanchel', color: '#3b82f6', campo: 'precioCarabanchel' },
    { id: 'usera', nombre: 'Usera', color: '#6366f1', campo: 'precioUsera' },
    { id: 'puente-vallecas', nombre: 'Puente de Vallecas', color: '#f43f5e', campo: 'precioPuenteVallecas' },
    { id: 'moratalaz', nombre: 'Moratalaz', color: '#a855f7', campo: 'precioMoratalaz' },
    { id: 'ciudad-lineal', nombre: 'Ciudad Lineal', color: '#14b8a6', campo: 'precioCiudadLineal' },
    { id: 'hortaleza', nombre: 'Hortaleza', color: '#f97316', campo: 'precioHortaleza' },
    { id: 'villaverde', nombre: 'Villaverde', color: '#84cc16', campo: 'precioVillaverde' },
    { id: 'villa-vallecas', nombre: 'Villa de Vallecas', color: '#06b6d4', campo: 'precioVillaVallecas' },
    { id: 'vicalvaro', nombre: 'Vicálvaro', color: '#8b5cf6', campo: 'precioVicalvaro' },
    { id: 'san-blas-canillejas', nombre: 'San Blas-Canillejas', color: '#ec4899', campo: 'precioSanBlas' },
    { id: 'barajas', nombre: 'Barajas', color: '#f59e0b', campo: 'precioBarajas' }
  ];

  const handleDistritoChange = (distritoId: string) => {
    setDistritosSeleccionados(prev => {
      if (prev.includes(distritoId)) {
        return prev.filter(id => id !== distritoId);
      } else {
        return [...prev, distritoId];
      }
    });
  };

  // Preparar datos para el gráfico
  const datosGrafico = evolucionPreciosMadrid.map(año => {
    const datos: any = { año: año.año };
    
    distritosSeleccionados.forEach(distritoId => {
      const distrito = distritosDisponibles.find(d => d.id === distritoId);
      if (distrito) {
        datos[distritoId] = año[distrito.campo as keyof typeof año] || 0;
      }
    });
    
    return datos;
  });

  // Calcular estadísticas de evolución
  const precioInicial = evolucionPreciosMadrid[0]?.precioMedioMadrid || 0;
  const precioFinal = evolucionPreciosMadrid[evolucionPreciosMadrid.length - 1]?.precioMedioMadrid || 0;
  const incrementoTotal = ((precioFinal - precioInicial) / precioInicial) * 100;

  return (
    <div className="space-y-6">
      {/* Título y descripción */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-xl font-bold text-blue-900 mb-2">Evolución Histórica de Precios (2000-2024)</h3>
        <p className="text-blue-800 text-sm">
          Análisis de la evolución de precios de vivienda en Madrid desde el año 2000 hasta 2024. 
          Selecciona los distritos que desees comparar para visualizar sus tendencias históricas.
        </p>
      </div>

      {/* Selector de distritos */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">Distritos a comparar</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {distritosDisponibles.map(distrito => (
            <label key={distrito.id} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={distritosSeleccionados.includes(distrito.id)}
                onChange={() => handleDistritoChange(distrito.id)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{distrito.nombre}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Gráfico de evolución */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Evolución de Precios por Distrito</h4>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={datosGrafico}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="año" 
              type="number"
              domain={[2000, 2024]}
              tickCount={13}
            />
            <YAxis 
              domain={[0, 6000]}
              tickFormatter={(value) => `${value}€`}
            />
            <Tooltip 
              formatter={(value: number) => [`${value.toLocaleString()} €/m²`, 'Precio']}
              labelFormatter={(label) => `Año ${label}`}
            />
            <Legend />
            {distritosSeleccionados.map(distritoId => {
              const distrito = distritosDisponibles.find(d => d.id === distritoId);
              return (
                <Area
                  key={distritoId}
                  type="monotone"
                  dataKey={distritoId}
                  stroke={distrito?.color || '#3b82f6'}
                  fill={distrito?.color || '#3b82f6'}
                  fillOpacity={0.3}
                  name={distrito?.nombre || distritoId}
                />
              );
            })}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Estadísticas de evolución */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h5 className="text-sm font-medium text-gray-500">Precio Inicial (2000)</h5>
          <p className="text-2xl font-bold text-green-600">{precioInicial.toLocaleString()} €/m²</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h5 className="text-sm font-medium text-gray-500">Precio Actual (2024)</h5>
          <p className="text-2xl font-bold text-blue-600">{precioFinal.toLocaleString()} €/m²</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h5 className="text-sm font-medium text-gray-500">Incremento Total</h5>
          <p className="text-2xl font-bold text-purple-600">+{incrementoTotal.toFixed(1)}%</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h5 className="text-sm font-medium text-gray-500">Años Analizados</h5>
          <p className="text-2xl font-bold text-orange-600">{estadisticasEvolucion.añosAnalizados}</p>
        </div>
      </div>

      {/* Información adicional */}
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h4 className="text-sm font-semibold text-yellow-900 mb-2">Análisis de la Evolución</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-800">
          <div>
            <strong>Período de crecimiento (2000-2008):</strong> Incremento del 167% en 8 años
          </div>
          <div>
            <strong>Crisis inmobiliaria (2008-2016):</strong> Caída del 31% en 8 años
          </div>
          <div>
            <strong>Recuperación (2017-2024):</strong> Incremento del 27% en 7 años
          </div>
          <div>
            <strong>Pico histórico:</strong> {estadisticasEvolucion.picoHistorico.toLocaleString()} €/m² (2008)
          </div>
        </div>
      </div>

      {/* Gráfico de índice de precios */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Índice de Precios (Base 2000 = 100)</h4>
        
        {/* Cuadro explicativo */}
        <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-200">
          <h5 className="text-sm font-semibold text-blue-900 mb-2">¿Qué es el Índice de Precios?</h5>
          <div className="text-sm text-blue-800 space-y-2">
            <p>
              <strong>Definición:</strong> El índice de precios es una medida que muestra la evolución relativa de los precios 
              de vivienda en Madrid desde el año 2000, tomando ese año como referencia (valor = 100).
            </p>
            <p>
              <strong>Interpretación:</strong>
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><strong>100 (2000):</strong> Precio base de referencia</li>
              <li><strong>200 (2010):</strong> Los precios se duplicaron respecto a 2000</li>
              <li><strong>150 (2005):</strong> Los precios aumentaron un 50% respecto a 2000</li>
              <li><strong>80 (2015):</strong> Los precios cayeron un 20% respecto a 2000</li>
            </ul>
            <p className="mt-2">
              <strong>Ventaja:</strong> Permite comparar fácilmente la evolución de precios a lo largo del tiempo, 
              independientemente del valor absoluto de los precios.
            </p>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={evolucionPreciosMadrid}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="año" 
              type="number"
              domain={[2000, 2024]}
              tickCount={13}
            />
            <YAxis 
              domain={[0, 300]}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip 
              formatter={(value: number) => [`${value.toFixed(1)}`, 'Índice']}
              labelFormatter={(label) => `Año ${label}`}
            />
            <Line 
              type="monotone" 
              dataKey="indicePrecios" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EvolucionPreciosMadrid; 