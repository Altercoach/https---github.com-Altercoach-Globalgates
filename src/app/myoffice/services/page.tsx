'use client';

import { useSite } from '@/hooks/use-site';
import { RouteGuard } from '@/components/auth/route-guard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/hooks/use-language';
import { PlusCircle, Trash2, Eye, EyeOff, Info } from 'lucide-react';
import { Alert, AlertTitle } from '@/components/ui/alert';
import type { Service, MultilingualString } from '@/lib/types';

const labels = {
  es: {
    pageTitle: 'Soluciones',
    pageSubtitle: 'Administra las soluciones que muestras en tu sitio.',
    addService: 'Agregar Solucion',
    deleteService: 'Eliminar',
    saveChanges: 'Guardar Cambios',
    nameLabel: 'Titulo',
    descriptionLabel: 'Descripcion (primera viñeta)',
    visibleLabel: 'Visible en la pagina',
    editingLanguage: 'Editando contenido en',
    noServices: 'No hay soluciones. Agrega una.',
    featuresLabel: 'Caracteristicas',
    addFeature: 'Agregar Caracteristica',
  },
  en: {
    pageTitle: 'Solutions',
    pageSubtitle: 'Manage the solutions you display on your site.',
    addService: 'Add Solution',
    deleteService: 'Delete',
    saveChanges: 'Save Changes',
    nameLabel: 'Title',
    descriptionLabel: 'Description (first bullet)',
    visibleLabel: 'Visible on page',
    editingLanguage: 'You are editing content in',
    noServices: 'No solutions yet. Add one.',
    featuresLabel: 'Features',
    addFeature: 'Add Feature',
  },
  fr: {
    pageTitle: 'Solutions',
    pageSubtitle: 'Gerez les solutions que vous affichez sur votre site.',
    addService: 'Ajouter une Solution',
    deleteService: 'Supprimer',
    saveChanges: 'Enregistrer les Modifications',
    nameLabel: 'Titre',
    descriptionLabel: 'Description (premiere puce)',
    visibleLabel: 'Visible sur la page',
    editingLanguage: 'Vous editez le contenu en',
    noServices: 'Aucune solution. Ajoutez-en une.',
    featuresLabel: 'Caracteristiques',
    addFeature: 'Ajouter une Caracteristique',
  },
};

function newService(): Service {
  return {
    id: `svc_${Date.now()}`,
    title: { es: '', en: '', fr: '' },
    bullets: [{ es: '', en: '', fr: '' }],
    features: [],
    visible: true,
  };
}

export default function ServicesEditorPage() {
  const { site, setSite } = useSite();
  const { language } = useLanguage();
  const langCode = language.code as keyof MultilingualString;
  const t = labels[langCode as keyof typeof labels] ?? labels.es;
  const services: Service[] = site.services ?? [];

  const addService = () => {
    setSite(prev => ({ ...prev, services: [...(prev.services ?? []), newService()] }));
  };

  const deleteService = (id: string) => {
    setSite(prev => ({ ...prev, services: (prev.services ?? []).filter(s => s.id !== id) }));
  };

  const updateService = (id: string, field: keyof Service, value: unknown) => {
    setSite(prev => ({
      ...prev,
      services: (prev.services ?? []).map(s =>
        s.id === id ? { ...s, [field]: value } : s
      ),
    }));
  };

  // Update title (MultilingualString)
  const updateTitle = (id: string, value: string) => {
    setSite(prev => ({
      ...prev,
      services: (prev.services ?? []).map(s =>
        s.id === id
          ? { ...s, title: { ...s.title, [langCode]: value } }
          : s
      ),
    }));
  };

  // Update first bullet (description)
  const updateDescription = (id: string, value: string) => {
    setSite(prev => ({
      ...prev,
      services: (prev.services ?? []).map(s => {
        if (s.id !== id) return s;
        const bullets = [...(s.bullets ?? [{ es: '', en: '', fr: '' }])];
        bullets[0] = { ...(bullets[0] ?? { es: '', en: '', fr: '' }), [langCode]: value };
        return { ...s, bullets };
      }),
    }));
  };

  const addFeature = (id: string) => {
    setSite(prev => ({
      ...prev,
      services: (prev.services ?? []).map(s =>
        s.id === id ? { ...s, features: [...(s.features ?? []), ''] } : s
      ),
    }));
  };

  const updateFeature = (id: string, idx: number, value: string) => {
    setSite(prev => ({
      ...prev,
      services: (prev.services ?? []).map(s => {
        if (s.id !== id) return s;
        const features = [...(s.features ?? [])];
        features[idx] = value;
        return { ...s, features };
      }),
    }));
  };

  const deleteFeature = (id: string, idx: number) => {
    setSite(prev => ({
      ...prev,
      services: (prev.services ?? []).map(s => {
        if (s.id !== id) return s;
        const features = (s.features ?? []).filter((_, i) => i !== idx);
        return { ...s, features };
      }),
    }));
  };

  return (
    <RouteGuard requireAuth requireRole="admin">
      <div className="space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-headline">{t.pageTitle}</h1>
            <p className="text-muted-foreground">{t.pageSubtitle}</p>
          </div>
          <Button onClick={addService}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {t.addService}
          </Button>
        </header>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>{`${t.editingLanguage} ${language.name}`}</AlertTitle>
        </Alert>

        {services.length === 0 && (
          <p className="text-muted-foreground text-center py-8">{t.noServices}</p>
        )}

        {services.map(service => (
          <Card key={service.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{service.title?.[langCode] || t.nameLabel}</span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteService(service.id)}
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  {t.deleteService}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>{t.nameLabel}</Label>
                <Input
                  value={service.title?.[langCode] ?? ''}
                  onChange={e => updateTitle(service.id, e.target.value)}
                />
              </div>
              <div>
                <Label>{t.descriptionLabel}</Label>
                <Textarea
                  value={service.bullets?.[0]?.[langCode] ?? ''}
                  onChange={e => updateDescription(service.id, e.target.value)}
                  rows={3}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={service.visible ?? true}
                  onCheckedChange={val => updateService(service.id, 'visible', val)}
                />
                <Label>{t.visibleLabel}</Label>
                {service.visible ? (
                  <Eye className="h-4 w-4 text-green-600" />
                ) : (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div>
                <Label>{t.featuresLabel}</Label>
                <div className="space-y-2 mt-1">
                  {(service.features ?? []).map((feat, idx) => (
                    <div key={idx} className="flex gap-2">
                      <Input
                        value={feat}
                        onChange={e => updateFeature(service.id, idx, e.target.value)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteFeature(service.id, idx)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => addFeature(service.id)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {t.addFeature}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </RouteGuard>
  );
}
