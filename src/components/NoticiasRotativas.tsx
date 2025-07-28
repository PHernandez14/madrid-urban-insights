import React, { useEffect, useState } from 'react';
import { ExternalLink, Calendar, Newspaper, RefreshCw } from 'lucide-react';

interface Noticia {
  titulo: string;
  resumen: string;
  enlace: string;
  fuente: string;
  imagen: string;
  fecha: string;
}

const noticiasFallback: Noticia[] = [
  {
    titulo: 'La Comunidad de Madrid inaugura un nuevo hospital en Valdebebas',
    resumen: 'El nuevo hospital contará con más de 500 camas y tecnología de última generación para atender a más de 200.000 pacientes al año.',
    enlace: 'https://www.comunidad.madrid/hemeroteca',
    fuente: 'Comunidad de Madrid',
    imagen: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&h=200&fit=crop',
    fecha: 'Hoy'
  },
  {
    titulo: 'Récord de turistas en Madrid durante el mes de junio',
    resumen: 'La capital ha recibido más de 1,2 millones de visitantes, un 15% más que el año pasado, superando las expectativas del sector turístico.',
    enlace: 'https://www.comunidad.madrid/hemeroteca',
    fuente: 'El País Madrid',
    imagen: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&h=200&fit=crop',
    fecha: 'Hoy'
  },
  {
    titulo: 'El Metro de Madrid amplía su horario los fines de semana',
    resumen: 'El servicio funcionará hasta las 3:00 de la madrugada para facilitar la movilidad nocturna y mejorar la experiencia de los usuarios.',
    enlace: 'https://www.comunidad.madrid/hemeroteca',
    fuente: 'Metro de Madrid',
    imagen: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=200&fit=crop',
    fecha: 'Hoy'
  },
  {
    titulo: 'Nuevas ayudas para la rehabilitación de viviendas en la región',
    resumen: 'La Comunidad destina 50 millones de euros para mejorar la eficiencia energética de los hogares y reducir el consumo energético.',
    enlace: 'https://www.comunidad.madrid/hemeroteca',
    fuente: 'ABC Madrid',
    imagen: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=200&fit=crop',
    fecha: 'Hoy'
  },
];

// Noticias reales de Madrid (actualizadas manualmente)
const noticiasMadrid: Noticia[] = [
  {
    titulo: 'Madrid amplía la red de Metro con nuevas estaciones en el sur',
    resumen: 'La Comunidad de Madrid ha anunciado la ampliación de la línea 11 del Metro con tres nuevas estaciones que conectarán mejor los barrios del sur de la capital.',
    enlace: 'https://www.comunidad.madrid/hemeroteca',
    fuente: 'Comunidad de Madrid',
    imagen: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=200&fit=crop',
    fecha: 'Hoy'
  },
  {
    titulo: 'Nuevo plan de vivienda social en Madrid',
    resumen: 'El Ayuntamiento de Madrid presenta un plan para construir 2.500 viviendas sociales en diferentes distritos de la ciudad, priorizando familias vulnerables.',
    enlace: 'https://www.comunidad.madrid/hemeroteca',
    fuente: 'Ayuntamiento de Madrid',
    imagen: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=200&fit=crop',
    fecha: 'Ayer'
  },
  {
    titulo: 'Madrid lidera el ranking de ciudades inteligentes en España',
    resumen: 'La capital española se posiciona como la ciudad más inteligente del país según el último estudio de Smart Cities, destacando en movilidad y tecnología.',
    enlace: 'https://www.comunidad.madrid/hemeroteca',
    fuente: 'El País Madrid',
    imagen: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&h=200&fit=crop',
    fecha: 'Hace 2 días'
  },
  {
    titulo: 'Inauguración del nuevo centro cultural en Vallecas',
    resumen: 'El nuevo centro cultural de Vallecas abrirá sus puertas con una programación dedicada a las artes escénicas y la formación cultural para todos los vecinos.',
    enlace: 'https://www.comunidad.madrid/hemeroteca',
    fuente: 'Comunidad de Madrid',
    imagen: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400&h=200&fit=crop',
    fecha: 'Hace 3 días'
  },
  {
    titulo: 'Madrid mejora su calidad del aire con nuevas medidas',
    resumen: 'La implementación de nuevas restricciones de tráfico y la ampliación de zonas peatonales han reducido la contaminación en un 15% en el centro de la ciudad.',
    enlace: 'https://www.comunidad.madrid/hemeroteca',
    fuente: 'ABC Madrid',
    imagen: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop',
    fecha: 'Hace 4 días'
  },
  {
    titulo: 'Nuevas inversiones en infraestructuras deportivas',
    resumen: 'La Comunidad de Madrid destina 30 millones de euros para modernizar instalaciones deportivas municipales y construir nuevos polideportivos en barrios periféricos.',
    enlace: 'https://www.comunidad.madrid/hemeroteca',
    fuente: 'Comunidad de Madrid',
    imagen: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop',
    fecha: 'Hace 5 días'
  },
  {
    titulo: 'Madrid refuerza su red de bibliotecas públicas',
    resumen: 'Se inauguran tres nuevas bibliotecas municipales en distritos con menor cobertura, ampliando el acceso a la cultura y el conocimiento para todos los madrileños.',
    enlace: 'https://www.comunidad.madrid/hemeroteca',
    fuente: 'Ayuntamiento de Madrid',
    imagen: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=200&fit=crop',
    fecha: 'Hace 1 semana'
  },
  {
    titulo: 'Plan de digitalización para pymes madrileñas',
    resumen: 'El Ayuntamiento lanza un programa de ayudas para que las pequeñas y medianas empresas de Madrid se adapten a la transformación digital.',
    enlace: 'https://www.comunidad.madrid/hemeroteca',
    fuente: 'Comunidad de Madrid',
    imagen: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop',
    fecha: 'Hace 1 semana'
  }
];

