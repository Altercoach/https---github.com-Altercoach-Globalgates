
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Zap, LifeBuoy } from 'lucide-react';

export default function ClientInstructionsPage() {

    return (
        <div className="bg-background min-h-screen">
            <section className="container mx-auto py-12 px-4 md:px-6">
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
        </div>
    );
}
