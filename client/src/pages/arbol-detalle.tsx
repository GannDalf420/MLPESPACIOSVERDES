import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft,
  TreeDeciduous,
  MapPin,
  Calendar,
  Container,
  FileText,
  Wrench,
  Plus
} from "lucide-react";
import type { ArbolConDetalles } from "@shared/schema";

export default function ArbolDetalle() {
  const [, params] = useRoute("/arboles/:id");
  const id = params?.id;

  const { data: arbol, isLoading } = useQuery<ArbolConDetalles>({
    queryKey: ["/api/arboles", id],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!arbol) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <TreeDeciduous className="h-16 w-16 text-muted-foreground/50" />
        <h2 className="text-2xl font-bold">Árbol no encontrado</h2>
        <Button asChild variant="outline">
          <Link href="/arboles">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a árboles
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild data-testid="button-back">
          <Link href="/arboles">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground" data-testid="text-especie">
            {arbol.especie}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge 
              variant={
                arbol.estado === "Vivo" ? "default" : 
                arbol.estado === "Muerto" ? "destructive" : 
                "secondary"
              }
              data-testid="badge-estado"
            >
              {arbol.estado}
            </Badge>
          </div>
        </div>
        <Button asChild data-testid="button-nuevo-mantenimiento">
          <Link href={`/mantenimientos/nuevo?arbolId=${arbol.id}`}>
            <Plus className="h-4 w-4 mr-2" />
            Registrar Mantenimiento
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TreeDeciduous className="h-5 w-5" />
              Información del Árbol
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Especie</label>
              <p className="text-base mt-1" data-testid="text-info-especie">{arbol.especie}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Fecha de Plantación</label>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="text-base" data-testid="text-fecha-plantacion">
                  {new Date(arbol.fechaPlantacion).toLocaleDateString("es-ES", {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Estado</label>
              <p className="text-base mt-1" data-testid="text-info-estado">{arbol.estado}</p>
            </div>
            {arbol.observaciones && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Observaciones</label>
                <p className="text-base mt-1 text-muted-foreground" data-testid="text-observaciones">
                  {arbol.observaciones}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Ubicación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Dirección</label>
              <p className="text-base mt-1" data-testid="text-direccion">
                {arbol.ubicacion?.direccion || "No especificada"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Barrio</label>
              <p className="text-base mt-1" data-testid="text-barrio">
                {arbol.ubicacion?.barrio || "No especificado"}
              </p>
            </div>
            {arbol.ubicacion?.coordenadas && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Coordenadas GPS</label>
                <p className="text-base mt-1 font-mono text-sm" data-testid="text-coordenadas">
                  {arbol.ubicacion.coordenadas}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Container className="h-5 w-5" />
              Cazuela
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Material</label>
              <p className="text-base mt-1" data-testid="text-material">
                {arbol.cazuela?.material || "No especificado"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Tamaño</label>
              <p className="text-base mt-1" data-testid="text-tamano">
                {arbol.cazuela?.tamano || "No especificado"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Estado de la Cazuela</label>
              <p className="text-base mt-1" data-testid="text-estado-cazuela">
                {arbol.cazuela?.estado || "No especificado"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Historial de Mantenimientos
          </CardTitle>
          <Button variant="outline" size="sm" asChild data-testid="button-add-mantenimiento">
            <Link href={`/mantenimientos/nuevo?arbolId=${arbol.id}`}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {!arbol.mantenimientos || arbol.mantenimientos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Wrench className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground mb-4">
                No hay mantenimientos registrados para este árbol
              </p>
              <Button variant="outline" size="sm" asChild data-testid="button-first-mantenimiento">
                <Link href={`/mantenimientos/nuevo?arbolId=${arbol.id}`}>
                  <Plus className="h-4 w-4 mr-2" />
                  Registrar primer mantenimiento
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {arbol.mantenimientos.map((mant, index) => (
                <div key={mant.id}>
                  {index > 0 && <Separator className="my-4" />}
                  <div className="flex items-start gap-4" data-testid={`mantenimiento-${mant.id}`}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-chart-2/10 text-chart-2 flex-shrink-0">
                      <Wrench className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h4 className="font-semibold">
                            {mant.tipoMantenimiento?.tipo || "Mantenimiento"}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(mant.fechaMantenimiento).toLocaleDateString("es-ES", {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <Badge variant="outline">
                          ${mant.costo.toLocaleString()}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Responsable:</span>{" "}
                          <span className="font-medium">{mant.responsable}</span>
                        </div>
                        {mant.motivoExtraccion && (
                          <div>
                            <span className="text-muted-foreground">Motivo:</span>{" "}
                            <span className="font-medium">{mant.motivoExtraccion.motivo}</span>
                          </div>
                        )}
                      </div>
                      {mant.observaciones && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {mant.observaciones}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
