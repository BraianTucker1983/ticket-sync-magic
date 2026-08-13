import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { evento, formatearPrecio } from "@/config/evento";

const schema = z.object({
  nombre: z.string().trim().min(2, "Ingresá tu nombre").max(100),
  email: z.string().trim().email("Email inválido").max(255),
  telefono: z
    .string()
    .trim()
    .min(6, "Ingresá tu teléfono")
    .max(30)
    .regex(/^[0-9+()\s-]+$/, "Teléfono inválido"),
  tipo: z.string().min(1),
  cantidad: z.number().int().min(1).max(20),
});

// Enlace de Mercado Pago generado previamente
const MP_LINK = "https://mpago.la/169Tei5";
const PORCENTAJE_RECARGO_MP = 0.10; // 10% recargo por servicio de tarjeta/MP

export function FormularioInscripcion() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [tipo, setTipo] = useState<string>(evento.entradas[0].id);
  const [cantidad, setCantidad] = useState(1);
  const [metodoPago, setMetodoPago] = useState<"transferencia" | "mercadopago">("transferencia");
  
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  // Estado para controlar el paso actual (1: Registro y Selección, 2: Confirmación/WhatsApp)
  const [paso, setPaso] = useState<1 | 2>(1);

  const entrada = evento.entradas.find((e) => e.id === tipo) ?? evento.entradas[0];
  
  // Cálculo de montos según método seleccionado
  const totalBase = entrada.precio * cantidad;
  const totalMP = Math.round(totalBase * (1 + PORCENTAJE_RECARGO_MP));
  const totalFinal = metodoPago === "mercadopago" ? totalMP : totalBase;

  const onSubmitPaso1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = schema.safeParse({ nombre, email, telefono, tipo, cantidad });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Revisá los datos ingresados");
      return;
    }

    setEnviando(true);
    
    // Guardamos la inscripción en Supabase con el método de pago y monto final
    const { error: dbError } = await supabase.from("inscripciones").insert({
  nombre: parsed.data.nombre,
  email: parsed.data.email,
  telefono: parsed.data.telefono,
  tipo_entrada: entrada.nombre,
  cantidad: parsed.data.cantidad,
  monto_total: totalFinal,
  metodo_pago: metodoPago as any, // 👈 Agregá "as any" acá
  estado: "pendiente",
} as any); // 👈 O casteá todo el objeto si te marca error en el `.insert()`
    
    setEnviando(false);

    if (dbError) {
      setError("No pudimos registrar tu inscripción. Probá de nuevo en unos segundos.");
      return;
    }

    if (metodoPago === "transferencia") {
      // 1. Copiar Alias al portapapeles
      try {
        await navigator.clipboard.writeText(evento.pago.alias);
      } catch {
        // En caso de que el navegador no otorgue permisos
      }
      // 2. Avanzar a pantalla de envío de comprobante por WhatsApp
      setPaso(2);
    } else {
      // Redirigir al Checkout de Mercado Pago
      window.open(MP_LINK, "_blank", "noopener,noreferrer");
      setPaso(2);
    }
  };

  const handleEnviarWhatsApp = () => {
    const mensaje =
      `Hola! Me inscribí al evento ${evento.nombre}.\n` +
      `Nombre: ${nombre}\n` +
      `Entrada: ${entrada.nombre} x${cantidad}\n` +
      `Método de pago: ${metodoPago === "transferencia" ? "Transferencia Alias" : "Mercado Pago"}\n` +
      `Total: ${formatearPrecio(totalFinal)}\n` +
      (metodoPago === "transferencia"
        ? `Transferí al alias ${evento.pago.alias} y te adjunto el comprobante.`
        : `Ya realicé el pago por Mercado Pago y te adjunto el comprobante.`);

    window.open(
      `https://wa.me/${evento.whatsapp}?text=${encodeURIComponent(mensaje)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const inputClass =
    "w-full rounded-xl border border-border bg-input/60 px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary disabled:opacity-50";

  return (
    <form onSubmit={onSubmitPaso1} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm text-muted-foreground">
          Nombre y apellido
          <input
            className={inputClass}
            value={nombre}
            disabled={paso === 2}
            maxLength={100}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Juana Pérez"
          />
        </label>
        <label className="grid gap-2 text-sm text-muted-foreground">
          Email
          <input
            className={inputClass}
            type="email"
            value={email}
            disabled={paso === 2}
            maxLength={255}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="juana@mail.com"
          />
        </label>
        <label className="grid gap-2 text-sm text-muted-foreground">
          WhatsApp
          <input
            className={inputClass}
            value={telefono}
            disabled={paso === 2}
            maxLength={30}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="+54 9 11 0000 0000"
          />
        </label>
        <label className="grid gap-2 text-sm text-muted-foreground">
          Cantidad
          <input
            className={inputClass}
            type="number"
            min={1}
            max={20}
            disabled={paso === 2}
            value={cantidad}
            onChange={(e) => setCantidad(Math.max(1, Math.min(20, Number(e.target.value) || 1)))}
          />
        </label>
      </div>

      {/* TIPO DE ENTRADA */}
      <fieldset className="grid gap-2">
        <legend className="mb-2 text-sm text-muted-foreground">Tipo de entrada</legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {evento.entradas.map((e) => (
            <button
              type="button"
              key={e.id}
              disabled={paso === 2}
              onClick={() => setTipo(e.id)}
              className={`rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                tipo === e.id
                  ? "border-primary bg-primary/15 text-foreground"
                  : "border-border bg-card/60 text-muted-foreground hover:border-accent"
              } disabled:opacity-50`}
            >
              <span className="block font-semibold">{e.nombre}</span>
              <span className="text-xs">{formatearPrecio(e.precio)}</span>
            </button>
          ))}
        </div>
      </fieldset>

      {/* MÉTODO DE PAGO */}
      <fieldset className="grid gap-2">
        <legend className="mb-2 text-sm text-muted-foreground">Forma de pago</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            disabled={paso === 2}
            onClick={() => setMetodoPago("transferencia")}
            className={`rounded-xl border p-4 text-left transition-all ${
              metodoPago === "transferencia"
                ? "border-primary bg-primary/15 text-foreground ring-1 ring-primary"
                : "border-border bg-card/60 text-muted-foreground hover:border-accent"
            } disabled:opacity-50`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">Transferencia Alias</span>
              <span className="text-xs font-bold text-emerald-500">Sin recargo</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Abonás {formatearPrecio(totalBase)} directamente al Alias {evento.pago.alias}
            </p>
          </button>

          <button
            type="button"
            disabled={paso === 2}
            onClick={() => setMetodoPago("mercadopago")}
            className={`rounded-xl border p-4 text-left transition-all ${
              metodoPago === "mercadopago"
                ? "border-primary bg-primary/15 text-foreground ring-1 ring-primary"
                : "border-border bg-card/60 text-muted-foreground hover:border-accent"
            } disabled:opacity-50`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">Mercado Pago / Tarjetas</span>
              <span className="text-xs text-muted-foreground">+10% gestión</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Abonás {formatearPrecio(totalMP)} en cuotas, tarjeta o dinero en cuenta
            </p>
          </button>
        </div>
      </fieldset>

      {/* TOTAL FINAL */}
      <div className="flex items-center justify-between rounded-xl border border-border bg-card/60 px-4 py-3">
        <span className="text-sm text-muted-foreground">Total a pagar</span>
        <span className="font-display text-2xl text-foreground">{formatearPrecio(totalFinal)}</span>
      </div>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      {/* VISTA DEL PASO 1 */}
      {paso === 1 && (
        <>
          <button
            type="submit"
            disabled={enviando}
            className="bg-fiesta shadow-fiesta rounded-xl px-6 py-4 font-display text-2xl tracking-wide text-primary-foreground transition-transform hover:scale-[1.01] disabled:opacity-60"
          >
            {enviando
              ? "Registrando…"
              : metodoPago === "transferencia"
              ? "1. Copiar Alias e ir a WhatsApp"
              : "1. Pagar con Mercado Pago"}
          </button>
          <p className="text-xs text-muted-foreground">
            {metodoPago === "transferencia"
              ? `Se registrará tu inscripción y se copiará el alias (${evento.pago.alias}) para realizar la transferencia.`
              : "Se registrará tu inscripción y serás redirigido al portal de cobro seguro de Mercado Pago."}
          </p>
        </>
      )}

      {/* VISTA DEL PASO 2 */}
      {paso === 2 && (
        <div className="grid gap-3 rounded-xl border border-primary/30 bg-primary/10 p-4">
          <p className="text-sm text-foreground">
            <strong>¡Inscripción registrada!</strong>{" "}
            {metodoPago === "transferencia"
              ? `Copiamos el alias ${evento.pago.alias} al portapapeles.`
              : "Abrimos la ventana de cobro de Mercado Pago."}
          </p>

          <button
            type="button"
            onClick={handleEnviarWhatsApp}
            className="w-full rounded-xl bg-emerald-600 px-6 py-4 font-display text-2xl tracking-wide text-white transition-transform hover:bg-emerald-700 hover:scale-[1.01]"
          >
            2. Enviar comprobante por WhatsApp
          </button>

          <button
            type="button"
            onClick={() => setPaso(1)}
            className="text-center text-xs text-muted-foreground underline hover:text-foreground"
          >
            Modificar datos o método de pago
          </button>
        </div>
      )}
    </form>
  );
}