CREATE TABLE public.inscripciones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT NOT NULL,
  tipo_entrada TEXT NOT NULL,
  cantidad INTEGER NOT NULL DEFAULT 1,
  monto_total NUMERIC(12,2) NOT NULL DEFAULT 0,
  estado TEXT NOT NULL DEFAULT 'pendiente',
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT INSERT ON public.inscripciones TO anon;
GRANT INSERT ON public.inscripciones TO authenticated;
GRANT ALL ON public.inscripciones TO service_role;

ALTER TABLE public.inscripciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cualquiera puede inscribirse"
  ON public.inscripciones
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(nombre) BETWEEN 2 AND 100
    AND length(email) BETWEEN 5 AND 255
    AND length(telefono) BETWEEN 5 AND 30
    AND length(tipo_entrada) BETWEEN 1 AND 100
    AND cantidad BETWEEN 1 AND 20
    AND monto_total >= 0
    AND estado = 'pendiente'
    AND (notas IS NULL OR length(notas) <= 500)
  );