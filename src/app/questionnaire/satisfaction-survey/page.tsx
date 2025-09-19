
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Star } from 'lucide-react';
import Link from 'next/link';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function SatisfactionSurveyPage() {
  const { toast } = useToast();
  const [rating, setRating] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: '¡Gracias por tu opinión!',
      description: 'Tus comentarios nos ayudan a mejorar continuamente.',
    });
    const form = document.getElementById('survey-form');
    const thanks = document.getElementById('thank-you');
    if (form) form.style.display = 'none';
    if (thanks) thanks.style.display = 'block';
  };

  return (
    <div className="min-h-screen bg-muted/20 py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center mb-4">
            <Star />
          </div>
          <CardTitle className="text-3xl">Encuesta de Satisfacción</CardTitle>
          <CardDescription>Tu opinión es muy importante para nosotros. Por favor, tómate un momento para evaluarnos.</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="survey-form" onSubmit={handleSubmit} className="space-y-8">

            <div className="space-y-4">
                <Label>En una escala del 1 al 5, ¿qué tan satisfecho estás con nuestro servicio?</Label>
                <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                        <button key={star} type="button" onClick={() => setRating(star)}>
                            <Star className={cn("h-8 w-8 transition-colors", rating >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300")} />
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
              <Label>¿Qué es lo que más te gustó de trabajar con nosotros?</Label>
              <Textarea placeholder="Tus comentarios..." rows={4} required />
            </div>
            
            <div className="space-y-2">
              <Label>¿Hay algo que podríamos mejorar? ¿Cómo?</Label>
              <Textarea placeholder="Tus sugerencias son bienvenidas..." rows={4} required />
            </div>
            
            <div className="space-y-4">
                <Label>¿Recomendarías nuestros servicios a un colega o amigo?</Label>
                <RadioGroup required>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="si" id="r_yes" />
                        <Label htmlFor="r_yes">Sí, definitivamente</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="talvez" id="r_maybe" />
                        <Label htmlFor="r_maybe">Tal vez</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="r_no" />
                        <Label htmlFor="r_no">No, probablemente no</Label>
                    </div>
                </RadioGroup>
            </div>


            <CardFooter className="px-0 pt-8">
              <Button type="submit" className="w-full" size="lg">Enviar Encuesta</Button>
            </CardFooter>
          </form>
           <div id="thank-you" style={{display: 'none'}} className="text-center py-12">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold">¡Gracias!</h2>
            <p className="text-muted-foreground mt-2">Valoramos mucho tu tiempo y tus comentarios.</p>
            <Button asChild className="mt-6">
                <Link href="/dashboard">Volver a tu Panel</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
