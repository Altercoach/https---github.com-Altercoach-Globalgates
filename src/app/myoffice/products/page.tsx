
'use client';

import { useState, useEffect } from 'react';
import { useSite } from '@/hooks/use-site';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import type { SiteData, Product, ProductFeature } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2, FileText } from 'lucide-react';

const defaultFeatures: ProductFeature[] = [
  { id: 'business-evaluation', name: 'Evaluación de Negocio (Doctor RX)', stage: 'onboarding', enabled: false },
  { id: 'brief-marketing', name: 'Brief de Marketing Profesional', stage: 'onboarding', enabled: false },
  { id: 'agent-training', name: 'Entrenamiento de Agente de IA', stage: 'onboarding', enabled: false },
  { id: 'satisfaction-survey', name: 'Encuesta de Satisfacción', stage: 'campaign_end', enabled: false },
];

const stageOptions = [
    { value: 'onboarding', label: 'Al contratar' },
    { value: 'campaign_start', label: 'Al iniciar campaña' },
    { value: 'campaign_end', label: 'Al finalizar campaña' },
    { value: 'on_demand', label: 'Bajo demanda' },
];

export default function ProductsEditorPage() {
  const { site, setSite } = useSite();
  const [draft, setDraft] = useState<SiteData>(() => JSON.parse(JSON.stringify(site)));
  const { toast } = useToast();

  useEffect(() => {
    // Ensure all products have a features array by merging with defaults
    const siteWithFeatures = JSON.parse(JSON.stringify(site));
    siteWithFeatures.products.forEach((p: Product) => {
      if (!p.features) {
        p.features = JSON.parse(JSON.stringify(defaultFeatures));
      } else {
        // Ensure all default features are present
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
    toast({ title: '¡Cambios guardados!', description: 'Tus productos han sido actualizados.' });
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
        name: 'Nuevo Producto',
        type: 'one',
        price: 100,
        badge: 'Nuevo',
        note: 'Una breve descripción.',
        description: 'Descripción detallada del nuevo producto.',
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
            <h1 className="font-headline text-3xl font-bold">Productos y Planes</h1>
            <p className="text-muted-foreground">Gestiona los productos y planes de suscripción que ofreces.</p>
          </div>
          <Button onClick={addNewProduct} variant="outline">
              <PlusCircle className="mr-2" />
              Añadir Producto
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
                      <div className="sm:col-span-2"><Label>Nombre</Label><Input value={product.name} onChange={e => handleProductUpdate(product.id, 'name', e.target.value)} /></div>
                      <div><Label>Tipo</Label>
                          <Select value={product.type} onValueChange={(v) => handleProductUpdate(product.id, 'type', v)}>
                              <SelectTrigger><SelectValue/></SelectTrigger>
                              <SelectContent>
                                  <SelectItem value="one">Pago Único</SelectItem>
                                  <SelectItem value="sub">Suscripción</SelectItem>
                                  <SelectItem value="info">Informativo</SelectItem>
                              </SelectContent>
                          </Select>
                      </div>
                      <div><Label>Precio (USD)</Label><Input type="number" value={product.price} onChange={e => handleProductUpdate(product.id, 'price', Number(e.target.value))} /></div>
                      <div className="sm:col-span-2"><Label>Nota (Descripción corta)</Label><Input value={product.note} onChange={e => handleProductUpdate(product.id, 'note', e.target.value)} /></div>
                      <div className="sm:col-span-2"><Label>Etiqueta</Label><Input value={product.badge} onChange={e => handleProductUpdate(product.id, 'badge', e.target.value)} /></div>
                    </div>
                    <div>
                      <Label>Descripción Completa</Label>
                      <Textarea value={product.description} onChange={e => handleProductUpdate(product.id, 'description', e.target.value)} rows={4} />
                    </div>
                    
                    <Separator className="my-6" />

                    <div>
                        <h4 className="font-semibold text-md mb-4 flex items-center gap-2"><FileText className="h-5 w-5 text-accent"/> Formularios Incluidos y Disparadores</h4>
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
                                            <SelectValue placeholder="Etapa de activación" />
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
            <Button onClick={saveChanges}>Guardar Cambios</Button>
        </div>
    </div>
  );
}
