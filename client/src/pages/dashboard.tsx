import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { 
  TreeDeciduous, 
  AlertTriangle, 
  FileX, 
  DollarSign,
  Plus,
  Calendar,
  MapPin,
  Wrench
} from "lucide-react";
import type { ArbolConDetalles, MantenimientoConDetalles } from "@shared/schema";

export default function Dashboard() {
  const { data: arboles, isLoading: arbolesLoading } = useQuery<ArbolConDetalles[]>({
    queryKey: ["/api/arboles"],
  });

  const { data: mantenimientos, isLoading: mantenimientosLoading } = useQuery<MantenimientoConDetalles[]>({
    queryKey: ["/api/mantenimientos"],
  });

  const isLoading = arbolesLoading || mantenimientosLoading;

  const stats = {
    totalArboles: arboles?.length || 0,
    arbolesVivos: arboles?.filter(a => a.estado === "Vivo").length || 0,
    arbolesMuertos: arboles?.filter(a => a.estado === "Muerto").length || 0,
    arbolesExtraidos: arboles?.filter(a => a.estado === "Extraído").length || 0,
    mantenimientosEsteMes: mantenimientos?.filter(m => {
      const fecha = new Date(m.fechaMantenimiento);
      const ahora = new Date();
      return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear();
    }).length || 0,
    costoTotal: mantenimientos?.reduce((sum, m) => sum + (m.costo || 0), 0) || 0,
  };

  const mantenimientosRecientes = mantenimientos?.slice(0, 5) || [];
  const arbolesRecientes = arboles?.slice(0, 5) || [];

  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground" data-testid="text-page-title">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Resumen general del sistema de gestión de árboles urbanos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            <Card data-testid="card-total-arboles">
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Árboles
                </CardTitle>
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <TreeDeciduous className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-total-arboles">
                  {stats.totalArboles}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.arbolesVivos} vivos · {stats.arbolesMuertos} muertos
                </p>
              </CardContent>
            </Card>

            <Card data-testid="card-mantenimientos-mes">
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Mantenimientos (mes)
                </CardTitle>
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-chart-2/10 text-chart-2">
                  <Wrench className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-mantenimientos-mes">
                  {stats.mantenimientosEsteMes}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Este mes
                </p>
              </CardContent>
            </Card>

            <Card data-testid="card-extraidos">
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Árboles Extraídos
                </CardTitle>
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-destructive/10 text-destructive">
                  <FileX className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-extraidos">
                  {stats.arbolesExtraidos}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Total histórico
                </p>
              </CardContent>
            </Card>

            <Card data-testid="card-costo-total">
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Costo Total
                </CardTitle>
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-chart-3/10 text-chart-3">
                  <DollarSign className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-costo-total">
                  ${stats.costoTotal.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Todos los mantenimientos
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
            <CardTitle className="text-lg font-semibold">Árboles Recientes</CardTitle>
            <Button variant="outline" size="sm" asChild data-testid="button-view-all-arboles">
              <Link href="/arboles">Ver todos</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-md" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                ))}
              </div>
            ) : arbolesRecientes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <TreeDeciduous className="h-12 w-12 text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground mb-4">
                  No hay árboles registrados
                </p>
                <Button asChild size="sm" data-testid="button-add-first-arbol">
                  <Link href="/arboles/nuevo">
                    <Plus className="h-4 w-4 mr-2" />
                    Registrar primer árbol
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {arbolesRecientes.map((arbol) => (
                  <Link 
                    key={arbol.id} 
                    href={`/arboles/${arbol.id}`}
                    className="flex items-center gap-3 p-3 rounded-md hover-elevate active-elevate-2 cursor-pointer"
                    data-testid={`link-arbol-${arbol.id}`}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary flex-shrink-0">
                      <TreeDeciduous className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm truncate">{arbol.especie}</p>
                        <Badge 
                          variant={
                            arbol.estado === "Vivo" ? "default" : 
                            arbol.estado === "Muerto" ? "destructive" : 
                            "secondary"
                          }
                          className="text-xs"
                        >
                          {arbol.estado}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {arbol.ubicacion?.direccion || "Sin ubicación"}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
            <CardTitle className="text-lg font-semibold">Mantenimientos Recientes</CardTitle>
            <Button variant="outline" size="sm" asChild data-testid="button-view-all-mantenimientos">
              <Link href="/mantenimientos">Ver todos</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-md" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                ))}
              </div>
            ) : mantenimientosRecientes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Wrench className="h-12 w-12 text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">
                  No hay mantenimientos registrados
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {mantenimientosRecientes.map((mant) => (
                  <div 
                    key={mant.id}
                    className="flex items-center gap-3 p-3 rounded-md border border-border"
                    data-testid={`card-mantenimiento-${mant.id}`}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-chart-2/10 text-chart-2 flex-shrink-0">
                      <Wrench className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm truncate">
                          {mant.tipoMantenimiento?.tipo || "Mantenimiento"}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          ${mant.costo.toLocaleString()}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(mant.fechaMantenimiento).toLocaleDateString("es-ES")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center gap-4">
        <Button asChild size="lg" data-testid="button-nuevo-arbol">
          <Link href="/arboles/nuevo">
            <Plus className="h-5 w-5 mr-2" />
            Registrar Árbol
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" data-testid="button-nuevo-mantenimiento">
          <Link href="/mantenimientos/nuevo">
            <Plus className="h-5 w-5 mr-2" />
            Registrar Mantenimiento
          </Link>
        </Button>
      </div>
    </div>
  );
}
