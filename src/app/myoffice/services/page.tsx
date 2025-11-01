
'use client';

import { useSite } from '@/hooks/use-site';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Service, MultilingualString } from '@/lib/types';
import { PlusCircle, Trash2, Info, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const labels = {
  es: {
    pageTitle: "Soluciones",
    pageSubtitle: "Gestiona las soluciones que muestras en tu página de inicio.",
    newFeature: "Nueva característica",
    addFeature: "Añadir Característica",
    editingLanguage: "Estás editando el contenido en",
    visible: "Visible en la página principal",
    addService: "Añadir Solución",
    deleteService: "Eliminar Solución",
    toastSuccessTitle: "¡Cambios guardados!",
    toastSuccessDescription: "Tus soluciones han sido actualizadas.",
  },
  en: {
    pageTitle: "Solutions",
    pageSubtitle: "Manage the solutions you display on your homepage.",
    newFeature: "New feature",
    addFeature: "Add Feature",
    editingLanguage: "You are editing the content in",
    visible: "Visible on homepage",
    addService: "Add Solution",
    deleteService: "Delete Solution",
    toastSuccessTitle: "Changes saved!",
    toastSuccessDescription: "Your solutions have been updated.",
  },
  fr: {
    pageTitle: "Solutions",
    pageSubtitle: "Gérez les solutions que vous affichez sur votre page d'accueil.",
    newFeature: "Nouvelle fonctionnalité",
    addFeature: "Ajouter une Caractéristique",
    editingLanguage: "Vous éditez le contenu en",
    visible: "Visible sur la page d'accueil",
    addService: "Ajouter une Solution",
    deleteService: "Supprimer la Solution",
    toastSuccessTitle: "Changements enregistrés !",
    toastSuccessDescription: "Vos solutions ont été mises à jour.",
  }
};

export default function ServicesEditorPage() {
  const { site, setSite } = useSite();
  const { language } = useLanguage();
  const { toast } = useToast();
  const langCode = language.code as keyof MultilingualString;
  const t = labels[langCode] || labels.en;
  
  const handleUpdate = (updater: (prev: Service[]) => Service[], silent: boolean = false) => {
    setSite(prevSite => {
      const newSite = { ...prevSite, services: updater(prevSite.services) };
      if (!silent) {
        toast({ title: t.toastSuccessTitle, description: t.toastSuccessDescription });
      }
      return newSite;
    });
  };
  
  const handleTextUpdate = (serviceId: string, field: 'title', value: any) => {
    const updater = (services: Service[]) => services.map(s => {
      if (s.id === serviceId) {
        const newTitle = { ...s.title, [langCode]: value };
        return { ...s, title: newTitle };
      }
      return s;
    });
    handleUpdate(updater);
  };
  
  const handleVisibilityToggle = (serviceId: string, checked: boolean) => {
    const updater = (services: Service[]) => services.map(s => 
      s.id === serviceId ? { ...s, visible: checked } : s
    );
    handleUpdate(updater);
  };

  const handleBulletChange = (serviceId: string, bulletIndex: number, newText: string) => {
    const updater = (services: Service[]) => services.map(s => {
      if (s.id === serviceId) {
        const newBullets = [...s.bullets];
        newBullets[bulletIndex] = { ...newBullets[bulletIndex], [langCode]: newText };
        return { ...s, bullets: newBullets };
      }
      return s;
    });
     handleUpdate(updater);
  };

  const addBullet = (serviceId: string) => {
    const updater = (services: Service[]) => services.map(s => {
      if(s.id === serviceId) {
        return {...s, bullets: [...s.bullets, { es: t.newFeature, en: 'New Feature', fr: 'Nouvelle fonctionnalité'}]}
      }
      return s;
    });
    handleUpdate(updater);
  };

  const removeBullet = (serviceId: string, bulletIndex: number) => {
    const updater = (services: Service[]) => services.map(s => {
      if(s.id === serviceId) {
        return {...s, bullets: s.bullets.filter((_, i) => i !== bulletIndex)}
      }
      return s;
    });
    handleUpdate(updater);
  };

  const addNewService = () => {
    const newService: Service = {
      id: `svc_${Date.now()}`,
      visible: true,
      title: { es: 'Nueva Solución', en: 'New Solution', fr: 'Nouvelle Solution' },
      bullets: [{ es: 'Nueva característica', en: 'New feature', fr: 'Nouvelle fonctionnalité' }]
    };
    const updater = (services: Service[]) => [...services, newService];
    handleUpdate(updater);
  };

  const removeService = (serviceId: string) => {
    const updater = (services: Service[]) => services.filter(s => s.id !== serviceId);
    handleUpdate(updater);
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold font-headline">{t.pageTitle}</h1>
            <p className="text-muted-foreground">{t.pageSubtitle}</p>
        </div>
         <Button onClick={addNewService}>
            <PlusCircle className="mr-2" />
            {t.addService}
        </Button>
      </header>

      <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>{`${t.editingLanguage} ${language.name}`}</AlertTitle>
      </Alert>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {site.services.map((service) => (
          <Card key={service.id}>
            <CardHeader>
               <div className="flex items-start justify-between gap-2">
                 <Input 
                    className="text-lg font-bold border-0 px-0"
                    value={service.title[langCode]} 
                    onChange={e => handleTextUpdate(service.id, 'title', e.target.value)} 
                  />
                  <Button variant="ghost" size="icon" className="shrink-0 text-destructive hover:text-destructive" onClick={() => removeService(service.id)} aria-label={t.deleteService}>
                      <Trash2 className="h-4 w-4" />
                  </Button>
               </div>
              <div className="flex items-center space-x-2 pt-2">
                <Switch 
                  id={`visible-${service.id}`} 
                  checked={service.visible}
                  onCheckedChange={(checked) => handleVisibilityToggle(service.id, checked)}
                />
                <Label htmlFor={`visible-${service.id}`} className="text-sm font-normal text-muted-foreground flex items-center">
                  {service.visible ? <Eye className="mr-2 h-4 w-4"/> : <EyeOff className="mr-2 h-4 w-4"/>}
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
    </div>
  );
}
