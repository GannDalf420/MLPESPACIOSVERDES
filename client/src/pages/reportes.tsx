import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { 
  TrendingUp,
  MapPin,
  DollarSign,
  FileX,
  Wrench,
  TreeDeciduous
} from "lucide-react";
import type { ArbolConDetalles, MantenimientoConDetalles } from "@shared/schema";

export default function Reportes() {
  const { data: arboles = [], isLoading: arbolesLoading } = useQuery<ArbolConDetalles[]>({
    queryKey: ["/api/arboles"],
  });

  const { data: mantenimientos = [], isLoading: mantenimientosLoading } = useQuery<MantenimientoConDetalles[]>({
    queryKey: ["/api/mantenimientos"],
  });

  const isLoading = arbolesLoading || mantenimientosLoading;

  const reportePorBarrio = arboles.reduce((acc, arbol) => {
    const barrio = arbol.ubicacion?.barrio || "Sin barrio";
    if (!acc[barrio]) {
      acc[barrio] = {
        total: 0,
        vivos: 0,
        muertos: 0,
        extraidos: 0,
        costoMantenimiento: 0,
      };
    }
    acc[barrio].total++;
    if (arbol.estado === "Vivo") acc[barrio].vivos++;
    if (arbol.estado === "Muerto") acc[barrio].muertos++;
    if (arbol.estado === "Extraído") acc[barrio].extraidos++;
    
    const mantenimientosArbol = mantenimientos.filter(m => m.idArbol === arbol.id);
    acc[barrio].costoMantenimiento += mantenimientosArbol.reduce((sum, m) => sum + m.costo, 0);
    
    return acc;
  }, {} as Record<string, { total: number; vivos: number; muertos: number; extraidos: number; costoMantenimiento: number }>);

  const extracciones = mantenimientos.filter(m => 
    m.tipoMantenimiento?.tipo === "Extracción" && m.motivoExtraccion
  );

  const reporteExtracciones = extracciones.reduce((acc, ext) => {
    const motivo = ext.motivoExtraccion?.motivo || "Sin motivo";
    if (!acc[motivo]) {
      acc[motivo] = { cantidad: 0, costoTotal: 0 };
    }
    acc[motivo].cantidad++;
    acc[motivo].costoTotal += ext.costo;
    return acc;
  }, {} as Record<string, { cantidad: number; costoTotal: number }>);

  const reportePorTipo = mantenimientos.reduce((acc, mant) => {
    const tipo = mant.tipoMantenimiento?.tipo || "Sin tipo";
    if (!acc[tipo]) {
      acc[tipo] = { cantidad: 0, costoTotal: 0 };
    }
    acc[tipo].cantidad++;
    acc[tipo].costoTotal += mant.costo;
    return acc;
  }, {} as Record<string, { cantidad: number; costoTotal: number }>);

  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground" data-testid="text-page-title">
          Reportes
        </h1>
        <p className="text-muted-foreground">
          Análisis y estadísticas del sistema de gestión de árboles
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Reporte por Barrio
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : Object.keys(reportePorBarrio).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <MapPin className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">
                No hay datos disponibles para generar el reporte
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(reportePorBarrio).map(([barrio, data], index) => (
                <div key={barrio}>
                  {index > 0 && <Separator className="my-4" />}
                  <div className="space-y-3" data-testid={`reporte-barrio-${barrio}`}>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{barrio}</h3>
                      <div className="flex items-center gap-1 text-primary">
                        <TreeDeciduous className="h-4 w-4" />
                        <span className="font-bold">{data.total}</span>
                        <span className="text-xs text-muted-foreground">árboles</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Vivos</p>
                        <p className="text-2xl font-bold text-chart-2">{data.vivos}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Muertos</p>
                        <p className="text-2xl font-bold text-destructive">{data.muertos}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Extraídos</p>
                        <p className="text-2xl font-bold text-muted-foreground">{data.extraidos}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Costo Mantenimiento</p>
                        <p className="text-2xl font-bold text-chart-3">
                          ${data.costoMantenimiento.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileX className="h-5 w-5" />
              Extracciones por Motivo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : Object.keys(reporteExtracciones).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileX className="h-12 w-12 text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">
                  No hay extracciones registradas
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(reporteExtracciones).map(([motivo, data]) => (
                  <div 
                    key={motivo}
                    className="flex items-center justify-between p-3 rounded-md border border-border"
                    data-testid={`extraccion-${motivo}`}
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{motivo}</h4>
                      <p className="text-sm text-muted-foreground">
                        {data.cantidad} {data.cantidad === 1 ? "extracción" : "extracciones"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">${data.costoTotal.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Costo total</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Mantenimientos por Tipo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : Object.keys(reportePorTipo).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Wrench className="h-12 w-12 text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">
                  No hay mantenimientos registrados
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(reportePorTipo).map(([tipo, data]) => (
                  <div 
                    key={tipo}
                    className="flex items-center justify-between p-3 rounded-md border border-border"
                    data-testid={`tipo-${tipo}`}
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{tipo}</h4>
                      <p className="text-sm text-muted-foreground">
                        {data.cantidad} {data.cantidad === 1 ? "mantenimiento" : "mantenimientos"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">${data.costoTotal.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Costo total</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
