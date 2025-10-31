'use client';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

const labels = {
  es: {
    title: "Ocurrió un Error",
    description: "Algo salió mal al intentar cargar esta página.",
    errorMessage: "No se proporcionaron detalles del error.",
    retry: "Intentar de Nuevo"
  },
  en: {
    title: "An Error Occurred",
    description: "Something went wrong when trying to load this page.",
    errorMessage: "No error details were provided.",
    retry: "Try Again"
  },
  fr: {
    title: "Une Erreur est Survenue",
    description: "Quelque chose s'est mal passé lors du chargement de cette page.",
    errorMessage: "Aucun détail sur l'erreur n'a été fourni.",
    retry: "Réessayer"
  }
}

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { language } = useLanguage();
  const t = labels[language.code as keyof typeof labels] || labels.en;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <CardTitle>{t.title}</CardTitle>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-destructive/20 bg-destructive/5 p-4 text-center text-sm text-destructive">
            <p>{error.message || t.errorMessage}</p>
          </div>
          <Button onClick={() => reset()} className="mt-6 w-full">
            {t.retry}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
