import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import KPICard from './KPICard';
import { Loader2, Bike, ArrowDownToLine, TowerControl } from 'lucide-react';

interface BiciMADStation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  free_bikes: number;
  empty_slots: number;
}

const EstadisticasBiciMAD: React.FC = () => {
  const [stations, setStations] = useState<BiciMADStation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stationsRes = await fetch('https://api.citybik.es/v2/networks/bicimad');
        if (!stationsRes.ok) throw new Error('No se pudo obtener la información de BiciMAD');
        
        const stationsData = await stationsRes.json();
        setStations(stationsData.network.stations);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const kpis = React.useMemo(() => {
    if (!stations.length) {
      return { totalBikes: 0, totalDocks: 0, totalStations: 0 };
    }

    const totalBikes = stations.reduce((sum, station) => sum + station.free_bikes, 0);
    const totalDocks = stations.reduce((sum, station) => sum + station.empty_slots, 0);
    const totalStations = stations.length;

    return { totalBikes, totalDocks, totalStations };
  }, [stations]);

  if (isLoading) {
    return (
      <Card className="flex items-center justify-center p-8 h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Cargando estadísticas de BiciMAD...</span>
      </Card>
    );
  }

  if (error) {
    return <Card className="p-4 bg-red-50 text-red-700">{error}</Card>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estado de la Red BiciMAD en Tiempo Real</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KPICard
            title="Estaciones Totales"
            value={kpis.totalStations}
            icon={<TowerControl className="w-4 h-4" />}
            color="#06B6D4"
          />
          <KPICard
            title="Bicicletas Disponibles"
            value={kpis.totalBikes}
            icon={<Bike className="w-4 h-4" />}
            color="#10B981"
          />
          <KPICard
            title="Anclajes Libres"
            value={kpis.totalDocks}
            icon={<ArrowDownToLine className="w-4 h-4" />}
            color="#F59E0B"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default EstadisticasBiciMAD;
