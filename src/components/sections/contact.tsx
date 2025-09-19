
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

// Helper component for WhatsApp icon
function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      <path d="M19.07 4.93a10 10 0 0 0-14.14 0" />
      <path d="M16.24 7.76a6 6 0 0 0-8.48 0" />
    </svg>
  );
}


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
              <a href="mailto:atencion@goldenkey.website">atencion@goldenkey.website</a>
            </div>
             <div className="flex items-center gap-3">
              <WhatsAppIcon className="h-5 w-5 text-accent" />
              <Link href="https://wa.me/message/I6IIHJNC7PP5C1" target="_blank" rel="noopener noreferrer">
                Chatea con nosotros en WhatsApp
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-accent" />
              <a href="tel:+526649035314">+52 (664) 903-5314</a>
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
                  <Input id="name" name="name" autoComplete="name" placeholder="Tu Nombre" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-left block">Email</Label>
                  <Input id="email" name="email" type="email" autoComplete="email" placeholder="tu@email.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-left block">Cuéntanos sobre tu proyecto</Label>
                  <Textarea id="message" name="message" placeholder="Tu mensaje..." required />
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
