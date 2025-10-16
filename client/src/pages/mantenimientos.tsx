import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { 
  Wrench, 
  Plus, 
  Search,
  Calendar,
  TreeDeciduous,
  DollarSign
} from "lucide-react";
import type { MantenimientoConDetalles } from "@shared/schema";

export default function Mantenimientos() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: mantenimientos = [], isLoading } = useQuery<MantenimientoConDetalles[]>({
    queryKey: ["/api/mantenimientos"],
  });

  const filteredMantenimientos = mantenimientos.filter(mant => 
    mant.tipoMantenimiento?.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mant.responsable.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-foreground" data-testid="text-page-title">
            Mantenimientos
          </h1>
          <p className="text-muted-foreground">
            Historial completo de mantenimientos realizados
          </p>
        </div>
        <Button asChild size="lg" data-testid="button-nuevo-mantenimiento">
          <Link href="/mantenimientos/nuevo">
            <Plus className="h-5 w-5 mr-2" />
            Registrar Mantenimiento
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por tipo o responsable..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search-mantenimientos"
            />
          </div>
        </CardContent>
      </Card>

      {filteredMantenimientos.length === 0 && !isLoading ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Wrench className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm ? "No se encontraron mantenimientos" : "No hay mantenimientos registrados"}
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              {searchTerm 
                ? "Intenta ajustar los términos de búsqueda"
                : "Comienza registrando el primer mantenimiento realizado a un árbol"
              }
            </p>
            {!searchTerm && (
              <Button asChild data-testid="button-add-first-mantenimiento">
                <Link href="/mantenimientos/nuevo">
                  <Plus className="h-4 w-4 mr-2" />
                  Registrar primer mantenimiento
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground" data-testid="text-result-count">
              Mostrando {filteredMantenimientos.length} {filteredMantenimientos.length === 1 ? "mantenimiento" : "mantenimientos"}
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {filteredMantenimientos.map((mant, index) => (
                  <div key={mant.id}>
                    {index > 0 && <Separator className="my-4" />}
                    <div className="flex items-start gap-4" data-testid={`card-mantenimiento-${mant.id}`}>
                      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-chart-2/10 text-chart-2 flex-shrink-0">
                        <Wrench className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {mant.tipoMantenimiento?.tipo || "Mantenimiento"}
                            </h3>
                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              {new Date(mant.fechaMantenimiento).toLocaleDateString("es-ES", {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                          </div>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {mant.costo.toLocaleString()}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 text-sm">
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
                          <p className="text-sm text-muted-foreground mt-3 border-l-2 border-muted pl-3">
                            {mant.observaciones}
                          </p>
                        )}

                        {mant.proximoMantenimiento && (
                          <div className="mt-3 text-sm">
                            <Badge variant="secondary" className="text-xs">
                              Próximo mantenimiento: {new Date(mant.proximoMantenimiento).toLocaleDateString("es-ES")}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
