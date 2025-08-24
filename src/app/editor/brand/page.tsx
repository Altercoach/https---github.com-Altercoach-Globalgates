
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

export default function BrandEditorPage() {
  const { site, setSite } = useSite();
  const [draft, setDraft] = useState<SiteData>(() => JSON.parse(JSON.stringify(site)));
  const { toast } = useToast();

  useEffect(() => {
    setDraft(JSON.parse(JSON.stringify(site)));
  }, [site]);

  const saveChanges = () => {
    setSite(draft);
    toast({ title: 'Changes saved!', description: 'Your brand details have been updated.' });
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

  return (
    <div className="space-y-6">
        <header>
            <h1 className="text-3xl font-bold font-headline">Brand & Hero</h1>
            <p className="text-muted-foreground">Manage your brand identity and hero section content.</p>
        </header>

        <Card>
            <CardHeader>
                <CardTitle>Brand Details</CardTitle>
                <CardDescription>This information is used across your site.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div><Label>Brand Name</Label><Input value={draft.brand.name} onChange={e => setDraft(p => ({...p, brand: {...p.brand, name: e.target.value}}))} /></div>
                <div><Label>Tagline</Label><Input value={draft.brand.tagline} onChange={e => setDraft(p => ({...p, brand: {...p.brand, tagline: e.target.value}}))} /></div>
            </CardContent>
        </Card>

         <Card>
            <CardHeader>
                <CardTitle>Hero Section</CardTitle>
                <CardDescription>This is the first thing visitors see on your homepage.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div><Label>Hero Title</Label><Input value={draft.brand.heroTitle} onChange={e => setDraft(p => ({...p, brand: {...p.brand, heroTitle: e.target.value}}))} /></div>
                    <div><Label>Hero Subtitle</Label><Textarea value={draft.brand.heroSubtitle} onChange={e => setDraft(p => ({...p, brand: {...p.brand, heroSubtitle: e.target.value}}))} rows={5} /></div>
                </div>
                 <div className="space-y-2">
                    <Label>Hero Image</Label>
                    <Input type="file" accept="image/*" onChange={handleImagePick} />
                    <p className="text-sm text-muted-foreground">Recommended size: 1200x800px.</p>
                    {draft.brand.heroImage && (
                        <div className="mt-2 rounded-md border p-2">
                            <Image src={draft.brand.heroImage} alt="Hero Preview" width={300} height={200} className="rounded-md object-contain" />
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
            <Button onClick={saveChanges}>Save Changes</Button>
        </div>
    </div>
  );
}
