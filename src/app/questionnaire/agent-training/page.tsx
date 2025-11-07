
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Bot, Upload, Paperclip, X } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-6 border-t pt-8">
    <h3 className="text-xl font-semibold">{title}</h3>
    {children}
  </div>
);

const Question = ({ label, children }: { label: string; children: React.ReactNode; }) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    {children}
  </div>
);

const YesNoQuestion = ({ label, descriptionLabel }: { label: string; descriptionLabel: string; }) => (
    <div className="space-y-2">
        <div className="flex items-center space-x-2">
            <Checkbox id={label.replace(/\s/g, '')} />
            <Label htmlFor={label.replace(/\s/g, '')} className="font-normal">{label}</Label>
        </div>
        <Question label={descriptionLabel}><Textarea /></Question>
    </div>
)

const FileUpload = ({ label, files, onFileChange, onFileRemove }: { label: string; files: File[], onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void, onFileRemove: (fileName: string) => void }) => (
    <div className="space-y-2">
        <Label>{label}</Label>
        <div className="flex items-center justify-center w-full">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/80">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Haz clic para subir</span> o arrastra y suelta</p>
                    <p className="text-xs text-muted-foreground">PDF, XLS, DOC, TXT (MAX. 5MB)</p>
                </div>
                <Input id="dropzone-file" type="file" className="hidden" onChange={onFileChange} multiple />
            </label>
        </div>
        {files.length > 0 && (
            <div className="pt-2 space-y-2">
                {files.map(file => (
                    <div key={file.name} className="flex items-center justify-between bg-muted/50 p-2 rounded-md text-sm">
                        <div className='flex items-center gap-2'>
                           <Paperclip className="h-4 w-4"/>
                           <span className="font-medium">{file.name}</span> 
                           <span className="text-muted-foreground text-xs">({(file.size / 1024).toFixed(1)} KB)</span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onFileRemove(file.name)}>
                            <X className="h-4 w-4"/>
                        </Button>
                    </div>
                ))}
            </div>
        )}
    </div>
)

