import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Container, Plus, Calendar } from "lucide-react";
import { insertCazuelaSchema } from "@shared/schema";
import type { Cazuela } from "@shared/schema";
import { z } from "zod";

const formSchema = insertCazuelaSchema.extend({
  fechaInstalacion: z.string().min(1, "La fecha de instalación es requerida"),
});

export default function Cazuelas() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const { data: cazuelas = [], isLoading } = useQuery<Cazuela[]>({
    queryKey: ["/api/cazuelas"],
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      material: "",
      tamano: "",
      fechaInstalacion: new Date().toISOString().split('T')[0],
      estado: "Buen estado",
    },
  });

  const createCazuela = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const cazuelaData = {
        ...data,
        fechaInstalacion: new Date(data.fechaInstalacion).toISOString(),
      };
      return await apiRequest("POST", "/api/cazuelas", cazuelaData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cazuelas"] });
      toast({
        title: "Cazuela creada",
        description: "La cazuela se ha registrado correctamente",
      });
      setOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo crear la cazuela",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createCazuela.mutate(data);
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-foreground" data-testid="text-page-title">
            Cazuelas
          </h1>
          <p className="text-muted-foreground">
            Gestiona las cazuelas/macetas donde están plantados los árboles
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="lg" data-testid="button-nueva-cazuela">
              <Plus className="h-5 w-5 mr-2" />
              Nueva Cazuela
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Registrar Nueva Cazuela</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="material"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Material *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ej: Concreto, Plástico, Metal..."
                          {...field}
                          data-testid="input-material"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tamano"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tamaño *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ej: Grande (1.5m x 1.5m), Mediano, Pequeño..."
                          {...field}
                          data-testid="input-tamano"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fechaInstalacion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Instalación *</FormLabel>
                      <FormControl>
                        <Input 
                          type="date"
                          {...field}
                          data-testid="input-fecha-instalacion"
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
                          <SelectItem value="Buen estado" data-testid="option-estado-buen-estado">Buen estado</SelectItem>
                          <SelectItem value="Dañada" data-testid="option-estado-danada">Dañada</SelectItem>
                          <SelectItem value="Reemplazada" data-testid="option-estado-reemplazada">Reemplazada</SelectItem>
                        </SelectContent>
                      </Select>
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
                    disabled={createCazuela.isPending}
                    data-testid="button-submit"
                  >
                    {createCazuela.isPending ? "Creando..." : "Crear Cazuela"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {cazuelas.length === 0 && !isLoading ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Container className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay cazuelas registradas</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              Comienza registrando la primera cazuela para poder asociar árboles
            </p>
            <Button onClick={() => setOpen(true)} data-testid="button-add-first-cazuela">
              <Plus className="h-4 w-4 mr-2" />
              Registrar primera cazuela
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cazuelas.map((cazuela) => (
            <Card key={cazuela.id} data-testid={`card-cazuela-${cazuela.id}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Container className="h-5 w-5 text-primary" />
                  <span className="truncate">{cazuela.material}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tamaño</label>
                  <p className="text-base">{cazuela.tamano}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Estado</label>
                  <p className="text-base">{cazuela.estado}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Fecha de Instalación</label>
                  <p className="text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(cazuela.fechaInstalacion).toLocaleDateString("es-ES")}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
