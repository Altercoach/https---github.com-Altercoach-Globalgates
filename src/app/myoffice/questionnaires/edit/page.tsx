
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import Link from 'next/link';

// Estas son las preguntas que me proporcionaste, ahora usadas como plantilla para el admin.
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

export default function QuestionnaireEditPage() {
  return (
    <div className="space-y-6">
      <header>
          <Button variant="outline" size="sm" asChild className="mb-4">
              <Link href="/myoffice/questionnaires"><ArrowLeft className="mr-2"/> Volver a Plantillas</Link>
          </Button>
          <h1 className="font-headline text-3xl font-bold">Editor de Plantilla de Cuestionario</h1>
          <p className="text-muted-foreground">Revisa y gestiona las preguntas de este formulario.</p>
      </header>
    
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Cuestionario de Evaluación de Negocio</CardTitle>
          <CardDescription>Este es el contenido que verá el cliente al que se le asigne este formulario. (Actualmente en modo de solo lectura).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            {Object.entries(questions).map(([sectionTitle, sectionQuestions]) => (
              <div key={sectionTitle} className="space-y-4 border-t pt-6">
                <h3 className="text-xl font-semibold">{sectionTitle}</h3>
                {sectionQuestions.map((question, index) => (
                  <div key={index} className="space-y-2">
                    <Label htmlFor={`q-${sectionTitle}-${index}`}>{`Pregunta ${index + 1}`}</Label>
                    <div className="flex items-center gap-2">
                        <Input
                          id={`q-${sectionTitle}-${index}`}
                          value={question}
                          readOnly
                          className="bg-muted/50"
                        />
                         <Button variant="ghost" size="icon" disabled>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
        </CardContent>
        <CardFooter>
            <Button disabled><Save className="mr-2"/> Guardar Cambios en Plantilla</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
