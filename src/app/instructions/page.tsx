
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Zap, LifeBuoy, Home, UserPlus, ShoppingCart, LogIn, LayoutDashboard, FileText, BarChart3, ArrowRight, ArrowDown, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ClientInstructionsPage() {
    const { auth } = useAuth();

    const returnHref = auth.loggedIn ? '/dashboard' : '/';
    const returnLabel = auth.loggedIn ? 'Volver al Panel' : 'Volver a la Página Principal';

    return (
        <div className="bg-background min-h-screen">
            <section className="container mx-auto py-12 px-4 md:px-6">
                <div className="mb-8">
                     <Button variant="outline" size="sm" asChild>
                        <Link href={returnHref}><ArrowLeft className="mr-2"/> {returnLabel}</Link>
                    </Button>
                </div>
                <div className="text-center space-y-3 mb-12">
                    <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Guía del Usuario</div>
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
                        Bienvenido al Centro de Ayuda
                    </h1>
                    <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        Aquí encontrarás todo lo que necesitas para sacar el máximo provecho de nuestros servicios y de tu panel de control. Elige una opción para empezar.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <Zap className="h-10 w-10 text-accent" />
                            <div>
                                <CardTitle>Guía de Inicio Rápido</CardTitle>
                                <CardDescription>Lo esencial para empezar a usar tu cuenta en 5 minutos.</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm text-muted-foreground">
                            <div>
                                <h4 className="font-semibold text-foreground mb-2">1. Explora y Compra</h4>
                                <p>Navega por las secciones "Soluciones" y "Planes" en la página principal. Usa el botón "Ver Detalles" para saber más sobre un servicio y "Añadir al Carrito" para comprar. Las suscripciones se renuevan automáticamente.</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-foreground mb-2">2. Crea tu Cuenta</h4>
                                <p>Puedes crear una cuenta de dos formas: 1) Después de finalizar una compra, serás dirigido a la página de registro. 2) Haciendo clic en "Regístrate Gratis" en la página principal. En ambos casos, tu cuenta te dará acceso a tu panel de cliente.</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-foreground mb-2">3. Usa tu Panel de Cliente</h4>
                                <p>Una vez creada tu cuenta, accederás a tu Dashboard. Si compraste un plan, verás tus KPIs de marketing y análisis. Si te registraste gratis, verás "Acciones Pendientes" (como llenar cuestionarios) para que podamos crear una estrategia para ti.</p>
                            </div>
                             <div>
                                <h4 className="font-semibold text-foreground mb-2">4. Habla con tu Agente IA</h4>
                                <p>En la esquina inferior derecha encontrarás a tu asistente de IA. Hazle preguntas sobre los planes, pide recomendaciones o, si ya eres cliente, pregúntale por tus resultados. ¡Está para ayudarte!</p>
                            </div>
                        </CardContent>
                    </Card>
                     <Card className="hover:shadow-lg transition-shadow border-primary/20 bg-primary/5">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <BookOpen className="h-10 w-10 text-primary" />
                             <div>
                                <CardTitle>Manual Detallado del Usuario</CardTitle>
                                <CardDescription>Una guía completa de todas las funcionalidades disponibles.</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm text-muted-foreground">
                             <div>
                                <h4 className="font-semibold text-foreground mb-2">Gestión de Cuenta y Suscripciones</h4>
                                <p>En tu panel de cliente, en la sección "Configuración", puedes actualizar tus datos de contacto. La cancelación de suscripciones se gestiona desde el mismo panel, en la sección de "Servicios Activos" (aún no implementado en este prototipo).</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-foreground mb-2">Cuestionarios y Estrategia</h4>
                                <p>Tu participación es clave. Al contratar ciertos planes, se te asignarán cuestionarios en tu panel. Tus respuestas son analizadas por nuestra IA (Doctor RX) para generar un análisis FODA y recomendaciones estratégicas. Podrás ver estos análisis en tu dashboard una vez completados.</p>
                            </div>
                             <div>
                                <h4 className="font-semibold text-foreground mb-2">Métricas y KPIs</h4>
                                <p>Si tienes un plan de marketing activo, tu dashboard mostrará métricas clave como "Leads Generados", "Tasa de Conversión" y un gráfico del rendimiento de tu embudo de ventas. Estos datos se actualizan a medida que tus campañas progresan.</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-foreground mb-2">Soporte y Contacto</h4>
                                <p>Además de tu agente de IA, puedes contactarnos a través del formulario en la sección "Contacto" de la página principal. Para problemas técnicos o consultas sobre tu cuenta, nuestro equipo de soporte está disponible.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
            
            <section className="container mx-auto py-12 px-4 md:px-6">
                <div className="text-center space-y-3 mb-12">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">
                        Ruta Visual del Cliente
                    </h2>
                    <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                       Sigue el flujo para entender cómo navegar desde el inicio hasta la gestión de tu cuenta.
                    </p>
                </div>
                
                <div className="flex flex-col items-center">
                    {/* Step 1: Homepage */}
                    <Card className="w-fit max-w-sm text-center shadow-md">
                        <CardHeader>
                            <CardTitle className="flex flex-col items-center gap-2"><Home /> Página Principal</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <p className="text-sm">Explora soluciones y planes.</p>
                        </CardContent>
                    </Card>
                    
                    <ArrowDown className="h-8 w-8 text-muted-foreground my-4" />

                    {/* Step 2: Two Paths */}
                    <div className="flex flex-col md:flex-row gap-8 items-stretch">
                        
                        {/* Path A: Free Signup */}
                        <div className="flex flex-col items-center">
                           <Card className="w-64 text-center border-accent bg-accent/5">
                               <CardHeader>
                                   <CardTitle className="flex flex-col items-center gap-2 text-accent"><UserPlus/> Registro Gratis</CardTitle>
                               </CardHeader>
                               <CardContent>
                                  <p className="text-sm">Crea una cuenta sin costo para una consulta.</p>
                               </CardContent>
                           </Card>
                           <ArrowDown className="h-8 w-8 text-muted-foreground my-4" />
                           <Card className="w-64 text-center">
                               <CardHeader>
                                   <CardTitle className="flex flex-col items-center gap-2"><FileText/> Panel con Tareas</CardTitle>
                               </CardHeader>
                               <CardContent>
                                  <p className="text-sm">Recibes "Acciones Pendientes" para definir tu estrategia.</p>
                               </CardContent>
                           </Card>
                        </div>
                        
                         {/* Path B: Purchase Plan */}
                         <div className="flex flex-col items-center">
                           <Card className="w-64 text-center border-primary bg-primary/5">
                               <CardHeader>
                                   <CardTitle className="flex flex-col items-center gap-2 text-primary"><ShoppingCart/> Compra de Plan</CardTitle>
                               </CardHeader>
                               <CardContent>
                                  <p className="text-sm">Añade servicios al carrito y finaliza la compra.</p>
                               </CardContent>
                           </Card>
                           <ArrowDown className="h-8 w-8 text-muted-foreground my-4" />
                           <Card className="w-64 text-center">
                               <CardHeader>
                                   <CardTitle className="flex flex-col items-center gap-2"><BarChart3/> Panel con KPIs</CardTitle>
                               </CardHeader>
                               <CardContent>
                                  <p className="text-sm">Desbloqueas tu dashboard con métricas y análisis de negocio.</p>
                               </CardContent>
                           </Card>
                        </div>

                    </div>
                    
                </div>
            </section>
        </div>
    );
}