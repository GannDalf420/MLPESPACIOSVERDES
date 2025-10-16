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
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { FileText, Plus, FileX } from "lucide-react";
import { insertMotivoExtraccionSchema } from "@shared/schema";
import type { MotivoExtraccion } from "@shared/schema";
import { z } from "zod";

export default function CatalogoMotivos() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const { data: motivos = [], isLoading } = useQuery<MotivoExtraccion[]>({
    queryKey: ["/api/motivos-extraccion"],
  });

  const form = useForm<z.infer<typeof insertMotivoExtraccionSchema>>({
    resolver: zodResolver(insertMotivoExtraccionSchema),
    defaultValues: {
      motivo: "",
    },
  });

  const createMotivo = useMutation({
    mutationFn: async (data: z.infer<typeof insertMotivoExtraccionSchema>) => {
      return await apiRequest("POST", "/api/motivos-extraccion", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/motivos-extraccion"] });
      toast({
        title: "Motivo creado",
        description: "El motivo de extracción se ha registrado correctamente",
      });
      setOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo crear el motivo de extracción",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof insertMotivoExtraccionSchema>) => {
    createMotivo.mutate(data);
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-foreground" data-testid="text-page-title">
            Motivos de Extracción
          </h1>
          <p className="text-muted-foreground">
            Gestiona el catálogo de motivos por los cuales se extraen árboles
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="lg" data-testid="button-nuevo-motivo">
              <Plus className="h-5 w-5 mr-2" />
              Nuevo Motivo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Motivo de Extracción</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="motivo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Motivo *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ej: Árbol muerto, Solicitud vecino, Daño en acera..."
                          {...field}
                          data-testid="input-motivo"
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
                    disabled={createMotivo.isPending}
                    data-testid="button-submit"
                  >
                    {createMotivo.isPending ? "Creando..." : "Crear Motivo"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {motivos.length === 0 && !isLoading ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <FileX className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay motivos de extracción registrados</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
              Comienza creando los motivos por los cuales se pueden extraer árboles
            </p>
            <Button onClick={() => setOpen(true)} data-testid="button-add-first-motivo">
              <Plus className="h-4 w-4 mr-2" />
              Crear primer motivo
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {motivos.map((motivo) => (
            <Card key={motivo.id} data-testid={`card-motivo-${motivo.id}`}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-destructive/10 text-destructive flex-shrink-0">
                    <FileX className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{motivo.motivo}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
