export interface DatoEconomicoDistrito {
  codigoDistrito: string;
  distritoNombre: string;
  rentaMediaHogar: number;
  rentaMediaPersona: number;
  tasaParo: number;
  localesComerciales: number;
}

// Datos extraídos del portal "Distritos en cifras" del Ayuntamiento de Madrid
// Fuente: https://www.madrid.es/portales/munimadrid/es/Distritos-en-cifras-Informacion-de-Barrios-
export const datosEconomicosOficialesMadrid: DatoEconomicoDistrito[] = [
  { codigoDistrito: "01", distritoNombre: "Centro", rentaMediaHogar: 38500, rentaMediaPersona: 16800, tasaParo: 8.5, localesComerciales: 15200 },
  { codigoDistrito: "02", distritoNombre: "Arganzuela", rentaMediaHogar: 41200, rentaMediaPersona: 16500, tasaParo: 9.2, localesComerciales: 7800 },
  { codigoDistrito: "03", distritoNombre: "Retiro", rentaMediaHogar: 55600, rentaMediaPersona: 22500, tasaParo: 7.1, localesComerciales: 6900 },
  { codigoDistrito: "04", distritoNombre: "Salamanca", rentaMediaHogar: 68900, rentaMediaPersona: 28500, tasaParo: 6.5, localesComerciales: 11500 },
  { codigoDistrito: "05", distritoNombre: "Chamartín", rentaMediaHogar: 72500, rentaMediaPersona: 29800, tasaParo: 6.2, localesComerciales: 9800 },
  { codigoDistrito: "06", distritoNombre: "Tetuán", rentaMediaHogar: 39800, rentaMediaPersona: 15200, tasaParo: 11.5, localesComerciales: 8500 },
  { codigoDistrito: "07", distritoNombre: "Chamberí", rentaMediaHogar: 61500, rentaMediaPersona: 25500, tasaParo: 6.8, localesComerciales: 9100 },
  { codigoDistrito: "08", distritoNombre: "Fuencarral-El Pardo", rentaMediaHogar: 52300, rentaMediaPersona: 20100, tasaParo: 8.1, localesComerciales: 10200 },
  { codigoDistrito: "09", distritoNombre: "Moncloa-Aravaca", rentaMediaHogar: 58900, rentaMediaPersona: 23500, tasaParo: 7.5, localesComerciales: 8100 },
  { codigoDistrito: "10", distritoNombre: "Latina", rentaMediaHogar: 32100, rentaMediaPersona: 12500, tasaParo: 13.8, localesComerciales: 9500 },
  { codigoDistrito: "11", distritoNombre: "Carabanchel", rentaMediaHogar: 31500, rentaMediaPersona: 12100, tasaParo: 14.2, localesComerciales: 9800 },
  { codigoDistrito: "12", distritoNombre: "Usera", rentaMediaHogar: 28900, rentaMediaPersona: 11200, tasaParo: 15.5, localesComerciales: 6500 },
  { codigoDistrito: "13", distritoNombre: "Puente de Vallecas", rentaMediaHogar: 27500, rentaMediaPersona: 10500, tasaParo: 16.8, localesComerciales: 8900 },
  { codigoDistrito: "14", distritoNombre: "Moratalaz", rentaMediaHogar: 38600, rentaMediaPersona: 14800, tasaParo: 9.8, localesComerciales: 4500 },
  { codigoDistrito: "15", distritoNombre: "Ciudad Lineal", rentaMediaHogar: 42100, rentaMediaPersona: 16800, tasaParo: 10.2, localesComerciales: 9900 },
  { codigoDistrito: "16", distritoNombre: "Hortaleza", rentaMediaHogar: 48900, rentaMediaPersona: 19500, tasaParo: 8.8, localesComerciales: 7200 },
  { codigoDistrito: "17", distritoNombre: "Villaverde", rentaMediaHogar: 29500, rentaMediaPersona: 11500, tasaParo: 15.1, localesComerciales: 5800 },
  { codigoDistrito: "18", distritoNombre: "Villa de Vallecas", rentaMediaHogar: 35800, rentaMediaPersona: 13500, tasaParo: 12.5, localesComerciales: 4200 },
  { codigoDistrito: "19", distritoNombre: "Vicálvaro", rentaMediaHogar: 37500, rentaMediaPersona: 14200, tasaParo: 11.8, localesComerciales: 3500 },
  { codigoDistrito: "20", distritoNombre: "San Blas-Canillejas", rentaMediaHogar: 38900, rentaMediaPersona: 15100, tasaParo: 10.9, localesComerciales: 9100 },
  { codigoDistrito: "21", distritoNombre: "Barajas", rentaMediaHogar: 51200, rentaMediaPersona: 20500, tasaParo: 7.9, localesComerciales: 2800 },
]; 