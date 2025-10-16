import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { MapPin, Plus } from "lucide-react";
import { insertUbicacionSchema } from "@shared/schema";
import type { Ubicacion } from "@shared/schema";
import { z } from "zod";

export default function Ubicaciones() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const { data: ubicaciones = [], isLoading } = useQuery<Ubicacion[]>({
    queryKey: ["/api/ubicaciones"],
  });

  const form = useForm<z.infer<typeof insertUbicacionSchema>>({
    resolver: zodResolver(insertUbicacionSchema),
    defaultValues: {
      direccion: "",
      barrio: "",
      coordenadas: "",
      observaciones: "",
    },
  });

  const createUbicacion = useMutation({
    mutationFn: async (data: z.infer<typeof insertUbicacionSchema>) => {
      return await apiRequest("POST", "/api/ubicaciones", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ubicaciones"] });
      toast({
        title: "Ubicación creada",
        description: "La ubicación se ha registrado correctamente",
      });
      setOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo crear la ubicación",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof insertUbicacionSchema>) => {
    createUbicacion.mutate(data);
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-foreground" data-testid="text-page-title">
            Ubicaciones
          </h1>
          <p className="text-muted-foreground">
            Gestiona las ubicaciones donde están plantados los árboles
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="lg" data-testid="button-nueva-ubicacion">
              <Plus className="h-5 w-5 mr-2" />
              Nueva Ubicación
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Registrar Nueva Ubicación</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="direccion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ej: Av. Libertador 1250"
                          {...field}
                          data-testid="input-direccion"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="barrio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Barrio *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ej: Centro"
                          {...field}
                          data-testid="input-barrio"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="coordenadas"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Coordenadas GPS (opcional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ej: -34.603722, -58.381592"
                          {...field}
                          value={field.value || ""}
                          data-testid="input-coordenadas"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="observaciones"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observaciones (opcional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Notas adicionales..."
                          rows={3}
                          {...field}
                          value={field.value || ""}
                          data-testid="input-observaciones"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setOpen(false)}
                    data-testid="button-cancel"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createUbicacion.isPending}
                    data-testid="button-submit"
                  >
                    {createUbicacion.isPending ? "Creando..." : "Crear Ubicación"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {ubicaciones.length === 0 && !isLoading ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <MapPin className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay ubicaciones registradas</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              Comienza registrando la primera ubicación donde se encuentran los árboles
            </p>
            <Button onClick={() => setOpen(true)} data-testid="button-add-first-ubicacion">
              <Plus className="h-4 w-4 mr-2" />
              Registrar primera ubicación
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ubicaciones.map((ubicacion) => (
            <Card key={ubicacion.id} data-testid={`card-ubicacion-${ubicacion.id}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="truncate">{ubicacion.direccion}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Barrio</label>
                  <p className="text-base">{ubicacion.barrio}</p>
                </div>
                {ubicacion.coordenadas && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Coordenadas</label>
                    <p className="text-sm font-mono">{ubicacion.coordenadas}</p>
                  </div>
                )}
                {ubicacion.observaciones && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Observaciones</label>
                    <p className="text-sm text-muted-foreground">{ubicacion.observaciones}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
