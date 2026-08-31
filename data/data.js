/**
 * data.js — Puntos y rutas de la expedición Córdoba Capital → Cerro Champaquí.
 *
 * Todas las coordenadas son reales (verificadas por Google Places / fuentes
 * oficiales citadas en cada punto — ver GUIA_EXPEDICION_CHAMPAQUI.docx en /docs
 * para el detalle de fuentes). Las líneas de ruta conectan esos puntos reales
 * en línea recta entre sí — NO son un trazado calculado por un motor de ruteo
 * sobre la red de caminos. Esto es intencional: este proyecto está pensado
 * para funcionar sin conexión, y un motor de ruteo en vivo necesitaría
 * internet cada vez que se abre el mapa. Cada tramo dice explícitamente en su
 * popup qué tan verificado está.
 *
 * No editar coordenadas "a ojo" — si hay que corregir un punto, buscar la
 * fuente real primero.
 */

// ---------------------------------------------------------------------------
// PUNTOS (marcadores)
// ---------------------------------------------------------------------------
const POINTS = [
  { name:"Plaza Jerónimo del Barco", cat:"inicio", type:"Punto de inicio",
    lat:-31.4037967, lng:-64.2180323, kmAcum:0, kmPrev:0,
    info:"Salida de la expedición. Av. Colón 2700, Córdoba Capital.",
    fuente:"Google Places [VERIFICADO]" },

  { name:"Alta Gracia", cat:"medico", type:"Localidad · Hospital",
    lat:-31.6584428, lng:-64.4273429, kmAcum:40, kmPrev:40,
    info:"Hospital Alta Gracia 'Dr. Arturo U. Illia', Av. del Libertador Gral. San Martín 1460. Tel: +54 3547 42-9285. El tramo hasta acá es autopista con peaje — sin acceso peatonal contemplado.",
    fuente:"Córdoba Turismo / Google Places [VERIFICADO]" },

  { name:"Anisacate", cat:"rutaVieja", type:"Localidad — camino viejo RP5",
    lat:-31.7342331, lng:-64.4196678, kmAcum:null, kmPrev:null,
    info:"Sobre el trazado viejo de la RP5, habilitado como camino local tras inaugurarse la autovía de peaje (dic. 2024) — pasa por el casco urbano, a diferencia de la autovía nueva que lo evita. Servicios puntuales sin verificar.",
    fuente:"Gobierno de Córdoba / prensa regional [VERIFICADO — existencia del camino viejo]" },

  { name:"Villa La Bolsa", cat:"rutaVieja", type:"Localidad — camino viejo RP5",
    lat:-31.7293726, lng:-64.4296872, kmAcum:null, kmPrev:null,
    info:"Sobre el trazado viejo de la RP5. Servicios sin verificar.",
    fuente:"Gobierno de Córdoba [VERIFICADO — existencia del camino viejo]" },

  { name:"Villa Los Aromos", cat:"rutaVieja", type:"Localidad — camino viejo RP5",
    lat:-31.7358549, lng:-64.4375770, kmAcum:null, kmPrev:null,
    info:"Sobre el trazado viejo de la RP5. Servicios sin verificar.",
    fuente:"Gobierno de Córdoba [VERIFICADO — existencia del camino viejo]" },

  { name:"La Serranita", cat:"rutaVieja", type:"Localidad — camino viejo RP5",
    lat:-31.7357034, lng:-64.4556668, kmAcum:null, kmPrev:null,
    info:"Sobre el trazado viejo de la RP5. Servicios sin verificar.",
    fuente:"Gobierno de Córdoba [VERIFICADO — existencia del camino viejo]" },

  { name:"La Rancherita", cat:"rutaVieja", type:"Localidad — camino viejo RP5",
    lat:-31.7575483, lng:-64.4586128, kmAcum:null, kmPrev:null,
    info:"Sobre el trazado viejo de la RP5. Servicios sin verificar.",
    fuente:"Gobierno de Córdoba [VERIFICADO — existencia del camino viejo]" },

  { name:"Villa Ciudad de América", cat:"localidad", type:"Localidad intermedia",
    lat:-31.7899576, lng:-64.5177602, kmAcum:null, kmPrev:null,
    info:"Sobre el dique Los Molinos. Punto donde el camino viejo de la RP5 se reconecta con la ruta principal. Camino sinuoso, buen estado, mucho tránsito según reportes de ruta.",
    fuente:"Google Places / ruta0.com" },

  { name:"Los Reartes", cat:"localidad", type:"Localidad intermedia",
    lat:-31.9089342, lng:-64.5740952, kmAcum:null, kmPrev:null,
    info:"Ruta nueva y sinuosa hacia Villa Gral. Belgrano, curvas peligrosas según reportes de ruta. Farmacia El Vergel, Av. San Martín — verificada, con atención de obras sociales.",
    fuente:"ruta0.com / directorio de farmacias [VERIFICADO farmacia]" },

  { name:"Villa General Belgrano", cat:"medico", type:"Centro turístico · Bomberos",
    lat:-31.9776652, lng:-64.5594102, kmAcum:89, kmPrev:49,
    info:"Centro turístico completo: supermercados, farmacias, salud. Bomberos Voluntarios: Paraguay 134, tel. +54 3546 46-2222. Camping 'El Arroyo', Nicaragua 571, tel. +54 3546 46-3855. Desde acá, 40 km por RP109 hasta Villa Alpina.",
    fuente:"Córdoba Turismo / Google Places [VERIFICADO]" },

  { name:"Athos Pampa", cat:"localidad", type:"Localidad intermedia",
    lat:-31.990447, lng:-64.6814739, kmAcum:null, kmPrev:null,
    info:"Paso obligado en la RP5/RP109 hacia Villa Alpina. Servicios sin verificar.",
    fuente:"Google Places / Córdoba Turismo" },

  { name:"Villa Alpina — base de ascenso", cat:"alpina", type:"Base de ascenso",
    lat:-31.9563507, lng:-64.8132356, kmAcum:125, kmPrev:40,
    info:"125 km desde Córdoba Capital por RP5. Puesto oficial de registro de Zona de Riesgo (Ley 9856, obligatorio y gratuito, en registrozonaderiesgo.cba.gov.ar). Camping Villa Alpina: +54 3464 52-7375. Restaurantes Alta Montaña y Los Abedules. Albergue Piedras Blancas.",
    fuente:"Córdoba Turismo / Gobierno de Córdoba [VERIFICADO]" },

  { name:"Zona de refugios (Río Tabaquillos)", cat:"refugio", type:"Acampe / refugios",
    lat:-31.972, lng:-64.870, kmAcum:139, kmPrev:14,
    info:"~14 km desde Villa Alpina, +700/800m, 7-8h. Refugios privados informales sin reserva confiable: 'Los Soles', puesto Moisés López, puesto Cufré. Acampe con carpa propia tolerado. 'El Hueco' (bosque cercano) está PROHIBIDO para acampar — Reserva Natural. Posición aproximada.",
    fuente:"Operadores cruzados / Andeshandbook [distancias verificadas, posición aproximada]" },

  { name:"Cumbre Cerro Champaquí", cat:"cumbre", type:"Cumbre — 2790 msnm",
    lat:-31.9874993, lng:-64.9366659, kmAcum:146, kmPrev:7,
    info:"Punto más alto de la provincia de Córdoba. Desde la zona de refugios: ~7 km, +700m, 3.5-4h aprox. Vistas a Traslasierra y Calamuchita.",
    fuente:"Google Places / Wikipedia / Infobae ago-2026 [VERIFICADO]" },

  { name:"Villa Yacanto de Calamuchita", cat:"medico", type:"Puesto oficial alternativo",
    lat:-32.1057442, lng:-64.7540869, kmAcum:null, kmPrev:null,
    info:"Uno de los 5 puestos oficiales de registro de Zona de Riesgo. No es parte del acceso clásico por Villa Alpina — referencia de la zona.",
    fuente:"Gobierno de Córdoba [VERIFICADO]" },

  { name:"Hospital Regional Santa Rosa de Calamuchita", cat:"medico", type:"Hospital",
    lat:-32.0624326, lng:-64.5304379, kmAcum:null, kmPrev:null,
    info:"Referencia hospitalaria del valle de Calamuchita. Tel: +54 3546 42-6683.",
    fuente:"Google Places [VERIFICADO]" }
];

