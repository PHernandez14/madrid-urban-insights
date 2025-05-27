import React, { useState } from 'react';
import { Users, Home, MapPin, TrendingUp } from 'lucide-react';
import Header from '../components/Header';
import KPICard from '../components/KPICard';
import DistrictCard from '../components/DistrictCard';
import BarChart from '../components/BarChart';
import ComparisonChart from '../components/ComparisonChart';
import MapView from '../components/MapView';
import FilterPanel from '../components/FilterPanel';
import { urbanIndicators, madridDistricts, kpiCategories } from '../data/madridData';

const Index = () => {
  const [activeView, setActiveView] = useState<'overview' | 'districts' | 'comparison'>('overview');
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('demographics');
  const [selectedMetric, setSelectedMetric] = useState<string>('population');
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);

  // Calculate total metrics
  const totalPopulation = urbanIndicators.reduce((sum, d) => sum + d.population, 0);
  const averagePrice = Math.round(urbanIndicators.reduce((sum, d) => sum + d.averagePriceM2, 0) / urbanIndicators.length);
  const totalMetroStations = urbanIndicators.reduce((sum, d) => sum + d.metroStations, 0);
  const averageIncome = Math.round(urbanIndicators.reduce((sum, d) => sum + d.averageIncome, 0) / urbanIndicators.length);

  const handleDistrictSelect = (districtId: string) => {
    if (activeView === 'comparison') {
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

  const getTopDistrictsData = (metric: keyof typeof urbanIndicators[0], count: number = 5) => {
    return urbanIndicators
      .sort((a, b) => (b[metric] as number) - (a[metric] as number))
      .slice(0, count)
      .map(d => ({
        name: d.districtName,
        value: d[metric] as number,
        color: kpiCategories[selectedCategory as keyof typeof kpiCategories]?.color || '#3B82F6'
      }));
  };

  const renderOverview = () => (
    <div className="space-y-8">
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

      {/* Charts and Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <BarChart
          data={getTopDistrictsData('population')}
          title="Top 5 Distritos por Población"
          unit=" hab"
        />
        <MapView
          selectedDistricts={selectedDistricts}
          onDistrictSelect={handleDistrictSelect}
          metric={selectedMetric}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <BarChart
          data={getTopDistrictsData('averagePriceM2')}
          title="Top 5 Distritos por Precio m²"
          unit="€"
        />
        <BarChart
          data={getTopDistrictsData('averageIncome')}
          title="Top 5 Distritos por Renta Media"
          unit="€"
        />
      </div>
    </div>
  );

  const renderDistricts = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {urbanIndicators.map(district => (
        <DistrictCard
          key={district.districtId}
          district={district}
          onSelect={handleDistrictSelect}
          isSelected={selectedDistricts.includes(district.districtId)}
        />
      ))}
    </div>
  );

  const renderComparison = () => {
    const selectedData = urbanIndicators.filter(d => selectedDistricts.includes(d.districtId));
    const selectedCategoryMetrics = kpiCategories[selectedCategory as keyof typeof kpiCategories]?.metrics || [];

    return (
      <div className="space-y-8">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            Selecciona hasta 4 distritos para comparar. Actualmente seleccionados: {selectedDistricts.length}/4
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <MapView
            selectedDistricts={selectedDistricts}
            onDistrictSelect={handleDistrictSelect}
            metric={selectedMetric}
          />
          
          {selectedData.length > 0 && (
            <ComparisonChart
              districts={selectedData}
              metrics={selectedCategoryMetrics.slice(0, 4)}
              title={`Comparación: ${kpiCategories[selectedCategory as keyof typeof kpiCategories]?.name || 'Métricas'}`}
            />
          )}
        </div>

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeView={activeView} onViewChange={setActiveView} />
      
      <FilterPanel
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedMetric={selectedMetric}
        onMetricChange={setSelectedMetric}
        isOpen={filterPanelOpen}
        onToggle={() => setFilterPanelOpen(!filterPanelOpen)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'overview' && renderOverview()}
        {activeView === 'districts' && renderDistricts()}
        {activeView === 'comparison' && renderComparison()}
      </main>
    </div>
  );
};

export default Index;
