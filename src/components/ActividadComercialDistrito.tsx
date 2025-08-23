import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import datosComerciales from '../data/datosComercialesMadrid';

const ActividadComercialDistrito: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const districtsToShow = isExpanded ? datosComerciales : datosComerciales.slice(0, 6);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividad Comercial por Distrito</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Distrito</TableHead>
              <TableHead className="text-right">Locales Totales</TableHead>
              <TableHead className="text-right">Locales Abiertos</TableHead>
              <TableHead>Top 5 Actividades</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {districtsToShow.map((distrito) => (
              <TableRow key={distrito.nombre}>
                <TableCell className="font-medium">{distrito.nombre}</TableCell>
                <TableCell className="text-right">{distrito.totalLocales.toLocaleString('es-ES')}</TableCell>
                <TableCell className="text-right">{distrito.localesAbiertos.toLocaleString('es-ES')}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(distrito.tiposActividad).map(([actividad, count]) => (
                      <Badge key={actividad} variant="secondary" className="truncate">
                        {actividad} ({count})
                      </Badge>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {datosComerciales.length > 10 && (
          <div className="text-center mt-4">
            <Button onClick={toggleExpanded} variant="link">
              {isExpanded ? 'Ver menos' : 'Ver más'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActividadComercialDistrito;
