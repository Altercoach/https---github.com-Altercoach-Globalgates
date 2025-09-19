
'use client';

import { useState, useEffect } from 'react';
import { useSite } from '@/hooks/use-site';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import type { SiteData, Service } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2 } from 'lucide-react';

export default function ServicesEditorPage() {
  const { site, setSite } = useSite();
  const [draft, setDraft] = useState<SiteData>(() => JSON.parse(JSON.stringify(site)));
  const { toast } = useToast();

  useEffect(() => {
    setDraft(JSON.parse(JSON.stringify(site)));
  }, [site]);

  const saveChanges = () => {
    setSite(draft);
    toast({ title: '¡Cambios guardados!', description: 'Tus servicios han sido actualizados.' });
  };
  
  const handleServiceTitleChange = (serviceId: string, newTitle: string) => {
    setDraft(prev => ({
      ...prev,
      services: prev.services.map(s => s.id === serviceId ? { ...s, title: newTitle } : s)
    }));
  };

  const handleBulletChange = (serviceId: string, bulletIndex: number, newText: string) => {
    setDraft(prev => ({
      ...prev,
      services: prev.services.map(s => {
        if (s.id === serviceId) {
          const newBullets = [...s.bullets];
          newBullets[bulletIndex] = newText;
          return { ...s, bullets: newBullets };
        }
        return s;
      })
    }));
  };

  const addBullet = (serviceId: string) => {
    setDraft(prev => ({
        ...prev,
        services: prev.services.map(s => {
            if(s.id === serviceId) {
                return {...s, bullets: [...s.bullets, 'Nueva característica']}
            }
            return s;
        })
    }))
  };

  const removeBullet = (serviceId: string, bulletIndex: number) => {
    setDraft(prev => ({
        ...prev,
        services: prev.services.map(s => {
            if(s.id === serviceId) {
                return {...s, bullets: s.bullets.filter((_, i) => i !== bulletIndex)}
            }
            return s;
        })
    }))
  };


  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold font-headline">Servicios</h1>
        <p className="text-muted-foreground">Gestiona los servicios que muestras en tu página de inicio.</p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {draft.services.map((service) => (
          <Card key={service.id}>
            <CardHeader>
              <Input 
                className="text-lg font-bold border-0 px-0"
                value={service.title} 
                onChange={e => handleServiceTitleChange(service.id, e.target.value)} 
              />
            </CardHeader>
            <CardContent className="space-y-2">
              {service.bullets.map((bullet, b_idx) => (
                <div key={b_idx} className="flex items-center gap-2">
                    <Input 
                        value={bullet} 
                        className="border-0 px-0"
                        onChange={e => handleBulletChange(service.id, b_idx, e.target.value)}
                    />
                    <Button variant="ghost" size="icon" className="shrink-0 text-destructive hover:text-destructive" onClick={() => removeBullet(service.id, b_idx)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => addBullet(service.id)}>
                <PlusCircle className="mr-2 h-4 w-4"/> Añadir Característica
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
       <div className="flex justify-end gap-2">
            <Button onClick={saveChanges}>Guardar Cambios</Button>
        </div>
    </div>
  );
}
