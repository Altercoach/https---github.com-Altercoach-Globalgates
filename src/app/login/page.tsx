
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import { Shield, User } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

const labels = {
  es: {
    title: "Iniciar Sesión",
    description: "Selecciona tu rol para acceder.",
    adminButton: "Entrar como Administrador",
    customerButton: "Entrar como Cliente (Demo)",
    demoMessage: "El inicio de sesión manual está deshabilitado para esta demostración.",
    backButton: "Volver al Inicio"
  },
  en: {
    title: "Login",
    description: "Select your role to access.",
    adminButton: "Enter as Administrator",
    customerButton: "Enter as Customer (Demo)",
    demoMessage: "Manual login is disabled for this demonstration.",
    backButton: "Back to Home"
  },
  fr: {
    title: "Connexion",
    description: "Sélectionnez votre rôle pour accéder.",
    adminButton: "Entrer en tant qu'administrateur",
    customerButton: "Entrer en tant que client (Démo)",
    demoMessage: "La connexion manuelle est désactivée pour cette démonstration.",
    backButton: "Retour à l'accueil"
  }
};


export default function LoginPage() {
  const { login } = useAuth();
  const { language } = useLanguage();
  const t = labels[language.code as keyof typeof labels] || labels.en;

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
          <CardTitle className="text-2xl">{t.title}</CardTitle>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
           <Button onClick={handleAdminLogin} className="w-full">
            <Shield className="mr-2"/>
            {t.adminButton}
          </Button>
           <Button onClick={handleCustomerLogin} variant="secondary" className="w-full">
            <User className="mr-2"/>
            {t.customerButton}
          </Button>
          
          <p className="px-8 text-center text-sm text-muted-foreground pt-2">
            {t.demoMessage}
          </p>

          <Button variant="outline" className="w-full" asChild>
              <Link href="/">{t.backButton}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
