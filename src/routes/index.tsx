import { createFileRoute } from "@tanstack/react-router";
import heroImg from "@/assets/Flyier Ferroviario.jpeg";
import { evento, formatearPrecio } from "@/config/evento";
import { FormularioInscripcion } from "@/components/FormularioInscripcion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${evento.nombre} — Entradas ${evento.fecha}` },
      {
        name: "description",
        content: `Reservá tu entrada para ${evento.nombre} el ${evento.fecha} en ${evento.lugar}. Pagá por transferencia y enviá el comprobante por WhatsApp.`,
      },
      { property: "og:title", content: `${evento.nombre} — Entradas` },
      {
        property: "og:description",
        content: `${evento.fecha} · ${evento.lugar}. Reservá tu lugar en pocos pasos.`,
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-background">
      <section className="relative isolate overflow-hidden bg-card/30 py-12 md:py-16 border-b border-border">
  <div className="mx-auto max-w-5xl px-6 grid gap-8 md:grid-cols-[1.1fr_0.9fr] items-center">
    
    {/* Columna Izquierda: Información del Evento */}
    <div className="flex flex-col gap-5">
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-accent">
        {evento.fecha} · {evento.lugar}
      </p>
      <h1 className="text-5xl sm:text-7xl leading-[0.9]">
        <span className="text-fiesta">{evento.nombre}</span>
      </h1>
      <p className="text-lg text-muted-foreground">{evento.bajada}</p>
      <a
        href="#entradas"
        className="bg-fiesta shadow-fiesta w-fit rounded-full px-8 py-4 font-display text-2xl tracking-wide text-primary-foreground mt-2"
      >
        Quiero mi entrada
      </a>
    </div>

    {/* Columna Derecha: Flyer Completo sin recortes */}
    <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-border shadow-2xl">
      <img
        src={heroImg}
        alt={`Flyer de ${evento.nombre}`}
        className="w-full h-auto object-contain block"
      />
    </div>

  </div>
</section>

      <section className="mx-auto grid max-w-5xl gap-10 px-6 py-20 md:grid-cols-[1.2fr_1fr]">
        <div className="grid gap-4">
          <h2 className="text-4xl">El evento</h2>
          <p className="text-muted-foreground">{evento.descripcion}</p>
        </div>
        <dl className="grid gap-4 rounded-2xl border border-border bg-card/60 p-6 text-sm">
          <div>
            <dt className="text-muted-foreground">Fecha</dt>
            <dd className="text-lg">{evento.fecha}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Horario</dt>
            <dd className="text-lg">{evento.horario}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Lugar</dt>
            <dd className="text-lg">{evento.lugar}</dd>
            <dd className="text-muted-foreground">{evento.direccion}</dd>
          </div>
        </dl>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-8">
        <h2 className="mb-8 text-4xl">Entradas</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {evento.entradas.map((e) => (
            <article
              key={e.id}
              className={`grid content-start gap-4 rounded-2xl border p-6 ${
                e.destacada
                  ? "border-primary bg-primary/10 shadow-fiesta"
                  : "border-border bg-card/60"
              }`}
            >
              <h3 className="text-3xl">{e.nombre}</h3>
              <p className="font-display text-4xl text-fiesta">{formatearPrecio(e.precio)}</p>
              <ul className="grid gap-2 text-sm text-muted-foreground">
                {e.detalle.map((d) => (
                  <li key={d}>· {d}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section id="entradas" className="mx-auto max-w-5xl scroll-mt-8 px-6 py-16">
        <div className="grid gap-8 rounded-3xl border border-border bg-card/70 p-6 sm:p-10 md:grid-cols-[1fr_1.1fr]">
          <div className="grid content-start gap-5">
            <h2 className="text-4xl">Reservá tu lugar</h2>
            <p className="text-sm text-muted-foreground">
              Completá tus datos, transferí el total por Mercado Pago y mandanos el comprobante por
              WhatsApp. Confirmamos tu entrada en el momento.
            </p>
            <div className="grid gap-3 rounded-2xl border border-border bg-background/60 p-5 text-sm">
              <div>
                <span className="text-muted-foreground">Alias Mercado Pago</span>
                <p className="font-display text-3xl tracking-wide">{evento.pago.alias}</p>
              </div>
              <div>
                <span className="text-muted-foreground">CBU/CVU</span>
                <p>{evento.pago.cbu}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Titular</span>
                <p>{evento.pago.titular}</p>
              </div>
            </div>
          </div>
          <FormularioInscripcion />
        </div>
      </section>

      <footer className="border-t border-border px-6 py-10 text-center text-sm text-muted-foreground">
        {evento.nombre} · {evento.fecha} · {evento.lugar}
      </footer>
    </main>
  );
}
