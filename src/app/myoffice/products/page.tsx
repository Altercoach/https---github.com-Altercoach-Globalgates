
'use client';

import { useState, useEffect } from 'react';
import { useSite } from '@/hooks/use-site';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import type { SiteData, Product, ProductFeature } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2, FileText } from 'lucide-react';
import { defaultFeatures } from '@/lib/constants';
import { useLanguage } from '@/hooks/use-language';

const labels = {
  es: {
    pageTitle: "Productos y Planes",
    pageSubtitle: "Gestiona los productos y planes de suscripción que ofreces.",
    addProduct: "Añadir Producto",
    newProduct: "Nuevo Producto",
    newProductDesc: "Una breve descripción.",
    newProductDetail: "Descripción detallada del nuevo producto.",
    newBadge: "Nuevo",
    nameLabel: "Nombre",
    typeLabel: "Tipo",
    priceLabel: "Precio (USD)",
    noteLabel: "Nota (Descripción corta)",
    badgeLabel: "Etiqueta",
    fullDescLabel: "Descripción Completa",
    includedFormsTitle: "Formularios Incluidos y Disparadores",
    activationStage: "Etapa de activación",
    saveChanges: "Guardar Cambios",
    toastSuccessTitle: "¡Cambios guardados!",
    toastSuccessDescription: "Tus productos han sido actualizados.",
    productTypes: { one: 'Pago Único', sub: 'Suscripción', info: 'Informativo' },
    stageOptions: { onboarding: 'Al contratar', campaign_start: 'Al iniciar campaña', campaign_end: 'Al finalizar campaña', on_demand: 'Bajo demanda' },
  },
  en: {
    pageTitle: "Products & Plans",
    pageSubtitle: "Manage the products and subscription plans you offer.",
    addProduct: "Add Product",
    newProduct: "New Product",
    newProductDesc: "A short description.",
    newProductDetail: "Detailed description of the new product.",
    newBadge: "New",
    nameLabel: "Name",
    typeLabel: "Type",
    priceLabel: "Price (USD)",
    noteLabel: "Note (Short description)",
    badgeLabel: "Badge",
    fullDescLabel: "Full Description",
    includedFormsTitle: "Included Forms & Triggers",
    activationStage: "Activation Stage",
    saveChanges: "Save Changes",
    toastSuccessTitle: "Changes saved!",
    toastSuccessDescription: "Your products have been updated.",
    productTypes: { one: 'One-time Payment', sub: 'Subscription', info: 'Informational' },
    stageOptions: { onboarding: 'Onboarding', campaign_start: 'On campaign start', campaign_end: 'On campaign end', on_demand: 'On demand' },
  },
  fr: {
    pageTitle: "Produits et Forfaits",
    pageSubtitle: "Gérez les produits et les plans d'abonnement que vous proposez.",
    addProduct: "Ajouter un Produit",
    newProduct: "Nouveau Produit",
    newProductDesc: "Une courte description.",
    newProductDetail: "Description détaillée du nouveau produit.",
    newBadge: "Nouveau",
    nameLabel: "Nom",
    typeLabel: "Type",
    priceLabel: "Prix (USD)",
    noteLabel: "Note (Description courte)",
    badgeLabel: "Badge",
    fullDescLabel: "Description Complète",
    includedFormsTitle: "Formulaires et Déclencheurs Inclus",
    activationStage: "Étape d'activation",
    saveChanges: "Enregistrer les Modifications",
    toastSuccessTitle: "Changements enregistrés !",
    toastSuccessDescription: "Vos produits ont été mis à jour.",
    productTypes: { one: 'Paiement Unique', sub: 'Abonnement', info: 'Informationnel' },
    stageOptions: { onboarding: 'À l\'intégration', campaign_start: 'Au début de la campagne', campaign_end: 'À la fin de la campagne', on_demand: 'À la demande' },
  }
};


