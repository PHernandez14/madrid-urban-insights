
import React from 'react';
import { Calendar, Play, Pause } from 'lucide-react';
import { availableYears } from '../data/expandedMadridData';

interface YearSelectorProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
  isAnimating?: boolean;
  onToggleAnimation?: () => void;
}

const YearSelector: React.FC<YearSelectorProps> = ({
  selectedYear,
  onYearChange,
  isAnimating = false,
  onToggleAnimation
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Período Temporal</h3>
        </div>
        
        {onToggleAnimation && (
          <button
            onClick={onToggleAnimation}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isAnimating 
                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            }`}
          >
            {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isAnimating ? 'Pausar' : 'Animar'}</span>
          </button>
        )}
      </div>

      {/* Year buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {availableYears.map(year => (
          <button
            key={year}
            onClick={() => onYearChange(year)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedYear === year
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {year}
          </button>
        ))}
      </div>

      {/* Year slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{Math.min(...availableYears)}</span>
          <span>Año seleccionado: <strong>{selectedYear}</strong></span>
          <span>{Math.max(...availableYears)}</span>
        </div>
        <input
          type="range"
          min={Math.min(...availableYears)}
          max={Math.max(...availableYears)}
          value={selectedYear}
          onChange={(e) => onYearChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${((selectedYear - Math.min(...availableYears)) / (Math.max(...availableYears) - Math.min(...availableYears))) * 100}%, #E5E7EB ${((selectedYear - Math.min(...availableYears)) / (Math.max(...availableYears) - Math.min(...availableYears))) * 100}%, #E5E7EB 100%)`
          }}
        />
      </div>
    </div>
  );
};

export default YearSelector;