// ---------------------------------------------------------------------------
// RUTAS (líneas que conectan puntos reales — NO son trazados de ruteo)
// ---------------------------------------------------------------------------
const ROUTES = {
  // Tramo A: la ruta vehicular Córdoba → Villa Alpina que NO tiene sendero
  // peatonal verificado. Se muestra igual porque es el recorrido documentado
  // (distancias oficiales de Córdoba Turismo), pero cada tramo está marcado
  // como riesgo — ver GUIA_EXPEDICION_CHAMPAQUI.docx, sección 3.
  tramoA: {
    label: "Tramo A curado (riesgo alto)",
    color: "#AD3B2C",
    dashArray: "2,10",
    defaultOn: true,
    popup: "Conecta puntos reales verificados, pero sigue la ruta vehicular documentada (RP5/RP109/autovía) — no es un sendero peatonal confirmado en terreno. Ver sección 3 de la guía.",
    segments: [
      [[-31.4037967,-64.2180323],[-31.6584428,-64.4273429]],                                   // Pza. J. del Barco -> Alta Gracia
      [[-31.7899576,-64.5177602],[-31.9089342,-64.5740952]],                                   // V. Ciudad de América -> Los Reartes
      [[-31.9089342,-64.5740952],[-31.9776652,-64.5594102]],                                   // Los Reartes -> Villa Gral. Belgrano
      [[-31.9776652,-64.5594102],[-31.990447,-64.6814739],[-31.9563507,-64.8132356]]           // VGB -> Athos Pampa -> Villa Alpina
    ]
  },

  // Camino viejo de la RP5: quedó habilitado para tránsito local cuando abrió
  // la autovía nueva de peaje (dic. 2024) — pasa por los cascos urbanos de
  // los pueblos, a diferencia de la autovía. Mejor candidato encontrado para
  // caminar ese tramo, aunque la banquina puntual sigue sin confirmar.
  caminoViejo: {
    label: "Camino viejo RP5 (mejor candidato)",
    color: "#6B7F3A",
    dashArray: "1,7",
    defaultOn: true,
    popup: "Camino de tránsito local habilitado tras abrirse la autovía nueva de peaje — pasa por Anisacate, Villa La Bolsa, Villa Los Aromos, La Serranita y La Rancherita. Banquina puntual aún sin confirmar en terreno.",
    segments: [
      [[-31.6584428,-64.4273429],[-31.7293726,-64.4296872],[-31.7342331,-64.4196678],
       [-31.7358549,-64.4375770],[-31.7357034,-64.4556668],[-31.7575483,-64.4586128],
       [-31.7899576,-64.5177602]]
    ]
  },

  // Traslado directo en auto: la alternativa más rápida y más segura,
  // documentada — resolver el Tramo A en vehículo (Ruta A recomendada en la
  // guía) y dejar toda la caminata real para el circuito del Champaquí.
  // Distancia y tiempo son datos documentados (Córdoba Turismo / ruta0.com),
  // no calculados en vivo.
  trasladoAuto: {
    label: "Traslado en auto (documentado, ~125 km / ~2h)",
    color: "#1F3A5F",
    dashArray: "6,6",
    defaultOn: false,
    popup: "Distancia documentada Córdoba → Villa Alpina: 125 km por RP5 (Córdoba Turismo). Tiempo estimado en auto: aprox. 2 horas, sumando los ~64 min documentados Córdoba–Villa Gral. Belgrano (ruta0.com) más el tramo de montaña Villa Gral. Belgrano–Villa Alpina. Esta es la opción más rápida y segura de las tres — ver Ruta A en la guía.",
    segments: [
      [[-31.4037967,-64.2180323],[-31.6584428,-64.4273429],[-31.9776652,-64.5594102],[-31.9563507,-64.8132356]]
    ]
  },

  // Tramo B: el sendero de montaña real, señalizado y verificado por varias
  // fuentes cruzadas de trekking. Es el único tramo con distancias 100%
  // confirmadas de punta a punta.
  tramoB: {
    label: "Sendero Champaquí (verificado)",
    color: "#3C6E47",
    dashArray: null,
    defaultOn: true,
    popup: "Villa Alpina → zona de refugios → cumbre. ~42 km circuito completo, +1450/1500m acumulado. Posición de la zona de refugios aproximada — para navegar en terreno se recomienda un track GPS real de Wikiloc del sendero 'Villa Alpina - Cerro Champaquí'.",
    segments: [
      [[-31.9563507,-64.8132356],[-31.972,-64.870],[-31.9874993,-64.9366659]]
    ]
  }
};
