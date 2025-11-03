
'use client';

import { useState, useEffect } from 'react';
import { useSite } from '@/hooks/use-site';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ArrowLeft, Save, Loader2, Check } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { saveSiteContent } from '@/lib/actions';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function ReviewAndSavePage() {
  const { site, setHasUnsavedChanges } = useSite();
  const [jsonString, setJsonString] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Stringify the site object to display it.
    setJsonString(JSON.stringify(site, null, 2));
  }, [site]);
  
  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const result = await saveSiteContent(site);
      if (result.success) {
        toast({
          title: '¡Cambios Guardados!',
          description: 'Tu contenido ha sido guardado permanentemente en el código fuente.',
        });
        setHasUnsavedChanges(false);
        // Optional: redirect or reload to confirm changes are loaded from file
        window.location.reload();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Failed to save changes:', error);
      toast({
        title: 'Error al Guardar',
        description: (error as Error).message || 'No se pudieron guardar los cambios en el archivo.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };


  return (
    <div className="space-y-6">
      <header>
        <Button variant="outline" size="sm" asChild className="mb-4">
          <Link href="/myoffice">
            <ArrowLeft className="mr-2" /> Volver a la Oficina
          </Link>
        </Button>
        <h1 className="font-headline text-3xl font-bold">Revisar y Guardar Cambios</h1>
        <p className="text-muted-foreground">Aquí puedes revisar el objeto de configuración completo y guardarlo permanentemente.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Configuración Actual del Sitio (JSON)</CardTitle>
          <CardDescription>
            Este es el contenido que se escribirá en el archivo <strong>src/lib/site-content.ts</strong>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="mt-2 h-[400px] w-full overflow-auto rounded-md bg-slate-950 p-4">
            <code className="text-white">{jsonString}</code>
          </pre>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>Guardar Cambios Permanentemente</CardTitle>
            <CardDescription>
                Esta acción sobrescribirá el archivo de contenido por defecto en el servidor. Los cambios persistirán después de recargar la página.
            </CardDescription>
        </CardHeader>
        <CardFooter>
            <Button size="lg" onClick={handleSaveChanges} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="mr-2" />
                  Guardar Cambios en el Código
                </>
              )}
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
