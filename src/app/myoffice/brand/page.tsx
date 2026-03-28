'use client';

import { useSite } from '@/hooks/use-site';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { Upload, Info } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { Alert, AlertTitle } from '@/components/ui/alert';

const labels = {
  es: {
    pageTitle: 'Marca y Héroe',
    pageSubtitle: 'Gestiona tu identidad de marca y el contenido de la sección principal.',
    brandDetailsTitle: 'Detalles de la Marca',
    brandDetailsSubtitle: 'Esta información se utiliza en todo tu sitio.',
    brandNameLabel: 'Nombre de la Marca',
    taglineLabel: 'Eslogan',
    heroSectionTitle: 'Sección Héroe',
    heroSectionSubtitle: 'Esto es lo primero que ven los visitantes en tu página de inicio.',
    heroTitleLabel: 'Título del Héroe',
    heroSubtitleLabel: 'Subtítulo del Héroe',
    heroImageLabel: 'Imagen del Héroe',
    heroImageRecommended: 'Tamaño recomendado: 1200x800px.',
    uploadImage: 'Subir Imagen',
    changeImage: 'Cambiar Imagen',
    editingLanguage: 'Estás editando el contenido en',
  },
  en: {
    pageTitle: 'Brand & Hero',
    pageSubtitle: 'Manage your brand identity and hero section content.',
    brandDetailsTitle: 'Brand Details',
    brandDetailsSubtitle: 'This information is used throughout your site.',
    brandNameLabel: 'Brand Name',
    taglineLabel: 'Tagline',
    heroSectionTitle: 'Hero Section',
    heroSectionSubtitle: 'This is the first thing visitors see on your homepage.',
    heroTitleLabel: 'Hero Title',
    heroSubtitleLabel: 'Hero Subtitle',
    heroImageLabel: 'Hero Image',
    heroImageRecommended: 'Recommended size: 1200x800px.',
    uploadImage: 'Upload Image',
    changeImage: 'Change Image',
    editingLanguage: 'You are editing content in',
  },
  fr: {
    pageTitle: 'Marque & Héros',
    pageSubtitle: 'Gérez votre identité de marque et le contenu de la section héros.',
    brandDetailsTitle: 'Détails de la Marque',
    brandDetailsSubtitle: 'Ces informations sont utilisées sur tout votre site.',
    brandNameLabel: 'Nom de la Marque',
    taglineLabel: 'Slogan',
    heroSectionTitle: 'Section Héros',
    heroSectionSubtitle: 'La première chose que les visiteurs voient sur votre page d\'accueil.',
    heroTitleLabel: 'Titre du Héros',
    heroSubtitleLabel: 'Sous-titre du Héros',
    heroImageLabel: 'Image du Héros',
    heroImageRecommended: 'Taille recommandée: 1200x800px.',
    uploadImage: 'Télécharger une Image',
    changeImage: 'Changer l\'Image',
    editingLanguage: 'Vous éditez le contenu en',
  },
};

export default function BrandEditorPage() {
  const { site, setSite } = useSite();
  const { language } = useLanguage();
  const langCode = language.code as keyof typeof labels;
  const t = labels[langCode] ?? labels.es;

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setSite(prev => ({ ...prev, brand: { ...prev.brand, heroImage: url } }));
  };

  const triggerFilePicker = () => {
    document.getElementById('heroImagePicker')?.click();
  };

  const handleTextChange = (
    subField: 'name' | 'tagline' | 'heroTitle' | 'heroSubtitle',
    value: string
  ) => {
    setSite(prev => ({
      ...prev,
      brand: {
        ...prev.brand,
        [subField]: {
          ...prev.brand[subField],
          [langCode]: value,
        },
      },
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
          <div>
            <Label>{t.brandNameLabel}</Label>
            <Input
              value={site.brand?.name?.[langCode] ?? ''}
              onChange={e => handleTextChange('name', e.target.value)}
            />
          </div>
          <div>
            <Label>{t.taglineLabel}</Label>
            <Input
              value={site.brand?.tagline?.[langCode] ?? ''}
              onChange={e => handleTextChange('tagline', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t.heroSectionTitle}</CardTitle>
          <CardDescription>{t.heroSectionSubtitle}</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label>{t.heroTitleLabel}</Label>
              <Input
                value={site.brand?.heroTitle?.[langCode] ?? ''}
                onChange={e => handleTextChange('heroTitle', e.target.value)}
              />
            </div>
            <div>
              <Label>{t.heroSubtitleLabel}</Label>
              <Textarea
                value={site.brand?.heroSubtitle?.[langCode] ?? ''}
                onChange={e => handleTextChange('heroSubtitle', e.target.value)}
                rows={5}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>{t.heroImageLabel}</Label>
            <Card className="flex h-[200px] items-center justify-center rounded-lg border-2 border-dashed">
              {site.brand?.heroImage ? (
                <div className="relative h-full w-full">
                  <Image
                    src={site.brand.heroImage}
                    alt="Vista previa del Héroe"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="rounded-md object-contain p-2"
                  />
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">{t.heroImageRecommended}</p>
                  <Button variant="outline" size="sm" className="mt-2" onClick={triggerFilePicker}>
                    <Upload className="mr-2 h-4 w-4" />
                    {t.uploadImage}
                  </Button>
                  <input id="heroImagePicker" type="file" accept="image/*" onChange={handleImagePick} className="hidden" />
                </div>
              )}
            </Card>
            {site.brand?.heroImage && (
              <div className="text-center">
                <Button variant="outline" size="sm" className="mt-2" onClick={triggerFilePicker}>
                  <Upload className="mr-2 h-4 w-4" />
                  {t.changeImage}
                </Button>
                <input id="heroImagePicker" type="file" accept="image/*" onChange={handleImagePick} className="hidden" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
