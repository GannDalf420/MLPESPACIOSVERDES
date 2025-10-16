import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertUbicacionSchema,
  insertCazuelaSchema,
  insertTipoMantenimientoSchema,
  insertMotivoExtraccionSchema,
  insertArbolSchema,
  insertMantenimientoSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/ubicaciones", async (_req, res) => {
    try {
      const ubicaciones = await storage.getUbicaciones();
      res.json(ubicaciones);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener ubicaciones" });
    }
  });

  app.get("/api/ubicaciones/:id", async (req, res) => {
    try {
      const ubicacion = await storage.getUbicacion(req.params.id);
      if (!ubicacion) {
        return res.status(404).json({ error: "Ubicación no encontrada" });
      }
      res.json(ubicacion);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener ubicación" });
    }
  });

  app.post("/api/ubicaciones", async (req, res) => {
    try {
      const validated = insertUbicacionSchema.parse(req.body);
      const ubicacion = await storage.createUbicacion(validated);
      res.status(201).json(ubicacion);
    } catch (error) {
      res.status(400).json({ error: "Datos de ubicación inválidos" });
    }
  });

  app.put("/api/ubicaciones/:id", async (req, res) => {
    try {
      const validated = insertUbicacionSchema.partial().parse(req.body);
      const ubicacion = await storage.updateUbicacion(req.params.id, validated);
      res.json(ubicacion);
    } catch (error: any) {
      if (error.message === "Ubicación no encontrada") {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: "Datos de ubicación inválidos" });
    }
  });

  app.delete("/api/ubicaciones/:id", async (req, res) => {
    try {
      await storage.deleteUbicacion(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar ubicación" });
    }
  });

  app.get("/api/cazuelas", async (_req, res) => {
    try {
      const cazuelas = await storage.getCazuelas();
      res.json(cazuelas);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener cazuelas" });
    }
  });

  app.get("/api/cazuelas/:id", async (req, res) => {
    try {
      const cazuela = await storage.getCazuela(req.params.id);
      if (!cazuela) {
        return res.status(404).json({ error: "Cazuela no encontrada" });
      }
      res.json(cazuela);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener cazuela" });
    }
  });

  app.post("/api/cazuelas", async (req, res) => {
    try {
      const validated = insertCazuelaSchema.parse(req.body);
      const cazuela = await storage.createCazuela(validated);
      res.status(201).json(cazuela);
    } catch (error) {
      res.status(400).json({ error: "Datos de cazuela inválidos" });
    }
  });

  app.put("/api/cazuelas/:id", async (req, res) => {
    try {
      const validated = insertCazuelaSchema.partial().parse(req.body);
      const cazuela = await storage.updateCazuela(req.params.id, validated);
      res.json(cazuela);
    } catch (error: any) {
      if (error.message === "Cazuela no encontrada") {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: "Datos de cazuela inválidos" });
    }
  });

  app.delete("/api/cazuelas/:id", async (req, res) => {
    try {
      await storage.deleteCazuela(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar cazuela" });
    }
  });

  app.get("/api/tipos-mantenimiento", async (_req, res) => {
    try {
      const tipos = await storage.getTiposMantenimiento();
      res.json(tipos);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener tipos de mantenimiento" });
    }
  });

  app.get("/api/tipos-mantenimiento/:id", async (req, res) => {
    try {
      const tipo = await storage.getTipoMantenimiento(req.params.id);
      if (!tipo) {
        return res.status(404).json({ error: "Tipo de mantenimiento no encontrado" });
      }
      res.json(tipo);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener tipo de mantenimiento" });
    }
  });

  app.post("/api/tipos-mantenimiento", async (req, res) => {
    try {
      const validated = insertTipoMantenimientoSchema.parse(req.body);
      const tipo = await storage.createTipoMantenimiento(validated);
      res.status(201).json(tipo);
    } catch (error) {
      res.status(400).json({ error: "Datos de tipo de mantenimiento inválidos" });
    }
  });

  app.put("/api/tipos-mantenimiento/:id", async (req, res) => {
    try {
      const validated = insertTipoMantenimientoSchema.partial().parse(req.body);
      const tipo = await storage.updateTipoMantenimiento(req.params.id, validated);
      res.json(tipo);
    } catch (error: any) {
      if (error.message === "Tipo de mantenimiento no encontrado") {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: "Datos de tipo de mantenimiento inválidos" });
    }
  });

  app.delete("/api/tipos-mantenimiento/:id", async (req, res) => {
    try {
      await storage.deleteTipoMantenimiento(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar tipo de mantenimiento" });
    }
  });

  app.get("/api/motivos-extraccion", async (_req, res) => {
    try {
      const motivos = await storage.getMotivosExtraccion();
      res.json(motivos);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener motivos de extracción" });
    }
  });

  app.get("/api/motivos-extraccion/:id", async (req, res) => {
    try {
      const motivo = await storage.getMotivoExtraccion(req.params.id);
      if (!motivo) {
        return res.status(404).json({ error: "Motivo de extracción no encontrado" });
      }
      res.json(motivo);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener motivo de extracción" });
    }
  });

  app.post("/api/motivos-extraccion", async (req, res) => {
    try {
      const validated = insertMotivoExtraccionSchema.parse(req.body);
      const motivo = await storage.createMotivoExtraccion(validated);
      res.status(201).json(motivo);
    } catch (error) {
      res.status(400).json({ error: "Datos de motivo de extracción inválidos" });
    }
  });

  app.put("/api/motivos-extraccion/:id", async (req, res) => {
    try {
      const validated = insertMotivoExtraccionSchema.partial().parse(req.body);
      const motivo = await storage.updateMotivoExtraccion(req.params.id, validated);
      res.json(motivo);
    } catch (error: any) {
      if (error.message === "Motivo de extracción no encontrado") {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: "Datos de motivo de extracción inválidos" });
    }
  });

  app.delete("/api/motivos-extraccion/:id", async (req, res) => {
    try {
      await storage.deleteMotivoExtraccion(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar motivo de extracción" });
    }
  });

  app.get("/api/arboles", async (_req, res) => {
    try {
      const arboles = await storage.getArboles();
      res.json(arboles);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener árboles" });
    }
  });

  app.get("/api/arboles/:id", async (req, res) => {
    try {
      const arbol = await storage.getArbol(req.params.id);
      if (!arbol) {
        return res.status(404).json({ error: "Árbol no encontrado" });
      }
      res.json(arbol);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener árbol" });
    }
  });

  app.post("/api/arboles", async (req, res) => {
    try {
      const validated = insertArbolSchema.parse(req.body);
      const arbol = await storage.createArbol(validated);
      res.status(201).json(arbol);
    } catch (error) {
      res.status(400).json({ error: "Datos de árbol inválidos" });
    }
  });

  app.put("/api/arboles/:id", async (req, res) => {
    try {
      const validated = insertArbolSchema.partial().parse(req.body);
      const arbol = await storage.updateArbol(req.params.id, validated);
      res.json(arbol);
    } catch (error: any) {
      if (error.message === "Árbol no encontrado") {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: "Datos de árbol inválidos" });
    }
  });

  app.delete("/api/arboles/:id", async (req, res) => {
    try {
      await storage.deleteArbol(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar árbol" });
    }
  });

  app.get("/api/mantenimientos", async (_req, res) => {
    try {
      const mantenimientos = await storage.getMantenimientos();
      res.json(mantenimientos);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener mantenimientos" });
    }
  });

  app.get("/api/mantenimientos/:id", async (req, res) => {
    try {
      const mantenimiento = await storage.getMantenimiento(req.params.id);
      if (!mantenimiento) {
        return res.status(404).json({ error: "Mantenimiento no encontrado" });
      }
      res.json(mantenimiento);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener mantenimiento" });
    }
  });

  app.post("/api/mantenimientos", async (req, res) => {
    try {
      const validated = insertMantenimientoSchema.parse(req.body);
      const mantenimiento = await storage.createMantenimiento(validated);
      res.status(201).json(mantenimiento);
    } catch (error) {
      res.status(400).json({ error: "Datos de mantenimiento inválidos" });
    }
  });

  app.put("/api/mantenimientos/:id", async (req, res) => {
    try {
      const validated = insertMantenimientoSchema.partial().parse(req.body);
      const mantenimiento = await storage.updateMantenimiento(req.params.id, validated);
      res.json(mantenimiento);
    } catch (error: any) {
      if (error.message === "Mantenimiento no encontrado") {
        return res.status(404).json({ error: error.message });
      }
      res.status(400).json({ error: "Datos de mantenimiento inválidos" });
    }
  });

  app.delete("/api/mantenimientos/:id", async (req, res) => {
    try {
      await storage.deleteMantenimiento(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar mantenimiento" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
