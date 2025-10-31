
'use client';

import { useState, useEffect } from 'react';
import { useSite } from '@/hooks/use-site';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { SiteData, Service } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

const labels = {
  es: {
    pageTitle: "Servicios",
    pageSubtitle: "Gestiona los servicios que muestras en tu página de inicio.",
    newFeature: "Nueva característica",
    addFeature: "Añadir Característica",
    saveChanges: "Guardar Cambios",
    toastSuccessTitle: "¡Cambios guardados!",
    toastSuccessDescription: "Tus servicios han sido actualizados."
  },
  en: {
    pageTitle: "Services",
    pageSubtitle: "Manage the services you display on your homepage.",
    newFeature: "New feature",
    addFeature: "Add Feature",
    saveChanges: "Save Changes",
    toastSuccessTitle: "Changes saved!",
    toastSuccessDescription: "Your services have been updated."
  },
  fr: {
    pageTitle: "Services",
    pageSubtitle: "Gérez les services que vous affichez sur votre page d'accueil.",
    newFeature: "Nouvelle fonctionnalité",
    addFeature: "Ajouter une Caractéristique",
    saveChanges: "Enregistrer les Modifications",
    toastSuccessTitle: "Changements enregistrés !",
    toastSuccessDescription: "Vos services ont été mis à jour."
  }
};

export default function ServicesEditorPage() {
  const { site, setSite } = useSite();
  const [draft, setDraft] = useState<SiteData>(() => JSON.parse(JSON.stringify(site)));
  const { toast } = useToast();
  const { language } = useLanguage();
  const t = labels[language.code as keyof typeof labels] || labels.en;

  useEffect(() => {
    setDraft(JSON.parse(JSON.stringify(site)));
  }, [site]);

  const saveChanges = () => {
    setSite(draft);
    toast({ title: t.toastSuccessTitle, description: t.toastSuccessDescription });
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
                return {...s, bullets: [...s.bullets, t.newFeature]}
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
        <h1 className="text-3xl font-bold font-headline">{t.pageTitle}</h1>
        <p className="text-muted-foreground">{t.pageSubtitle}</p>
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
                <PlusCircle className="mr-2 h-4 w-4"/> {t.addFeature}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
       <div className="flex justify-end gap-2">
            <Button onClick={saveChanges}>{t.saveChanges}</Button>
        </div>
    </div>
  );
}
