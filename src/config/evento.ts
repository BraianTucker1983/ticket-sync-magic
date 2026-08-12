// ─────────────────────────────────────────────────────────────
// CONFIGURACIÓN DEL EVENTO
// Editá SOLO este archivo para cambiar nombre, fecha, lugar,
// precios, alias de Mercado Pago y número de WhatsApp.
// ─────────────────────────────────────────────────────────────

export const evento = {
  nombre: "Tucker Fest",
  bajada: "Una noche de música, color y gente linda",
  descripcion:
    "Un evento pensado para vivirlo de principio a fin: música en vivo, DJs, food trucks y una producción visual que no vas a olvidar. Reservá tu lugar antes de que se agote.",
  fecha: "Domingo 16 de agosto",
  horario: "22:00 a 06:00 hs",
  lugar: "Club estudiantes Ferroviario Mitre",
  direccion: "Logia Lautaro y Coliqueo - Coronel Suarez",

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
      destacada: false,
    },
    // {
    //   id: "vip",
    //   nombre: "VIP",
    //   precio: 25000,
    //   detalle: ["Ingreso preferencial", "Sector exclusivo", "Welcome drink"],
    //   destacada: true,
    // },
    // {
    //   id: "mesa",
    //   nombre: "Mesa (4 personas)",
    //   precio: 90000,
    //   detalle: ["Mesa reservada", "Botella incluida", "Atención personalizada"],
    //   destacada: false,
    // },
  ],
} as const;

export type TipoEntrada = (typeof evento.entradas)[number];

export const formatearPrecio = (valor: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(valor);