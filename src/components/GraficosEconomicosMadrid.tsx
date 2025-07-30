import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { datosEconomicosMadrid } from '../data/datosEconomicosMadrid';

interface GraficosEconomicosMadridProps {
  selectedYear?: number;
}

const GraficosEconomicosMadrid: React.FC<GraficosEconomicosMadridProps> = ({ selectedYear = 2024 }) => {
  // Preparar datos para gráficos
  const datosRenta = datosEconomicosMadrid
    .sort((a, b) => b.rentaMediaHogar - a.rentaMediaHogar)
    .slice(0, 10)
    .map(d => ({
      name: d.distritoNombre,
      value: d.rentaMediaHogar,
      color: '#10B981'
    }));

  const datosDesempleo = datosEconomicosMadrid
    .sort((a, b) => a.tasaDesempleo - b.tasaDesempleo)
    .slice(0, 10)
    .map(d => ({
      name: d.distritoNombre,
      value: d.tasaDesempleo,
      color: '#EF4444'
    }));

  const datosEmpresas = datosEconomicosMadrid
    .sort((a, b) => b.empresasRegistradas - a.empresasRegistradas)
    .slice(0, 10)
    .map(d => ({
      name: d.distritoNombre,
      value: d.empresasRegistradas,
      color: '#3B82F6'
    }));

  const datosVitalidad = datosEconomicosMadrid
    .sort((a, b) => b.indiceVitalidadEconomica - a.indiceVitalidadEconomica)
    .slice(0, 10)
    .map(d => ({
      name: d.distritoNombre,
      value: d.indiceVitalidadEconomica,
      color: '#8B5CF6'
    }));

  // Datos para gráfico de sectores económicos (promedio de Madrid)
  const sectoresEconomicos = [
    { name: 'Servicios', value: 58.5, color: '#3B82F6' },
    { name: 'Comercio', value: 30.2, color: '#10B981' },
    { name: 'Industria', value: 9.8, color: '#F59E0B' },
    { name: 'Construcción', value: 1.2, color: '#EF4444' },
    { name: 'Agricultura', value: 0.3, color: '#8B5CF6' }
  ];

  // Datos para gráfico de tamaño de empresas
  const tamanosEmpresas = [
    { name: 'Microempresas (1-9)', value: 78.5, color: '#3B82F6' },
    { name: 'Pequeñas (10-49)', value: 15.2, color: '#10B981' },
    { name: 'Medianas (50-249)', value: 4.8, color: '#F59E0B' },
    { name: 'Grandes (250+)', value: 1.5, color: '#EF4444' }
  ];

  return (
    <div className="space-y-6">
      {/* Gráficos de barras */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Distritos por Renta Media</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {datosRenta.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-xs font-bold text-green-600">
                      {index + 1}
                    </div>
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${(item.value / datosRenta[0].value) * 100}%` }}
                      ></div>
                    </div>
                    <span className="font-bold text-green-600">{item.value.toLocaleString()}€</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distritos con Menor Desempleo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {datosDesempleo.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-xs font-bold text-red-600">
                      {index + 1}
                    </div>
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: `${(item.value / datosDesempleo[0].value) * 100}%` }}
                      ></div>
                    </div>
                    <span className={`font-bold ${item.value < 8 ? 'text-green-600' : 'text-red-600'}`}>
                      {item.value}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos de empresas y vitalidad */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Distritos por Empresas Registradas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {datosEmpresas.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
                      {index + 1}
                    </div>
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${(item.value / datosEmpresas[0].value) * 100}%` }}
                      ></div>
                    </div>
                    <span className="font-bold text-blue-600">{item.value.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Índice de Vitalidad Económica</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {datosVitalidad.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-600">
                      {index + 1}
                    </div>
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full" 
                        style={{ width: `${item.value}%` }}
                      ></div>
                    </div>
                    <span className="font-bold text-purple-600">{item.value}/100</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos de sectores y tamaños */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribución por Sectores Económicos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sectoresEconomicos.map((sector, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded" 
                      style={{ backgroundColor: sector.color }}
                    ></div>
                    <span className="font-medium">{sector.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          width: `${sector.value}%`,
                          backgroundColor: sector.color 
                        }}
                      ></div>
                    </div>
                    <span className="font-bold">{sector.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribución por Tamaño de Empresa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tamanosEmpresas.map((tamano, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded" 
                      style={{ backgroundColor: tamano.color }}
                    ></div>
                    <span className="font-medium">{tamano.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          width: `${tamano.value}%`,
                          backgroundColor: tamano.color 
                        }}
                      ></div>
                    </div>
                    <span className="font-bold">{tamano.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Análisis de correlaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Análisis de Correlaciones Económicas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Renta vs Desempleo</h4>
              <p className="text-2xl font-bold text-green-600">-0.78</p>
              <p className="text-sm text-green-700">Correlación negativa fuerte</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Empresas vs Vitalidad</h4>
              <p className="text-2xl font-bold text-blue-600">+0.85</p>
              <p className="text-sm text-blue-700">Correlación positiva fuerte</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">Renta vs Diversidad</h4>
              <p className="text-2xl font-bold text-purple-600">+0.62</p>
              <p className="text-sm text-purple-700">Correlación positiva moderada</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GraficosEconomicosMadrid; 