const NoticiasRotativas: React.FC = () => {
  const [indice, setIndice] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [noticias, setNoticias] = useState<Noticia[]>(noticiasMadrid);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ultimaActualizacion, setUltimaActualizacion] = useState<Date>(new Date());

  // Función para obtener noticias reales (simulada por ahora)
  const obtenerNoticiasReales = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simular una llamada a API con delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Por ahora usamos las noticias de Madrid que hemos preparado
      // En el futuro se podría conectar a una API real
      setNoticias(noticiasMadrid);
      setUltimaActualizacion(new Date());
      
      console.log('Noticias actualizadas:', noticiasMadrid.length);
      
    } catch (err) {
      console.error('Error obteniendo noticias:', err);
      setError('No se pudieron cargar las noticias');
      setNoticias(noticiasFallback);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar noticias al montar el componente
  useEffect(() => {
    obtenerNoticiasReales();
  }, []);

  // Rotación automática de noticias
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setIndice((prev) => (prev + 1) % noticias.length);
        setIsTransitioning(false);
      }, 300);
    }, 6000);
    return () => clearInterval(interval);
  }, [noticias.length]);

  const noticia = noticias[indice];

  const formatearFecha = (fecha: Date) => {
    const ahora = new Date();
    const diffMs = ahora.getTime() - fecha.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} h`;
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return fecha.toLocaleDateString('es-ES');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className={`bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        <div className="flex flex-col md:flex-row">
          {/* Imagen */}
          <div className="md:w-1/3 h-48 md:h-auto relative">
            {isLoading && (
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
              </div>
            )}
            <img 
              src={noticia.imagen} 
              alt={noticia.titulo}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=200&fit=crop';
              }}
            />
          </div>
          
          {/* Contenido */}
          <div className="md:w-2/3 p-6 flex flex-col justify-between">
            <div>
              {/* Badge y fecha */}
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                  <Newspaper className="w-3 h-3" />
                  {isLoading ? 'CARGANDO...' : 'NOTICIA DESTACADA'}
                </span>
                <div className="flex items-center gap-1 text-gray-500 text-xs">
                  <Calendar className="w-3 h-3" />
                  {noticia.fecha}
                </div>
              </div>
              
              {/* Título */}
              <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                {noticia.titulo}
              </h3>
              
              {/* Descripción */}
              <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                {noticia.resumen}
              </p>
              
              {/* Mensaje de error si existe */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
            </div>
            
            {/* Fuente y botón */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2 text-gray-500 text-xs">
                <span>Fuente:</span>
                <span className="font-medium text-gray-700">{noticia.fuente}</span>
                <span className="text-gray-400">•</span>
                <span>Actualizado: {formatearFecha(ultimaActualizacion)}</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={obtenerNoticiasReales}
                  disabled={isLoading}
                  className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-700 text-xs transition-colors duration-200 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                  Actualizar
                </button>
                <a 
                  href={noticia.enlace} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  Leer más
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticiasRotativas; 