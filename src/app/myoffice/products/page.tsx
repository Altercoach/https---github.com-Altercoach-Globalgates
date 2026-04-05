'use client';

import { useSite } from '@/hooks/use-site';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { Product, MultilingualString } from '@/lib/types';
import { PlusCircle, Trash2, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { RouteGuard } from '@/components/auth/route-guard';

const labels = {
  es: {
    pageTitle: 'Productos',
    pageSubtitle: 'Gestiona los productos que muestras en tu tienda.',
    addProduct: 'Añadir Producto',
    deleteProduct: 'Eliminar',
    saveChanges: 'Guardar Cambios',
    nameLabel: 'Nombre',
    descriptionLabel: 'Descripcion',
    priceLabel: 'Precio (USD)',
    visibleLabel: 'Visible en la pagina',
    editingLanguage: 'Estas editando el contenido en',
    noProducts: 'No hay productos. Añade uno.',
  },
  en: {
    pageTitle: 'Products',
    pageSubtitle: 'Manage the products you display in your store.',
    addProduct: 'Add Product',
    deleteProduct: 'Delete',
    saveChanges: 'Save Changes',
    nameLabel: 'Name',
    descriptionLabel: 'Description',
    priceLabel: 'Price (USD)',
    visibleLabel: 'Visible on page',
    editingLanguage: 'You are editing content in',
    noProducts: 'No products yet. Add one.',
  },
  fr: {
    pageTitle: 'Produits',
    pageSubtitle: 'Gerez les produits que vous affichez dans votre boutique.',
    addProduct: 'Ajouter un Produit',
    deleteProduct: 'Supprimer',
    saveChanges: 'Enregistrer les Modifications',
    nameLabel: 'Nom',
    descriptionLabel: 'Description',
    priceLabel: 'Prix (USD)',
    visibleLabel: 'Visible sur la page',
    editingLanguage: 'Vous editez le contenu en',
    noProducts: "Aucun produit. Ajoutez-en un.",
  },
};

function newProduct(): Product {
  return {
    id: `prod_${Date.now()}`,
    name: { es: '', en: '', fr: '' },
    description: { es: '', en: '', fr: '' },
    badge: { es: '', en: '', fr: '' },
    note: { es: '', en: '', fr: '' },
    type: 'one',
    price: 0,
    features: [],
    visible: true,
  };
}

export default function ProductsEditorPage() {
  const { site, setSite } = useSite();
  const { language } = useLanguage();
  const langCode = language.code as keyof typeof labels & keyof MultilingualString;
  const t = labels[langCode] ?? labels.es;
  const products: Product[] = site.products ?? [];

  const addProduct = () => {
    setSite(prev => ({ ...prev, products: [...(prev.products ?? []), newProduct()] }));
  };

  const deleteProduct = (id: string) => {
    setSite(prev => ({ ...prev, products: (prev.products ?? []).filter(p => p.id !== id) }));
  };

  const updateProduct = (id: string, field: keyof Product, value: unknown) => {
    setSite(prev => ({
      ...prev,
      products: (prev.products ?? []).map(p =>
        p.id === id ? { ...p, [field]: value } : p
      ),
    }));
  };

  const updateMultilingual = (id: string, field: 'name' | 'description', value: string) => {
    setSite(prev => ({
      ...prev,
      products: (prev.products ?? []).map(p =>
        p.id === id
          ? { ...p, [field]: { ...p[field], [langCode]: value } }
          : p
      ),
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
          <Button onClick={addProduct}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {t.addProduct}
          </Button>
        </header>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>{`${t.editingLanguage} ${language.name}`}</AlertTitle>
        </Alert>

        {products.length === 0 && (
          <p className="text-muted-foreground text-center py-8">{t.noProducts}</p>
        )}

        {products.map(product => (
          <Card key={product.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{product.name?.[langCode] || t.nameLabel}</span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteProduct(product.id)}
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  {t.deleteProduct}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>{t.nameLabel}</Label>
                <Input
                  value={product.name?.[langCode] ?? ''}
                  onChange={e => updateMultilingual(product.id, 'name', e.target.value)}
                />
              </div>
              <div>
                <Label>{t.descriptionLabel}</Label>
                <Textarea
                  value={product.description?.[langCode] ?? ''}
                  onChange={e => updateMultilingual(product.id, 'description', e.target.value)}
                  rows={3}
                />
              </div>
              <div>
                <Label>{t.priceLabel}</Label>
                <Input
                  type="number"
                  value={product.price ?? 0}
                  onChange={e => updateProduct(product.id, 'price', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={product.visible ?? true}
                  onCheckedChange={val => updateProduct(product.id, 'visible', val)}
                />
                <Label>{t.visibleLabel}</Label>
                {product.visible ? (
                  <Eye className="h-4 w-4 text-green-600" />
                ) : (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </RouteGuard>
  );
}
