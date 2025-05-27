
import React, { useState, useEffect } from 'react';
import { Users, Home, MapPin, TrendingUp } from 'lucide-react';
import Header from '../components/Header';
import KPICard from '../components/KPICard';
import DistrictCard from '../components/DistrictCard';
import BarChart from '../components/BarChart';
import ComparisonChart from '../components/ComparisonChart';
import InteractiveMap from '../components/InteractiveMap';
import RadarChart from '../components/RadarChart';
import ScatterPlot from '../components/ScatterPlot';
import FilterPanel from '../components/FilterPanel';
import YearSelector from '../components/YearSelector';
import { 
  expandedUrbanIndicators, 
  expandedKpiCategories, 
  expandedMetricLabels,
  useCases,
  availableYears 
} from '../data/expandedMadridData';

const Index = () => {
  const [activeView, setActiveView] = useState<'overview' | 'districts' | 'comparison' | 'analysis'>('overview');
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('demographics');
  const [selectedMetric, setSelectedMetric] = useState<string>('population');
  const [selectedUseCase, setSelectedUseCase] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animation effect for year selector
  useEffect(() => {
    if (isAnimating) {
      const interval = setInterval(() => {
        setSelectedYear(prev => {
          const currentIndex = availableYears.indexOf(prev);
          const nextIndex = (currentIndex + 1) % availableYears.length;
          return availableYears[nextIndex];
        });
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isAnimating]);

  // Get current year data
  const currentYearData = expandedUrbanIndicators.filter(d => d.year === selectedYear);

  // Calculate totals for current year
  const totalPopulation = currentYearData.reduce((sum, d) => sum + d.population, 0);
  const averagePrice = Math.round(currentYearData.reduce((sum, d) => sum + d.averagePriceM2, 0) / currentYearData.length);
  const totalMetroStations = currentYearData.reduce((sum, d) => sum + d.metroStations, 0);
  const averageIncome = Math.round(currentYearData.reduce((sum, d) => sum + d.averageIncome, 0) / currentYearData.length);

  const handleDistrictSelect = (districtId: string) => {
    if (activeView === 'comparison' || activeView === 'analysis') {
      setSelectedDistricts(prev => {
        if (prev.includes(districtId)) {
          return prev.filter(id => id !== districtId);
        } else if (prev.length < 4) {
          return [...prev, districtId];
        }
        return prev;
      });
    } else {
      setSelectedDistricts([districtId]);
    }
  };

  const getTopDistrictsData = (metric: keyof typeof expandedUrbanIndicators[0], count: number = 5) => {
    return currentYearData
      .sort((a, b) => (b[metric] as number) - (a[metric] as number))
      .slice(0, count)
      .map(d => ({
        name: d.districtName,
        value: d[metric] as number,
        color: expandedKpiCategories[selectedCategory as keyof typeof expandedKpiCategories]?.color || '#3B82F6'
      }));
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Year Selector */}
      <YearSelector
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        isAnimating={isAnimating}
        onToggleAnimation={() => setIsAnimating(!isAnimating)}
      />

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Población Total"
          value={totalPopulation}
          unit="habitantes"
          icon={<Users className="w-4 h-4" />}
          color="#3B82F6"
          trend={{ value: 2.1, isPositive: true }}
        />
        <KPICard
          title="Precio Medio m²"
          value={averagePrice}
          unit="€"
          icon={<Home className="w-4 h-4" />}
          color="#10B981"
          trend={{ value: 3.8, isPositive: true }}
        />
        <KPICard
          title="Estaciones Metro"
          value={totalMetroStations}
          unit="estaciones"
          icon={<MapPin className="w-4 h-4" />}
          color="#F59E0B"
        />
        <KPICard
          title="Renta Media"
          value={averageIncome}
          unit="€/año"
          icon={<TrendingUp className="w-4 h-4" />}
          color="#8B5CF6"
          trend={{ value: 1.5, isPositive: true }}
        />
      </div>

      {/* Interactive Map and Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <InteractiveMap
          data={expandedUrbanIndicators}
          selectedMetric={selectedMetric}
          selectedDistricts={selectedDistricts}
          onDistrictSelect={handleDistrictSelect}
          selectedYear={selectedYear}
        />
        <BarChart
          data={getTopDistrictsData('population')}
          title={`Top 5 Distritos por Población (${selectedYear})`}
          unit=" hab"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <BarChart
          data={getTopDistrictsData('averagePriceM2')}
          title={`Top 5 Distritos por Precio m² (${selectedYear})`}
          unit="€"
        />
        <BarChart
          data={getTopDistrictsData('averageIncome')}
          title={`Top 5 Distritos por Renta Media (${selectedYear})`}
          unit="€"
        />
      </div>
    </div>
  );

  const renderDistricts = () => (
    <div className="space-y-6">
      <YearSelector
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentYearData.map(district => (
          <DistrictCard
            key={district.districtId}
            district={district}
            onSelect={handleDistrictSelect}
            isSelected={selectedDistricts.includes(district.districtId)}
          />
        ))}
      </div>
    </div>
  );

  const renderComparison = () => {
    const selectedData = currentYearData.filter(d => selectedDistricts.includes(d.districtId));
    const selectedCategoryMetrics = selectedUseCase 
      ? useCases[selectedUseCase as keyof typeof useCases]?.metrics || []
      : expandedKpiCategories[selectedCategory as keyof typeof expandedKpiCategories]?.metrics || [];

    return (
      <div className="space-y-8">
        <YearSelector
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
        />
        
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            Selecciona hasta 4 distritos para comparar. Actualmente seleccionados: {selectedDistricts.length}/4
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <InteractiveMap
            data={expandedUrbanIndicators}
            selectedMetric={selectedMetric}
            selectedDistricts={selectedDistricts}
            onDistrictSelect={handleDistrictSelect}
            selectedYear={selectedYear}
          />
          
          {selectedData.length > 0 && (
            <ComparisonChart
              districts={selectedData}
              metrics={selectedCategoryMetrics.slice(0, 4)}
              title={`Comparación: ${selectedUseCase ? useCases[selectedUseCase as keyof typeof useCases]?.name : expandedKpiCategories[selectedCategory as keyof typeof expandedKpiCategories]?.name || 'Métricas'} (${selectedYear})`}
            />
          )}
        </div>

        {selectedData.length >= 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RadarChart
              districts={selectedData}
              metrics={selectedCategoryMetrics.slice(0, 6)}
              title="Comparación Multidimensional"
            />
            
            {selectedCategoryMetrics.length >= 2 && (
              <ScatterPlot
                data={selectedData}
                xMetric={selectedCategoryMetrics[0]}
                yMetric={selectedCategoryMetrics[1]}
                title="Análisis de Correlación"
                selectedDistricts={selectedDistricts}
              />
            )}
          </div>
        )}

        {selectedData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedData.map(district => (
              <DistrictCard
                key={district.districtId}
                district={district}
                onSelect={handleDistrictSelect}
                isSelected={true}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderAnalysis = () => {
    const selectedData = currentYearData.filter(d => selectedDistricts.includes(d.districtId));
    
    return (
      <div className="space-y-8">
        <YearSelector
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
        />
        
        <div className="bg-purple-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-purple-900 mb-2">Análisis Inteligente</h3>
          <p className="text-sm text-purple-800">
            Selecciona distritos y métricas para generar insights automáticos y patrones de correlación.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <InteractiveMap
            data={expandedUrbanIndicators}
            selectedMetric={selectedMetric}
            selectedDistricts={selectedDistricts}
            onDistrictSelect={handleDistrictSelect}
            selectedYear={selectedYear}
          />
          
          {currentYearData.length >= 2 && (
            <ScatterPlot
              data={currentYearData}
              xMetric="averageIncome"
              yMetric="averagePriceM2"
              title="Renta vs Precio Vivienda"
              selectedDistricts={selectedDistricts}
            />
          )}
        </div>

        {selectedData.length >= 3 && (
          <RadarChart
            districts={selectedData.slice(0, 4)}
            metrics={['population', 'averageIncome', 'accessibilityScore', 'greenSpaceM2PerCapita', 'economicActivityIndex']}
            title="Perfil Integral de Distritos Seleccionados"
          />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeView={activeView} onViewChange={setActiveView} />
      
      <FilterPanel
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedMetric={selectedMetric}
        onMetricChange={setSelectedMetric}
        selectedUseCase={selectedUseCase}
        onUseCaseChange={setSelectedUseCase}
        isOpen={filterPanelOpen}
        onToggle={() => setFilterPanelOpen(!filterPanelOpen)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'overview' && renderOverview()}
        {activeView === 'districts' && renderDistricts()}
        {activeView === 'comparison' && renderComparison()}
        {activeView === 'analysis' && renderAnalysis()}
      </main>
    </div>
  );
};

export default Index;
