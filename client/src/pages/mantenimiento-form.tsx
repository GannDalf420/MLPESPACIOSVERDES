import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation, useSearch } from "wouter";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { ArrowLeft, Wrench } from "lucide-react";
import { Link } from "wouter";
import { insertMantenimientoSchema } from "@shared/schema";
import type { ArbolConDetalles, TipoMantenimiento, MotivoExtraccion } from "@shared/schema";

const formSchema = insertMantenimientoSchema.extend({
  fechaMantenimiento: z.string().min(1, "La fecha es requerida"),
  proximoMantenimiento: z.string().optional(),
  idMotivoExtraccion: z.string().optional(),
});

export default function MantenimientoForm() {
  const [, setLocation] = useLocation();
  const searchParams = useSearch();
  const { toast } = useToast();
  
  const arbolIdFromUrl = new URLSearchParams(searchParams).get('arbolId') || '';

  const { data: arboles = [] } = useQuery<ArbolConDetalles[]>({
    queryKey: ["/api/arboles"],
  });

  const { data: tiposMantenimiento = [] } = useQuery<TipoMantenimiento[]>({
    queryKey: ["/api/tipos-mantenimiento"],
  });

  const { data: motivosExtraccion = [] } = useQuery<MotivoExtraccion[]>({
    queryKey: ["/api/motivos-extraccion"],
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idArbol: arbolIdFromUrl,
      fechaMantenimiento: new Date().toISOString().split('T')[0],
      idTipoMantenimiento: "",
      idMotivoExtraccion: "",
      responsable: "",
      observaciones: "",
      costo: 0,
      proximoMantenimiento: "",
    },
  });

  const tipoSeleccionado = form.watch("idTipoMantenimiento");
  const esExtraccion = tiposMantenimiento.find(t => t.id === tipoSeleccionado)?.tipo === "Extracción";

  const createMantenimiento = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const mantenimientoData = {
        ...data,
        fechaMantenimiento: new Date(data.fechaMantenimiento).toISOString(),
        proximoMantenimiento: data.proximoMantenimiento 
          ? new Date(data.proximoMantenimiento).toISOString() 
          : null,
        idMotivoExtraccion: data.idMotivoExtraccion || null,
      };
      return await apiRequest("POST", "/api/mantenimientos", mantenimientoData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mantenimientos"] });
      queryClient.invalidateQueries({ queryKey: ["/api/arboles"] });
      toast({
        title: "Mantenimiento registrado",
        description: "El mantenimiento se ha registrado correctamente",
      });
      setLocation("/mantenimientos");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo registrar el mantenimiento",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createMantenimiento.mutate(data);
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild data-testid="button-back">
          <Link href="/mantenimientos">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground" data-testid="text-page-title">
            Registrar Mantenimiento
          </h1>
          <p className="text-muted-foreground mt-1">
            Registra un nuevo mantenimiento realizado a un árbol
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Información del Mantenimiento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="idArbol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Árbol *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-arbol">
                          <SelectValue placeholder="Selecciona un árbol" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {arboles.length === 0 ? (
                          <div className="p-2 text-sm text-muted-foreground">
                            No hay árboles registrados
                          </div>
                        ) : (
                          arboles.map((arbol) => (
                            <SelectItem 
                              key={arbol.id} 
                              value={arbol.id}
                              data-testid={`option-arbol-${arbol.id}`}
                            >
                              {arbol.especie} - {arbol.ubicacion?.direccion}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="idTipoMantenimiento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Mantenimiento *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-tipo">
                            <SelectValue placeholder="Selecciona el tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {tiposMantenimiento.map((tipo) => (
                            <SelectItem 
                              key={tipo.id} 
                              value={tipo.id}
                              data-testid={`option-tipo-${tipo.id}`}
                            >
                              {tipo.tipo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fechaMantenimiento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha *</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          {...field}
                          data-testid="input-fecha"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {esExtraccion && (
                <FormField
                  control={form.control}
                  name="idMotivoExtraccion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Motivo de Extracción *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-motivo">
                            <SelectValue placeholder="Selecciona el motivo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {motivosExtraccion.map((motivo) => (
                            <SelectItem 
                              key={motivo.id} 
                              value={motivo.id}
                              data-testid={`option-motivo-${motivo.id}`}
                            >
                              {motivo.motivo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Requerido para mantenimientos de tipo extracción
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="responsable"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Responsable *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Nombre del responsable"
                          {...field}
                          data-testid="input-responsable"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="costo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Costo *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          data-testid="input-costo"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="proximoMantenimiento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Próximo Mantenimiento (opcional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="date"
                        {...field}
                        value={field.value || ""}
                        data-testid="input-proximo"
                      />
                    </FormControl>
                    <FormDescription>
                      Fecha sugerida para el próximo mantenimiento
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="observaciones"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observaciones</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Detalles adicionales del mantenimiento..."
                        rows={4}
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
                  asChild
                  data-testid="button-cancel"
                >
                  <Link href="/mantenimientos">Cancelar</Link>
                </Button>
                <Button 
                  type="submit" 
                  disabled={createMantenimiento.isPending}
                  data-testid="button-submit"
                >
                  {createMantenimiento.isPending ? "Registrando..." : "Registrar Mantenimiento"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
