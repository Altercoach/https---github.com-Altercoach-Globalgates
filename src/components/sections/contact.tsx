'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin } from 'lucide-react';

export function Contact() {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: '¡Mensaje Enviado!',
      description: 'Gracias por contactarnos. Te responderemos en breve.',
    });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <section id="contact" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6 lg:gap-10">
        <div className="space-y-3">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">¿Listo para Abrir Nuevas Puertas?</h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Escríbenos y agenda una llamada. Hablemos de cómo podemos elevar tu marca.
          </p>
        </div>
        <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-accent" />
              <span>hello@globalgate.agency</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-accent" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-accent" />
              <span>Tijuana • San Diego • Chula Vista • Los Angeles</span>
            </div>
          </div>
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-left block">Nombre</Label>
                  <Input id="name" placeholder="Tu Nombre" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-left block">Email</Label>
                  <Input id="email" type="email" placeholder="tu@email.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-left block">Cuéntanos sobre tu proyecto</Label>
                  <Textarea id="message" placeholder="Tu mensaje..." required />
                </div>
                <Button type="submit" className="w-full bg-accent hover:bg-accent/90">Enviar Mensaje</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
