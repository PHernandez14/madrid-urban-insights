import React from 'react';
import { TrendingUp, Users, Building, Briefcase, Euro, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { datosEconomicosMadrid, getTopDistritosPorRenta, getTopDistritosPorDesempleo, getTopDistritosPorEmpresas, estadisticasEconomicasMadrid } from '../data/datosEconomicosMadrid';

interface DatosEconomicosMadridProps {
  selectedYear?: number;
}

const DatosEconomicosMadrid: React.FC<DatosEconomicosMadridProps> = ({ selectedYear = 2024 }) => {
  const topRenta = getTopDistritosPorRenta(5);
  const topDesempleo = getTopDistritosPorDesempleo(5);
  const topEmpresas = getTopDistritosPorEmpresas(5);

  const rentaMediaMadrid = estadisticasEconomicasMadrid.rentaMediaMadrid;
  const desempleoMedioMadrid = estadisticasEconomicasMadrid.desempleoMedioMadrid;

  return (
    <div className="space-y-6">
      {/* Resumen ejecutivo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Renta Media Madrid</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rentaMediaMadrid.toLocaleString()}€</div>
            <p className="text-xs text-muted-foreground">
              {selectedYear} - INE Encuesta de Condiciones de Vida
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Desempleo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{desempleoMedioMadrid}%</div>
            <p className="text-xs text-muted-foreground">
              {selectedYear} - EPA Q4 Ministerio de Trabajo
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empresas Registradas</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticasEconomicasMadrid.empresasTotalMadrid.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {selectedYear} - INE DIRCE
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Población Activa</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">65.2%</div>
            <p className="text-xs text-muted-foreground">
              Tasa de actividad media - EPA {selectedYear}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top 5 distritos por renta */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Top 5 Distritos por Renta Media
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topRenta.map((distrito, index) => (
              <div key={distrito.distritoId} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="w-8 h-8 flex items-center justify-center">
                    {index + 1}
                  </Badge>
                  <div>
                    <p className="font-medium">{distrito.distritoNombre}</p>
                    <p className="text-sm text-muted-foreground">
                      Renta per cápita: {distrito.rentaPerCapita.toLocaleString()}€
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">
                    {distrito.rentaMediaHogar.toLocaleString()}€
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Gini: {(distrito.indiceGini * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top 5 distritos por desempleo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-red-600" />
            Distritos con Menor Tasa de Desempleo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topDesempleo.map((distrito, index) => (
              <div key={distrito.distritoId} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="w-8 h-8 flex items-center justify-center">
                    {index + 1}
                  </Badge>
                  <div>
                    <p className="font-medium">{distrito.distritoNombre}</p>
                    <p className="text-sm text-muted-foreground">
                      Tasa actividad: {distrito.tasaActividad}%
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${distrito.tasaDesempleo < 8 ? 'text-green-600' : 'text-orange-600'}`}>
                    {distrito.tasaDesempleo}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Empleo: {distrito.tasaEmpleo}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top 5 distritos por empresas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-blue-600" />
            Top 5 Distritos por Empresas Registradas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topEmpresas.map((distrito, index) => (
              <div key={distrito.distritoId} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="w-8 h-8 flex items-center justify-center">
                    {index + 1}
                  </Badge>
                  <div>
                    <p className="font-medium">{distrito.distritoNombre}</p>
                    <p className="text-sm text-muted-foreground">
                      Nuevas 2023: {distrito.empresasNuevas2023}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600">
                    {distrito.empresasRegistradas.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Vitalidad: {distrito.indiceVitalidadEconomica}/100
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Indicadores de desigualdad */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Renta por Distrito</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {datosEconomicosMadrid
                .sort((a, b) => b.rentaMediaHogar - a.rentaMediaHogar)
                .slice(0, 8)
                .map((distrito) => (
                  <div key={distrito.distritoId} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{distrito.distritoNombre}</span>
                      <span className="font-medium">{distrito.rentaMediaHogar.toLocaleString()}€</span>
                    </div>
                    <Progress 
                      value={(distrito.rentaMediaHogar / estadisticasEconomicasMadrid.rentaMaxima) * 100} 
                      className="h-2"
                    />
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Indicadores de Desigualdad</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {datosEconomicosMadrid
                .sort((a, b) => b.indiceGini - a.indiceGini)
                .slice(0, 8)
                .map((distrito) => (
                  <div key={distrito.distritoId} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{distrito.distritoNombre}</span>
                      <span className="font-medium">{(distrito.indiceGini * 100).toFixed(1)}%</span>
                    </div>
                    <Progress 
                      value={distrito.indiceGini * 100} 
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground">
                      Riesgo pobreza: {distrito.poblacionRiesgoPobreza}%
                    </p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fuentes de datos */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Fuentes de Datos Oficiales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">Renta y Bienestar</h4>
              <ul className="space-y-1 text-blue-700">
                <li>• INE - Encuesta de Condiciones de Vida 2023</li>
                <li>• Coeficiente de Gini por distrito</li>
                <li>• Población en riesgo de pobreza</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">Mercado Laboral</h4>
              <ul className="space-y-1 text-blue-700">
                <li>• Ministerio de Trabajo - EPA Q4 2024</li>
                <li>• Afiliados a la Seguridad Social</li>
                <li>• Tasa de actividad y empleo</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">Actividad Empresarial</h4>
              <ul className="space-y-1 text-blue-700">
                <li>• INE - DIRCE 2024</li>
                <li>• Empresas por tamaño</li>
                <li>• Sectores económicos</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">Indicadores Compuestos</h4>
              <ul className="space-y-1 text-blue-700">
                <li>• Índice de Vitalidad Económica</li>
                <li>• Índice de Diversidad Económica</li>
                <li>• Índice de Accesibilidad Económica</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DatosEconomicosMadrid; 