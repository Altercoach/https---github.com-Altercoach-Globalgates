
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Beaker, CalendarDays, Bot, Image, Video, Users } from 'lucide-react';
import Link from 'next/link';

export default function TeamLabPage() {
    return (
        <div className="space-y-6">
            <header>
                <div className="flex items-center gap-3 mb-2">
                    <Beaker className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold font-headline">Team Lab Marketing</h1>
                </div>
                <p className="text-muted-foreground">
                    Centro de operaciones para la creación, gestión y producción de entregables para clientes.
                </p>
            </header>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                <Card className="col-span-1 md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><CalendarDays /> Parrilla de Contenido IA</CardTitle>
                        <CardDescription>
                            Genera, edita y aprueba parrillas de contenido mensuales para los clientes. Asigna tareas al equipo de community management.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Próximamente: Se mostrará una lista de clientes con planes activos. Al seleccionar uno, se podrá generar o visualizar su parrilla de contenido mensual, con propuestas de copy y creatividades sugeridas por IA.</p>
                         <Button className="mt-4" disabled>Generar Parrilla para Cliente</Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Users /> Gestión de Equipo</CardTitle>
                        <CardDescription>
                            Administra el acceso de tus colaboradores a las herramientas del laboratorio.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                         <p className="text-sm text-muted-foreground">Próximamente: Interfaz para invitar y asignar roles (diseñador, copywriter, community manager) a los miembros de tu equipo.</p>
                         <Button className="mt-4" disabled>Administrar Colaboradores</Button>
                    </CardContent>
                </Card>
                
                <Card className="col-span-1 md:col-span-3">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Image /> Generador de Medios por IA</CardTitle>
                        <CardDescription>
                            Herramientas de IA para crear los recursos visuales de las campañas. Utiliza texto, imágenes o videos de referencia.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-4 border rounded-lg text-center bg-muted/50">
                            <Image className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                            <h3 className="font-semibold">Texto a Imagen</h3>
                            <p className="text-xs text-muted-foreground mt-1">Genera imágenes a partir de descripciones detalladas.</p>
                        </div>
                        <div className="p-4 border rounded-lg text-center bg-muted/50">
                             <Video className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                            <h3 className="font-semibold">Texto a Video</h3>
                            <p className="text-xs text-muted-foreground mt-1">Crea clips de video cortos a partir de un guion o idea.</p>
                        </div>
                        <div className="p-4 border rounded-lg text-center bg-muted/50">
                             <Image className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                            <h3 className="font-semibold">Imagen a Imagen</h3>
                            <p className="text-xs text-muted-foreground mt-1">Modifica o mejora una imagen existente usando IA.</p>
                        </div>
                        <div className="p-4 border rounded-lg text-center bg-muted/50">
                            <Video className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                            <h3 className="font-semibold">Video a Video</h3>
                            <p className="text-xs text-muted-foreground mt-1">Aplica nuevos estilos o efectos a un video de referencia.</p>
                        </div>
                    </CardContent>
                </Card>

                 <Card className="col-span-1 md:col-span-3">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Bot /> Activación de Agentes de IA para Clientes</CardTitle>
                        <CardDescription>
                            Una vez que un cliente completa sus formularios de entrenamiento, activa y despliega su agente de IA personalizado.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Próximamente: Lista de clientes pendientes de activación. Un clic aquí procesará sus respuestas, generará el 'system prompt' final y habilitará el agente en el panel del cliente correspondiente.</p>
                         <Button className="mt-4" disabled>Ver Clientes Pendientes</Button>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
