
'use client';

import { useState, useEffect } from 'react';
import { useSite } from '@/hooks/use-site';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Clipboard, Check } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function ReviewAndSavePage() {
  const { site, setHasUnsavedChanges } = useSite();
  const [jsonString, setJsonString] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Stringify the site object to display it.
    // The null, 2 arguments format it nicely.
    setJsonString(JSON.stringify(site, null, 2));
  }, [site]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    toast({
      title: '¡Copiado al portapapeles!',
      description: 'Ahora pégalo en el chat con el asistente de IA.',
    });
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleMarkAsSaved = () => {
      setHasUnsavedChanges(false);
      toast({
          title: "Cambios Marcados como Guardados",
          description: "Hemos restablecido el indicador de cambios. ¡No olvides pedirle al asistente que guarde el contenido!"
      })
  }

  return (
    <div className="space-y-6">
      <header>
        <Button variant="outline" size="sm" asChild className="mb-4">
          <Link href="/myoffice">
            <ArrowLeft className="mr-2" /> Volver a la Oficina
          </Link>
        </Button>
        <h1 className="font-headline text-3xl font-bold">Revisar y Guardar Cambios</h1>
        <p className="text-muted-foreground">Sigue los pasos para guardar permanentemente tus cambios.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Paso 1: Copia la Configuración</CardTitle>
          <CardDescription>
            Haz clic en el botón de abajo para copiar la configuración actualizada de tu sitio. Este es el contenido que se guardará permanentemente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="mt-2 h-[300px] w-full overflow-auto rounded-md bg-slate-950 p-4">
            <code className="text-white">{jsonString}</code>
          </pre>
          <Button onClick={copyToClipboard} className="mt-4 w-full">
            {copied ? <Check className="mr-2" /> : <Clipboard className="mr-2" />}
            {copied ? '¡Copiado!' : 'Copiar para el Asistente'}
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>Paso 2: Pide al Asistente que Guarde</CardTitle>
            <CardDescription>
                Abre la conversación con el Asistente de IA (aquí mismo en esta interfaz de Studio) y pídele que guarde los cambios pegando el contenido que acabas de copiar.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Alert>
                <AlertTitle>Ejemplo de Instrucción para la IA:</AlertTitle>
                <AlertDescription>
                    <p className="font-mono text-sm">"Por favor, guarda la siguiente configuración del sitio:"</p>
                    <p className="mt-2">Luego, simplemente pega (Ctrl+V o Cmd+V) el texto que copiaste en el paso 1.</p>
                </AlertDescription>
            </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Paso 3 (Opcional): Marcar como Guardado</CardTitle>
            <CardDescription>
                Si ya le pediste al asistente que guarde los cambios y quieres ocultar el botón "Revisar y Guardar", puedes hacer clic aquí.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Button onClick={handleMarkAsSaved} variant="outline">
                He pedido a la IA que guarde, ocultar notificación
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
