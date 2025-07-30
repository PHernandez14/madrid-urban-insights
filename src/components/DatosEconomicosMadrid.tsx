import React from 'react';
import { TrendingUp, Briefcase, Store } from 'lucide-react';
import { datosEconomicosOficialesMadrid } from '../data/datosEconomicosOficialesMadrid';

interface DatosEconomicosMadridProps {
  selectedYear: number;
}

const DatosEconomicosMadrid: React.FC<DatosEconomicosMadridProps> = ({ selectedYear }) => {
  const promedioRentaPersona = Math.round(
    datosEconomicosOficialesMadrid.reduce((sum, d) => sum + d.rentaMediaPersona, 0) / datosEconomicosOficialesMadrid.length
  );
  const promedioTasaParo = Math.round(
    (datosEconomicosOficialesMadrid.reduce((sum, d) => sum + d.tasaParo, 0) / datosEconomicosOficialesMadrid.length) * 10
  ) / 10;
  const totalLocales = datosEconomicosOficialesMadrid.reduce((sum, d) => sum + d.localesComerciales, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-purple-50 p-4 rounded-lg text-center shadow-sm">
        <Store className="mx-auto text-purple-600 mb-2" size={24} />
        <p className="text-sm text-purple-800 font-semibold">Locales Comerciales</p>
        <p className="text-2xl font-bold text-purple-900">{totalLocales.toLocaleString()}</p>
      </div>
      <div className="bg-indigo-50 p-4 rounded-lg text-center shadow-sm">
        <TrendingUp className="mx-auto text-indigo-600 mb-2" size={24} />
        <p className="text-sm text-indigo-800 font-semibold">Renta Media por Persona</p>
        <p className="text-2xl font-bold text-indigo-900">{promedioRentaPersona.toLocaleString()} €</p>
      </div>
      <div className="bg-pink-50 p-4 rounded-lg text-center shadow-sm">
        <Briefcase className="mx-auto text-pink-600 mb-2" size={24} />
        <p className="text-sm text-pink-800 font-semibold">Tasa de Paro Promedio</p>
        <p className="text-2xl font-bold text-pink-900">{promedioTasaParo}%</p>
      </div>
    </div>
  );
};

export default DatosEconomicosMadrid; 