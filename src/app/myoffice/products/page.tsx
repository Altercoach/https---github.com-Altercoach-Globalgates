
'use client';

import { useState, useEffect } from 'react';
import { useSite } from '@/hooks/use-site';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { SiteData, Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2 } from 'lucide-react';

export default function ProductsEditorPage() {
  const { site, setSite } = useSite();
  const [draft, setDraft] = useState<SiteData>(() => JSON.parse(JSON.stringify(site)));
  const { toast } = useToast();

  useEffect(() => {
    setDraft(JSON.parse(JSON.stringify(site)));
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

  const addNewProduct = () => {
    const newProduct: Product = {
        id: `prod_${Date.now()}`,
        name: 'Nuevo Producto',
        type: 'one',
        price: 100,
        badge: 'Nuevo',
        note: 'Una breve descripción.',
        description: 'Descripción detallada del nuevo producto.',
        interval: 'month'
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
