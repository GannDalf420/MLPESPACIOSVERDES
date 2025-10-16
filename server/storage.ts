import { randomUUID } from "crypto";
import type {
  Ubicacion,
  InsertUbicacion,
  Cazuela,
  InsertCazuela,
  TipoMantenimiento,
  InsertTipoMantenimiento,
  MotivoExtraccion,
  InsertMotivoExtraccion,
  Arbol,
  InsertArbol,
  Mantenimiento,
  InsertMantenimiento,
  ArbolConDetalles,
  MantenimientoConDetalles,
} from "@shared/schema";

export interface IStorage {
  getUbicaciones(): Promise<Ubicacion[]>;
  getUbicacion(id: string): Promise<Ubicacion | undefined>;
  createUbicacion(ubicacion: InsertUbicacion): Promise<Ubicacion>;
  updateUbicacion(id: string, ubicacion: Partial<InsertUbicacion>): Promise<Ubicacion>;
  deleteUbicacion(id: string): Promise<void>;

  getCazuelas(): Promise<Cazuela[]>;
  getCazuela(id: string): Promise<Cazuela | undefined>;
  createCazuela(cazuela: InsertCazuela): Promise<Cazuela>;
  updateCazuela(id: string, cazuela: Partial<InsertCazuela>): Promise<Cazuela>;
  deleteCazuela(id: string): Promise<void>;

  getTiposMantenimiento(): Promise<TipoMantenimiento[]>;
  getTipoMantenimiento(id: string): Promise<TipoMantenimiento | undefined>;
  createTipoMantenimiento(tipo: InsertTipoMantenimiento): Promise<TipoMantenimiento>;
  updateTipoMantenimiento(id: string, tipo: Partial<InsertTipoMantenimiento>): Promise<TipoMantenimiento>;
  deleteTipoMantenimiento(id: string): Promise<void>;

  getMotivosExtraccion(): Promise<MotivoExtraccion[]>;
  getMotivoExtraccion(id: string): Promise<MotivoExtraccion | undefined>;
  createMotivoExtraccion(motivo: InsertMotivoExtraccion): Promise<MotivoExtraccion>;
  updateMotivoExtraccion(id: string, motivo: Partial<InsertMotivoExtraccion>): Promise<MotivoExtraccion>;
  deleteMotivoExtraccion(id: string): Promise<void>;

  getArboles(): Promise<ArbolConDetalles[]>;
  getArbol(id: string): Promise<ArbolConDetalles | undefined>;
  createArbol(arbol: InsertArbol): Promise<Arbol>;
  updateArbol(id: string, arbol: Partial<InsertArbol>): Promise<Arbol>;
  deleteArbol(id: string): Promise<void>;

