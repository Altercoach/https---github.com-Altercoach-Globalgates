
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, FileText } from 'lucide-react';
import Link from 'next/link';

// Estas son las preguntas que me proporcionaste.
const questions = {
  'Sección 1: Información General del Negocio': [
    '¿Cuáles son los principales productos y servicios que ofrece tu negocio?',
    '¿Cuál es tu producto o servicio estrella?',
    '¿Qué te diferencia de tu competencia?',
    '¿A quienes consideras competencia?',
    '¿Cuál consideras negocio modelo que te gustaría igualar o mejorar?',
    '¿Cual es el tu segmento de mercado principal? (Hogares, empresas, grandes corporaciones, gobierno etc.)',
    '¿Quién es tu cliente ideal? Describe quien es y cómo se comporta, que busca ,que le molesta, por que es así, que lo lleva a ser tu cliente, como queda satisfecho',
    '¿Cuáles serían los disparadores impulsores de tu negocio? (ejemplo neveria exceso de calor o temporada de verano, dentista despues del dia de niños, bicicletas en navidad)',
    '¿Cuál consideras tu nicho o nichos de mercado? (sector que de seguro necesita comprate)',
    '¿En qué áreas geográficas prefieres operar tu negocio? (interna, foránea,en mi comunidad, Local(solo en mi ciudad) , regional, nacional, internacional)',
    '¿Ofreces servicios adicionales? (Instalación, monitoreo 24/7, soporte técnico, etc.)',
    '¿Ofreces servicios a domicilio o solo en tu local o ambos?',
    '¿Cuál es tu plan de crecimiento o escalabilidad y de qué dependerá?'
  ],
  'Sección 2: Objetivos de Marketing': [
    '¿Cuál es su principal objetivo con esta estrategia? (Ejemplo: aumentar ventas, captar leads, fidelizar clientes, posicionar la marca, etc.)',
    '¿Cuántos clientes nuevos espera captar mensualmente?',
    '¿Qué porcentaje de los ingresos está dispuesto a invertir en publicidad digital al mes?',
    '¿Prefiere enfocar la estrategia en atracción de nuevos clientes o fidelización de los actuales o ambos?'
  ],
  'Sección 3: Audiencia y Clientes Actuales': [
    '¿Qué tipo de clientes suelen buscar sus productos/servicios actualmente?',
    '¿Qué problemas suelen tener sus clientes que sus productos/servicios solucionan?',
    '¿Tiene datos demográficos sobre su público objetivo? (Edad, ubicación, ingresos, etc.)',
    '¿De dónde provienen sus clientes actuales? (Recomendaciones, redes sociales, página web, etc.)',
    '¿Qué intangible emocional definiría tu propuesta de valor? Ejemplo un gimnasio renta convivencia, coca cola vende felicidad y fraternidad, iphone vende status económico y social etc.',
    '¿Con qué expresión y palabra definiría el cliente su producto o servicio? ejemplo sorpresa por el precio, satisfacción por haberlo encontrado, etc.'
  ],
  'Sección 4: Presencia Digital y Competencia': [
    '¿Tienen una página web? ¿Está actualizada y optimizada para conversiones?',
    '¿Cuáles redes sociales utiliza su negocio? (Instagram, Facebook, LinkedIn, etc.)',
    '¿Qué tipo de contenido publican actualmente?',
    '¿Conoce a su competencia? ¿Qué estrategias considera que les funcionan?'
  ],
  'Sección 5: Estrategias de Publicidad y Generación de contactos': [
    '¿Utilizan alguna herramienta para captar clientes potenciales actualmente? (mencione)',
    '¿Está interesado en alguna forma específica para captar contactos para ventas?',
    '¿Prefiere que los contactos se gestionen de manera automática (Agentes de IA) o manual?'
  ],

  'Sección 6: Contenidos y Mensajes Publicitarios': [
    '¿Qué mensajes clave desearía comunicar en su publicidad?',
    '¿Cuenta con casos de éxito, testimonios o materiales visuales que podamos usar?',
    '¿Quiere incluir promociones especiales o paquetes en la estrategia publicitaria?',
    '¿Sugiere que a sus prospectos les interesa un estilo de comunicación técnico, profesional o más sencillo ?'
  ],
  'Sección 7: Proceso de Venta y Seguimiento': [
    '¿Cómo es el proceso de venta actual, desde el primer contacto hasta la compra?(describa lo más completo enumerando los pasos)',
    '¿Qué canales utiliza actualmente para atender a sus clientes? (WhatsApp, email, llamadas, etc.)',
    '¿Qué tan rápido pueden responder a los contactos que generemos para su atencion o venta?',
    '¿Su servicio depende de agendar cita?',
    '¿Usted ofrece muestras o pruebas gratuitas como carnada impulsora de la venta?',
    '¿Que describiría como principal y más importante aspecto de su negocio? enumere Calidad, Precio, Rapidez.'
  ],
  'Sección 8: Seguimiento y Métricas': [
    '¿Qué indicadores considera más importantes para medir el éxito de la estrategia principal? (contactos generados, ventas cerradas, resultado en monto de ingresos, alcance, interacciones, la opinión de su comunidad en redes etc.)',
    '¿Cómo prefiere recibir reportes y actualizaciones? (junta mensual, reuniones virtuales, por chat etc.)'
  ]
};

export default function QuestionnaireFillPage() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // En el futuro, aquí guardaríamos las respuestas.
    toast({
      title: '¡Cuestionario Enviado!',
      description: 'Gracias por tus respuestas. Nuestro equipo las revisará pronto.',
    });
    // Idealmente, redirigir a una página de agradecimiento.
    const form = e.target as HTMLFormElement;
    form.style.display = 'none';
    const thanks = document.getElementById('thank-you');
    if(thanks) thanks.style.display = 'block';

  };

  return (
    <div className="min-h-screen bg-muted/20 py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
            <div className="mx-auto bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <FileText />
            </div>
          <CardTitle className="text-3xl">Cuestionario de Evaluación de Negocio</CardTitle>
          <CardDescription>Tus respuestas nos ayudarán a crear la mejor estrategia para ti.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {Object.entries(questions).map(([sectionTitle, sectionQuestions]) => (
              <div key={sectionTitle} className="space-y-4 border-t pt-6">
                <h3 className="text-xl font-semibold">{sectionTitle}</h3>
                {sectionQuestions.map((question, index) => (
                  <div key={index} className="space-y-2">
                    <Label htmlFor={`q-${sectionTitle}-${index}`}>{question}</Label>
                    <Textarea
                      id={`q-${sectionTitle}-${index}`}
                      placeholder="Tu respuesta..."
                      rows={3}
                      required
                    />
                  </div>
                ))}
              </div>
            ))}

            <CardFooter className="px-0 pt-8">
                <Button type="submit" className="w-full" size="lg">Enviar Respuestas</Button>
            </CardFooter>
          </form>

          <div id="thank-you" style={{display: 'none'}} className="text-center py-12">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold">¡Gracias por tus respuestas!</h2>
            <p className="text-muted-foreground mt-2">Hemos recibido tu información. Nos pondremos en contacto contigo pronto.</p>
            <Button asChild className="mt-6">
                <Link href="/">Volver a la página principal</Link>
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
