-- Add audit timestamps required by dashboard and reporting queries.
ALTER TABLE "Producto"
    ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "Entradas"
    ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "Salidas"
    ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE INDEX IF NOT EXISTS "Producto_categoria_idx" ON "Producto"("categoria");
CREATE INDEX IF NOT EXISTS "Producto_stock_idx" ON "Producto"("stock");
CREATE INDEX IF NOT EXISTS "Entradas_fecha_idx" ON "Entradas"("fecha");
CREATE INDEX IF NOT EXISTS "Entradas_productoId_idx" ON "Entradas"("productoId");
CREATE INDEX IF NOT EXISTS "Salidas_fecha_idx" ON "Salidas"("fecha");
CREATE INDEX IF NOT EXISTS "Salidas_productoId_idx" ON "Salidas"("productoId");
