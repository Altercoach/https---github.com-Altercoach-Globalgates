
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { KeyRound, LayoutGrid, ShoppingBag, Store, Puzzle, ShieldCheck, User, FileText, MessageSquare, BookOpen } from 'lucide-react';

export default function AdminInstructionsPage() {

    return (
        <div className="space-y-6">
            <header>
                <div className="flex items-center gap-3 mb-2">
                    <BookOpen className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold font-headline">Manual de Operaciones del Administrador</h1>
                </div>
                <p className="text-muted-foreground">
                    Esta guía explica cómo gestionar cada módulo del panel "Mi Oficina" para configurar y administrar la plataforma.
                </p>
            </header>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Store/> Marca</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-2">
                        <p><strong>Función:</strong> Gestionar la identidad visual y textual principal del sitio web.</p>
                        <p><strong>Uso:</strong> Cambia el nombre de la marca, el eslogan y los textos de la sección "Héroe". Sube la imagen principal que los visitantes verán al entrar. Todos los cambios aquí son multi-idioma.</p>
                        <p><strong>Importante:</strong> Los cambios son temporales hasta que los guardes permanentemente desde "Revisar y Guardar".</p>
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
                        <p><strong>Uso:</strong> Usa "Nuevo Cuestionario" para crear un formulario personalizado pegando una lista de preguntas. Revisa las respuestas de los clientes y el análisis de la IA en los envíos completados.</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Puzzle/> Integraciones</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-2">
                        <p><strong>Función:</strong> Conectar canales de mensajería y configurar el Agente de IA.</p>
                        <p><strong>Uso:</strong> Desde esta página, puedes acceder al configurador del agente para darle una identidad (nombre, foto), editar su "cerebro" (System Prompt), y gestionar su base de conocimiento y reglas de exclusión.</p>
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
                        <p><strong>Crucial:</strong> Cualquier cambio realizado en las secciones de "Marca", "Soluciones" o "Planes" es temporal. Para hacerlos permanentes, debes ir a la página **"Revisar y Guardar"** (botón flotante) y usar el botón **"Guardar Cambios en el Código"**.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
