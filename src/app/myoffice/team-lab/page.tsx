'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Beaker, CalendarDays, Bot, Image, Video, Users, Loader2 } from 'lucide-react';
import { generateContentSchedule } from '@/ai/flows/generate-content-schedule-flow';
import type { ContentPost } from '@/ai/flows/generate-content-schedule-flow';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { initialCustomers } from '@/lib/constants';

export default function TeamLabPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [schedule, setSchedule] = useState<ContentPost[] | null>(null);
    const [selectedClientId, setSelectedClientId] = useState<string | undefined>();
    const [additionalInstructions, setAdditionalInstructions] = useState('Enfócate en un estilo de vida saludable, equilibrio mente-cuerpo y constancia. Público objetivo: personas de 25-45 años que buscan más que solo ejercicio.');
    const { toast } = useToast();

    const handleGenerateSchedule = async () => {
        if (!selectedClientId) {
            toast({
                title: "Cliente no seleccionado",
                description: "Por favor, selecciona un cliente para generar su parrilla de contenido.",
                variant: "destructive"
            });
            return;
        }
        
        const selectedCustomer = initialCustomers.find(c => c.id === selectedClientId);
        if (!selectedCustomer) {
            toast({ title: "Error", description: "Cliente no encontrado.", variant: "destructive" });
            return;
        }

        const clientBusinessDescription = `Cliente: ${selectedCustomer.name} (${selectedCustomer.email}). 
Plan contratado: ${selectedCustomer.plan}.
Instrucciones adicionales del equipo: ${additionalInstructions}`;

        setIsLoading(true);
        setSchedule(null);
        try {
            const result = await generateContentSchedule({ clientBusiness: clientBusinessDescription });
            setSchedule(result.posts);
        } catch (error) {
            console.error("Failed to generate schedule", error);
            toast({
                title: "Error al generar",
                description: "La IA no pudo generar la parrilla. Inténtalo de nuevo.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

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

            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><CalendarDays /> Parrilla de Contenido IA</CardTitle>
                        <CardDescription>
                            Selecciona un cliente, añade instrucciones y genera una parrilla de contenido mensual. La IA usará los datos del cliente y tus notas.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid lg:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="client-select">Seleccionar Cliente</Label>
                                <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                                    <SelectTrigger id="client-select">
                                        <SelectValue placeholder="Elige un cliente..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {initialCustomers.map(customer => (
                                            <SelectItem key={customer.id} value={customer.id}>
                                                {customer.name} - ({customer.email})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="business-description">Instrucciones Adicionales para la IA</Label>
                                <Textarea
                                    id="business-description"
                                    placeholder="Ej: Enfocarse en un diseño estético, analizar la competencia para el Buen Fin, etc."
                                    value={additionalInstructions}
                                    onChange={(e) => setAdditionalInstructions(e.target.value)}
                                    rows={3}
                                />
                            </div>
                        </div>
                        <Button onClick={handleGenerateSchedule} disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generando...
                                </>
                            ) : (
                                "Generar Parrilla con IA"
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {schedule && (
                     <Card className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle>Parrilla de Contenido Generada</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px]">Post</TableHead>
                                        <TableHead>Formato</TableHead>
                                        <TableHead>Tópico</TableHead>
                                        <TableHead>Copy In (Ideas)</TableHead>
                                        <TableHead>Copy Out (Publicación)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {schedule.map((post) => (
                                        <TableRow key={post.postNumber}>
                                            <TableCell>{post.postNumber}</TableCell>
                                            <TableCell>{post.format}</TableCell>
                                            <TableCell>{post.topic}</TableCell>
                                            <TableCell className="text-xs whitespace-pre-wrap font-sans">{post.copyIn}</TableCell>
                                            <TableCell className="text-xs whitespace-pre-wrap font-sans">{post.copyOut}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}


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

                 <Card className="col-span-1 md:col-span-2">
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
