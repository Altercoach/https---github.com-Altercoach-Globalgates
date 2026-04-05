
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { KeyRound, LayoutGrid, ShoppingBag, Store, Puzzle, ShieldCheck, FileText, MessageSquare, BookOpen, ArrowRight, Beaker } from 'lucide-react';

export default function AdminInstructionsPage() {

    return (
        <div className="space-y-6">
            <header>
                <div className="flex items-center gap-3 mb-2">
                    <BookOpen className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold font-headline">Manual de Operaciones del Administrador</h1>
                </div>
                <p className="text-muted-foreground">
                    Esta guía explica cómo gestionar cada módulo del panel &quot;Mi Oficina&quot; para configurar y administrar la plataforma.
                </p>
            </header>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Store/> Marca</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-2">
                        <p><strong>Función:</strong> Gestionar la identidad visual y textual principal del sitio web.</p>
                        <p><strong>Uso:</strong> Cambia el nombre de la marca, el eslogan y los textos de la sección &quot;Héroe&quot;. Sube la imagen principal que los visitantes verán al entrar. Todos los cambios aquí son multi-idioma.</p>
                        <p><strong>Importante:</strong> Los cambios son temporales hasta que los guardes permanentemente desde &quot;Revisar y Guardar&quot;.</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><LayoutGrid/> Soluciones</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-2">
                        <p><strong>Función:</strong> Administrar las tarjetas de soluciones que aparecen en la página de inicio.</p>
                        <p><strong>Uso:</strong> Puedes añadir nuevas soluciones, editar sus títulos y las listas de características (bullets), y activar/desactivar su visibilidad. Los cambios son multi-idioma.</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><ShoppingBag/> Planes y Servicios</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-2">
                        <p><strong>Función:</strong> El corazón de tu oferta comercial. Gestiona los productos que los clientes pueden comprar.</p>
                        <p><strong>Uso:</strong> Añade o elimina planes. Configura nombre, tipo (pago único, suscripción), precio, descripciones y las características incluidas (formularios que se activan). Puedes reordenar los planes arrastrándolos.</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><FileText/> Cuestionarios</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-2">
                        <p><strong>Función:</strong> Crear y revisar los cuestionarios de onboarding para clientes.</p>
                        <p><strong>Uso:</strong> Usa &quot;Nuevo Cuestionario&quot; para crear un formulario personalizado pegando una lista de preguntas. Revisa las respuestas de los clientes y el análisis de la IA en los envíos completados.</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Beaker/> Team Lab</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-2">
                        <p><strong>Función:</strong> Es el centro de producción. Aquí, tu equipo crea y gestiona los entregables para los clientes.</p>
                        <p><strong>Uso:</strong> Próximamente: Genera parrillas de contenido con IA, crea imágenes y videos, y gestiona las órdenes de trabajo para los community managers.</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Puzzle/> Integraciones</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-2">
                        <p><strong>Función:</strong> Conectar canales de mensajería y configurar el Agente de IA.</p>
                        <p><strong>Uso:</strong> Desde esta página, puedes acceder al configurador del agente para darle una identidad (nombre, foto), editar su &quot;cerebro&quot; (System Prompt), y gestionar su base de conocimiento y reglas de exclusión.</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><ShieldCheck/> Admin</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-2">
                        <p><strong>Función:</strong> Gestionar tu base de clientes y ver KPIs del negocio.</p>
                        <p><strong>Uso:</strong> Busca, filtra y realiza acciones en lote sobre tus clientes (suspender, reactivar). Accede a la vista detallada de cada cliente para ver sus servicios activos, analíticas y cuestionarios asignados.</p>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><MessageSquare/> CRM</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-2">
                        <p><strong>Función:</strong> Supervisar las conversaciones que el Agente de IA tiene con los clientes.</p>
                        <p><strong>Uso:</strong> Revisa las interacciones en tiempo real. Si el agente solicita intervención humana, puedes tomar el control de la conversación y responder directamente desde esta interfaz.</p>
                    </CardContent>
                </Card>

                <Card className="bg-destructive/10 border-destructive/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-destructive"><KeyRound/> Guardado Permanente</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-2">
                        <p><strong>Crucial:</strong> Cualquier cambio realizado en las secciones de &quot;Marca&quot;, &quot;Soluciones&quot; o &quot;Planes&quot; es temporal. Para hacerlos permanentes, debes ir a la página **&quot;Revisar y Guardar&quot;** (botón flotante) y usar el botón **&quot;Guardar Cambios en el Código&quot;**.</p>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-12">
                <div className="text-center space-y-3 mb-12">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">
                       Mapa Conceptual del Panel de Administración
                    </h2>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left side: Site Config */}
                    <Card className="border-primary">
                        <CardHeader>
                            <CardTitle>1. Configuración del Sitio (Contenido Público)</CardTitle>
                            <CardDescription>Lo que editas aquí define lo que ven tus visitantes en la página principal. Los cambios son temporales hasta que los guardas.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col gap-2 items-center">
                                    <div className="p-3 bg-muted rounded-lg w-40 text-center"><Store className="mx-auto mb-1"/>Marca</div>
                                    <div className="p-3 bg-muted rounded-lg w-40 text-center"><LayoutGrid className="mx-auto mb-1"/>Soluciones</div>
                                    <div className="p-3 bg-muted rounded-lg w-40 text-center"><ShoppingBag className="mx-auto mb-1"/>Planes</div>
                                </div>
                                <ArrowRight className="h-8 w-8 text-muted-foreground shrink-0"/>
                                <div className="p-3 bg-primary/10 border border-dashed border-primary rounded-lg text-center flex-1">
                                    <p className="font-semibold">Página Principal</p>
                                    <p className="text-sm text-muted-foreground">(Lo que ve el cliente)</p>
                                </div>
                                 <ArrowRight className="h-8 w-8 text-muted-foreground shrink-0"/>
                                 <div className="p-3 bg-destructive/10 border border-destructive rounded-lg text-center w-40">
                                    <KeyRound className="mx-auto mb-1 text-destructive"/>
                                    <p className="font-semibold">Revisar y Guardar</p>
                                    <p className="text-sm text-muted-foreground">(Paso final para guardar)</p>
                                 </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    {/* Right side: Business Management */}
                     <Card className="border-accent">
                        <CardHeader>
                            <CardTitle>2. Gestión del Negocio (Operaciones Internas)</CardTitle>
                            <CardDescription>Herramientas para administrar clientes, crear cuestionarios y supervisar a tu agente de IA.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="p-3 bg-accent/10 rounded-lg text-center mb-2"><ShieldCheck className="mx-auto mb-1 text-accent"/> <span className="font-semibold">Admin:</span> Gestión de Clientes y KPIs</div>
                             <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-muted rounded-lg text-center"><MessageSquare className="mx-auto mb-1"/> <span className="font-semibold">CRM:</span> Supervisión de Chats</div>
                                <div className="p-3 bg-muted rounded-lg text-center"><FileText className="mx-auto mb-1"/> <span className="font-semibold">Cuestionarios:</span> Onboarding de Clientes</div>
                                <div className="p-3 bg-muted rounded-lg text-center"><Beaker className="mx-auto mb-1"/> <span className="font-semibold">Team Lab:</span> Producción de Contenido</div>
                                <div className="p-3 bg-muted rounded-lg text-center"><Puzzle className="mx-auto mb-1"/> <span className="font-semibold">Integraciones:</span> Configuración del Agente IA</div>
                             </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
