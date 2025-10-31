
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
          <CardDescription>Selecciona tu rol para acceder a la plataforma.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
           <Button onClick={handleAdminLogin} className="w-full">
            <Shield className="mr-2"/>
            Entrar como Administrador
          </Button>
           <Button onClick={handleCustomerLogin} variant="secondary" className="w-full">
            <User className="mr-2"/>
            Entrar como Cliente (Demo)
          </Button>
          
          <p className="px-8 text-center text-sm text-muted-foreground">
            El inicio de sesión manual está deshabilitado para esta demostración. Por favor, usa uno de los botones de arriba.
          </p>

          <Button variant="outline" className="w-full" asChild>
              <Link href="/">Volver al Inicio</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
