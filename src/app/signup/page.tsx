
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useLanguage } from '@/hooks/use-language';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

const labels = {
  es: {
    title: "Crear Cuenta",
    description: "Regístrate para obtener una consulta gratuita y gestionar tus servicios.",
    emailLabel: "Email",
    passwordLabel: "Contraseña",
    submitButton: "Crear Cuenta",
    backButton: "Volver al Inicio",
    toastTitle: "¡Cuenta Creada!",
    toastDescription: "Hemos creado tu cuenta. Ahora serás dirigido a tu panel de cliente.",
  },
  en: {
    title: "Create Account",
    description: "Sign up for a free consultation and manage your services.",
    emailLabel: "Email",
    passwordLabel: "Password",
    submitButton: "Create Account",
    backButton: "Back to Home",
    toastTitle: "Account Created!",
    toastDescription: "We've created your account. You will now be directed to your customer dashboard.",
  },
  fr: {
    title: "Créer un Compte",
    description: "Inscrivez-vous pour une consultation gratuite et gérez vos services.",
    emailLabel: "Email",
    passwordLabel: "Mot de passe",
    submitButton: "Créer un Compte",
    backButton: "Retour à l'accueil",
    toastTitle: "Compte Créé !",
    toastDescription: "Nous avons créé votre compte. Vous allez maintenant être redirigé vers votre tableau de bord client.",
  }
}


export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();
  const { language } = useLanguage();
  const { login } = useAuth();
  const router = useRouter();
  const t = labels[language.code as keyof typeof labels] || labels.en;


  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API endpoint to register the user
    toast({
      title: t.toastTitle,
      description: t.toastDescription,
    });
    // Log the user in as a 'customer' role but they won't have paid status yet.
    login(email, 'customer');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{t.title}</CardTitle>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t.emailLabel}</Label>
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
              <Label htmlFor="password">{t.passwordLabel}</Label>
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
            <Button type="submit" className="w-full">
              {t.submitButton}
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/">{t.backButton}</Link>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
