
import React from 'react';
import { Filter, X, BarChart3, TrendingUp } from 'lucide-react';
import { expandedKpiCategories, useCases } from '../data/expandedMadridData';

interface FilterPanelProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedMetric: string;
  onMetricChange: (metric: string) => void;
  selectedUseCase: string;
  onUseCaseChange: (useCase: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  selectedCategory,
  onCategoryChange,
  selectedMetric,
  onMetricChange,
  selectedUseCase,
  onUseCaseChange,
  isOpen,
  onToggle
}) => {
  const categories = Object.entries(expandedKpiCategories);
  const cases = Object.entries(useCases);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed top-20 left-4 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-3 hover:shadow-xl transition-shadow"
      >
        <Filter className="w-5 h-5 text-gray-600" />
      </button>

      {/* Filter Panel */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-xl border-r border-gray-200 z-40 transform transition-transform duration-300 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: '320px' }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Filtros y Análisis</h2>
            <button
              onClick={onToggle}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Use Cases Section */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-medium text-gray-700">Casos de Uso</h3>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => onUseCaseChange('')}
                  className={`w-full text-left p-3 rounded-lg border transition-all text-sm ${
                    selectedUseCase === ''
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="font-medium">Análisis Personalizado</div>
                  <div className="text-xs text-gray-500 mt-1">Selección manual de métricas</div>
                </button>
                
                {cases.map(([key, useCase]) => (
                  <button
                    key={key}
                    onClick={() => onUseCaseChange(key)}
                    className={`w-full text-left p-3 rounded-lg border transition-all text-sm ${
                      selectedUseCase === key
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="font-medium">{useCase.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{useCase.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Category Selection */}
            {selectedUseCase === '' && (
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <BarChart3 className="w-4 h-4 text-green-600" />
                  <h3 className="text-sm font-medium text-gray-700">Categoría</h3>
                </div>
                <div className="space-y-2">
                  {categories.map(([key, category]) => (
                    <button
                      key={key}
                      onClick={() => onCategoryChange(key)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        selectedCategory === key
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="font-medium">{category.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Metric Selection */}
            {selectedUseCase === '' && selectedCategory && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Métrica Principal</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {expandedKpiCategories[selectedCategory as keyof typeof expandedKpiCategories].metrics.map((metric) => (
                    <button
                      key={metric}
                      onClick={() => onMetricChange(metric)}
                      className={`w-full text-left p-2 rounded text-sm transition-all ${
                        selectedMetric === metric
                          ? 'bg-gray-100 text-gray-900 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {metric.charAt(0).toUpperCase() + metric.slice(1).replace(/([A-Z])/g, ' $1')}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Use Case Metrics Display */}
            {selectedUseCase !== '' && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Métricas del Caso de Uso</h3>
                <div className="space-y-2">
                  {useCases[selectedUseCase as keyof typeof useCases].metrics.map((metric) => (
                    <div
                      key={metric}
                      className="p-2 bg-gray-50 rounded text-sm text-gray-700"
                    >
                      {metric.charAt(0).toUpperCase() + metric.slice(1).replace(/([A-Z])/g, ' $1')}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-30"
          onClick={onToggle}
        />
      )}
    </>
  );
};

export default FilterPanel;
