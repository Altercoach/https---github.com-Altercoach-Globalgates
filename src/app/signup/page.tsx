
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { hasPurchased } = useCart();
  const { toast } = useToast();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API endpoint
    toast({
      title: '¡Cuenta Creada!',
      description: 'Ahora puedes iniciar sesión con tus nuevas credenciales.',
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Crear Cuenta</CardTitle>
          <CardDescription>Regístrate para gestionar tus servicios.</CardDescription>
        </CardHeader>
        <CardContent>
          {!hasPurchased && (
            <Alert variant="default" className="mb-4 bg-accent/10 border-accent/30">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Registro Deshabilitado</AlertTitle>
              <AlertDescription>
                Para crear una cuenta, por favor compra primero uno de nuestros planes.
              </AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSignup} className="space-y-4">
            <fieldset disabled={!hasPurchased} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={!hasPurchased}>
                Crear Cuenta
              </Button>
            </fieldset>
             <Button variant="outline" className="w-full" asChild>
              <Link href="/">Volver al Inicio</Link>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
