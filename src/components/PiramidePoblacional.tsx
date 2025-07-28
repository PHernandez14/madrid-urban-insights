import React, { useEffect, useState } from 'react';
import type { PiramidePoblacional } from '../data/types/demografia';
import { parsePiramideCSV } from '../data/utils/parseCSV';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

const CSV_URL = '/ficheros/demo/estadisticas202506.csv';

const PiramidePoblacional: React.FC = () => {
  const [data, setData] = useState<PiramidePoblacional[]>([]);
  const [distritos, setDistritos] = useState<string[]>([]);
  const [barrios, setBarrios] = useState<string[]>([]);
  const [distritoSel, setDistritoSel] = useState<string>('');
  const [barrioSel, setBarrioSel] = useState<string>('');
  const [piramide, setPiramide] = useState<any[]>([]);

  useEffect(() => {
    fetch(CSV_URL)
      .then((res) => res.text())
      .then((text) => {
        const parsed = parsePiramideCSV(text);
        setData(parsed);
        const dists = Array.from(new Set(parsed.map(r => r.DESC_DISTRITO)));
        setDistritos(dists);
      });
  }, []);

  useEffect(() => {
    if (distritoSel) {
      const barriosFiltrados = Array.from(new Set(data.filter(r => r.DESC_DISTRITO === distritoSel).map(r => r.DESC_BARRIO)));
      setBarrios(barriosFiltrados);
      setBarrioSel('');
    }
  }, [distritoSel, data]);

  useEffect(() => {
    let filtrado = data.filter(r => r.DESC_DISTRITO === distritoSel);
    if (barrioSel) filtrado = filtrado.filter(r => r.DESC_BARRIO === barrioSel);
    // Agrupar por edad y sexo
    const edades = Array.from(new Set(filtrado.map(r => r.COD_EDAD_INT))).sort((a, b) => a - b);
    const piramideData = edades.map(edad => {
      const hombres = filtrado.filter(r => r.COD_EDAD_INT === edad).reduce((acc, r) => acc + (r.ESPANOLESHOMBRES || 0) + (r.EXTRANJEROSHOMBRES || 0), 0);
      const mujeres = filtrado.filter(r => r.COD_EDAD_INT === edad).reduce((acc, r) => acc + (r.ESPANOLESMUJERES || 0) + (r.EXTRANJEROSMUJERES || 0), 0);
      return {
        edad: edad.toString(),
        hombres: -hombres, // Negativo para la pirámide
        mujeres: mujeres,
      };
    });
    setPiramide(piramideData);
  }, [distritoSel, barrioSel, data]);

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-8">
      <h2 className="text-xl font-bold mb-4">Pirámide poblacional</h2>
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          className="border rounded px-2 py-1"
          value={distritoSel}
          onChange={e => setDistritoSel(e.target.value)}
        >
          <option value="">Selecciona distrito</option>
          {distritos.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select
          className="border rounded px-2 py-1"
          value={barrioSel}
          onChange={e => setBarrioSel(e.target.value)}
          disabled={!distritoSel}
        >
          <option value="">Todos los barrios</option>
          {barrios.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={piramide}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" tickFormatter={v => Math.abs(v)} />
          <YAxis dataKey="edad" type="category" width={40} />
          <Tooltip formatter={v => Math.abs(Number(v))} />
          <Legend />
          <Bar dataKey="hombres" fill="#60a5fa" name="Hombres" isAnimationActive />
          <Bar dataKey="mujeres" fill="#f472b6" name="Mujeres" isAnimationActive />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PiramidePoblacional; 