export default function AgentTrainingPage() {
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleFileRemove = (fileName: string) => {
    setFiles(prev => prev.filter(f => f.name !== fileName));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: '¡Información Enviada!',
      description: 'Gracias. Usaremos estos datos para entrenar a tu Agente de IA.',
    });
    const form = document.getElementById('agent-form');
    const thanks = document.getElementById('thank-you');
    if (form) form.style.display = 'none';
    if (thanks) thanks.style.display = 'block';
  };

  return (
    <div className="min-h-screen bg-muted/20 py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center mb-4">
            <Bot />
          </div>
          <CardTitle className="text-3xl">Cuestionario Profesional para Entrenamiento de Agente de IA</CardTitle>
          <CardDescription>Sus respuestas permitirán entrenar un agente de IA que refleje los procesos, el tono y las reglas de su empresa.</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="agent-form" onSubmit={handleSubmit} className="space-y-8">
            
            <Section title="Sección 1: Leads y Seguimiento Comercial">
                <Question label="Canales preferidos para que el agente contacte a leads (WhatsApp, correo, llamada, chat web):"><Input/></Question>
                <Question label="Información mínima a recopilar de un lead antes de iniciar seguimiento:"><Textarea/></Question>
                <Question label="Criterios para considerar un lead “calificado” o “prioritario”:"><Textarea/></Question>
                <Question label="Proceso actual de seguimiento desde la generación del lead hasta la venta:"><Textarea/></Question>
                <Question label="Frecuencia deseada de seguimiento a cada lead:"><Input/></Question>
                <YesNoQuestion label="¿Desea recordatorios internos de seguimiento para el equipo?" descriptionLabel="Detalles:"/>
                <Question label="Mensajes o scripts recomendados para contactar leads:"><Textarea/></Question>
                <Question label="Criterios para priorizar leads (región, producto, urgencia, otro):"><Textarea/></Question>
                <Question label="Información adicional que el agente debe registrar sobre cada lead:"><Textarea/></Question>
                <Question label="Acciones del agente si un lead no responde después de X intentos:"><Textarea/></Question>
            </Section>

            <Section title="Sección 2: Ventas">
                <YesNoQuestion label="¿Desea que el agente genere cotizaciones o presupuestos automáticos?" descriptionLabel="Detalles y condiciones:"/>
                <Question label="Recomendaciones de productos/servicios según perfil de cliente:"><Textarea/></Question>
                <Question label="Registro de ventas en CRM o sistema interno:"><Textarea/></Question>
                <Question label="Aplicación de descuentos, promociones o condiciones especiales:"><Textarea/></Question>
                <YesNoQuestion label="Notificación de ventas al equipo humano:" descriptionLabel="¿A quién y cómo?" />
                <Question label="Reportes de ventas deseados (diarios, semanales, métricas):"><Textarea/></Question>
                <Question label="Estrategias de up-selling o cross-selling que debe sugerir:"><Textarea/></Question>
            </Section>

            <Section title="Sección 3: Atención al Cliente">
                <Question label="Tipos de consultas que el agente debe atender:"><Textarea/></Question>
                <Question label="¿Debe responder quejas automáticamente o derivarlas a un humano?"><Input/></Question>
                <Question label="Tono de comunicación deseado: Formal / Cercano / Amigable / Técnico / Otro:"><Input/></Question>
                <Question label="Confirmaciones automáticas que debe enviar (compra, envío, cita, pago):"><Textarea/></Question>
                <YesNoQuestion label="Recolección de feedback o encuestas de satisfacción:" descriptionLabel="¿En qué momento del proceso?"/>
                <Question label="Restricciones legales a considerar:"><Textarea/></Question>
                <Question label="Gestión de devoluciones: automática / solo registro para humano"><Input/></Question>
            </Section>

            <Section title="Sección 4: Agenda y Citas">
                <YesNoQuestion label="¿Desea que el agente pueda agendar citas automáticamente?" descriptionLabel="Detalles:" />
                <Question label="Información requerida para agendar (fecha, hora, duración, tipo de servicio, cliente):"><Textarea/></Question>
                <YesNoQuestion label="Recordatorios automáticos (clientes y equipo):" descriptionLabel="¿Con cuánta antelación?" />
                <Question label="Manejo de cancelaciones o reprogramaciones:"><Textarea/></Question>
                <YesNoQuestion label="Limitación de citas diarias según disponibilidad:" descriptionLabel="¿Cuál es el límite?" />
                <Question label="Sincronización con calendarios internos (Google Calendar, Outlook, otro):"><Input/></Question>
            </Section>

            <Section title="Sección 5: Integraciones y Tecnología">
                <Question label="Sistemas o plataformas a utilizar (CRM, ERP, WhatsApp Business, email, calendario):"><Textarea/></Question>
                <YesNoQuestion label="Integración de múltiples canales simultáneos:" descriptionLabel="¿Cuáles?"/>
                <YesNoQuestion label="Registro de interacciones en dashboards o reportes en tiempo real:" descriptionLabel="¿Dónde?"/>
                <Question label="Nivel de automatización deseado: 100% autónomo / Supervisión humana parcial"><Input/></Question>
                <YesNoQuestion label="¿Desea que el agente aprenda y mejore con el tiempo?" descriptionLabel="¿Bajo qué condiciones?"/>
            </Section>

            <Section title="Sección 6: Escenarios y Tono">
                <Question label="Ejemplos de conversaciones típicas para entrenamiento del agente:"><Textarea/></Question>
                <Question label="¿Comunicación uniforme o adaptativa según segmento?"><Input/></Question>
                <Question label="Acción del agente si no tiene información suficiente para responder:"><Textarea/></Question>
                <Question label="Prioridad en respuestas: rapidez / detalle / combinación"><Input/></Question>
                <Question label="Palabras, expresiones o tono a evitar:"><Textarea/></Question>
            </Section>

            <Section title="Sección 7: Reportes y Métricas">
                <Question label="Indicadores clave a rastrear:"><Textarea/></Question>
                <Question label="Frecuencia de reportes: diario / semanal / mensual / otro:"><Input/></Question>
                <YesNoQuestion label="Alertas automáticas por leads sin seguimiento o citas próximas:" descriptionLabel="¿Bajo qué reglas?" />
                <YesNoQuestion label="Análisis de patrones de comportamiento de clientes:" descriptionLabel="¿Qué tipo de patrones?"/>
                <YesNoQuestion label="Recomendaciones automáticas de mejora en ventas o atención:" descriptionLabel="¿En base a qué datos?"/>
            </Section>

            <Section title="Sección 8: Manejo de Leads Avanzado">
                <YesNoQuestion label="Clasificación automática de leads por interés o potencial:" descriptionLabel="¿Con qué criterios?"/>
                <YesNoQuestion label="Asignación de leads a vendedores específicos:" descriptionLabel="¿Bajo qué reglas?"/>
                <Question label="Acciones para leads inactivos:"><Textarea/></Question>
                <YesNoQuestion label="Seguimiento de leads en redes, email o WhatsApp:" descriptionLabel="¿Qué canales?"/>
                <Question label="Prioridad de leads pagados vs orgánicos:"><Input/></Question>
                <YesNoQuestion label="Registro automático de la fuente de cada lead:" descriptionLabel="¿Cómo se identifica la fuente?"/>
                <YesNoQuestion label="Recordatorios internos para leads sin respuesta:" descriptionLabel="¿Después de cuánto tiempo?"/>
                <Question label="Información adicional para enriquecer la base de datos:"><Textarea/></Question>
                <YesNoQuestion label="Integración de notas humanas sobre leads:" descriptionLabel="¿Cómo?"/>
                <YesNoQuestion label="Sugerencia de próximos pasos según interacción previa:" descriptionLabel="¿Qué tipo de sugerencias?"/>
            </Section>

            <Section title="Sección 9: Automatización de Ventas">
                <YesNoQuestion label="Envío automático de ofertas según perfil o historial:" descriptionLabel="¿Qué criterios usar?"/>
                <YesNoQuestion label="Seguimiento postventa:" descriptionLabel="¿Qué tipo de mensajes y cuándo?"/>
                <YesNoQuestion label="Actualización de inventario en tiempo real:" descriptionLabel="¿Con qué sistema se integra?"/>
                <YesNoQuestion label="Registro de pagos automáticamente:" descriptionLabel="¿Con qué pasarela de pago?"/>
                <YesNoQuestion label="Notificación de oportunidades de venta urgentes:" descriptionLabel="¿A quién y bajo qué condiciones?"/>
                <YesNoQuestion label="Gestión automática de renovaciones o suscripciones:" descriptionLabel="¿Cómo funciona?"/>
                <YesNoQuestion label="Aplicación de reglas de descuento según segmentación:" descriptionLabel="¿Qué reglas aplicar?"/>
                <Question label="Acción ante carrito abandonado:"><Textarea/></Question>
                <YesNoQuestion label="Sugerencias de cross-sell / up-sell:" descriptionLabel="¿Basado en qué?"/>
                <YesNoQuestion label="Reportes parciales o comparativos de ventas:" descriptionLabel="¿Qué tipo de comparativas?"/>
            </Section>

            <Section title="Sección 10: Atención al Cliente Avanzada">
                 <YesNoQuestion label="Identificación de clientes recurrentes y personalización:" descriptionLabel="¿Qué tipo de personalización?"/>
                 <YesNoQuestion label="Escalado automático de consultas complejas:" descriptionLabel="¿A quién y cuándo?"/>
                 <Question label="Idiomas soportados por el agente:"><Input/></Question>
                 <YesNoQuestion label="Protocolos de seguridad o verificación antes de dar información sensible:" descriptionLabel="¿Cuáles son?"/>
                 <YesNoQuestion label="Envío automático de documentos o facturas:" descriptionLabel="¿Desde qué sistema?"/>
                 <YesNoQuestion label="Registro completo de interacciones:" descriptionLabel="¿Dónde se guarda?"/>
                 <YesNoQuestion label="Atención fuera de horario laboral:" descriptionLabel="¿Con qué capacidades?"/>
                 <YesNoQuestion label="Generación automática de tickets de soporte:" descriptionLabel="¿En qué sistema?"/>
                 <YesNoQuestion label="Encuestas de satisfacción post-interacción:" descriptionLabel="¿Inmediatamente después o más tarde?"/>
                 <YesNoQuestion label="Adaptación de tono según tipo de consulta:" descriptionLabel="¿Qué tonos para qué consultas?"/>
            </Section>

             <Section title="Sección 11: Agenda y Gestión de Citas Avanzada">
                 <YesNoQuestion label="Sugerencia automática de horarios disponibles:" descriptionLabel="¿De qué calendarios?"/>
                 <YesNoQuestion label="Manejo de bloqueos por días festivos o vacaciones:" descriptionLabel="¿Cómo se gestionan?"/>
                 <Question label="Tipos de recordatorios automáticos: SMS / Email / WhatsApp / Otro:"><Input/></Question>
                 <YesNoQuestion label="Reprogramación automática de citas:" descriptionLabel="¿Bajo qué condiciones?"/>
                 <YesNoQuestion label="Alertas sobre citas críticas o clientes importantes:" descriptionLabel="¿A quién se alerta?"/>
                 <YesNoQuestion label="Integración con videollamadas (Zoom, Meet, Teams):" descriptionLabel="¿Se generan enlaces automáticamente?"/>
                 <YesNoQuestion label="Confirmación automática al registrar, cambiar o cancelar cita:" descriptionLabel="¿Qué mensaje se envía?"/>
                 <YesNoQuestion label="Manejo de citas recurrentes:" descriptionLabel="¿Cómo se configuran?"/>
                 <YesNoQuestion label="Reportes de ocupación, cancelaciones y efectividad:" descriptionLabel="¿Qué métricas son importantes?"/>
                 <Question label="Prioridad según cliente o tipo de servicio:"><Input/></Question>
             </Section>

             <Section title="Sección 12: Escenarios Especiales y Excepciones">
                 <Question label="Manejo de información incompleta o incorrecta:"><Textarea/></Question>
                 <Question label="Conflictos entre disponibilidad y solicitudes:"><Textarea/></Question>
                 <Question label="Excepciones técnicas (CRM caído, WhatsApp, email):"><Textarea/></Question>
                 <YesNoQuestion label="Alertas ante situaciones críticas o urgentes:" descriptionLabel="¿A quién y cómo?"/>
                 <YesNoQuestion label="Registro completo para auditoría interna:" descriptionLabel="¿Qué se debe registrar?"/>
                 <Question label="Acciones ante solicitudes fuera del alcance de la IA:"><Textarea/></Question>
                 <Question label="Sugerencias alternativas ante problemas de stock o entrega:"><Textarea/></Question>
                 <Question label="Manejo de leads duplicados o clientes recurrentes:"><Textarea/></Question>
                 <YesNoQuestion label="Atención diferenciada a clientes VIP:" descriptionLabel="¿Cómo se identifica a un VIP?"/>
                 <YesNoQuestion label="Comunicación diferenciada según canal preferido:" descriptionLabel="¿Cómo se establece la preferencia?"/>
             </Section>

             <Section title="Sección 13: Reportes, Métricas y Optimización">
                 <Question label="Indicadores clave en tiempo real:"><Textarea/></Question>
                 <YesNoQuestion label="Dashboards visuales:" descriptionLabel="¿Con qué herramienta?"/>
                 <YesNoQuestion label="Reportes comparativos entre periodos:" descriptionLabel="¿Qué periodos comparar?"/>
                 <YesNoQuestion label="Recomendaciones automáticas según métricas:" descriptionLabel="¿Qué tipo de recomendaciones?"/>
                 <YesNoQuestion label="Sugerencias para optimizar scripts, mensajes o procesos:" descriptionLabel="¿En base a qué?"/>
                 <Question label="Frecuencia de alertas de desempeño:"><Input/></Question>
                 <YesNoQuestion label="Análisis de tendencias de clientes para prever demanda:" descriptionLabel="¿Qué tendencias?"/>
                 <YesNoQuestion label="Reportes diferenciados por canal de comunicación:" descriptionLabel="¿Cómo se diferencian?"/>
                 <YesNoQuestion label="Benchmarking interno con historial de leads, ventas y citas:" descriptionLabel="¿Qué datos históricos usar?"/>
                 <YesNoQuestion label="Recomendaciones estratégicas para mejorar ventas y atención:" descriptionLabel="¿Basadas en qué análisis?"/>
             </Section>

            <Section title="Sección 14: Entrenamiento Específico y Base de Conocimiento">
                <Question label="URLs de referencia (página de precios, FAQ, sobre nosotros, etc.):">
                    <Textarea placeholder="https://ejemplo.com/precios&#10;https://ejemplo.com/faq" />
                </Question>
                <FileUpload 
                    label="Archivos de conocimiento (PDF con políticas, XLS con inventario, etc.)"
                    files={files}
                    onFileChange={handleFileChange}
                    onFileRemove={handleFileRemove}
                />
                <Question label="Información adicional clave (horarios, detalles de productos, etc.):">
                    <Textarea placeholder="Nuestro horario es de 9am a 6pm. El producto 'X' está hecho de material reciclado." />
                </Question>
            </Section>

            <CardFooter className="px-0 pt-8">
              <Button type="submit" className="w-full" size="lg">Enviar Información de Entrenamiento</Button>
            </CardFooter>
          </form>
           <div id="thank-you" style={{display: 'none'}} className="text-center py-12">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold">¡Gracias!</h2>
            <p className="text-muted-foreground mt-2">Hemos recibido la información. Tu Agente de IA estará aprendiendo pronto.</p>
            <Button asChild className="mt-6">
                <Link href="/dashboard">Volver a tu Panel</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
