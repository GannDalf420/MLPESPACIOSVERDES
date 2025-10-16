import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/hooks/use-theme";
import { ThemeToggle } from "@/components/theme-toggle";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Arboles from "@/pages/arboles";
import ArbolDetalle from "@/pages/arbol-detalle";
import ArbolForm from "@/pages/arbol-form";
import Ubicaciones from "@/pages/ubicaciones";
import Cazuelas from "@/pages/cazuelas";
import Mantenimientos from "@/pages/mantenimientos";
import MantenimientoForm from "@/pages/mantenimiento-form";
import Reportes from "@/pages/reportes";
import CatalogoTipos from "@/pages/catalogo-tipos";
import CatalogoMotivos from "@/pages/catalogo-motivos";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/arboles" component={Arboles} />
      <Route path="/arboles/nuevo" component={ArbolForm} />
      <Route path="/arboles/:id" component={ArbolDetalle} />
      <Route path="/ubicaciones" component={Ubicaciones} />
      <Route path="/cazuelas" component={Cazuelas} />
      <Route path="/mantenimientos" component={Mantenimientos} />
      <Route path="/mantenimientos/nuevo" component={MantenimientoForm} />
      <Route path="/reportes" component={Reportes} />
      <Route path="/catalogos/tipos-mantenimiento" component={CatalogoTipos} />
      <Route path="/catalogos/motivos-extraccion" component={CatalogoMotivos} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  const style = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <SidebarProvider style={style as React.CSSProperties}>
            <div className="flex h-screen w-full">
              <AppSidebar />
              <div className="flex flex-col flex-1 overflow-hidden">
                <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-background">
                  <SidebarTrigger data-testid="button-sidebar-toggle" />
                  <ThemeToggle />
                </header>
                <main className="flex-1 overflow-auto bg-background">
                  <Router />
                </main>
              </div>
            </div>
          </SidebarProvider>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
