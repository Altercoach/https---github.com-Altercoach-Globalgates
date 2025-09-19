
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Send, Link as LinkIcon, Clipboard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';

const questionnaireId = `eval-${Date.now()}`;
const questionnaireUrl = typeof window !== 'undefined' ? `${window.location.origin}/questionnaire/${questionnaireId}` : '';

export default function NewQuestionnairePage() {
  const [clientEmail, setClientEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const { toast } = useToast();

  const handleSend = () => {
    if (!clientEmail) {
      toast({ title: 'Por favor, introduce un email.', variant: 'destructive' });
      return;
    }
    // Simular envío
    console.log(`Enviando cuestionario a ${clientEmail}`);
    setIsSent(true);
    toast({ title: '¡Cuestionario "enviado"!', description: 'Se ha generado un enlace para tu cliente.' });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(questionnaireUrl);
    toast({ title: '¡Enlace copiado!', description: 'Puedes compartirlo directamente con tu cliente.' });
  };

  return (
    <div className="space-y-6">
       <header>
        <h1 className="font-headline text-3xl font-bold">Nuevo Cuestionario de Evaluación</h1>
        <p className="text-muted-foreground">Envía un enlace a tu cliente para que complete el formulario.</p>
      </header>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Enviar a Cliente</CardTitle>
          <CardDescription>Introduce el email del cliente para generar un enlace único para el cuestionario.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="client-email">Email del Cliente</Label>
            <Input
              id="client-email"
              type="email"
              placeholder="cliente@email.com"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              disabled={isSent}
            />
          </div>
           {isSent && (
            <Alert>
                <LinkIcon className="h-4 w-4" />
                <AlertTitle>Enlace Generado</AlertTitle>
                <AlertDescription className="flex items-center justify-between">
                  <Link href={questionnaireUrl} target="_blank" className="text-sm underline truncate pr-4">
                    {questionnaireUrl}
                  </Link>
                  <Button variant="ghost" size="icon" onClick={copyToClipboard}>
                    <Clipboard className="h-4 w-4"/>
                  </Button>
                </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
            <Button variant="ghost" asChild><Link href="/myoffice/questionnaires">Cancelar</Link></Button>
            <Button onClick={handleSend} disabled={isSent}>
                <Send className="mr-2" />
                {isSent ? 'Enlace Generado' : 'Generar Enlace'}
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

