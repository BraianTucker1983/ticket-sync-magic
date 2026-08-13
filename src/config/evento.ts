// ─────────────────────────────────────────────────────────────
// CONFIGURACIÓN DEL EVENTO
// Editá SOLO este archivo para cambiar nombre, fecha, lugar,
// precios, alias de Mercado Pago y número de WhatsApp.
// ─────────────────────────────────────────────────────────────

export const evento = {
  nombre: "Tucker Fest",
  bajada: "Una noche de música, color y gente linda",
  descripcion: `Un festival independiente hecho por y para amantes de la música.

Nueve bandas en vivo: Una grilla variada con géneros para todos los gustos, desde proyectos amigos consagrados hasta bandas que hacen su debut.

Servicio de Cantina: Cerveza y bebidas durante toda la jornada.

El ambiente: Encuentro, buena vibra y el mejor plan para bancar la música independiente.

¡Conseguí tu entrada y vení a vivir la experiencia!`,
  fecha: "Domingo 16 de agosto",
  horario: "22:00 a 06:00 hs",
  lugar: "Club Estudiantes Ferroviario Mitre",
  direccion: "Logia Lautaro y Coliqueo - Coronel Suárez",

  // Pago por transferencia con Mercado Pago
  pago: {
    alias: "BRAIANTUCKER.MP",
    cbu: "0000003100057583444356",
    titular: "Braian Tucker",
  },

  // WhatsApp al que se envía el comprobante (formato internacional, sin + ni espacios)
  whatsapp: "5492926466613",

  entradas: [
    {
      id: "general",
      nombre: "General",
      precio: 5000,
      detalle: ["Acceso general", "Barra habilitada"],
      destacada: true, // La dejamos destacada para que tome la estética principal en la tarjeta
    },    
  ],
} as const;

export type TipoEntrada = (typeof evento.entradas)[number];

export const formatearPrecio = (valor: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(valor);