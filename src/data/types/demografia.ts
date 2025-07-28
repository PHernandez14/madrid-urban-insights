export interface PoblacionBarrio {
  año: number;
  cod_distrito: number | string;
  distrito: string;
  cod_barrio: number | string;
  barrio: string;
  num_personas: number;
  num_personas_hombres: number;
  num_personas_mujeres: number;
}

export interface PiramidePoblacional {
  COD_DISTRITO: number;
  DESC_DISTRITO: string;
  COD_DIST_BARRIO: number;
  DESC_BARRIO: string;
  COD_BARRIO: number;
  COD_DIST_SECCION: number;
  COD_SECCION: number;
  COD_EDAD_INT: number;
  ESPANOLESHOMBRES: number;
  ESPANOLESMUJERES: number;
  EXTRANJEROSHOMBRES: number;
  EXTRANJEROSMUJERES: number;
  FX_CARGA: string;
  FX_DATOS_INI: string;
  FX_DATOS_FIN: string;
} 