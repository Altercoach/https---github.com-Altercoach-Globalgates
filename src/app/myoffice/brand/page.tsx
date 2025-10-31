
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
import { Upload, Info } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const labels = {
  es: {
    pageTitle: "Marca y Héroe",
    pageSubtitle: "Gestiona tu identidad de marca y el contenido de la sección principal.",
    brandDetailsTitle: "Detalles de la Marca",
    brandDetailsSubtitle: "Esta información se utiliza en todo tu sitio.",
    brandNameLabel: "Nombre de la Marca",
    taglineLabel: "Eslogan",
    heroSectionTitle: "Sección Héroe",
    heroSectionSubtitle: "Esto es lo primero que ven los visitantes en tu página de inicio.",
    heroTitleLabel: "Título del Héroe",
    heroSubtitleLabel: "Subtítulo del Héroe",
    heroImageLabel: "Imagen del Héroe",
    heroImageRecommended: "Tamaño recomendado: 1200x800px.",
    uploadImage: "Subir Imagen",
    changeImage: "Cambiar Imagen",
    saveChanges: "Guardar Cambios",
    toastSuccessTitle: "¡Cambios guardados!",
    toastSuccessDescription: "Los detalles de tu marca han sido actualizados.",
    editingLanguage: "Estás editando el contenido en"
  },
  en: {
    pageTitle: "Brand & Hero",
    pageSubtitle: "Manage your brand identity and the content of the main section.",
    brandDetailsTitle: "Brand Details",
    brandDetailsSubtitle: "This information is used throughout your site.",
    brandNameLabel: "Brand Name",
    taglineLabel: "Tagline",
    heroSectionTitle: "Hero Section",
    heroSectionSubtitle: "This is the first thing visitors see on your homepage.",
    heroTitleLabel: "Hero Title",
    heroSubtitleLabel: "Hero Subtitle",
    heroImageLabel: "Hero Image",
    heroImageRecommended: "Recommended size: 1200x800px.",
    uploadImage: "Upload Image",
    changeImage: "Change Image",
    saveChanges: "Save Changes",
    toastSuccessTitle: "Changes saved!",
    toastSuccessDescription: "Your brand details have been updated.",
    editingLanguage: "You are editing the content in"
  },
  fr: {
    pageTitle: "Marque et Héro",
    pageSubtitle: "Gérez votre identité de marque et le contenu de la section principale.",
    brandDetailsTitle: "Détails de la Marque",
    brandDetailsSubtitle: "Ces informations sont utilisées sur tout votre site.",
    brandNameLabel: "Nom de la Marque",
    taglineLabel: "Slogan",
    heroSectionTitle: "Section Héro",
    heroSectionSubtitle: "C'est la première chose que les visiteurs voient sur votre page d'accueil.",
    heroTitleLabel: "Titre du Héro",
    heroSubtitleLabel: "Sous-titre du Héro",
    heroImageLabel: "Image du Héro",
    heroImageRecommended: "Taille recommandée : 1200x800px.",
    uploadImage: "Télécharger une Image",
    changeImage: "Changer d'Image",
    saveChanges: "Enregistrer les Modifications",
    toastSuccessTitle: "Changements enregistrés !",
    toastSuccessDescription: "Les détails de votre marque ont été mis à jour.",
    editingLanguage: "Vous éditez le contenu en"
  }
};


export default function BrandEditorPage() {
  const { site, setSite } = useSite();
  const [draft, setDraft] = useState<SiteData>(() => JSON.parse(JSON.stringify(site)));
  const { toast } = useToast();
  const { language } = useLanguage();
  const langCode = language.code;
  const t = labels[langCode] || labels.en;

  useEffect(() => {
    setDraft(JSON.parse(JSON.stringify(site)));
  }, [site]);

  const saveChanges = () => {
    setSite(draft);
    toast({ title: t.toastSuccessTitle, description: t.toastSuccessDescription });
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

  const handleTextChange = (field: keyof SiteData['brand'], subField: 'name' | 'tagline' | 'heroTitle' | 'heroSubtitle', value: string) => {
    setDraft(prev => ({
        ...prev,
        brand: {
            ...prev.brand,
            [subField]: {
                ...prev.brand[subField],
                [langCode]: value,
            }
        }
    }));
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

        <Card>
            <CardHeader>
                <CardTitle>{t.brandDetailsTitle}</CardTitle>
                <CardDescription>{t.brandDetailsSubtitle}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div><Label>{t.brandNameLabel}</Label><Input className="border-0 px-0" value={draft.brand.name[langCode]} onChange={e => handleTextChange('brand', 'name', e.target.value)} /></div>
                <div><Label>{t.taglineLabel}</Label><Input className="border-0 px-0" value={draft.brand.tagline[langCode]} onChange={e => handleTextChange('brand', 'tagline', e.target.value)} /></div>
            </CardContent>
        </Card>

         <Card>
            <CardHeader>
                <CardTitle>{t.heroSectionTitle}</CardTitle>
                <CardDescription>{t.heroSectionSubtitle}</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div><Label>{t.heroTitleLabel}</Label><Input className="border-0 px-0" value={draft.brand.heroTitle[langCode]} onChange={e => handleTextChange('brand', 'heroTitle', e.target.value)} /></div>
                    <div><Label>{t.heroSubtitleLabel}</Label><Textarea className="border-0 px-0" value={draft.brand.heroSubtitle[langCode]} onChange={e => handleTextChange('brand', 'heroSubtitle', e.target.value)} rows={5} /></div>
                </div>
                 <div className="space-y-2">
                    <Label>{t.heroImageLabel}</Label>
                    <Card className="flex h-[200px] items-center justify-center rounded-lg border-2 border-dashed">
                      {draft.brand.heroImage ? (
                          <div className="relative h-full w-full">
                              <Image src={draft.brand.heroImage} alt="Vista previa del Héroe" fill className="rounded-md object-contain p-2" />
                          </div>
                      ) : (
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">{t.heroImageRecommended}</p>
                            <Button variant="outline" size="sm" className="mt-2" onClick={triggerFilePicker}>
                                <Upload className="mr-2"/>
                                {t.uploadImage}
                            </Button>
                            <Input id="heroImagePicker" type="file" accept="image/*" onChange={handleImagePick} className="hidden"/>
                        </div>
                      )}
                    </Card>
                     {draft.brand.heroImage && (
                        <div className="text-center">
                            <Button variant="outline" size="sm" className="mt-2" onClick={triggerFilePicker}>
                                <Upload className="mr-2"/>
                                {t.changeImage}
                            </Button>
                            <Input id="heroImagePicker" type="file" accept="image/*" onChange={handleImagePick} className="hidden"/>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
            <Button onClick={saveChanges}>{t.saveChanges}</Button>
        </div>
    </div>
  );
}
