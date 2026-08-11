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

export function FormularioInscripcion() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [tipo, setTipo] = useState<string>(evento.entradas[0].id);
  const [cantidad, setCantidad] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const entrada = evento.entradas.find((e) => e.id === tipo) ?? evento.entradas[0];
  const total = entrada.precio * cantidad;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = schema.safeParse({ nombre, email, telefono, tipo, cantidad });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Revisá los datos ingresados");
      return;
    }

    setEnviando(true);
    const { error: dbError } = await supabase.from("inscripciones").insert({
      nombre: parsed.data.nombre,
      email: parsed.data.email,
      telefono: parsed.data.telefono,
      tipo_entrada: entrada.nombre,
      cantidad: parsed.data.cantidad,
      monto_total: total,
      estado: "pendiente",
    });
    setEnviando(false);

    if (dbError) {
      setError("No pudimos registrar tu inscripción. Probá de nuevo en unos segundos.");
      return;
    }

    const mensaje =
      `Hola! Me inscribí al evento ${evento.nombre}.\n` +
      `Nombre: ${parsed.data.nombre}\n` +
      `Entrada: ${entrada.nombre} x${parsed.data.cantidad}\n` +
      `Total: ${formatearPrecio(total)}\n` +
      `Transferí al alias ${evento.pago.alias} y te adjunto el comprobante.`;

    window.open(
      `https://wa.me/${evento.whatsapp}?text=${encodeURIComponent(mensaje)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const inputClass =
    "w-full rounded-xl border border-border bg-input/60 px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary";

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm text-muted-foreground">
          Nombre y apellido
          <input
            className={inputClass}
            value={nombre}
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
            value={cantidad}
            onChange={(e) => setCantidad(Math.max(1, Math.min(20, Number(e.target.value) || 1)))}
          />
        </label>
      </div>

      <fieldset className="grid gap-2">
        <legend className="mb-2 text-sm text-muted-foreground">Tipo de entrada</legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {evento.entradas.map((e) => (
            <button
              type="button"
              key={e.id}
              onClick={() => setTipo(e.id)}
              className={`rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                tipo === e.id
                  ? "border-primary bg-primary/15 text-foreground"
                  : "border-border bg-card/60 text-muted-foreground hover:border-accent"
              }`}
            >
              <span className="block font-semibold">{e.nombre}</span>
              <span className="text-xs">{formatearPrecio(e.precio)}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <div className="flex items-center justify-between rounded-xl border border-border bg-card/60 px-4 py-3">
        <span className="text-sm text-muted-foreground">Total a transferir</span>
        <span className="font-display text-2xl text-foreground">{formatearPrecio(total)}</span>
      </div>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={enviando}
        className="bg-fiesta shadow-fiesta rounded-xl px-6 py-4 font-display text-2xl tracking-wide text-primary-foreground transition-transform hover:scale-[1.01] disabled:opacity-60"
      >
        {enviando ? "Registrando…" : "Reservar y enviar comprobante"}
      </button>
      <p className="text-xs text-muted-foreground">
        Al reservar se abre WhatsApp con un mensaje listo para que adjuntes el comprobante de la
        transferencia al alias <strong className="text-foreground">{evento.pago.alias}</strong>.
      </p>
    </form>
  );
}