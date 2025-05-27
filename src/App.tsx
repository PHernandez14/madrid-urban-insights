
import React, { useState } from 'react';

const App = () => {
  const [activeTab, setActiveTab] = useState('resumen');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con navegación */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-blue-600">Dashboard Urbano Madrid</h1>
            <nav className="flex space-x-4">
              <button 
                onClick={() => setActiveTab('resumen')}
                className={`px-4 py-2 rounded ${activeTab === 'resumen' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'}`}
              >
                Resumen
              </button>
              <button 
                onClick={() => setActiveTab('distritos')}
                className={`px-4 py-2 rounded ${activeTab === 'distritos' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'}`}
              >
                Distritos
              </button>
              <button 
                onClick={() => setActiveTab('comparar')}
                className={`px-4 py-2 rounded ${activeTab === 'comparar' ? 'bg-blue-100 text-blue-700' : 'text-gray-600'}`}
              >
                Comparar
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'resumen' && <ResumenView />}
        {activeTab === 'distritos' && <DistritosView />}
        {activeTab === 'comparar' && <CompararView />}
      </main>
    </div>
  );
};

// Componentes simples que funcionan garantizado
const ResumenView = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">Población Total</h3>
      <p className="text-3xl font-bold text-blue-600">3.2M</p>
      <p className="text-sm text-green-600">+2.1% vs año anterior</p>
    </div>
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">Precio Medio m²</h3>
      <p className="text-3xl font-bold text-blue-600">4.2K€</p>
      <p className="text-sm text-green-600">+3.8% vs año anterior</p>
    </div>
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">Distritos</h3>
      <p className="text-3xl font-bold text-blue-600">21</p>
      <p className="text-sm text-gray-600">distritos totales</p>
    </div>
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">Renta Media</h3>
      <p className="text-3xl font-bold text-blue-600">45K€</p>
      <p className="text-sm text-green-600">+1.5% vs año anterior</p>
    </div>
  </div>
);

const DistritosView = () => {
  const distritos = [
    { nombre: 'Centro', poblacion: '131K', precio: '5.2K€', renta: '43K€' },
    { nombre: 'Chamartín', poblacion: '141K', precio: '5.1K€', renta: '52K€' },
    { nombre: 'Salamanca', poblacion: '146K', precio: '6.1K€', renta: '59K€' },
    { nombre: 'Retiro', poblacion: '118K', precio: '5.3K€', renta: '49K€' },
    { nombre: 'Chamberí', poblacion: '143K', precio: '4.8K€', renta: '48K€' },
    { nombre: 'Tetuán', poblacion: '155K', precio: '3.9K€', renta: '39K€' },
    { nombre: 'Arganzuela', poblacion: '180K', precio: '4.1K€', renta: '41K€' },
    { nombre: 'Moncloa', poblacion: '117K', precio: '4.5K€', renta: '46K€' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {distritos.map((distrito, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <h3 className="text-xl font-semibold mb-4 text-gray-900">{distrito.nombre}</h3>
          <div className="space-y-2">
            <p><span className="font-medium text-gray-700">Población:</span> <span className="text-blue-600">{distrito.poblacion}</span></p>
            <p><span className="font-medium text-gray-700">Precio m²:</span> <span className="text-green-600">{distrito.precio}</span></p>
            <p><span className="font-medium text-gray-700">Renta media:</span> <span className="text-purple-600">{distrito.renta}</span></p>
          </div>
        </div>
      ))}
    </div>
  );
};

const CompararView = () => {
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  
  const distritos = ['Centro', 'Chamartín', 'Salamanca', 'Retiro', 'Chamberí', 'Tetuán'];

  const toggleDistrict = (distrito: string) => {
    setSelectedDistricts(prev => 
      prev.includes(distrito) 
        ? prev.filter(d => d !== distrito)
        : [...prev, distrito]
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">Comparación de Distritos</h2>
        <p className="text-gray-600 mb-4">Selecciona distritos para comparar sus métricas.</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {distritos.map((distrito) => (
            <button
              key={distrito}
              onClick={() => toggleDistrict(distrito)}
              className={`p-3 rounded-lg border transition-colors ${
                selectedDistricts.includes(distrito)
                  ? 'bg-blue-100 border-blue-500 text-blue-700'
                  : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {distrito}
            </button>
          ))}
        </div>
        
        {selectedDistricts.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Distritos Seleccionados:</h3>
            <p className="text-blue-700">{selectedDistricts.join(', ')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
