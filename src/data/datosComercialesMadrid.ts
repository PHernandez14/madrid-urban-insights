const datosComerciales = [
  {
    "nombre": "CENTRO",
    "totalLocales": 25186,
    "localesAbiertos": 20349,
    "tiposActividad": {
      "No especificada": 4588,
      "VIVIENDAS TURÍSTICAS": 2796,
      "COMERCIO AL POR MENOR DE PRENDAS DE VESTIR EN ESTABLECIMIENTOS ESPECIALIZADOS": 876,
      "BAR RESTAURANTE": 834,
      "RESTAURANTE": 781
    },
    "licencias": {
      "concedidas": 12715,
      "denegadas": 4140,
      "enTramite": 6695,
      "total": 29958
    },
    "terrazas": {
      "total": 911,
      "superficieTotal": 20860.93999999997,
      "mesasTotales": 7147,
      "sillasTotales": 23840
    }
  },
  {
    "nombre": "ARGANZUELA",
    "totalLocales": 8790,
    "localesAbiertos": 6777,
    "tiposActividad": {
      "No especificada": 1373,
      "ACTIVIDADES ADMINISTRATIVAS Y AUXILIARES DE OFICINA Y SERVICIOS DE REPROGRAFIA": 335,
      "SERVICIO DE PELUQUERIA": 275,
      "ENSEÑANZA NO REGLADA (DEPORTIVA Y RECREATIVA, CULTURAL, CLASES DE RECUPERACION, INFORMATICA)": 248,
      "BAR CON COCINA": 219
    },
    "licencias": {
      "concedidas": 5252,
      "denegadas": 962,
      "enTramite": 3423,
      "total": 12208
    },
    "terrazas": {
      "total": 468,
      "superficieTotal": 14631.419999999993,
      "mesasTotales": 4587,
      "sillasTotales": 14742
    }
  },
  {
    "nombre": "SALAMANCA",
    "totalLocales": 18152,
    "localesAbiertos": 14872,
    "tiposActividad": {
      "No especificada": 3200,
      "ACTIVIDADES ADMINISTRATIVAS Y AUXILIARES DE OFICINA Y SERVICIOS DE REPROGRAFIA": 1192,
      "COMERCIO AL POR MENOR DE PRENDAS DE VESTIR EN ESTABLECIMIENTOS ESPECIALIZADOS": 768,
      "BAR RESTAURANTE": 423,
      "CAFETERIA": 412
    },
    "licencias": {
      "concedidas": 9385,
      "denegadas": 2561,
      "enTramite": 7075,
      "total": 24467
    },
    "terrazas": {
      "total": 631,
      "superficieTotal": 15394.630000000012,
      "mesasTotales": 5200,
      "sillasTotales": 14709
    }
  },
  {
    "nombre": "CHAMBERI",
    "totalLocales": 14393,
    "localesAbiertos": 11660,
    "tiposActividad": {
      "No especificada": 2930,
      "ACTIVIDADES ADMINISTRATIVAS Y AUXILIARES DE OFICINA Y SERVICIOS DE REPROGRAFIA": 840,
      "BAR RESTAURANTE": 379,
      "SERVICIO DE PELUQUERIA": 355,
      "CAFETERIA": 293
    },
    "licencias": {
      "concedidas": 7226,
      "denegadas": 2115,
      "enTramite": 5173,
      "total": 18718
    },
    "terrazas": {
      "total": 683,
      "superficieTotal": 17140.01000000001,
      "mesasTotales": 5953,
      "sillasTotales": 17927
    }
  },
  {
    "nombre": "RETIRO",
    "totalLocales": 7186,
    "localesAbiertos": 5931,
    "tiposActividad": {
      "No especificada": 1176,
      "ACTIVIDADES ADMINISTRATIVAS Y AUXILIARES DE OFICINA Y SERVICIOS DE REPROGRAFIA": 343,
      "SERVICIO DE PELUQUERIA": 228,
      "BAR RESTAURANTE": 176,
      "LOCAL SIN ACTIVIDAD": 144
    },
    "licencias": {
      "concedidas": 4114,
      "denegadas": 832,
      "enTramite": 2486,
      "total": 9394
    },
    "terrazas": {
      "total": 412,
      "superficieTotal": 10647.439999999988,
      "mesasTotales": 3783,
      "sillasTotales": 11388
    }
  },
  {
    "nombre": "CHAMARTIN",
    "totalLocales": 12365,
    "localesAbiertos": 9874,
    "tiposActividad": {
      "No especificada": 2309,
      "ACTIVIDADES ADMINISTRATIVAS Y AUXILIARES DE OFICINA Y SERVICIOS DE REPROGRAFIA": 901,
      "LOCAL SIN ACTIVIDAD": 295,
      "SERVICIO DE PELUQUERIA": 279,
      "BAR RESTAURANTE": 275
    },
    "licencias": {
      "concedidas": 6037,
      "denegadas": 1238,
      "enTramite": 4513,
      "total": 14885
    },
    "terrazas": {
      "total": 616,
      "superficieTotal": 21782.68999999998,
      "mesasTotales": 7046,
      "sillasTotales": 21642
    }
  },
  {
    "nombre": "TETUAN",
    "totalLocales": 15346,
    "localesAbiertos": 10300,
    "tiposActividad": {
      "No especificada": 4031,
      "ACTIVIDADES ADMINISTRATIVAS Y AUXILIARES DE OFICINA Y SERVICIOS DE REPROGRAFIA": 1060,
      "SERVICIO DE PELUQUERIA": 358,
      "LOCAL SIN ACTIVIDAD": 330,
      "BAR RESTAURANTE": 303
    },
    "licencias": {
      "concedidas": 7023,
      "denegadas": 1502,
      "enTramite": 4604,
      "total": 16397
    },
    "terrazas": {
      "total": 387,
      "superficieTotal": 12174.350000000004,
      "mesasTotales": 3907,
      "sillasTotales": 11797
    }
  },
  {
    "nombre": "FUENCARRAL-EL PARDO",
    "totalLocales": 10622,
    "localesAbiertos": 7398,
    "tiposActividad": {
      "No especificada": 2509,
      "ACTIVIDADES ADMINISTRATIVAS Y AUXILIARES DE OFICINA Y SERVICIOS DE REPROGRAFIA": 450,
      "SERVICIO DE PELUQUERIA": 345,
      "BAR RESTAURANTE": 279,
      "BAR CON COCINA": 204
    },
    "licencias": {
      "concedidas": 5870,
      "denegadas": 938,
      "enTramite": 3906,
      "total": 13830
    },
    "terrazas": {
      "total": 400,
      "superficieTotal": 15809.470000000005,
      "mesasTotales": 4998,
      "sillasTotales": 16146
    }
  },
  {
    "nombre": "MONCLOA-ARAVACA",
    "totalLocales": 7685,
    "localesAbiertos": 5905,
    "tiposActividad": {
      "No especificada": 1610,
      "ACTIVIDADES ADMINISTRATIVAS Y AUXILIARES DE OFICINA Y SERVICIOS DE REPROGRAFIA": 289,
      "BAR RESTAURANTE": 245,
      "CAFETERIA": 198,
      "LOCAL SIN ACTIVIDAD": 192
    },
    "licencias": {
      "concedidas": 3992,
      "denegadas": 749,
      "enTramite": 2364,
      "total": 9003
    },
    "terrazas": {
      "total": 232,
      "superficieTotal": 6860.840000000001,
      "mesasTotales": 2297,
      "sillasTotales": 7202
    }
  },
  {
    "nombre": "LATINA",
    "totalLocales": 11527,
    "localesAbiertos": 6739,
    "tiposActividad": {
      "No especificada": 3625,
      "SERVICIO DE PELUQUERIA": 402,
      "BAR CON COCINA": 356,
      "OTRO COMERCIO AL POR MENOR DE PRODUCTOS ALIMENTICIOS (PERECEDEROS Y NO PERECEDEROS) CON VENDEDOR N.C.O.P.": 223,
      "COMERCIO AL POR MENOR DE FRUTAS Y HORTALIZAS SIN OBRADOR": 222
    },
    "licencias": {
      "concedidas": 4961,
      "denegadas": 912,
      "enTramite": 2641,
      "total": 10829
    },
    "terrazas": {
      "total": 322,
      "superficieTotal": 10551.289999999999,
      "mesasTotales": 3399,
      "sillasTotales": 11526
    }
  },
  {
    "nombre": "CARABANCHEL",
    "totalLocales": 15446,
    "localesAbiertos": 9488,
    "tiposActividad": {
      "No especificada": 4809,
      "SERVICIO DE PELUQUERIA": 471,
      "BAR CON COCINA": 427,
      "DEPOSITO Y ALMACENAMIENTO": 297,
      "COMERCIO AL POR MENOR DE PRENDAS DE VESTIR EN ESTABLECIMIENTOS ESPECIALIZADOS": 258
    },
    "licencias": {
      "concedidas": 6736,
      "denegadas": 1409,
      "enTramite": 4091,
      "total": 15875
    },
    "terrazas": {
      "total": 359,
      "superficieTotal": 10321.350000000004,
      "mesasTotales": 3572,
      "sillasTotales": 11899
    }
  },
  {
    "nombre": "USERA",
    "totalLocales": 7064,
    "localesAbiertos": 4487,
    "tiposActividad": {
      "No especificada": 2032,
      "SERVICIO DE PELUQUERIA": 236,
      "BAR CON COCINA": 206,
      "LOCAL SIN ACTIVIDAD": 161,
      "OTRO COMERCIO AL POR MENOR DE PRODUCTOS ALIMENTICIOS (PERECEDEROS Y NO PERECEDEROS) CON VENDEDOR N.C.O.P.": 157
    },
    "licencias": {
      "concedidas": 3565,
      "denegadas": 762,
      "enTramite": 2340,
      "total": 8500
    },
    "terrazas": {
      "total": 156,
      "superficieTotal": 5955.0700000000015,
      "mesasTotales": 1866,
      "sillasTotales": 6552
    }
  },
  {
    "nombre": "PUENTE DE VALLECAS",
    "totalLocales": 12522,
    "localesAbiertos": 6876,
    "tiposActividad": {
      "No especificada": 4581,
      "LOCAL SIN ACTIVIDAD": 631,
      "SERVICIO DE PELUQUERIA": 382,
      "BAR CON COCINA": 362,
      "OTRO COMERCIO AL POR MENOR DE PRODUCTOS ALIMENTICIOS (PERECEDEROS Y NO PERECEDEROS) CON VENDEDOR N.C.O.P.": 219
    },
    "licencias": {
      "concedidas": 2752,
      "denegadas": 847,
      "enTramite": 2820,
      "total": 9133
    },
    "terrazas": {
      "total": 340,
      "superficieTotal": 11628.88999999999,
      "mesasTotales": 3504,
      "sillasTotales": 12221
    }
  },
  {
    "nombre": "MORATALAZ",
    "totalLocales": 3181,
    "localesAbiertos": 2273,
    "tiposActividad": {
      "No especificada": 599,
      "SERVICIO DE PELUQUERIA": 151,
      "BAR CON COCINA": 87,
      "BAR SIN COCINA": 75,
      "COMERCIO AL POR MENOR DE FRUTAS Y HORTALIZAS SIN OBRADOR": 74
    },
    "licencias": {
      "concedidas": 1845,
      "denegadas": 235,
      "enTramite": 1030,
      "total": 3937
    },
    "terrazas": {
      "total": 174,
      "superficieTotal": 7011.559999999997,
      "mesasTotales": 2003,
      "sillasTotales": 6983
    }
  },
  {
    "nombre": "CIUDAD LINEAL",
    "totalLocales": 14362,
    "localesAbiertos": 8999,
    "tiposActividad": {
      "No especificada": 4226,
      "ACTIVIDADES ADMINISTRATIVAS Y AUXILIARES DE OFICINA Y SERVICIOS DE REPROGRAFIA": 547,
      "SERVICIO DE PELUQUERIA": 500,
      "BAR CON COCINA": 361,
      "COMERCIO AL POR MENOR DE PRENDAS DE VESTIR EN ESTABLECIMIENTOS ESPECIALIZADOS": 234
    },
    "licencias": {
      "concedidas": 3711,
      "denegadas": 1357,
      "enTramite": 3928,
      "total": 12216
    },
    "terrazas": {
      "total": 279,
      "superficieTotal": 7052.890000000003,
      "mesasTotales": 2405,
      "sillasTotales": 7566
    }
  },
  {
    "nombre": "HORTALEZA",
    "totalLocales": 9166,
    "localesAbiertos": 5725,
    "tiposActividad": {
      "No especificada": 2583,
      "ACTIVIDADES ADMINISTRATIVAS Y AUXILIARES DE OFICINA Y SERVICIOS DE REPROGRAFIA": 356,
      "SERVICIO DE PELUQUERIA": 221,
      "BAR CON COCINA": 167,
      "BAR RESTAURANTE": 164
    },
    "licencias": {
      "concedidas": 2387,
      "denegadas": 645,
      "enTramite": 2868,
      "total": 7916
    },
    "terrazas": {
      "total": 293,
      "superficieTotal": 13209.560000000003,
      "mesasTotales": 3738,
      "sillasTotales": 12183
    }
  },
  {
    "nombre": "VILLAVERDE",
    "totalLocales": 8591,
    "localesAbiertos": 5287,
    "tiposActividad": {
      "No especificada": 2585,
      "SERVICIO DE PELUQUERIA": 295,
      "DEPOSITO Y ALMACENAMIENTO": 248,
      "BAR CON COCINA": 234,
      "COMERCIO AL POR MENOR DE FRUTAS Y HORTALIZAS SIN OBRADOR": 172
    },
    "licencias": {
      "concedidas": 3928,
      "denegadas": 829,
      "enTramite": 2222,
      "total": 9010
    },
    "terrazas": {
      "total": 180,
      "superficieTotal": 6544.799999999999,
      "mesasTotales": 1892,
      "sillasTotales": 6580
    }
  },
  {
    "nombre": "VILLA DE VALLECAS",
    "totalLocales": 6491,
    "localesAbiertos": 4461,
    "tiposActividad": {
      "No especificada": 1599,
      "COMERCIO AL POR MAYOR FRUTAS, VERDURAS Y DERIVADOS": 222,
      "SERVICIO DE PELUQUERIA": 141,
      "DEPOSITO Y ALMACENAMIENTO": 123,
      "ACTIVIDADES ADMINISTRATIVAS Y AUXILIARES DE OFICINA Y SERVICIOS DE REPROGRAFIA": 112
    },
    "licencias": {
      "concedidas": 2530,
      "denegadas": 552,
      "enTramite": 1874,
      "total": 6602
    },
    "terrazas": {
      "total": 189,
      "superficieTotal": 7651.970000000001,
      "mesasTotales": 2447,
      "sillasTotales": 8435
    }
  },
  {
    "nombre": "VICALVARO",
    "totalLocales": 2788,
    "localesAbiertos": 1873,
    "tiposActividad": {
      "No especificada": 635,
      "OTRO COMERCIO AL POR MENOR DE PRODUCTOS ALIMENTICIOS (PERECEDEROS Y NO PERECEDEROS) CON VENDEDOR N.C.O.P.": 113,
      "PRODUCCION, TRANSPORTE Y DISTRIBUCION DE ENERGIA ELECTRICA Y GAS": 111,
      "SERVICIO DE PELUQUERIA": 93,
      "BAR CON COCINA": 85
    },
    "licencias": {
      "concedidas": 1661,
      "denegadas": 222,
      "enTramite": 992,
      "total": 3766
    },
    "terrazas": {
      "total": 106,
      "superficieTotal": 2757.5500000000006,
      "mesasTotales": 979,
      "sillasTotales": 3228
    }
  },
  {
    "nombre": "SAN BLAS-CANILLEJAS",
    "totalLocales": 8814,
    "localesAbiertos": 6573,
    "tiposActividad": {
      "No especificada": 2259,
      "ACTIVIDADES ADMINISTRATIVAS Y AUXILIARES DE OFICINA Y SERVICIOS DE REPROGRAFIA": 319,
      "BAR RESTAURANTE": 257,
      "SERVICIO DE PELUQUERIA": 223,
      "BAR CON COCINA": 211
    },
    "licencias": {
      "concedidas": 2798,
      "denegadas": 787,
      "enTramite": 3298,
      "total": 9162
    },
    "terrazas": {
      "total": 297,
      "superficieTotal": 10098.430000000006,
      "mesasTotales": 3236,
      "sillasTotales": 10805
    }
  },
  {
    "nombre": "BARAJAS",
    "totalLocales": 3348,
    "localesAbiertos": 2493,
    "tiposActividad": {
      "No especificada": 721,
      "ACTIVIDADES ADMINISTRATIVAS Y AUXILIARES DE OFICINA Y SERVICIOS DE REPROGRAFIA": 266,
      "CAFETERIA": 104,
      "BAR RESTAURANTE": 99,
      "SERVICIO DE PELUQUERIA": 69
    },
    "licencias": {
      "concedidas": 1639,
      "denegadas": 281,
      "enTramite": 1166,
      "total": 4205
    },
    "terrazas": {
      "total": 109,
      "superficieTotal": 3168.6800000000003,
      "mesasTotales": 958,
      "sillasTotales": 3320
    }
  }
];

export default datosComerciales;
