import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "wouter";
import { 
  TreeDeciduous, 
  Plus, 
  Search,
  MapPin,
  Calendar,
  Filter
} from "lucide-react";
import type { ArbolConDetalles } from "@shared/schema";

export default function Arboles() {
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFilter, setEstadoFilter] = useState<string>("todos");

  const { data: arboles, isLoading } = useQuery<ArbolConDetalles[]>({
    queryKey: ["/api/arboles"],
  });

  const filteredArboles = arboles?.filter(arbol => {
    const matchesSearch = arbol.especie.toLowerCase().includes(searchTerm.toLowerCase()) ||
      arbol.ubicacion?.direccion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      arbol.ubicacion?.barrio?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEstado = estadoFilter === "todos" || arbol.estado === estadoFilter;
    
    return matchesSearch && matchesEstado;
  }) || [];

  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-foreground" data-testid="text-page-title">
            Árboles
          </h1>
          <p className="text-muted-foreground">
            Gestiona el registro completo de árboles urbanos
          </p>
        </div>
        <Button asChild size="lg" data-testid="button-nuevo-arbol">
          <Link href="/arboles/nuevo">
            <Plus className="h-5 w-5 mr-2" />
            Registrar Árbol
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por especie, dirección o barrio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search-arboles"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={estadoFilter} onValueChange={setEstadoFilter}>
                <SelectTrigger className="w-[180px]" data-testid="select-filter-estado">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos" data-testid="option-filter-todos">Todos los estados</SelectItem>
                  <SelectItem value="Vivo" data-testid="option-filter-vivo">Vivo</SelectItem>
                  <SelectItem value="Muerto" data-testid="option-filter-muerto">Muerto</SelectItem>
                  <SelectItem value="Extraído" data-testid="option-filter-extraido">Extraído</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-16 w-16 rounded-md" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredArboles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <TreeDeciduous className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm || estadoFilter !== "todos" ? "No se encontraron árboles" : "No hay árboles registrados"}
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              {searchTerm || estadoFilter !== "todos" 
                ? "Intenta ajustar los filtros de búsqueda"
                : "Comienza registrando el primer árbol en el sistema"
              }
            </p>
            {!searchTerm && estadoFilter === "todos" && (
              <Button asChild data-testid="button-add-first-arbol">
                <Link href="/arboles/nuevo">
                  <Plus className="h-4 w-4 mr-2" />
                  Registrar primer árbol
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground" data-testid="text-result-count">
              Mostrando {filteredArboles.length} {filteredArboles.length === 1 ? "árbol" : "árboles"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArboles.map((arbol) => (
              <Link key={arbol.id} href={`/arboles/${arbol.id}`}>
                <Card className="hover-elevate active-elevate-2 cursor-pointer h-full" data-testid={`card-arbol-${arbol.id}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-md bg-primary/10 text-primary flex-shrink-0">
                        <TreeDeciduous className="h-8 w-8" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1 truncate" data-testid={`text-especie-${arbol.id}`}>
                          {arbol.especie}
                        </h3>
                        <Badge 
                          variant={
                            arbol.estado === "Vivo" ? "default" : 
                            arbol.estado === "Muerto" ? "destructive" : 
                            "secondary"
                          }
                          data-testid={`badge-estado-${arbol.id}`}
                        >
                          {arbol.estado}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">
                          {arbol.ubicacion?.direccion || "Sin ubicación"}
                        </span>
                      </div>
                      {arbol.ubicacion?.barrio && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4 flex-shrink-0 invisible" />
                          <span className="truncate text-xs">
                            {arbol.ubicacion.barrio}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4 flex-shrink-0" />
                        <span>
                          Plantado {new Date(arbol.fechaPlantacion).toLocaleDateString("es-ES")}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
