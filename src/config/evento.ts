// ─────────────────────────────────────────────────────────────
// CONFIGURACIÓN DEL EVENTO
// Editá SOLO este archivo para cambiar nombre, fecha, lugar,
// precios, alias de Mercado Pago y número de WhatsApp.
// ─────────────────────────────────────────────────────────────

export const evento = {
  nombre: "Nombre del Evento",
  bajada: "Una noche de música, color y gente linda",
  descripcion:
    "Un evento pensado para vivirlo de principio a fin: música en vivo, DJs, food trucks y una producción visual que no vas a olvidar. Reservá tu lugar antes de que se agote.",
  fecha: "Sábado 12 de septiembre",
  horario: "22:00 a 06:00 hs",
  lugar: "Nombre del Salón",
  direccion: "Av. Siempreviva 742, Buenos Aires",

  // Pago por transferencia con Mercado Pago
  pago: {
    alias: "MI.ALIAS.MP",
    cbu: "0000003100010000000001",
    titular: "Nombre y Apellido",
  },

  // WhatsApp al que se envía el comprobante (formato internacional, sin + ni espacios)
  whatsapp: "5491100000000",

  entradas: [
    {
      id: "general",
      nombre: "General",
      precio: 15000,
      detalle: ["Acceso general", "Barra habilitada", "Cupos limitados"],
      destacada: false,
    },
    {
      id: "vip",
      nombre: "VIP",
      precio: 25000,
      detalle: ["Ingreso preferencial", "Sector exclusivo", "Welcome drink"],
      destacada: true,
    },
    {
      id: "mesa",
      nombre: "Mesa (4 personas)",
      precio: 90000,
      detalle: ["Mesa reservada", "Botella incluida", "Atención personalizada"],
      destacada: false,
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