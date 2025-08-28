
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
          <CardTitle>Ocurrió un Error</CardTitle>
          <CardDescription>Algo salió mal al intentar cargar esta página.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-destructive/20 bg-destructive/5 p-4 text-center text-sm text-destructive">
            <p>{error.message || 'No se proporcionaron detalles del error.'}</p>
          </div>
          <Button onClick={() => reset()} className="mt-6 w-full">
            Intentar de Nuevo
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
