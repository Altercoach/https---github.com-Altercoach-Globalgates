
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Beaker, CalendarDays, Bot, Image as ImageIcon, Video, Users, Loader2, Download, Mail, Copy, File } from 'lucide-react';
import { generateContentSchedule } from '@/ai/flows/generate-content-schedule-flow';
import type { ContentPost } from '@/ai/flows/generate-content-schedule-flow';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { initialCustomers } from '@/lib/constants';
import { Input } from '@/components/ui/input';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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
            toast({
                title: "¡Parrilla Generada!",
                description: "La IA ha creado una nueva parrilla de contenido."
            })
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
    
    const handleScheduleChange = (index: number, field: keyof ContentPost, value: string) => {
        if (!schedule) return;
        const newSchedule = [...schedule];
        (newSchedule[index] as any)[field] = value;
        setSchedule(newSchedule);
    };

    const downloadCSV = () => {
        if (!schedule) return;
        const headers = ['postNumber', 'format', 'topic', 'copyIn', 'copyOut'];
        const csvContent = [
            headers.join(','),
            ...schedule.map(post => 
                headers.map(header => `"${((post as any)[header] || '').replace(/"/g, '""')}"`).join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `parrilla_contenido_${selectedClientId}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };
    
    const downloadPDF = () => {
        if (!schedule) return;
        const doc = new jsPDF();
        const customer = initialCustomers.find(c => c.id === selectedClientId);

        doc.text(`Parrilla de Contenido para: ${customer?.name || selectedClientId}`, 14, 15);

        (doc as any).autoTable({
            startY: 25,
            head: [['Post', 'Formato', 'Tópico', 'Copy In', 'Copy Out']],
            body: schedule.map(post => [
                post.postNumber,
                post.format,
                post.topic,
                post.copyIn,
                post.copyOut
            ]),
            styles: { fontSize: 8 },
            headStyles: { fillColor: [34, 49, 63] },
            columnStyles: {
              3: { cellWidth: 50 },
              4: { cellWidth: 50 },
            }
        });

        doc.save(`parrilla_contenido_${selectedClientId}.pdf`);
    };

    const sendByEmail = () => {
        if (!schedule) return;
        const customer = initialCustomers.find(c => c.id === selectedClientId);
        const subject = `Parrilla de Contenido para ${customer?.name || selectedClientId}`;
        const tableRows = schedule.map(post => `
            <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">${post.postNumber}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${post.format}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${post.topic}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${post.copyIn.replace(/\n/g, '<br>')}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${post.copyOut.replace(/\n/g, '<br>')}</td>
            </tr>
        `).join('');

        const emailBody = `
            <h2>Parrilla de Contenido</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Post</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Formato</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Tópico</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Copy In</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Copy Out</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
        `;
        
        const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
        window.location.href = mailtoLink;
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

            <Card>
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
                 <Card>
                    <CardHeader>
                        <CardTitle>Parrilla de Contenido Editable</CardTitle>
                        <CardDescription>Ajusta el contenido generado por la IA y luego expórtalo o compártelo.</CardDescription>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]">Post</TableHead>
                                    <TableHead className="w-[120px]">Formato</TableHead>
                                    <TableHead className="w-[150px]">Tópico</TableHead>
                                    <TableHead className="min-w-[250px]">Copy In (Ideas)</TableHead>
                                    <TableHead className="min-w-[250px]">Copy Out (Publicación)</TableHead>
                                    <TableHead className="w-[120px]">Acción</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {schedule.map((post, index) => (
                                    <TableRow key={post.postNumber}>
                                        <TableCell>
                                            <Input value={post.postNumber} onChange={e => handleScheduleChange(index, 'postNumber', e.target.value)} className="text-center font-bold"/>
                                        </TableCell>
                                        <TableCell>
                                             <Input value={post.format} onChange={e => handleScheduleChange(index, 'format', e.target.value)} />
                                        </TableCell>
                                        <TableCell>
                                            <Input value={post.topic} onChange={e => handleScheduleChange(index, 'topic', e.target.value)} />
                                        </TableCell>
                                        <TableCell>
                                            <Textarea value={post.copyIn} onChange={e => handleScheduleChange(index, 'copyIn', e.target.value)} rows={4} className="text-xs" />
                                        </TableCell>
                                        <TableCell>
                                            <Textarea value={post.copyOut} onChange={e => handleScheduleChange(index, 'copyOut', e.target.value)} rows={4} className="text-xs"/>
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="outline" size="sm">Crear Recurso</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={downloadPDF}><File className="mr-2"/> Descargar PDF</Button>
                        <Button variant="outline" onClick={downloadCSV}><Download className="mr-2"/> Descargar CSV</Button>
                        <Button variant="outline" onClick={sendByEmail}><Mail className="mr-2"/> Enviar por Email</Button>
                    </CardFooter>
                </Card>
            )}

            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="col-span-1 md:col-span-3">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><ImageIcon /> Generador de Medios por IA</CardTitle>
                        <CardDescription>
                            Herramientas de IA para crear los recursos visuales de las campañas. Utiliza texto, imágenes o videos de referencia.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-4 border rounded-lg text-center bg-muted/50">
                            <ImageIcon className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                            <h3 className="font-semibold">Texto a Imagen</h3>
                            <p className="text-xs text-muted-foreground mt-1">Genera imágenes a partir de descripciones detalladas.</p>
                        </div>
                        <div className="p-4 border rounded-lg text-center bg-muted/50">
                             <Video className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                            <h3 className="font-semibold">Texto a Video</h3>
                            <p className="text-xs text-muted-foreground mt-1">Crea clips de video cortos a partir de un guion o idea.</p>
                        </div>
                        <div className="p-4 border rounded-lg text-center bg-muted/50">
                             <ImageIcon className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
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
