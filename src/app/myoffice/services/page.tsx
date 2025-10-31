
'use client';

import { useState, useEffect } from 'react';
import { useSite } from '@/hooks/use-site';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { SiteData, Service, MultilingualString } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2, Info, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const labels = {
  es: {
    pageTitle: "Servicios",
    pageSubtitle: "Gestiona los servicios que muestras en tu página de inicio.",
    newFeature: "Nueva característica",
    addFeature: "Añadir Característica",
    saveChanges: "Guardar Cambios",
    toastSuccessTitle: "¡Cambios guardados!",
    toastSuccessDescription: "Tus servicios han sido actualizados.",
    editingLanguage: "Estás editando el contenido en",
    visible: "Visible en la página principal"
  },
  en: {
    pageTitle: "Services",
    pageSubtitle: "Manage the services you display on your homepage.",
    newFeature: "New feature",
    addFeature: "Add Feature",
    saveChanges: "Save Changes",
    toastSuccessTitle: "Changes saved!",
    toastSuccessDescription: "Your services have been updated.",
    editingLanguage: "You are editing the content in",
    visible: "Visible on homepage"
  },
  fr: {
    pageTitle: "Services",
    pageSubtitle: "Gérez les services que vous affichez sur votre page d'accueil.",
    newFeature: "Nouvelle fonctionnalité",
    addFeature: "Ajouter une Caractéristique",
    saveChanges: "Enregistrer les Modifications",
    toastSuccessTitle: "Changements enregistrés !",
    toastSuccessDescription: "Vos services ont été mis à jour.",
    editingLanguage: "Vous éditez le contenu en",
    visible: "Visible sur la page d'accueil"
  }
};

export default function ServicesEditorPage() {
  const { site, setSite } = useSite();
  const [draft, setDraft] = useState<SiteData>(() => JSON.parse(JSON.stringify(site)));
  const { toast } = useToast();
  const { language } = useLanguage();
  const langCode = language.code as keyof MultilingualString;
  const t = labels[langCode] || labels.en;

  useEffect(() => {
    setDraft(JSON.parse(JSON.stringify(site)));
  }, [site]);

  const saveChanges = () => {
    setSite(draft);
    toast({ title: t.toastSuccessTitle, description: t.toastSuccessDescription });
  };
  
  const handleTextUpdate = (serviceId: string, field: keyof Service, value: any) => {
    setDraft(prev => ({
      ...prev,
      services: prev.services.map(s => {
        if (s.id === serviceId) {
          if (field === 'title') {
            return { ...s, title: { ...s.title, [langCode]: value }};
          }
        }
        return s;
      })
    }));
  };
  
  const handleVisibilityToggle = (serviceId: string, checked: boolean) => {
    const updatedServices = site.services.map(s => 
      s.id === serviceId ? { ...s, visible: checked } : s
    );
    setSite(prev => ({ ...prev, services: updatedServices }));
  };


  const handleBulletChange = (serviceId: string, bulletIndex: number, newText: string) => {
    setDraft(prev => ({
      ...prev,
      services: prev.services.map(s => {
        if (s.id === serviceId) {
          const newBullets = [...s.bullets];
          newBullets[bulletIndex] = { ...newBullets[bulletIndex], [langCode]: newText };
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
                return {...s, bullets: [...s.bullets, { es: t.newFeature, en: 'New Feature', fr: 'Nouvelle fonctionnalité'}]}
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

      <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>{`${t.editingLanguage} ${language.name}`}</AlertTitle>
      </Alert>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {draft.services.map((service) => (
          <Card key={service.id}>
            <CardHeader>
              <Input 
                className="text-lg font-bold border-0 px-0"
                value={service.title[langCode]} 
                onChange={e => handleTextUpdate(service.id, 'title', e.target.value)} 
              />
              <div className="flex items-center space-x-2 pt-2">
                <Switch 
                  id={`visible-${service.id}`} 
                  checked={site.services.find(s => s.id === service.id)?.visible ?? false}
                  onCheckedChange={(checked) => handleVisibilityToggle(service.id, checked)}
                />
                <Label htmlFor={`visible-${service.id}`} className="text-sm font-normal text-muted-foreground flex items-center">
                  {(site.services.find(s => s.id === service.id)?.visible ?? false) ? <Eye className="mr-2 h-4 w-4"/> : <EyeOff className="mr-2 h-4 w-4"/>}
                  {t.visible}
                </Label>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {service.bullets.map((bullet, b_idx) => (
                <div key={b_idx} className="flex items-center gap-2">
                    <Input 
                        value={bullet[langCode]} 
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
