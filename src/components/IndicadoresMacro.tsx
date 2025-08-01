import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import KPICard from '@/components/KPICard';
import { datosMacroMadrid } from '../data/datosMacroeconomicosMadrid';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, User, Landmark, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const IndicadoresMacro: React.FC = () => {
  const ultimoDato = datosMacroMadrid[datosMacroMadrid.length - 1];

  const formatoMillones = (valor: number) => {
    return `${(valor / 1000000).toLocaleString('es-ES', { maximumFractionDigits: 0 })} M€`;
  };
  
  const formatoEuros = (valor: number) => {
    return `${valor.toLocaleString('es-ES')} €`;
  };

  const PibNominalTitle = (
    <div className="flex items-center">
      <span>{`PIB Nominal (${ultimoDato.ano})`}</span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="h-3 w-3 ml-2 text-muted-foreground cursor-help" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Valor total de todos los bienes y servicios finales<br/>producidos en un año, sin ajustar por inflación.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );

  const PibPerCapitaTitle = (
    <div className="flex items-center">
      <span>{`PIB per Cápita (${ultimoDato.ano})`}</span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="h-3 w-3 ml-2 text-muted-foreground cursor-help" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Indicador que mide la relación entre el nivel de<br/>renta de un país y su población.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Indicadores Macroeconómicos de la Comunidad de Madrid</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* KPIs */}
        <div className="grid gap-4 md:grid-cols-3">
          <KPICard
            title={PibNominalTitle}
            value={formatoMillones(ultimoDato.pib_nominal_miles_euros * 1000)}
            subtitle="Producto Interior Bruto"
            icon={<Landmark className="h-4 w-4 text-muted-foreground" />}
          />
          <KPICard
            title={PibPerCapitaTitle}
            value={formatoEuros(ultimoDato.pib_per_capita_euros)}
            subtitle="Renta media por habitante"
            icon={<User className="h-4 w-4 text-muted-foreground" />}
          />
          <KPICard
            title={`Crecimiento PIB (${ultimoDato.ano})`}
            value={`${ultimoDato.crecimiento_pib_porcentaje.toLocaleString('es-ES')}%`}
            subtitle="Variación interanual"
            icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          />
        </div>

        {/* Gráfico de Evolución */}
        <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Evolución del PIB y PIB per Cápita</h3>
             <ResponsiveContainer width="100%" height={400}>
                <LineChart data={datosMacroMadrid} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="ano" />
                    <YAxis yAxisId="left" label={{ value: 'PIB (Millones €)', angle: -90, position: 'insideLeft' }} 
                        tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                    />
                    <YAxis yAxisId="right" orientation="right" label={{ value: 'PIB per Cápita (€)', angle: -90, position: 'insideRight' }}
                        tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    />
                    <RechartsTooltip 
                      formatter={(value: number, name: string) => {
                        if (name === 'PIB Nominal') return [`${(value / 1000000).toLocaleString('es-ES', {maximumFractionDigits: 0})} M€`, name];
                        if (name === 'PIB per Cápita') return [`${value.toLocaleString('es-ES')} €`, name];
                        return [value, name];
                      }}
                    />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="pib_nominal_miles_euros" name="PIB Nominal" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line yAxisId="right" type="monotone" dataKey="pib_per_capita_euros" name="PIB per Cápita" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default IndicadoresMacro;
