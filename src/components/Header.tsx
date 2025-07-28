
import React from 'react';
import { Search, BarChart, TrendingUp, Users, Brain } from 'lucide-react';

interface HeaderProps {
  activeView: 'overview' | 'analysis' | 'comparison' | 'ai';
  onViewChange: (view: 'overview' | 'analysis' | 'comparison' | 'ai') => void;
}

const Header: React.FC<HeaderProps> = ({ activeView, onViewChange }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-red-600 rounded-lg flex items-center justify-center">
                <BarChart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Dashboard Urbano</h1>
                <p className="text-sm text-gray-600">Madrid - Análisis Interactivo</p>
              </div>
            </div>
          </div>

          <nav className="flex space-x-1">
            <button
              onClick={() => onViewChange('overview')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeView === 'overview'
                  ? 'bg-blue-100 text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-2">
                <BarChart className="w-4 h-4" />
                <span>Resumen</span>
              </div>
            </button>
            <button
              onClick={() => onViewChange('analysis')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeView === 'analysis'
                  ? 'bg-blue-100 text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>Análisis</span>
              </div>
            </button>
            <button
              onClick={() => onViewChange('comparison')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeView === 'comparison'
                  ? 'bg-blue-100 text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Comparar</span>
              </div>
            </button>
            <button
              onClick={() => onViewChange('ai')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeView === 'ai'
                  ? 'bg-blue-100 text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4" />
                <span>IA</span>
              </div>
            </button>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar distrito..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
