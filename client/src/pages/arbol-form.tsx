import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
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
import { ArrowLeft, TreeDeciduous } from "lucide-react";
import { Link } from "wouter";
import { insertArbolSchema } from "@shared/schema";
import type { Ubicacion, Cazuela } from "@shared/schema";

const formSchema = insertArbolSchema.extend({
  fechaPlantacion: z.string().min(1, "La fecha de plantación es requerida"),
});

export default function ArbolForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: ubicaciones = [] } = useQuery<Ubicacion[]>({
    queryKey: ["/api/ubicaciones"],
  });

  const { data: cazuelas = [] } = useQuery<Cazuela[]>({
    queryKey: ["/api/cazuelas"],
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      especie: "",
      fechaPlantacion: new Date().toISOString().split('T')[0],
      estado: "Vivo",
      idCazuela: "",
      idUbicacion: "",
      fotoUrl: "",
      observaciones: "",
    },
  });

  const createArbol = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const arbolData = {
        ...data,
        fechaPlantacion: new Date(data.fechaPlantacion).toISOString(),
      };
      return await apiRequest("POST", "/api/arboles", arbolData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/arboles"] });
      toast({
        title: "Árbol registrado",
        description: "El árbol se ha registrado correctamente",
      });
      setLocation("/arboles");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo registrar el árbol",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createArbol.mutate(data);
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild data-testid="button-back">
          <Link href="/arboles">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground" data-testid="text-page-title">
            Registrar Nuevo Árbol
          </h1>
          <p className="text-muted-foreground mt-1">
            Completa la información del árbol a registrar
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TreeDeciduous className="h-5 w-5" />
            Información del Árbol
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="especie"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Especie *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ej: Platanus x acerifolia (Plátano de sombra)" 
                        {...field}
                        data-testid="input-especie"
                      />
                    </FormControl>
                    <FormDescription>
                      Nombre común o científico de la especie
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fechaPlantacion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Plantación *</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          {...field}
                          data-testid="input-fecha-plantacion"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-estado">
                            <SelectValue placeholder="Selecciona el estado" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Vivo" data-testid="option-estado-vivo">Vivo</SelectItem>
                          <SelectItem value="Muerto" data-testid="option-estado-muerto">Muerto</SelectItem>
                          <SelectItem value="Extraído" data-testid="option-estado-extraido">Extraído</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="idUbicacion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ubicación *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-ubicacion">
                            <SelectValue placeholder="Selecciona una ubicación" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ubicaciones.length === 0 ? (
                            <div className="p-2 text-sm text-muted-foreground">
                              No hay ubicaciones registradas
                            </div>
                          ) : (
                            ubicaciones.map((ubicacion) => (
                              <SelectItem 
                                key={ubicacion.id} 
                                value={ubicacion.id}
                                data-testid={`option-ubicacion-${ubicacion.id}`}
                              >
                                {ubicacion.direccion} - {ubicacion.barrio}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        <Link href="/ubicaciones" className="text-primary hover:underline" data-testid="link-crear-ubicacion">
                          Crear nueva ubicación
                        </Link>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="idCazuela"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cazuela *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-cazuela">
                            <SelectValue placeholder="Selecciona una cazuela" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cazuelas.length === 0 ? (
                            <div className="p-2 text-sm text-muted-foreground">
                              No hay cazuelas registradas
                            </div>
                          ) : (
                            cazuelas.map((cazuela) => (
                              <SelectItem 
                                key={cazuela.id} 
                                value={cazuela.id}
                                data-testid={`option-cazuela-${cazuela.id}`}
                              >
                                {cazuela.material} - {cazuela.tamano}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        <Link href="/cazuelas" className="text-primary hover:underline" data-testid="link-crear-cazuela">
                          Crear nueva cazuela
                        </Link>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="observaciones"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observaciones</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Notas adicionales sobre el árbol..."
                        className="resize-none"
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
                  <Link href="/arboles">Cancelar</Link>
                </Button>
                <Button 
                  type="submit" 
                  disabled={createArbol.isPending}
                  data-testid="button-submit"
                >
                  {createArbol.isPending ? "Registrando..." : "Registrar Árbol"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
