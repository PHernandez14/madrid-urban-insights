# 🏙️ Madrid Urban Insights

Una plataforma web interactiva para el análisis urbano de Madrid que utiliza datos oficiales del Ayuntamiento, INE y fuentes públicas para proporcionar insights detallados sobre demografía, economía, vivienda y servicios urbanos.

## 📋 Tabla de Contenidos

- [📖 Descripción del Proyecto](#-descripción-del-proyecto)
- [🚀 Demo en Vivo](#-demo-en-vivo)
- [✨ Características Principales](#-características-principales)
- [🛠️ Stack Tecnológico](#️-stack-tecnológico)
- [📊 Fuentes de Datos](#-fuentes-de-datos)
- [🏗️ Estructura del Repositorio](#️-estructura-del-repositorio)
- [💻 Instalación Local](#-instalación-local)
- [🔧 Scripts Disponibles](#-scripts-disponibles)
- [📱 Uso de la Aplicación](#-uso-de-la-aplicación)
- [📈 ETL y Procesamiento de Datos](#-etl-y-procesamiento-de-datos)
- [🤖 Asistente Inteligente](#-asistente-inteligente)
- [🌐 Deployment](#-deployment)
- [📄 Licencia](#-licencia)

## 📖 Descripción del Proyecto

Madrid Urban Insights es una aplicación web desarrollada para facilitar el análisis urbano de la ciudad de Madrid. La plataforma integra múltiples fuentes de datos oficiales para ofrecer:

- **Visualizaciones interactivas** de indicadores urbanos
- **Análisis comparativo** entre distritos y barrios
- **Mapas temáticos** con capas de información especializada
- **Asistente inteligente** para decisiones de residencia
- **Dashboard ejecutivo** con KPIs principales

El proyecto nace como herramienta de apoyo para ciudadanos, investigadores, urbanistas y responsables políticos que necesiten tomar decisiones informadas sobre la ciudad de Madrid.

## 🚀 Demo en Vivo

**🔗 URL de Deployment:** [https://madrid-urban-insights.vercel.app](https://madrid-urban-insights.vercel.app)

> **Nota:** El enlace estará disponible tras el deployment en Vercel. La aplicación es completamente responsiva y optimizada para desktop, tablet y móvil.

## ✨ Características Principales

### 📊 Dashboard Overview
- KPIs principales de Madrid (población, economía, vivienda)
- Mapas interactivos con datos georreferenciados
- Indicadores macroeconómicos en tiempo real
- Noticias rotativas sobre la ciudad

### 🔍 Pestaña Análisis
- **15+ visualizaciones especializadas** incluyendo:
  - Pirámide poblacional interactiva
  - Mapas de calor de actividad comercial
  - Evolución de precios inmobiliarios
  - Red de transporte (Metro, EMT, BiciMAD)
  - Estadísticas de accidentes y movilidad
  - Equipamientos urbanos (hospitales, colegios, bibliotecas)

### ⚖️ Pestaña Comparativa
- **Análisis multi-criterio** entre distritos
- **Sistema de categorías**: Demografía, Economía, Vivienda, Libre
- **Gráficos de correlación** y scatter plots
- **Estadísticas descriptivas** automáticas
- **Tooltips informativos** en todas las secciones

### 🤖 Asistente Inteligente
- **Wizard de preferencias** personalizado (5 pasos)
- **Simulador de presupuesto** adaptativo
- **Algoritmo de scoring** que considera más de 15 variables
- **Recomendaciones cualitativas** basadas en perfiles de usuario
- **Segmentación por presupuesto** (bajo, medio, alto)

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** - Biblioteca principal
- **TypeScript 5.5** - Tipado estático
- **Vite 5.4** - Build tool y dev server
- **Tailwind CSS 3.4** - Styling utility-first

### UI/UX
- **shadcn/ui** - Componentes base con Radix UI
- **Lucide React** - Iconografía consistente
- **React Hook Form** - Gestión de formularios
- **Zod** - Validación de esquemas

### Visualizaciones
- **Recharts 2.12** - Charts y gráficos interactivos
- **Leaflet 1.9** - Mapas web open source
- **React-Leaflet 4.2** - Integración React-Leaflet
- **Leaflet.heat** - Mapas de calor
- **Turf.js 7.2** - Análisis geoespacial

### Gestión de Estado
- **TanStack Query 5.56** - Caching y sincronización
- **React Router 6.26** - Routing del lado cliente

### Desarrollo
- **ESLint 9.9** - Linting de código
- **Autoprefixer** - Prefijos CSS automáticos
- **PostCSS** - Transformación CSS

### ETL y Datos
- **Node.js** - Scripts de procesamiento
- **PapaParse 5.5** - Parsing de CSV
- **Proj4** - Transformaciones de coordenadas

## 📊 Fuentes de Datos

El proyecto integra **15+ datasets oficiales** totalizando **~288k registros**:

### Datos Demográficos
- **INE** - Instituto Nacional de Estadística
- **Padrón Municipal** - Datos poblacionales oficiales
- **Portal Datos Abiertos** - Ayuntamiento de Madrid

### Datos Económicos
- **"Distritos en cifras"** - Portal oficial del Ayuntamiento
- **Sociedad de Tasación** - Precios inmobiliarios
- **Ministerio de Transportes** - Indicadores de vivienda

### Datos Urbanos y Servicios
- **Censo de locales comerciales** - Actividad económica
- **Red de transporte** - Metro, EMT, puntos de recarga
- **Equipamientos públicos** - Hospitales, colegios, bibliotecas
- **Datos de movilidad** - Accidentes, aparcamientos, BiciMAD

Todos los datos son procesados mediante **pipeline ETL automatizado** que garantiza integridad, normalización y tipado estático.

## 🏗️ Estructura del Repositorio

```
madrid-urban-insights/
├── 📁 public/                     # Assets estáticos
│   ├── barrios_madrid.geojson     # Geometrías de barrios
│   ├── favicon.ico               # Icono de la app
│   └── robots.txt                # SEO crawling
│
├── 📁 src/                       # Código fuente principal
│   ├── 📁 components/            # Componentes React
│   │   ├── 📁 ui/               # Componentes base shadcn/ui (30+)
│   │   ├── ComparisonPanel.tsx   # Panel comparativo principal
│   │   ├── MapaBarriosLeaflet.tsx # Mapas interactivos
│   │   ├── PiramidePoblacional.tsx # Análisis demográfico
│   │   └── ... (35+ componentes especializados)
│   │
│   ├── 📁 data/                  # Gestión y almacenamiento de datos
│   │   ├── 📁 types/            # Definiciones TypeScript
│   │   ├── 📁 utils/            # Utilidades de procesamiento
│   │   ├── expandedMadridData.ts # Dataset principal consolidado
│   │   ├── datosEconomicosOficialesMadrid.ts
│   │   ├── preciosOficialesMadrid.ts
│   │   ├── accidentesMadrid.ts   # 280k+ registros
│   │   └── ... (15+ datasets tipados)
│   │
│   ├── 📁 lib/                   # Librerías y utilidades
│   │   ├── utils.ts             # Helpers generales
│   │   └── aiClient.ts          # Cliente IA (Ollama)
│   │
│   ├── 📁 hooks/                # Custom React hooks
│   ├── 📁 pages/                # Páginas principales
│   ├── App.tsx                  # Componente raíz
│   └── main.tsx                 # Entry point
│
├── 📁 scripts/                   # Pipeline ETL
│   ├── diagnosticar_csv.cjs     # Auto-detección encoding
│   ├── procesar_datos_economicos.cjs
│   ├── procesar_accidentes.cjs  # Geocodificación
│   ├── procesar_metro.cjs       # Red transporte
│   └── ... (8+ scripts ETL)
│
├── 📁 ficheros/                  # Datos raw y procesados
│   ├── 📁 demo/                 # Datasets de demostración
│   └── 📁 equipamientos/        # GeoJSON equipamientos
│
├── 📄 package.json              # Dependencias y scripts
├── 📄 vite.config.ts           # Configuración Vite
├── 📄 tailwind.config.ts       # Configuración Tailwind
├── 📄 tsconfig.json            # Configuración TypeScript
└── 📄 README.md                # Este archivo
```

## 💻 Instalación Local

### Prerrequisitos
- **Node.js 18+** - [Instalar con nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **npm** o **yarn** - Gestor de paquetes
- **Git** - Control de versiones

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/madrid-urban-insights.git
cd madrid-urban-insights
```

2. **Instalar dependencias**
```bash
npm install
# o
yarn install
```

3. **Configurar variables de entorno** (opcional)
```bash
# Para funcionalidad AI local (Ollama)
echo "VITE_OLLAMA_URL=http://localhost:11434" > .env.local
```

4. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

5. **Abrir navegador**
```
http://localhost:8080
```

### Configuración de Ollama (Opcional)
Para utilizar el asistente IA local:

```bash
# Instalar Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Ejecutar modelo local
ollama run llama2
```

## 🔧 Scripts Disponibles

```bash
# 🚀 Desarrollo
npm run dev          # Servidor desarrollo (puerto 8080)
npm run build        # Build para producción
npm run preview      # Preview build local
npm run lint         # Linting con ESLint

# 📊 ETL y Procesamiento de Datos
cd scripts/
node diagnosticar_csv.cjs           # Diagnóstico CSV
node procesar_datos_economicos.cjs  # Procesar datos económicos
node procesar_accidentes.cjs        # Geocodificar accidentes
node procesar_metro.cjs             # Procesar red Metro
# ... otros scripts disponibles
```

## 📱 Uso de la Aplicación

### 🏠 Dashboard Overview
1. **Visualiza KPIs principales** de Madrid en cards interactivas
2. **Explora mapas temáticos** con diferentes capas de información
3. **Consulta indicadores macroeconómicos** actualizados

### 🔍 Pestaña Análisis
1. **Selecciona categorías** (Demografía, Economía, Vivienda, etc.)
2. **Aplica filtros** por distrito o métrica específica
3. **Interactúa con visualizaciones** para explorar datos en detalle
4. **Utiliza mapas de calor** para identificar patrones geográficos

### ⚖️ Pestaña Comparativa
1. **Selecciona distritos** para comparar (máximo recomendado: 5)
2. **Elige categoría de análisis** o usa "Libre" para comparación cruzada
3. **Analiza gráficos de correlación** entre variables
4. **Consulta estadísticas descriptivas** automáticas
5. **Utiliza tooltips** para obtener información contextual

### 🤖 Asistente Inteligente
1. **Completa el wizard de preferencias** (5 pasos interactivos)
2. **Configura tu presupuesto** y tipo de vivienda
3. **Obtén recomendaciones personalizadas** basadas en tu perfil
4. **Explora insights cualitativos** sobre cada distrito

## 📈 ETL y Procesamiento de Datos

El proyecto incluye un **pipeline ETL robusto** para procesamiento de datos:

### Características del Pipeline
- **Auto-detección de encoding** y delimitadores CSV
- **Geocodificación automática** de direcciones
- **Normalización** de formatos y esquemas
- **Agregación inteligente** por distrito/barrio
- **Validación de integridad** de datos
- **Conversión a TypeScript** tipado para build

### Volumen Procesado
- **~288k registros** distribuidos en 15+ datasets
- **Reducción de tamaño del 67%** mediante optimización
- **8 scripts ETL especializados** para diferentes fuentes

### Calidad de Datos
- **Fallbacks documentados** para datos faltantes
- **Indicadores derivados robustos** calculados automáticamente
- **Avisos claros al usuario** cuando datos no están disponibles

## 🤖 Asistente Inteligente

### Algoritmo de Scoring
El asistente utiliza un **algoritmo de puntuación multi-criterio** que considera:

- **Segmentación por presupuesto** (bajo < €1.500, medio €1.500-2.500, alto > €2.500)
- **Filtros de affordability** que eliminan opciones fuera de presupuesto
- **Pesos adaptativos** según perfil de usuario
- **Normalización de métricas** para comparabilidad
- **Puntuación compuesta** en escala 0-10

### Perfiles de Usuario
- 👨‍👩‍👧‍👦 **Familias** - Priorizan servicios y precios asequibles
- 👨‍💼 **Jóvenes Profesionales** - Buscan vida social y conectividad
- 👴 **Seniors** - Valoran estabilidad y servicios esenciales
- 💼 **Inversores** - Enfocan en rentabilidad y crecimiento

### Recomendaciones Cualitativas
El sistema proporciona insights textuales evitando cifras poco realistas:
- ✅ "Zona con buena relación calidad-precio"
- ✅ "Excelente conectividad de transporte"
- ✅ "Rica vida cultural y nocturna"

## 🌐 Deployment

### Vercel (Recomendado)
La aplicación está optimizada para deployment en Vercel:

```bash
# Configuración automática
vercel --prod

# Variables de entorno en Vercel Dashboard:
# VITE_OLLAMA_URL (opcional para IA)
```

### Netlify
También compatible con Netlify:

```bash
# Build settings:
Build command: npm run build
Publish directory: dist
```

### Otras Plataformas
- **GitHub Pages** - Requiere configuración adicional para SPA
- **AWS S3 + CloudFront** - Setup manual pero alta performance
- **Docker** - `Dockerfile` incluido para containerización

### Configuración de Dominio Personalizado
1. Configurar DNS apuntando a tu proveedor
2. Añadir dominio en dashboard del proveedor
3. Habilitar HTTPS automático

## 📄 Licencia

Este proyecto está licenciado bajo la [Licencia MIT](LICENSE).

### Reconocimientos
- **Datos oficiales** proporcionados por Ayuntamiento de Madrid, INE y fuentes públicas
- **Componentes UI** basados en shadcn/ui y Radix UI
- **Iconografía** de Lucide React
- **Mapas base** de OpenStreetMap

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. 🍴 **Fork** el repositorio
2. 🌿 **Crea una rama** para tu feature (`git checkout -b feature/AmazingFeature`)
3. 💾 **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. 📤 **Push** a la rama (`git push origin feature/AmazingFeature`)
5. 🔄 **Abre un Pull Request**

## 📞 Contacto

Para preguntas, sugerencias o colaboraciones:
- 📧 **Email**: tu-email@ejemplo.com
- 🐙 **GitHub Issues**: [Reportar problema](https://github.com/tu-usuario/madrid-urban-insights/issues)

---

⭐ **¡Si este proyecto te ha sido útil, considera darle una estrella en GitHub!**