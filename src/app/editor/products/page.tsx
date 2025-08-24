
'use client';

import { useState, useEffect } from 'react';
import { useSite } from '@/hooks/use-site';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    toast({ title: 'Changes saved!', description: 'Your products have been updated.' });
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
        name: 'New Product',
        type: 'one',
        price: 100,
        badge: 'New',
        note: 'A brief description.',
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
            <h1 className="text-3xl font-bold font-headline">Products & Plans</h1>
            <p className="text-muted-foreground">Manage the products and subscription plans you offer.</p>
          </div>
          <Button onClick={addNewProduct} variant="outline">
              <PlusCircle className="mr-2" />
              Add Product
          </Button>
      </header>

      <div className="space-y-4">
        {draft.products.map(product => (
            <Card key={product.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Edit Product</CardTitle>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => removeProduct(product.id)}>
                        <Trash2 />
                    </Button>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="sm:col-span-2"><Label>Name</Label><Input value={product.name} onChange={e => handleProductUpdate(product.id, 'name', e.target.value)} /></div>
                    <div><Label>Type</Label>
                        <Select value={product.type} onValueChange={(v) => handleProductUpdate(product.id, 'type', v)}>
                            <SelectTrigger><SelectValue/></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="one">One-time</SelectItem>
                                <SelectItem value="sub">Subscription</SelectItem>
                                <SelectItem value="info">Informational</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div><Label>Price (USD)</Label><Input type="number" value={product.price} onChange={e => handleProductUpdate(product.id, 'price', Number(e.target.value))} /></div>
                    <div className="sm:col-span-2"><Label>Note</Label><Input value={product.note} onChange={e => handleProductUpdate(product.id, 'note', e.target.value)} /></div>
                    <div className="sm:col-span-2"><Label>Badge</Label><Input value={product.badge} onChange={e => handleProductUpdate(product.id, 'badge', e.target.value)} /></div>
                </CardContent>
            </Card>
        ))}
      </div>
      
       <div className="flex justify-end gap-2">
            <Button onClick={saveChanges}>Save Changes</Button>
        </div>
    </div>
  );
}
