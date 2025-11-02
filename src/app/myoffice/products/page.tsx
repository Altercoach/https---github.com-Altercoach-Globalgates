
'use client';

import { useState, useEffect } from 'react';
import { useSite } from '@/hooks/use-site';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import type { SiteData, Product, ProductFeature, MultilingualString } from '@/lib/types';
import { PlusCircle, Trash2, FileText, Info, Eye, EyeOff, GripVertical, Save } from 'lucide-react';
import { defaultFeatures } from '@/lib/constants';
import { useLanguage } from '@/hooks/use-language';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const labels = {
  es: {
    pageTitle: "Planes y Servicios",
    pageSubtitle: "Gestiona los planes y servicios que ofreces. Arrastra para reordenar.",
    addProduct: "Añadir Plan",
    newProduct: "Nuevo Plan",
    newProductDesc: "Una breve descripción.",
    newProductDetail: "Descripción detallada del nuevo plan.",
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
    productTypes: { one: 'Pago Único', sub: 'Suscripción', info: 'Informativo' },
    stageOptions: { onboarding: 'Al contratar', campaign_start: 'Al iniciar campaña', campaign_end: 'Al finalizar campaña', on_demand: 'Bajo demanda' },
    editingLanguage: "Estás editando el contenido en",
    visible: "Visible en la página principal"
  },
  en: {
    pageTitle: "Plans & Services",
    pageSubtitle: "Manage the plans and services you offer. Drag to reorder.",
    addProduct: "Add Plan",
    newProduct: "New Plan",
    newProductDesc: "A short description.",
    newProductDetail: "Detailed description of the new plan.",
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
    productTypes: { one: 'One-time Payment', sub: 'Subscription', info: 'Informational' },
    stageOptions: { onboarding: 'Onboarding', campaign_start: 'On campaign start', campaign_end: 'On campaign end', on_demand: 'On demand' },
    editingLanguage: "You are editing the content in",
    visible: "Visible on homepage"
  },
  fr: {
    pageTitle: "Forfaits et Services",
    pageSubtitle: "Gérez les forfaits et les services que vous proposez. Faites glisser pour réorganiser.",
    addProduct: "Ajouter un Forfait",
    newProduct: "Nouveau Forfait",
    newProductDesc: "Une courte description.",
    newProductDetail: "Description détaillée du nouveau forfait.",
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
    productTypes: { one: 'Paiement Unique', sub: 'Abonnement', info: 'Informationnel' },
    stageOptions: { onboarding: 'À l\'intégration', campaign_start: 'Au début de la campagne', campaign_end: 'À la fin de la campagne', on_demand: 'À la demande' },
    editingLanguage: "Vous éditez le contenu en",
    visible: "Visible sur la page d'accueil"
  }
};

const SortableProductItem = ({ product, children }: { product: Product, children: React.ReactNode }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: product.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="flex items-center gap-2">
        <button {...listeners} className="cursor-grab p-2 text-muted-foreground hover:bg-muted rounded-md">
          <GripVertical />
        </button>
        <div className="flex-grow">{children}</div>
      </div>
    </div>
  );
};

