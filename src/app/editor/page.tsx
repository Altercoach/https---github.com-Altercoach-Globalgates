'use client';

import { useState, useEffect, useRef } from 'react';
import { useSite } from '@/hooks/use-site';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DEFAULT_SITE } from '@/lib/constants';
import type { SiteData, Product } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';

export default function EditorPage() {
  const { site, setSite } = useSite();
  const [draft, setDraft] = useState<SiteData>(() => JSON.parse(JSON.stringify(site)));
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraft(JSON.parse(JSON.stringify(site)));
  }, [site]);

  const saveChanges = () => setSite(draft);
  const resetDefault = () => setDraft(JSON.parse(JSON.stringify(DEFAULT_SITE)));

  const handleJsonImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const newSiteData = JSON.parse(e.target?.result as string);
        setDraft(newSiteData);
      } catch (err) {
        alert('Invalid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleJsonExport = () => {
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'globalgate-site.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setDraft(prev => ({ ...prev, brand: { ...prev.brand, heroImage: url } }));
  };

  const handleProductUpdate = (id: string, field: keyof Product, value: any) => {
    setDraft(prev => ({
        ...prev,
        products: prev.products.map(p => p.id === id ? {...p, [field]: value} : p)
    }));
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <div className="container mx-auto space-y-8">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-headline">Page Editor</h1>
            <p className="text-muted-foreground">Manage your site content. Changes are saved locally.</p>
          </div>
          <div className="grid grid-cols-2 sm:flex gap-2">
            <Button onClick={saveChanges} className="bg-accent hover:bg-accent/90">Save Changes</Button>
            <Button onClick={resetDefault} variant="outline">Reset</Button>
            <Button onClick={handleJsonExport} variant="outline">Export JSON</Button>
            <Button asChild variant="outline"><label htmlFor="import-json" className="cursor-pointer">Import JSON</label></Button>
            <input type="file" id="import-json" accept=".json" onChange={handleJsonImport} className="hidden" />
             <Button variant="secondary" asChild><Link href="/">View Site</Link></Button>
          </div>
        </header>

        <Card>
            <CardHeader><CardTitle>Brand Details</CardTitle></CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div><Label>Name</Label><Input value={draft.brand.name} onChange={e => setDraft(p => ({...p, brand: {...p.brand, name: e.target.value}}))} /></div>
                    <div><Label>Tagline</Label><Input value={draft.brand.tagline} onChange={e => setDraft(p => ({...p, brand: {...p.brand, tagline: e.target.value}}))} /></div>
                    <div><Label>Hero Title</Label><Input value={draft.brand.heroTitle} onChange={e => setDraft(p => ({...p, brand: {...p.brand, heroTitle: e.target.value}}))} /></div>
                    <div><Label>Hero Subtitle</Label><Textarea value={draft.brand.heroSubtitle} onChange={e => setDraft(p => ({...p, brand: {...p.brand, heroSubtitle: e.target.value}}))} /></div>
                </div>
                 <div className="space-y-4">
                    <div>
                        <Label>Hero Image</Label>
                        <Input ref={fileInputRef} type="file" accept="image/*" onChange={handleImagePick} />
                        {draft.brand.heroImage && <Image src={draft.brand.heroImage} alt="Hero Preview" width={200} height={100} className="mt-2 rounded-md border" />}
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle>Services</CardTitle></CardHeader>
            <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {draft.services.map((service, s_idx) => (
                    <Card key={service.id} className="p-4 space-y-2">
                        <Input value={service.title} onChange={e => setDraft(p => {
                            const newServices = [...p.services];
                            newServices[s_idx].title = e.target.value;
                            return {...p, services: newServices};
                        })} />
                        {service.bullets.map((bullet, b_idx) => (
                            <Input key={b_idx} value={bullet} onChange={e => setDraft(p => {
                                const newServices = [...p.services];
                                newServices[s_idx].bullets[b_idx] = e.target.value;
                                return {...p, services: newServices};
                            })}/>
                        ))}
                    </Card>
                ))}
            </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle>Products & Plans</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                {draft.products.map(product => (
                    <div key={product.id} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 rounded-lg border p-4">
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
                    </div>
                ))}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
