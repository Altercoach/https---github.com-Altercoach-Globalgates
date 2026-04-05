
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import { Shield, User, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { Alert, AlertDescription } from '@/components/ui/alert';

const labels = {
  es: {
    title: "Iniciar Sesión",
    description: "Accede a tu cuenta",
    emailLabel: "Email",
    passwordLabel: "Contraseña",
    loginButton: "Iniciar Sesión",
    signupButton: "Crear Cuenta",
    errorMessage: "Error al iniciar sesión. Intenta nuevamente.",
    demoCredentials: "Credenciales de demo: admin@negocio.com / demo@cliente.com (Contraseña: Demo123!)",
    backButton: "Volver al Inicio",
    adminEmail: "admin@negocio.com",
    customerEmail: "demo@cliente.com",
    demoPassword: "Demo123!",
    adminButtonText: "Demo: Entrar como Administrador",
    customerButtonText: "Demo: Entrar como Cliente"
  },
  en: {
    title: "Login",
    description: "Access your account",
    emailLabel: "Email",
    passwordLabel: "Password",
    loginButton: "Sign In",
    signupButton: "Create Account",
    errorMessage: "Error signing in. Please try again.",
    demoCredentials: "Demo credentials: admin@negocio.com / demo@cliente.com (Password: Demo123!)",
    backButton: "Back to Home",
    adminEmail: "admin@negocio.com",
    customerEmail: "demo@cliente.com",
    demoPassword: "Demo123!",
    adminButtonText: "Demo: Enter as Administrator",
    customerButtonText: "Demo: Enter as Customer"
  },
  fr: {
    title: "Connexion",
    description: "Accédez à votre compte",
    emailLabel: "Email",
    passwordLabel: "Mot de passe",
    loginButton: "Se connecter",
    signupButton: "Créer un compte",
    errorMessage: "Erreur de connexion. Veuillez réessayer.",
    demoCredentials: "Identifiants de démonstration: admin@negocio.com / demo@cliente.com (Mot de passe: Demo123!)",
    backButton: "Retour à l'accueil",
    adminEmail: "admin@negocio.com",
    customerEmail: "demo@cliente.com",
    demoPassword: "Demo123!",
    adminButtonText: "Démo: Entrer en tant qu'administrateur",
    customerButtonText: "Démo: Entrer en tant que client"
  }
};

export default function LoginPage() {
  const { login } = useAuth();
  const { language } = useLanguage();
  const t = labels[language.code as keyof typeof labels] || labels.en;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
    } catch (err) {
      setError(t.errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoAdmin = async () => {
    setError('');
    setIsLoading(true);
    try {
      await login(t.adminEmail, t.demoPassword);
    } catch (err) {
      setError(t.errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoCustomer = async () => {
    setError('');
    setIsLoading(true);
    try {
      await login(t.customerEmail, t.demoPassword);
    } catch (err) {
      setError(t.errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t.title}</CardTitle>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-3">
            <div className="space-y-2">
              <Label htmlFor="email">{t.emailLabel}</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">{t.passwordLabel}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs focus:outline-none"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Cargando...' : t.loginButton}
            </Button>
          </form>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Demos</span>
            </div>
          </div>

          <Button 
            onClick={handleDemoAdmin} 
            variant="outline" 
            className="w-full"
            disabled={isLoading}
          >
            <Shield className="mr-2 h-4 w-4"/>
            {t.adminButtonText}
          </Button>

          <Button 
            onClick={handleDemoCustomer} 
            variant="outline" 
            className="w-full"
            disabled={isLoading}
          >
            <User className="mr-2 h-4 w-4"/>
            {t.customerButtonText}
          </Button>

          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground text-center">
              {t.demoCredentials}
            </p>
          </div>

          <Button variant="ghost" className="w-full" asChild>
            <Link href="/">{t.backButton}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