export default function ProductsEditorPage() {
  const { site, setSite } = useSite();
  const [draft, setDraft] = useState<SiteData>(() => JSON.parse(JSON.stringify(site)));
  const { toast } = useToast();
  const { language } = useLanguage();
  const t = labels[language.code as keyof typeof labels] || labels.en;

  const stageOptions = Object.entries(t.stageOptions).map(([value, label]) => ({ value, label }));

  useEffect(() => {
    const siteWithFeatures = JSON.parse(JSON.stringify(site));
    siteWithFeatures.products.forEach((p: Product) => {
      if (!p.features) {
        p.features = JSON.parse(JSON.stringify(defaultFeatures));
      } else {
        const featureIds = p.features.map(f => f.id);
        defaultFeatures.forEach(df => {
          if (!featureIds.includes(df.id)) {
            p.features!.push(JSON.parse(JSON.stringify(df)));
          }
        });
      }
    });
    setDraft(siteWithFeatures);
  }, [site]);

  const saveChanges = () => {
    setSite(draft);
    toast({ title: t.toastSuccessTitle, description: t.toastSuccessDescription });
  };
  
  const handleProductUpdate = (id: string, field: keyof Product, value: any) => {
    setDraft(prev => ({
        ...prev,
        products: prev.products.map(p => p.id === id ? {...p, [field]: value} : p)
    }));
  };

  const handleFeatureToggle = (productId: string, featureId: string, enabled: boolean) => {
    setDraft(prev => {
        const newProducts = prev.products.map(p => {
            if (p.id === productId && p.features) {
                const newFeatures = p.features.map(f => 
                    f.id === featureId ? { ...f, enabled } : f
                );
                return { ...p, features: newFeatures };
            }
            return p;
        });
        return { ...prev, products: newProducts };
    });
  };

  const handleFeatureStageChange = (productId: string, featureId: string, stage: ProductFeature['stage']) => {
     setDraft(prev => {
        const newProducts = prev.products.map(p => {
            if (p.id === productId && p.features) {
                const newFeatures = p.features.map(f => 
                    f.id === featureId ? { ...f, stage } : f
                );
                return { ...p, features: newFeatures };
            }
            return p;
        });
        return { ...prev, products: newProducts };
    });
  }

  const addNewProduct = () => {
    const newProduct: Product = {
        id: `prod_${Date.now()}`,
        name: t.newProduct,
        type: 'one',
        price: 100,
        badge: t.newBadge,
        note: t.newProductDesc,
        description: t.newProductDetail,
        interval: 'month',
        features: JSON.parse(JSON.stringify(defaultFeatures))
    };
    setDraft(prev => ({...prev, products: [...prev.products, newProduct]}));
  };

  const removeProduct = (id: string) => {
    setDraft(prev => ({...prev, products: prev.products.filter(p => p.id !== id)}));
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
          <div>
            <h1 className="font-headline text-3xl font-bold">{t.pageTitle}</h1>
            <p className="text-muted-foreground">{t.pageSubtitle}</p>
          </div>
          <Button onClick={addNewProduct} variant="outline">
              <PlusCircle className="mr-2" />
              {t.addProduct}
          </Button>
      </header>

      <div className="space-y-4">
        {draft.products.map(product => (
            <Card key={product.id}>
                <CardHeader className="flex flex-row items-start justify-between">
                    <CardTitle className="text-lg leading-tight">{product.name}</CardTitle>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive flex-shrink-0" onClick={() => removeProduct(product.id)}>
                        <Trash2 />
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                      <div className="sm:col-span-2"><Label>{t.nameLabel}</Label><Input value={product.name} onChange={e => handleProductUpdate(product.id, 'name', e.target.value)} /></div>
                      <div><Label>{t.typeLabel}</Label>
                          <Select value={product.type} onValueChange={(v) => handleProductUpdate(product.id, 'type', v)}>
                              <SelectTrigger><SelectValue/></SelectTrigger>
                              <SelectContent>
                                  <SelectItem value="one">{t.productTypes.one}</SelectItem>
                                  <SelectItem value="sub">{t.productTypes.sub}</SelectItem>
                                  <SelectItem value="info">{t.productTypes.info}</SelectItem>
                              </SelectContent>
                          </Select>
                      </div>
                      <div><Label>{t.priceLabel}</Label><Input type="number" value={product.price} onChange={e => handleProductUpdate(product.id, 'price', Number(e.target.value))} /></div>
                      <div className="sm:col-span-2"><Label>{t.noteLabel}</Label><Input value={product.note} onChange={e => handleProductUpdate(product.id, 'note', e.target.value)} /></div>
                      <div className="sm:col-span-2"><Label>{t.badgeLabel}</Label><Input value={product.badge} onChange={e => handleProductUpdate(product.id, 'badge', e.target.value)} /></div>
                    </div>
                    <div>
                      <Label>{t.fullDescLabel}</Label>
                      <Textarea value={product.description} onChange={e => handleProductUpdate(product.id, 'description', e.target.value)} rows={4} />
                    </div>
                    
                    <Separator className="my-6" />

                    <div>
                        <h4 className="font-semibold text-md mb-4 flex items-center gap-2"><FileText className="h-5 w-5 text-accent"/> {t.includedFormsTitle}</h4>
                        <div className="space-y-4">
                            {(product.features || []).map(feature => (
                                <div key={feature.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 rounded-md border p-4">
                                    <Label htmlFor={`switch-${product.id}-${feature.id}`} className="font-normal flex flex-col">
                                        {feature.name}
                                        <span className="text-xs text-muted-foreground">ID: {feature.id}</span>
                                    </Label>
                                    <Switch
                                        id={`switch-${product.id}-${feature.id}`}
                                        checked={feature.enabled}
                                        onCheckedChange={(checked) => handleFeatureToggle(product.id, feature.id, checked)}
                                    />
                                     <Select
                                        value={feature.stage}
                                        onValueChange={(value: ProductFeature['stage']) => handleFeatureStageChange(product.id, feature.id, value)}
                                        disabled={!feature.enabled}
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder={t.activationStage} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {stageOptions.map(opt => (
                                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            ))}
                        </div>
                    </div>
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
