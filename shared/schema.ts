import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const ubicaciones = pgTable("ubicaciones", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  direccion: text("direccion").notNull(),
  barrio: text("barrio").notNull(),
  coordenadas: text("coordenadas"),
  observaciones: text("observaciones"),
});

export const cazuelas = pgTable("cazuelas", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  material: text("material").notNull(),
  tamano: text("tamano").notNull(),
  fechaInstalacion: timestamp("fecha_instalacion").notNull().default(sql`now()`),
  estado: text("estado").notNull().default('Buen estado'),
});

export const tiposMantenimiento = pgTable("tipos_mantenimiento", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tipo: text("tipo").notNull(),
  frecuenciaRecomendada: integer("frecuencia_recomendada"),
  descripcion: text("descripcion"),
});

export const motivosExtraccion = pgTable("motivos_extraccion", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  motivo: text("motivo").notNull(),
});

export const arboles = pgTable("arboles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  especie: text("especie").notNull(),
  fechaPlantacion: timestamp("fecha_plantacion").notNull().default(sql`now()`),
  estado: text("estado").notNull().default('Vivo'),
  idCazuela: varchar("id_cazuela").notNull(),
  idUbicacion: varchar("id_ubicacion").notNull(),
  fotoUrl: text("foto_url"),
  observaciones: text("observaciones"),
});

export const mantenimientos = pgTable("mantenimientos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  idArbol: varchar("id_arbol").notNull(),
  fechaMantenimiento: timestamp("fecha_mantenimiento").notNull().default(sql`now()`),
  idTipoMantenimiento: varchar("id_tipo_mantenimiento").notNull(),
  idMotivoExtraccion: varchar("id_motivo_extraccion"),
  responsable: text("responsable").notNull(),
  observaciones: text("observaciones"),
  costo: real("costo").notNull().default(0),
  proximoMantenimiento: timestamp("proximo_mantenimiento"),
});

export const insertUbicacionSchema = createInsertSchema(ubicaciones).omit({
  id: true,
});

export const insertCazuelaSchema = createInsertSchema(cazuelas).omit({
  id: true,
});

export const insertTipoMantenimientoSchema = createInsertSchema(tiposMantenimiento).omit({
  id: true,
});

export const insertMotivoExtraccionSchema = createInsertSchema(motivosExtraccion).omit({
  id: true,
});

export const insertArbolSchema = createInsertSchema(arboles).omit({
  id: true,
});

export const insertMantenimientoSchema = createInsertSchema(mantenimientos).omit({
  id: true,
});

export type Ubicacion = typeof ubicaciones.$inferSelect;
export type InsertUbicacion = z.infer<typeof insertUbicacionSchema>;

export type Cazuela = typeof cazuelas.$inferSelect;
export type InsertCazuela = z.infer<typeof insertCazuelaSchema>;

export type TipoMantenimiento = typeof tiposMantenimiento.$inferSelect;
export type InsertTipoMantenimiento = z.infer<typeof insertTipoMantenimientoSchema>;

export type MotivoExtraccion = typeof motivosExtraccion.$inferSelect;
export type InsertMotivoExtraccion = z.infer<typeof insertMotivoExtraccionSchema>;

export type Arbol = typeof arboles.$inferSelect;
export type InsertArbol = z.infer<typeof insertArbolSchema>;

export type Mantenimiento = typeof mantenimientos.$inferSelect;
export type InsertMantenimiento = z.infer<typeof insertMantenimientoSchema>;

export type ArbolConDetalles = Arbol & {
  ubicacion: Ubicacion;
  cazuela: Cazuela;
  mantenimientos?: MantenimientoConDetalles[];
};

export type MantenimientoConDetalles = Mantenimiento & {
  tipoMantenimiento: TipoMantenimiento;
  motivoExtraccion?: MotivoExtraccion;
};
