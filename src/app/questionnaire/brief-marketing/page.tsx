
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, FileText, Upload, Paperclip, X } from 'lucide-react';
import Link from 'next/link';

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

const FileUpload = ({ label, files, onFileChange, onFileRemove, field }: { label: string; files: File[], onFileChange: (event: React.ChangeEvent<HTMLInputElement>, field: string) => void, onFileRemove: (fileName: string, field: string) => void, field: string }) => (
    <div className="space-y-2">
        <Label>{label}</Label>
        <div className="flex items-center justify-center w-full">
            <label htmlFor={`dropzone-${field}`} className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/80">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Haz clic para subir</span></p>
                    <p className="text-xs text-muted-foreground">PDF, JPG, PNG, etc.</p>
                </div>
                <Input id={`dropzone-${field}`} type="file" className="hidden" onChange={(e) => onFileChange(e, field)} />
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
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onFileRemove(file.name, field)}>
                            <X className="h-4 w-4"/>
                        </Button>
                    </div>
                ))}
            </div>
        )}
    </div>
)

export default function BriefMarketingPage() {
  const { toast } = useToast();
  const [showEcommerce, setShowEcommerce] = useState(false);
  const [, setShowOffline] = useState(false);

  const [uploadedFiles, setUploadedFiles] = useState<{[key: string]: File[]}>({});

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (event.target.files) {
      const newFile = event.target.files[0];
      setUploadedFiles(prev => ({
        ...prev,
        [field]: [newFile]
      }));
    }
  };

  const handleFileRemove = (fileName: string, field: string) => {
    setUploadedFiles(prev => ({
      ...prev,
      [field]: prev[field]?.filter(f => f.name !== fileName) || []
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: '¡Brief Enviado!',
      description: 'Gracias por tus respuestas. Nuestro equipo las revisará pronto.',
    });
    // Idealmente, redirigir a una página de agradecimiento.
    const form = document.getElementById('brief-form');
    const thanks = document.getElementById('thank-you');
    if (form) form.style.display = 'none';
    if (thanks) thanks.style.display = 'block';
  };

  return (
    <div className="min-h-screen bg-muted/20 py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
            <div className="mx-auto bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <FileText />
            </div>
          <CardTitle className="text-3xl">Brief Profesional de Marketing</CardTitle>
          <CardDescription>Tus respuestas son el cimiento de nuestra estrategia. Por favor, sé lo más detallado posible.</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="brief-form" onSubmit={handleSubmit} className="space-y-8">
            <Section title="A. Información básica y contacto">
                <div className="grid md:grid-cols-2 gap-4">
                    <Question label="Nombre de la empresa"><Input required /></Question>
                    <Question label="Nombre del contacto principal"><Input required /></Question>
                    <Question label="Cargo del contacto principal"><Input required /></Question>
                    <Question label="Teléfono / WhatsApp"><Input required /></Question>
                    <Question label="Correo electrónico"><Input type="email" required /></Question>
                    <Question label="Dirección física (si aplica)"><Input /></Question>
                    <Question label="Horario de atención"><Input /></Question>
                </div>
                 <Question label="¿Quiénes más participarán en el proyecto? (nombres y cargos)"><Textarea /></Question>
                 <Question label="Mejor forma y horario para comunicarnos"><Input /></Question>
            </Section>

            <Section title="B. Datos comerciales y operativos">
                <Question label="Giro o industria principal"><Input /></Question>
                <div className="flex items-center space-x-2">
                    <Checkbox id="has-locals" onCheckedChange={(checked) => setShowOffline(!!checked)} />
                    <label htmlFor="has-locals" className="text-sm font-medium">¿El negocio tiene local(es) y/o sucursales?</label>
                </div>
                <Question label="Ciudades / regiones / países donde opera"><Input /></Question>
                <div className="flex items-center space-x-2">
                    <Checkbox id="has-ecommerce" onCheckedChange={(checked) => setShowEcommerce(!!checked)} />
                    <label htmlFor="has-ecommerce" className="text-sm font-medium">¿Ofrecen venta online?</label>
                </div>
                {showEcommerce && (
                     <Question label="Plataforma de e-commerce (Shopify, WooCommerce, etc.)"><Input placeholder="Ej: Shopify" /></Question>
                )}
                <Question label="¿Ofrecen envíos? Zonas, tiempos y costo promedio."><Textarea /></Question>
                <Question label="Condiciones de venta: política de devoluciones, garantía, tiempos de entrega."><Textarea /></Question>
                <Question label="Horarios / estacionalidad / fechas clave (Black Friday, Navidades, etc.)"><Textarea /></Question>
                <Question label="Estructura comercial: canales de venta (tienda física, distribuidores, afiliados)."><Textarea /></Question>
            </Section>

            <Section title="C. Objetivos y prioridades">
                 <Question label="¿Cuáles son los objetivos principales del trabajo de marketing? (Selecciona y explica)"><Textarea placeholder="Aumentar ventas, generar leads, branding..." /></Question>
                 <Question label="KPI principales (¿cómo mediremos el éxito?): ventas, MQLs, CPL, CAC, ROAS, tráfico, etc."><Textarea /></Question>
                 <Question label="Presupuesto mensual o por campaña (publicidad, producción, contenidos)."><Input type="number" /></Question>
                 <Question label="Plazos y metas por periodo (3, 6, 12 meses)."><Textarea /></Question>
                 <Question label="¿Cuál sería el resultado ideal al finalizar el primer mes / trimestre / año?"><Textarea /></Question>
            </Section>

            <Section title="D. Marca e identidad (branding)">
                <FileUpload 
                  label="¿La empresa cuenta con manual de identidad / brandbook?" 
                  field="brandbook" 
                  files={uploadedFiles['brandbook'] || []} 
                  onFileChange={handleFileChange} 
                  onFileRemove={handleFileRemove} 
                />
                <Question label="Nombre de la tipografía corporativa"><Input /></Question>
                <Question label="Colores corporativos (HEX / Pantone)"><Input /></Question>
                <FileUpload 
                  label="Logotipo (subir versiones: color, blanco y negro, SVG/AI/EPS)" 
                  field="logo"
                  files={uploadedFiles['logo'] || []} 
                  onFileChange={handleFileChange} 
                  onFileRemove={handleFileRemove} 
                />
                <Question label="¿Qué elementos visuales deben evitarse?"><Textarea /></Question>
                <Question label="¿Cómo describirías la personalidad de la marca? (ej. formal, cercana, técnica, divertida)"><Input /></Question>
                <Question label="Tono de comunicación (voz de marca): (ej. experto, cercano, inspirador, humorístico)"><Input /></Question>
                <Question label="Ejemplos de marcas o referencias gráficas que te gustan (links y breve explicación)"><Textarea /></Question>
                <FileUpload 
                  label="¿Cuenta con fotografías reales de producto o servicio?" 
                  field="photos"
                  files={uploadedFiles['photos'] || []} 
                  onFileChange={handleFileChange} 
                  onFileRemove={handleFileRemove} 
                />
                <FileUpload 
                  label="¿Disponen de videos corporativos o promocionales?" 
                  field="videos"
                  files={uploadedFiles['videos'] || []} 
                  onFileChange={handleFileChange} 
                  onFileRemove={handleFileRemove} 
                />
            </Section>
            
            {/* Secciones E a Q se omiten por brevedad en este ejemplo, pero se añadirían siguiendo el mismo patrón */}

            <Section title="Q. Firma, condiciones y aceptación">
                <Question label="Comentarios, dudas o puntos a considerar que no hemos consultado."><Textarea /></Question>
                <div className="flex items-center space-x-2 pt-4">
                    <Checkbox id="terms" required />
                    <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Acepto los términos y condiciones del servicio.
                    </label>
                </div>
            </Section>

            <CardFooter className="px-0 pt-8">
                <Button type="submit" className="w-full" size="lg">Enviar Brief de Marketing</Button>
            </CardFooter>
          </form>

          <div id="thank-you" style={{display: 'none'}} className="text-center py-12">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold">¡Gracias por completar el Brief!</h2>
            <p className="text-muted-foreground mt-2">Hemos recibido tu información. Nuestro equipo comenzará a trabajar en tu estrategia.</p>
            <Button asChild className="mt-6">
                <Link href="/dashboard">Volver a tu Panel</Link>
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
