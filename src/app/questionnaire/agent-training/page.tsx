
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Bot } from 'lucide-react';
import Link from 'next/link';

export default function AgentTrainingPage() {
  const { toast } = useToast();

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
          <CardTitle className="text-3xl">Formulario de Entrenamiento del Agente de IA</CardTitle>
          <CardDescription>Proporciónanos la información base para que tu asistente virtual pueda ayudar a tus clientes.</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="agent-form" onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <Label>Información General de la Empresa</Label>
              <Textarea placeholder="Describe tu negocio, qué hacen, su historia, su misión, etc." rows={5} required />
            </div>
            <div className="space-y-2">
              <Label>Productos y Servicios</Label>
              <Textarea placeholder="Lista tus principales productos o servicios con una breve descripción y precios si aplica." rows={8} required />
            </div>
             <div className="space-y-2">
              <Label>Preguntas Frecuentes (FAQ)</Label>
              <Textarea placeholder="Escribe las 5-10 preguntas más comunes que reciben de sus clientes y sus respuestas exactas.&#10;Ej: P: ¿Cuáles son sus horarios? R: Estamos abiertos de 9am a 6pm de lunes a viernes." rows={10} required />
            </div>
             <div className="space-y-2">
              <Label>Tono de Comunicación</Label>
              <Textarea placeholder="¿Cómo debe comunicarse el agente? ¿Formal, amigable, técnico, divertido?" rows={2} required />
            </div>
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