export default function ProductsEditorPage() {
  const { site, saveSite, setSite } = useSite();
  const [draft, setDraft] = useState<SiteData['products']>(() => {
    // Ensure every product has features
    const productsWithFeatures = site.products.map(p => {
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
        return p;
    });
    return JSON.parse(JSON.stringify(productsWithFeatures));
  });
  
  const { language } = useLanguage();
  const langCode = language.code as keyof MultilingualString;
  const t = labels[langCode] || labels.en;
  const [openAccordionItem, setOpenAccordionItem] = useState<string | undefined>();

  const stageOptions = Object.entries(t.stageOptions).map(([value, label]) => ({ value, label }));

  useEffect(() => {
    const productsWithFeatures = site.products.map(p => {
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
        return p;
    });
    setDraft(JSON.parse(JSON.stringify(productsWithFeatures)));
  }, [site.products]);


  const handleUpdate = (updater: (currentDraft: Product[]) => Product[]) => {
    setDraft(updater);
  };
  
  const handleProductUpdate = (id: string, field: keyof Product, value: any, isMultilingual: boolean) => {
    handleUpdate(prev => 
        prev.map(p => {
          if (p.id === id) {
            if (isMultilingual) {
              const multilingualValue = p[field as keyof Product] as MultilingualString;
              return { ...p, [field]: { ...multilingualValue, [langCode]: value } };
            }
            return { ...p, [field]: value };
          }
          return p;
        })
    );
  };

  const handleFeatureToggle = (productId: string, featureId: string, enabled: boolean) => {
    handleUpdate(prev => 
        prev.map(p => {
            if (p.id === productId && p.features) {
                const newFeatures = p.features.map(f => 
                    f.id === featureId ? { ...f, enabled } : f
                );
                return { ...p, features: newFeatures };
            }
            return p;
        })
    );
  };

  const handleFeatureStageChange = (productId: string, featureId: string, stage: ProductFeature['stage']) => {
     handleUpdate(prev => 
        prev.map(p => {
            if (p.id === productId && p.features) {
                const newFeatures = p.features.map(f => 
                    f.id === featureId ? { ...f, stage } : f
                );
                return { ...p, features: newFeatures };
            }
            return p;
        })
    );
  }

  const addNewProduct = () => {
    const newId = `prod_${Date.now()}`;
    const newProduct: Product = {
        id: newId,
        visible: true,
        name: { en: 'New Plan', es: 'Nuevo Plan', fr: 'Nouveau Forfait' },
        type: 'one',
        price: 100,
        badge: { en: 'New', es: 'Nuevo', fr: 'Nouveau' },
        note: { en: 'A short description.', es: 'Una breve descripción.', fr: 'Une courte description.' },
        description: { en: 'Detailed description of the new plan.', es: 'Descripción detallada del nuevo plan.', fr: 'Description détaillée du nouveau forfait.' },
        features: JSON.parse(JSON.stringify(defaultFeatures))
    };
    handleUpdate(prev => [newProduct, ...prev]);
    setOpenAccordionItem(newId);
  };

  const removeProduct = (id: string) => {
    handleUpdate(prev => prev.filter(p => p.id !== id));
  }

  const handleSaveChanges = () => {
    saveSite({ ...site, products: draft });
  };
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      handleUpdate(items => {
        const oldIndex = items.findIndex(p => p.id === active.id);
        const newIndex = items.findIndex(p => p.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

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

      <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>{`${t.editingLanguage} ${language.name}`}</AlertTitle>
      </Alert>

      <Card>
        <CardContent className="p-0">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={draft.map(p => p.id)} strategy={verticalListSortingStrategy}>
              <Accordion 
                  type="single" 
                  collapsible 
                  className="w-full"
                  value={openAccordionItem}
                  onValueChange={setOpenAccordionItem}
              >
                {draft.map(product => (
                  <SortableProductItem key={product.id} product={product}>
                    <AccordionItem value={product.id} className="border-b last:border-b-0">
                        <div className="flex items-center justify-between px-6 py-4 hover:bg-muted/50">
                            <AccordionTrigger className="flex-1 text-left p-0 hover:no-underline">
                                <div>
                                    <p className="font-semibold">{product.name[langCode] || product.name.en}</p>
                                    <p className="text-sm text-muted-foreground">{t.productTypes[product.type]}</p>
                                </div>
                            </AccordionTrigger>
                            <div className="flex items-center gap-4 pl-4">
                                <Switch
                                    id={`visible-${product.id}`}
                                    checked={product.visible}
                                    onCheckedChange={(checked) => handleProductUpdate(product.id, 'visible', checked, false)}
                                    aria-label={t.visible}
                                />
                                <Label htmlFor={`visible-${product.id}`} className="text-sm font-normal text-muted-foreground">
                                    {product.visible ? <Eye className="h-4 w-4"/> : <EyeOff className="h-4 w-4"/>}
                                </Label>
                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive flex-shrink-0" onClick={() => removeProduct(product.id)}>
                                    <Trash2 />
                                </Button>
                            </div>
                        </div>
                        <AccordionContent>
                          <div className="p-6 pt-2 space-y-4 bg-muted/20">
                              <div><Label>{t.nameLabel}</Label>
                                <Input 
                                  value={product.name[langCode]} 
                                  onChange={e => handleProductUpdate(product.id, 'name', e.target.value, true)} 
                                />
                              </div>

                              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                                <div><Label>{t.typeLabel}</Label>
                                    <Select value={product.type} onValueChange={(v) => handleProductUpdate(product.id, 'type', v, false)}>
                                        <SelectTrigger><SelectValue/></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="one">{t.productTypes.one}</SelectItem>
                                            <SelectItem value="sub">{t.productTypes.sub}</SelectItem>
                                            <SelectItem value="info">{t.productTypes.info}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div><Label>{t.priceLabel}</Label><Input type="number" value={product.price} onChange={e => handleProductUpdate(product.id, 'price', Number(e.target.value), false)} /></div>
                                <div><Label>{t.badgeLabel}</Label><Input value={product.badge[langCode]} onChange={e => handleProductUpdate(product.id, 'badge', e.target.value, true)} /></div>
                              </div>
                              <div><Label>{t.noteLabel}</Label><Input value={product.note[langCode]} onChange={e => handleProductUpdate(product.id, 'note', e.target.value, true)} /></div>
                              <div>
                                <Label>{t.fullDescLabel}</Label>
                                <Textarea value={product.description[langCode]} onChange={e => handleProductUpdate(product.id, 'description', e.target.value, true)} rows={4} />
                              </div>
                              
                              <Separator className="my-6 bg-border" />

                              <div>
                                  <h4 className="font-semibold text-md mb-4 flex items-center gap-2"><FileText className="h-5 w-5 text-accent"/> {t.includedFormsTitle}</h4>
                                  <div className="space-y-4">
                                      {(product.features || []).map(feature => (
                                          <div key={feature.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 rounded-md border bg-background p-4">
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
                          </div>
                        </AccordionContent>
                    </AccordionItem>
                  </SortableProductItem>
                ))}
              </Accordion>
            </SortableContext>
          </DndContext>
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button onClick={handleSaveChanges}><Save className="mr-2"/>{t.saveChanges}</Button>
      </div>
    </div>
  );
}

    