  getMantenimientos(): Promise<MantenimientoConDetalles[]>;
  getMantenimiento(id: string): Promise<MantenimientoConDetalles | undefined>;
  createMantenimiento(mantenimiento: InsertMantenimiento): Promise<Mantenimiento>;
  updateMantenimiento(id: string, mantenimiento: Partial<InsertMantenimiento>): Promise<Mantenimiento>;
  deleteMantenimiento(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private ubicaciones: Map<string, Ubicacion>;
  private cazuelas: Map<string, Cazuela>;
  private tiposMantenimiento: Map<string, TipoMantenimiento>;
  private motivosExtraccion: Map<string, MotivoExtraccion>;
  private arboles: Map<string, Arbol>;
  private mantenimientos: Map<string, Mantenimiento>;

  constructor() {
    this.ubicaciones = new Map();
    this.cazuelas = new Map();
    this.tiposMantenimiento = new Map();
    this.motivosExtraccion = new Map();
    this.arboles = new Map();
    this.mantenimientos = new Map();

    this.initializeDefaults();
  }

  private initializeDefaults() {
    const tiposPorDefecto = [
      { tipo: "Poda", frecuenciaRecomendada: 180, descripcion: "Poda de mantenimiento de ramas y follaje" },
      { tipo: "Riego", frecuenciaRecomendada: 7, descripcion: "Riego regular del árbol" },
      { tipo: "Fertilización", frecuenciaRecomendada: 90, descripcion: "Aplicación de fertilizantes y nutrientes" },
      { tipo: "Fumigación", frecuenciaRecomendada: 120, descripcion: "Control de plagas y enfermedades" },
      { tipo: "Extracción", frecuenciaRecomendada: null, descripcion: "Remoción completa del árbol" },
    ];

    tiposPorDefecto.forEach(tipo => {
      const id = randomUUID();
      this.tiposMantenimiento.set(id, { id, ...tipo });
    });

    const motivosPorDefecto = [
      { motivo: "Árbol muerto" },
      { motivo: "Solicitud vecino" },
      { motivo: "Daño en acera o infraestructura" },
      { motivo: "Enfermedad terminal" },
      { motivo: "Riesgo de caída" },
      { motivo: "Obra pública" },
    ];

    motivosPorDefecto.forEach(motivo => {
      const id = randomUUID();
      this.motivosExtraccion.set(id, { id, ...motivo });
    });
  }

  async getUbicaciones(): Promise<Ubicacion[]> {
    return Array.from(this.ubicaciones.values());
  }

  async getUbicacion(id: string): Promise<Ubicacion | undefined> {
    return this.ubicaciones.get(id);
  }

  async createUbicacion(insertUbicacion: InsertUbicacion): Promise<Ubicacion> {
    const id = randomUUID();
    const ubicacion: Ubicacion = { id, ...insertUbicacion };
    this.ubicaciones.set(id, ubicacion);
    return ubicacion;
  }

  async updateUbicacion(id: string, data: Partial<InsertUbicacion>): Promise<Ubicacion> {
    const ubicacion = this.ubicaciones.get(id);
    if (!ubicacion) throw new Error("Ubicación no encontrada");
    const updated = { ...ubicacion, ...data };
    this.ubicaciones.set(id, updated);
    return updated;
  }

  async deleteUbicacion(id: string): Promise<void> {
    this.ubicaciones.delete(id);
  }

  async getCazuelas(): Promise<Cazuela[]> {
    return Array.from(this.cazuelas.values());
  }

  async getCazuela(id: string): Promise<Cazuela | undefined> {
    return this.cazuelas.get(id);
  }

  async createCazuela(insertCazuela: InsertCazuela): Promise<Cazuela> {
    const id = randomUUID();
    const cazuela: Cazuela = { 
      id, 
      ...insertCazuela,
      fechaInstalacion: insertCazuela.fechaInstalacion || new Date(),
    };
    this.cazuelas.set(id, cazuela);
    return cazuela;
  }

  async updateCazuela(id: string, data: Partial<InsertCazuela>): Promise<Cazuela> {
    const cazuela = this.cazuelas.get(id);
    if (!cazuela) throw new Error("Cazuela no encontrada");
    const updated = { ...cazuela, ...data };
    this.cazuelas.set(id, updated);
    return updated;
  }

  async deleteCazuela(id: string): Promise<void> {
    this.cazuelas.delete(id);
  }

  async getTiposMantenimiento(): Promise<TipoMantenimiento[]> {
    return Array.from(this.tiposMantenimiento.values());
  }

  async getTipoMantenimiento(id: string): Promise<TipoMantenimiento | undefined> {
    return this.tiposMantenimiento.get(id);
  }

  async createTipoMantenimiento(insertTipo: InsertTipoMantenimiento): Promise<TipoMantenimiento> {
    const id = randomUUID();
    const tipo: TipoMantenimiento = { id, ...insertTipo };
    this.tiposMantenimiento.set(id, tipo);
    return tipo;
  }

  async updateTipoMantenimiento(id: string, data: Partial<InsertTipoMantenimiento>): Promise<TipoMantenimiento> {
    const tipo = this.tiposMantenimiento.get(id);
    if (!tipo) throw new Error("Tipo de mantenimiento no encontrado");
    const updated = { ...tipo, ...data };
    this.tiposMantenimiento.set(id, updated);
    return updated;
  }

  async deleteTipoMantenimiento(id: string): Promise<void> {
    this.tiposMantenimiento.delete(id);
  }

  async getMotivosExtraccion(): Promise<MotivoExtraccion[]> {
    return Array.from(this.motivosExtraccion.values());
  }

  async getMotivoExtraccion(id: string): Promise<MotivoExtraccion | undefined> {
    return this.motivosExtraccion.get(id);
  }

  async createMotivoExtraccion(insertMotivo: InsertMotivoExtraccion): Promise<MotivoExtraccion> {
    const id = randomUUID();
    const motivo: MotivoExtraccion = { id, ...insertMotivo };
    this.motivosExtraccion.set(id, motivo);
    return motivo;
  }

  async updateMotivoExtraccion(id: string, data: Partial<InsertMotivoExtraccion>): Promise<MotivoExtraccion> {
    const motivo = this.motivosExtraccion.get(id);
    if (!motivo) throw new Error("Motivo de extracción no encontrado");
    const updated = { ...motivo, ...data };
    this.motivosExtraccion.set(id, updated);
    return updated;
  }

  async deleteMotivoExtraccion(id: string): Promise<void> {
    this.motivosExtraccion.delete(id);
  }

  async getArboles(): Promise<ArbolConDetalles[]> {
    const arboles = Array.from(this.arboles.values());
    return arboles.map(arbol => this.enrichArbol(arbol));
  }

  async getArbol(id: string): Promise<ArbolConDetalles | undefined> {
    const arbol = this.arboles.get(id);
    if (!arbol) return undefined;
    return this.enrichArbol(arbol);
  }

  async createArbol(insertArbol: InsertArbol): Promise<Arbol> {
    const id = randomUUID();
    const arbol: Arbol = { 
      id, 
      ...insertArbol,
      fechaPlantacion: insertArbol.fechaPlantacion || new Date(),
    };
    this.arboles.set(id, arbol);
    return arbol;
  }

  async updateArbol(id: string, data: Partial<InsertArbol>): Promise<Arbol> {
    const arbol = this.arboles.get(id);
    if (!arbol) throw new Error("Árbol no encontrado");
    const updated = { ...arbol, ...data };
    this.arboles.set(id, updated);
    return updated;
  }

  async deleteArbol(id: string): Promise<void> {
    this.arboles.delete(id);
  }

  async getMantenimientos(): Promise<MantenimientoConDetalles[]> {
    const mantenimientos = Array.from(this.mantenimientos.values());
    return mantenimientos
      .map(mant => this.enrichMantenimiento(mant))
      .sort((a, b) => new Date(b.fechaMantenimiento).getTime() - new Date(a.fechaMantenimiento).getTime());
  }

  async getMantenimiento(id: string): Promise<MantenimientoConDetalles | undefined> {
    const mantenimiento = this.mantenimientos.get(id);
    if (!mantenimiento) return undefined;
    return this.enrichMantenimiento(mantenimiento);
  }

  async createMantenimiento(insertMantenimiento: InsertMantenimiento): Promise<Mantenimiento> {
    const id = randomUUID();
    
    const tipoMantenimiento = this.tiposMantenimiento.get(insertMantenimiento.idTipoMantenimiento);
    
    let proximoMantenimiento = insertMantenimiento.proximoMantenimiento || null;
    if (!proximoMantenimiento && tipoMantenimiento?.frecuenciaRecomendada) {
      const fechaBase = insertMantenimiento.fechaMantenimiento || new Date();
      const proxima = new Date(fechaBase);
      proxima.setDate(proxima.getDate() + tipoMantenimiento.frecuenciaRecomendada);
      proximoMantenimiento = proxima;
    }
    
    const mantenimiento: Mantenimiento = { 
      id, 
      ...insertMantenimiento,
      fechaMantenimiento: insertMantenimiento.fechaMantenimiento || new Date(),
      proximoMantenimiento,
      idMotivoExtraccion: insertMantenimiento.idMotivoExtraccion || null,
    };
    this.mantenimientos.set(id, mantenimiento);

    if (tipoMantenimiento?.tipo === "Extracción") {
      const arbol = this.arboles.get(mantenimiento.idArbol);
      if (arbol) {
        arbol.estado = "Extraído";
        this.arboles.set(arbol.id, arbol);
      }
    }

    return mantenimiento;
  }

  async updateMantenimiento(id: string, data: Partial<InsertMantenimiento>): Promise<Mantenimiento> {
    const mantenimiento = this.mantenimientos.get(id);
    if (!mantenimiento) throw new Error("Mantenimiento no encontrado");
    const updated = { ...mantenimiento, ...data };
    this.mantenimientos.set(id, updated);
    return updated;
  }

  async deleteMantenimiento(id: string): Promise<void> {
    this.mantenimientos.delete(id);
  }

  private enrichArbol(arbol: Arbol): ArbolConDetalles {
    const ubicacion = this.ubicaciones.get(arbol.idUbicacion);
    const cazuela = this.cazuelas.get(arbol.idCazuela);
    
    const mantenimientosArbol = Array.from(this.mantenimientos.values())
      .filter(m => m.idArbol === arbol.id)
      .map(m => this.enrichMantenimiento(m))
      .sort((a, b) => new Date(b.fechaMantenimiento).getTime() - new Date(a.fechaMantenimiento).getTime());

    return {
      ...arbol,
      ubicacion: ubicacion!,
      cazuela: cazuela!,
      mantenimientos: mantenimientosArbol,
    };
  }

  private enrichMantenimiento(mantenimiento: Mantenimiento): MantenimientoConDetalles {
    const tipoMantenimiento = this.tiposMantenimiento.get(mantenimiento.idTipoMantenimiento);
    const motivoExtraccion = mantenimiento.idMotivoExtraccion 
      ? this.motivosExtraccion.get(mantenimiento.idMotivoExtraccion)
      : undefined;

    return {
      ...mantenimiento,
      tipoMantenimiento: tipoMantenimiento!,
      motivoExtraccion,
    };
  }
}

export const storage = new MemStorage();
