# Estructura de Datos - Madrid Urban Insights

## Organización de Datos

```
src/
└── data/
    ├── raw/            # CSVs originales sin procesar
    ├── processed/      # Datos procesados y optimizados
    ├── types/          # Definiciones de tipos TypeScript
    └── utils/          # Funciones de procesamiento de datos
```

## Convenciones de Nombrado

- Los archivos CSV deben seguir el formato: `YYYY-MM-categoria-descripcion.csv`
- Los archivos procesados deben tener el sufijo `-processed`
- Todos los archivos deben usar codificación UTF-8

## Categorías de Datos

- demograficos/
- movilidad/
- medioambiente/
- economia/
- servicios/
- urbanismo/

## Procesamiento de Datos

Para mantener el rendimiento óptimo del dashboard:
1. Los CSVs originales se almacenan en `raw/`
2. Se procesan y optimizan usando las utilidades en `utils/`
3. Los datos procesados se guardan en `processed/`
4. Se generan tipos TypeScript automáticamente en `types/`

## Actualización de Datos

1. Añadir nuevos CSVs en la carpeta correspondiente dentro de `raw/`
2. Ejecutar el script de procesamiento (se creará próximamente)
3. Verificar los tipos generados
4. Actualizar los componentes que utilizarán los nuevos datos 