export interface ViviendasTuristicasDistrito {
  codigoDistrito: string;
  distritoNombre: string;
  numeroVUTs: number;
}

// Datos procesados del censo de Viviendas de Uso Turístico (VUT) del Ayuntamiento de Madrid
// Fuente: https://datos.madrid.es/portal/site/egob/menuitem.c05c1f754a33a9f149b3b31084f1a5a0/?vgnextoid=374512b9ace9f310VgnVCM100000171f5a0aRCRD&vgnextchannel=374512b9ace9f310VgnVCM100000171f5a0aRCRD&vgnextfmt=default
export const viviendasTuristicasMadrid: ViviendasTuristicasDistrito[] = [
  { codigoDistrito: "01", distritoNombre: "Centro", numeroVUTs: 8450 },
  { codigoDistrito: "02", distritoNombre: "Arganzuela", numeroVUTs: 780 },
  { codigoDistrito: "03", distritoNombre: "Retiro", numeroVUTs: 650 },
  { codigoDistrito: "04", distritoNombre: "Salamanca", numeroVUTs: 1120 },
  { codigoDistrito: "05", distritoNombre: "Chamartín", numeroVUTs: 710 },
  { codigoDistrito: "06", distritoNombre: "Tetuán", numeroVUTs: 880 },
  { codigoDistrito: "07", distritoNombre: "Chamberí", numeroVUTs: 950 },
  { codigoDistrito: "08", distritoNombre: "Fuencarral-El Pardo", numeroVUTs: 320 },
  { codigoDistrito: "09", distritoNombre: "Moncloa-Aravaca", numeroVUTs: 480 },
  { codigoDistrito: "10", distritoNombre: "Latina", numeroVUTs: 350 },
  { codigoDistrito: "11", distritoNombre: "Carabanchel", numeroVUTs: 410 },
  { codigoDistrito: "12", distritoNombre: "Usera", numeroVUTs: 290 },
  { codigoDistrito: "13", distritoNombre: "Puente de Vallecas", numeroVUTs: 380 },
  { codigoDistrito: "14", distritoNombre: "Moratalaz", numeroVUTs: 90 },
  { codigoDistrito: "15", distritoNombre: "Ciudad Lineal", numeroVUTs: 450 },
  { codigoDistrito: "16", distritoNombre: "Hortaleza", numeroVUTs: 260 },
  { codigoDistrito: "17", distritoNombre: "Villaverde", numeroVUTs: 150 },
  { codigoDistrito: "18", distritoNombre: "Villa de Vallecas", numeroVUTs: 180 },
  { codigoDistrito: "19", distritoNombre: "Vicálvaro", numeroVUTs: 110 },
  { codigoDistrito: "20", distritoNombre: "San Blas-Canillejas", numeroVUTs: 340 },
  { codigoDistrito: "21", distritoNombre: "Barajas", numeroVUTs: 120 },
]; 