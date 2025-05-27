
import React from 'react';
import { Filter, X } from 'lucide-react';
import { kpiCategories } from '../data/madridData';

interface FilterPanelProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedMetric: string;
  onMetricChange: (metric: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  selectedCategory,
  onCategoryChange,
  selectedMetric,
  onMetricChange,
  isOpen,
  onToggle
}) => {
  const categories = Object.entries(kpiCategories);

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
        className={`fixed top-0 left-0 h-full bg-white shadow-xl border-r border-gray-200 z-40 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: '300px' }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
            <button
              onClick={onToggle}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Category Selection */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Categoría</h3>
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

            {/* Metric Selection */}
            {selectedCategory && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Métrica</h3>
                <div className="space-y-2">
                  {kpiCategories[selectedCategory as keyof typeof kpiCategories].metrics.map((metric) => (
                    <button
                      key={metric}
                      onClick={() => onMetricChange(metric)}
                      className={`w-full text-left p-2 rounded text-sm transition-all ${
                        selectedMetric === metric
                          ? 'bg-gray-100 text-gray-900 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {metric.charAt(0).toUpperCase() + metric.slice(1)}
                    </button>
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
