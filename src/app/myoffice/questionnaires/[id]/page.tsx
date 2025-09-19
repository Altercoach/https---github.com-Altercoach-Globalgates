
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Bot, Download } from 'lucide-react';
import Link from 'next/link';

// Datos de ejemplo para las respuestas. En el futuro, esto vendrá de la base de datos.
const sampleAnswers = {
  'Sección 1: Información General del Negocio': {
    '¿Cuáles son los principales productos y servicios que ofrece tu negocio?': 'Café de especialidad, pastelería artesanal y desayunos.',
    '¿Cuál es tu producto o servicio estrella?': 'Nuestro café "cold brew" y el pastel de zanahoria.',
  },
  'Sección 2: Objetivos de Marketing': {
    '¿Cuál es su principal objetivo con esta estrategia?': 'Aumentar las ventas en un 20% y posicionar la marca en la zona centro.',
  }
};

const sampleAnalysis = `
**Análisis FODA (Fortalezas, Oportunidades, Debilidades, Amenazas)**

*   **Fortalezas:** Producto estrella bien definido (cold brew, pastel de zanahoria) que puede ser un gran gancho de marketing. Oferta de productos artesanales que apela a un público que valora la calidad.
*   **Oportunidades:** Posicionar la marca en la zona centro, donde puede haber alta afluencia de oficinistas y residentes con poder adquisitivo. El café de especialidad es un mercado en crecimiento.
*   **Debilidades:** (Requiere más información) No se menciona la presencia online actual ni la capacidad de producción para un aumento del 20% en ventas.
*   **Amenazas:** (Requiere más información) Competencia en la zona centro, sensibilidad al precio por parte de los consumidores.

**Recomendaciones Estratégicas Iniciales:**

1.  **Estrategia de Contenido:** Enfocar las redes sociales en la calidad artesanal de los productos. Mostrar el proceso de preparación del "cold brew", destacar los ingredientes del pastel de zanahoria, etc. Crear contenido visualmente atractivo que genere antojo.
2.  **Campaña de Posicionamiento Local (Branding):** Lanzar anuncios geolocalizados en Facebook e Instagram dirigidos a personas que viven o trabajan en la zona centro. Ofrecer una promoción de lanzamiento (ej. 2x1 en cold brew) para atraer a los primeros clientes.
3.  **Captura de Leads:** Implementar un Funnel sencillo. Ofrecer un pequeño descuento (10% en la primera compra) a cambio del correo electrónico del cliente en la landing page para construir una base de datos y fomentar la fidelización.

**Plan Sugerido:**
*   **Setup Funnel (Pago Único):** Para capturar los datos de los clientes interesados en la promoción.
*   **Marketing de Contenido (Suscripción):** Para construir la marca y mantener el interés en redes sociales.
*   **Branding (8 pubs/mes) (Suscripción):** Para ejecutar las campañas de posicionamiento local.
`;

export default function QuestionnaireResponsePage({ params }: { params: { id: string } }) {
  const isCompleted = params.id === 'brief-001';

  return (
    <div className="space-y-6">
      <header>
        <Button variant="outline" size="sm" asChild className="mb-4">
            <Link href="/myoffice/questionnaires"><ArrowLeft className="mr-2"/> Volver a Cuestionarios</Link>
        </Button>
        <h1 className="font-headline text-3xl font-bold">Respuestas del Cliente</h1>
        <p className="text-muted-foreground">Revisa la información proporcionada por el cliente y el análisis de la IA.</p>
      </header>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Columna de Respuestas */}
        <Card>
          <CardHeader>
            <CardTitle>Respuestas del Cuestionario</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isCompleted ? (
              Object.entries(sampleAnswers).map(([section, answers]) => (
                <div key={section}>
                  <h4 className="font-semibold text-lg mb-2">{section}</h4>
                  <div className="space-y-4 text-sm">
                    {Object.entries(answers).map(([question, answer]) => (
                      <div key={question}>
                        <p className="text-muted-foreground">{question}</p>
                        <p className="font-medium pl-2 border-l-2 border-primary">{answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-8">El cliente aún no ha completado este cuestionario.</p>
            )}
          </CardContent>
        </Card>

        {/* Columna de Análisis IA */}
        <Card className="bg-primary/5 sticky top-20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bot /> Análisis y Recomendación de IA</CardTitle>
          </CardHeader>
          <CardContent>
            {isCompleted ? (
              <div className="prose prose-sm max-w-none text-foreground prose-headings:text-foreground prose-strong:text-foreground">
                <pre className="whitespace-pre-wrap font-sans bg-transparent p-0">{sampleAnalysis}</pre>
              </div>
            ) : (
               <div className="text-center py-8 text-muted-foreground">
                 <p>El análisis se generará automáticamente una vez que el cliente envíe sus respuestas.</p>
               </div>
            )}
          </CardContent>
           {isCompleted && (
            <CardFooter>
                <Button variant="secondary" className="w-full">
                    <Download className="mr-2" />
                    Descargar Análisis (PDF)
                </Button>
            </CardFooter>
           )}
        </Card>
      </div>

    </div>
  );
}
