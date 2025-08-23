import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import datosComerciales from '../data/datosComercialesMadrid';

const TerrazasDistrito: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const districtsToShow = isExpanded ? datosComerciales : datosComerciales.slice(0, 6);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estadísticas de Terrazas por Distrito</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Distrito</TableHead>
              <TableHead className="text-right">Nº Terrazas</TableHead>
              <TableHead className="text-right">Superficie Media (m²)</TableHead>
              <TableHead className="text-right">Mesas Totales</TableHead>
              <TableHead className="text-right">Sillas Totales</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {districtsToShow.map((distrito) => (
              <TableRow key={distrito.nombre}>
                <TableCell className="font-medium">{distrito.nombre}</TableCell>
                <TableCell className="text-right">{distrito.terrazas.total.toLocaleString('es-ES')}</TableCell>
                <TableCell className="text-right">
                  {distrito.terrazas.total > 0
                    ? (distrito.terrazas.superficieTotal / distrito.terrazas.total).toFixed(2)
                    : '0.00'}
                </TableCell>
                <TableCell className="text-right">{distrito.terrazas.mesasTotales.toLocaleString('es-ES')}</TableCell>
                <TableCell className="text-right">{distrito.terrazas.sillasTotales.toLocaleString('es-ES')}</TableCell>
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

export default TerrazasDistrito;
