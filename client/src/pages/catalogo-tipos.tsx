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
  FormDescription,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { FileText, Plus, Calendar } from "lucide-react";
import { insertTipoMantenimientoSchema } from "@shared/schema";
import type { TipoMantenimiento } from "@shared/schema";
import { z } from "zod";

export default function CatalogoTipos() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const { data: tipos = [], isLoading } = useQuery<TipoMantenimiento[]>({
    queryKey: ["/api/tipos-mantenimiento"],
  });

  const form = useForm<z.infer<typeof insertTipoMantenimientoSchema>>({
    resolver: zodResolver(insertTipoMantenimientoSchema),
    defaultValues: {
      tipo: "",
      frecuenciaRecomendada: undefined,
      descripcion: "",
    },
  });

  const createTipo = useMutation({
    mutationFn: async (data: z.infer<typeof insertTipoMantenimientoSchema>) => {
      return await apiRequest("POST", "/api/tipos-mantenimiento", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tipos-mantenimiento"] });
      toast({
        title: "Tipo creado",
        description: "El tipo de mantenimiento se ha registrado correctamente",
      });
      setOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo crear el tipo de mantenimiento",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof insertTipoMantenimientoSchema>) => {
    createTipo.mutate(data);
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-foreground" data-testid="text-page-title">
            Tipos de Mantenimiento
          </h1>
          <p className="text-muted-foreground">
            Gestiona el catálogo de tipos de mantenimiento disponibles
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="lg" data-testid="button-nuevo-tipo">
              <Plus className="h-5 w-5 mr-2" />
              Nuevo Tipo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Tipo de Mantenimiento</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="tipo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ej: Poda, Riego, Fertilización, Extracción..."
                          {...field}
                          data-testid="input-tipo"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="frecuenciaRecomendada"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frecuencia Recomendada (días)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="Ej: 90 (cada 3 meses)"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          data-testid="input-frecuencia"
                        />
                      </FormControl>
                      <FormDescription>
                        Intervalo sugerido entre mantenimientos (opcional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="descripcion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción (opcional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Detalles adicionales sobre este tipo de mantenimiento..."
                          rows={3}
                          {...field}
                          value={field.value || ""}
                          data-testid="input-descripcion"
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
                    disabled={createTipo.isPending}
                    data-testid="button-submit"
                  >
                    {createTipo.isPending ? "Creando..." : "Crear Tipo"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {tipos.length === 0 && !isLoading ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay tipos de mantenimiento registrados</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              Comienza creando los tipos de mantenimiento que se realizarán a los árboles
            </p>
            <Button onClick={() => setOpen(true)} data-testid="button-add-first-tipo">
              <Plus className="h-4 w-4 mr-2" />
              Crear primer tipo
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tipos.map((tipo) => (
            <Card key={tipo.id} data-testid={`card-tipo-${tipo.id}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5 text-primary" />
                  <span>{tipo.tipo}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {tipo.frecuenciaRecomendada && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Frecuencia sugerida</span>
                    </div>
                    <Badge variant="secondary">
                      Cada {tipo.frecuenciaRecomendada} días
                    </Badge>
                  </div>
                )}
                {tipo.descripcion && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Descripción</label>
                    <p className="text-sm text-muted-foreground mt-1">{tipo.descripcion}</p>
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
