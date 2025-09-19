
'use client';

import { useState, useEffect } from 'react';
import { useSite } from '@/hooks/use-site';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import type { SiteData } from '@/lib/types';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Upload } from 'lucide-react';

export default function BrandEditorPage() {
  const { site, setSite } = useSite();
  const [draft, setDraft] = useState<SiteData>(() => JSON.parse(JSON.stringify(site)));
  const { toast } = useToast();

  useEffect(() => {
    setDraft(JSON.parse(JSON.stringify(site)));
  }, [site]);

  const saveChanges = () => {
    setSite(draft);
    toast({ title: '¡Cambios guardados!', description: 'Los detalles de tu marca han sido actualizados.' });
  };
  
  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const url = event.target?.result as string;
        setDraft(prev => ({ ...prev, brand: { ...prev.brand, heroImage: url } }));
    };
    reader.readAsDataURL(file);
  };
  
  const triggerFilePicker = () => {
    document.getElementById('heroImagePicker')?.click();
  }


  return (
    <div className="space-y-6">
        <header>
            <h1 className="text-3xl font-bold font-headline">Marca y Héroe</h1>
            <p className="text-muted-foreground">Gestiona tu identidad de marca y el contenido de la sección principal.</p>
        </header>

        <Card>
            <CardHeader>
                <CardTitle>Detalles de la Marca</CardTitle>
                <CardDescription>Esta información se utiliza en todo tu sitio.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div><Label>Nombre de la Marca</Label><Input className="border-0 px-0" value={draft.brand.name} onChange={e => setDraft(p => ({...p, brand: {...p.brand, name: e.target.value}}))} /></div>
                <div><Label>Eslogan</Label><Input className="border-0 px-0" value={draft.brand.tagline} onChange={e => setDraft(p => ({...p, brand: {...p.brand, tagline: e.target.value}}))} /></div>
            </CardContent>
        </Card>

         <Card>
            <CardHeader>
                <CardTitle>Sección Héroe</CardTitle>
                <CardDescription>Esto es lo primero que ven los visitantes en tu página de inicio.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div><Label>Título del Héroe</Label><Input className="border-0 px-0" value={draft.brand.heroTitle} onChange={e => setDraft(p => ({...p, brand: {...p.brand, heroTitle: e.target.value}}))} /></div>
                    <div><Label>Subtítulo del Héroe</Label><Textarea className="border-0 px-0" value={draft.brand.heroSubtitle} onChange={e => setDraft(p => ({...p, brand: {...p.brand, heroSubtitle: e.target.value}}))} rows={5} /></div>
                </div>
                 <div className="space-y-2">
                    <Label>Imagen del Héroe</Label>
                    <Card className="flex h-[200px] items-center justify-center rounded-lg border-2 border-dashed">
                      {draft.brand.heroImage ? (
                          <div className="relative h-full w-full">
                              <Image src={draft.brand.heroImage} alt="Vista previa del Héroe" fill className="rounded-md object-contain p-2" />
                          </div>
                      ) : (
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">Tamaño recomendado: 1200x800px.</p>
                            <Button variant="outline" size="sm" className="mt-2" onClick={triggerFilePicker}>
                                <Upload className="mr-2"/>
                                Subir Imagen
                            </Button>
                            <Input id="heroImagePicker" type="file" accept="image/*" onChange={handleImagePick} className="hidden"/>
                        </div>
                      )}
                    </Card>
                     {draft.brand.heroImage && (
                        <div className="text-center">
                            <Button variant="outline" size="sm" className="mt-2" onClick={triggerFilePicker}>
                                <Upload className="mr-2"/>
                                Cambiar Imagen
                            </Button>
                            <Input id="heroImagePicker" type="file" accept="image/*" onChange={handleImagePick} className="hidden"/>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
            <Button onClick={saveChanges}>Guardar Cambios</Button>
        </div>
    </div>
  );
}
