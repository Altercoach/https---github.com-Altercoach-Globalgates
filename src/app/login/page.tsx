
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import { Shield, User } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleAdminLogin = () => {
    login('admin@negocio.com', 'admin');
  };

  const handleCustomerLogin = () => {
    login('demo@cliente.com', 'customer');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
          <CardDescription>Selecciona tu rol para continuar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <Button onClick={handleAdminLogin} className="w-full">
            <Shield className="mr-2"/>
            Entrar como Administrador
          </Button>
           <Button onClick={handleCustomerLogin} variant="secondary" className="w-full">
            <User className="mr-2"/>
            Entrar como Cliente (Demo)
          </Button>

          <div className="relative my-4">
            <Separator />
            <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-background px-2 text-xs text-muted-foreground">O</span>
          </div>
          
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled
              />
            </div>
             <Button type="submit" className="w-full" disabled>
              Iniciar Sesión (deshabilitado)
            </Button>
          </form>

          <Button variant="outline" className="w-full" asChild>
              <Link href="/">Volver al Inicio</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
