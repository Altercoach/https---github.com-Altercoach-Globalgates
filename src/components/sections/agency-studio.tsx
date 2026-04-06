'use client';

import { useMemo, useState } from 'react';
import { Building2, Sparkles, ShoppingCart, Layers, Gauge, Rocket } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useLanguage } from '@/hooks/use-language';
import { useSite } from '@/hooks/use-site';
import { useCart } from '@/hooks/use-cart';
import { useCurrency } from '@/hooks/use-currency';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';

const labels = {
  es: {
    title: 'Para Agencias y Studio On Demand',
    subtitle:
      'Opera en modo white label o crea paquetes a la carta con precio dinámico y checkout inmediato.',
    agencyPartner: 'Programa Agency Partner',
    onDemandTitle: 'Customised Package Builder',
    channels: 'Canales',
    volume: 'Volumen de piezas',
    urgency: 'Nivel de urgencia',
    addons: 'Add-ons',
    posts: 'Posts',
    reels: 'Reels / Shorts',
    ads: 'Creativos Ads',
    standard: 'Estándar (72h)',
    priority: 'Prioritario (48h)',
    rush: 'Rush (24h)',
    strategyWorkshop: 'Workshop estratégico',
    communitySupport: 'Soporte de comunidad',
    analyticsPack: 'Reporte de analytics',
    estimate: 'Estimado del paquete',
    formula: 'Base + canales + volumen + urgencia + add-ons',
    addCustomToCart: 'Añadir paquete personalizado',
    addAgencySub: 'Añadir Agency Scale Kit',
    alreadyExists: 'No se encontró la oferta de agencia en el catálogo.',
    packageAdded: 'Paquete personalizado agregado al carrito',
    agencyAdded: 'Agency Scale Kit agregado al carrito',
    fromCatalog: 'Desde catálogo',
    summaryTitle: 'Resumen del paquete personalizado',
    summaryDescription: 'Revisa el brief final, SLA y fecha estimada antes de enviarlo al carrito.',
    estimatedDelivery: 'Entrega estimada',
    sla: 'SLA comprometido',
    selectedChannels: 'Canales seleccionados',
    selectedAddons: 'Add-ons seleccionados',
    none: 'Ninguno',
    confirmAdd: 'Confirmar y añadir al carrito',
    cancel: 'Cancelar',
    brief: 'Brief final',
    perMonth: '/mes',
  },
  en: {
    title: 'For Agencies and On-Demand Studio',
    subtitle:
      'Operate in white-label mode or build a la carte packages with dynamic pricing and instant checkout.',
    agencyPartner: 'Agency Partner Program',
    onDemandTitle: 'Customised Package Builder',
    channels: 'Channels',
    volume: 'Asset volume',
    urgency: 'Urgency level',
    addons: 'Add-ons',
    posts: 'Posts',
    reels: 'Reels / Shorts',
    ads: 'Ad creatives',
    standard: 'Standard (72h)',
    priority: 'Priority (48h)',
    rush: 'Rush (24h)',
    strategyWorkshop: 'Strategy workshop',
    communitySupport: 'Community support',
    analyticsPack: 'Analytics report',
    estimate: 'Package estimate',
    formula: 'Base + channels + volume + urgency + add-ons',
    addCustomToCart: 'Add custom package',
    addAgencySub: 'Add Agency Scale Kit',
    alreadyExists: 'Agency offer was not found in the catalog.',
    packageAdded: 'Custom package added to cart',
    agencyAdded: 'Agency Scale Kit added to cart',
    fromCatalog: 'From catalog',
    summaryTitle: 'Custom package summary',
    summaryDescription: 'Review the final brief, SLA and estimated delivery before sending to cart.',
    estimatedDelivery: 'Estimated delivery',
    sla: 'Committed SLA',
    selectedChannels: 'Selected channels',
    selectedAddons: 'Selected add-ons',
    none: 'None',
    confirmAdd: 'Confirm and add to cart',
    cancel: 'Cancel',
    brief: 'Final brief',
    perMonth: '/mo',
  },
  fr: {
    title: 'Pour Agences et Studio On-Demand',
    subtitle:
      'Travaillez en mode marque blanche ou créez des packages à la carte avec prix dynamique et checkout immédiat.',
    agencyPartner: 'Programme Agency Partner',
    onDemandTitle: 'Customised Package Builder',
    channels: 'Canaux',
    volume: 'Volume des livrables',
    urgency: "Niveau d'urgence",
    addons: 'Add-ons',
    posts: 'Posts',
    reels: 'Reels / Shorts',
    ads: 'Créatifs Ads',
    standard: 'Standard (72h)',
    priority: 'Prioritaire (48h)',
    rush: 'Rush (24h)',
    strategyWorkshop: 'Workshop stratégique',
    communitySupport: 'Support communauté',
    analyticsPack: 'Rapport analytics',
    estimate: 'Estimation du package',
    formula: 'Base + canaux + volume + urgence + add-ons',
    addCustomToCart: 'Ajouter le package personnalisé',
    addAgencySub: 'Ajouter Agency Scale Kit',
    alreadyExists: 'Offre agence introuvable dans le catalogue.',
    packageAdded: 'Package personnalisé ajouté au panier',
    agencyAdded: 'Agency Scale Kit ajouté au panier',
    fromCatalog: 'Depuis le catalogue',
    summaryTitle: 'Résumé du package personnalisé',
    summaryDescription: 'Vérifiez le brief final, le SLA et la date estimée avant ajout au panier.',
    estimatedDelivery: 'Livraison estimée',
    sla: 'SLA engagé',
    selectedChannels: 'Canaux sélectionnés',
    selectedAddons: 'Add-ons sélectionnés',
    none: 'Aucun',
    confirmAdd: 'Confirmer et ajouter au panier',
    cancel: 'Annuler',
    brief: 'Brief final',
    perMonth: '/mois',
  },
};

type Urgency = 'standard' | 'priority' | 'rush';

const CHANNELS = ['instagram', 'facebook', 'linkedin', 'threads', 'tiktok', 'twitter'] as const;

export function AgencyStudio() {
  const { language, getTranslation } = useLanguage();
  const { site } = useSite();
  const { addToCart } = useCart();
  const { currency } = useCurrency();
  const { toast } = useToast();

  const t = labels[language.code] || labels.en;

  const agencyScaleKit = site.products.find((p) => p.id === 'prod_agency_scale_kit');
  const customBaseProduct = site.products.find((p) => p.id === 'prod_custom_pack_on_demand');

  const [selectedChannels, setSelectedChannels] = useState<string[]>(['instagram', 'facebook']);
  const [postQty, setPostQty] = useState(8);
  const [reelQty, setReelQty] = useState(2);
  const [adsQty, setAdsQty] = useState(2);
  const [urgency, setUrgency] = useState<Urgency>('standard');
  const [addStrategy, setAddStrategy] = useState(true);
  const [addCommunity, setAddCommunity] = useState(false);
  const [addAnalytics, setAddAnalytics] = useState(true);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  const basePrice = customBaseProduct?.price ?? 450;

  const pricing = useMemo(() => {
    const channelSurcharge = Math.max(0, selectedChannels.length - 1) * 60;
    const volumeCost = postQty * 12 + reelQty * 25 + adsQty * 20;

    const addonCost =
      (addStrategy ? 120 : 0) +
      (addCommunity ? 180 : 0) +
      (addAnalytics ? 90 : 0);

    const urgencyMultiplier = urgency === 'standard' ? 1 : urgency === 'priority' ? 1.25 : 1.6;
    const subtotal = basePrice + channelSurcharge + volumeCost + addonCost;
    const total = Math.round(subtotal * urgencyMultiplier);

    return { channelSurcharge, volumeCost, addonCost, urgencyMultiplier, total };
  }, [selectedChannels.length, postQty, reelQty, adsQty, addStrategy, addCommunity, addAnalytics, urgency, basePrice]);

  const toggleChannel = (channel: string) => {
    setSelectedChannels((prev) => {
      if (prev.includes(channel)) {
        if (prev.length === 1) return prev;
        return prev.filter((c) => c !== channel);
      }
      return [...prev, channel];
    });
  };

  const selectedAddons = useMemo(() => {
    const list: string[] = [];
    if (addStrategy) list.push(t.strategyWorkshop);
    if (addCommunity) list.push(t.communitySupport);
    if (addAnalytics) list.push(t.analyticsPack);
    return list;
  }, [addStrategy, addCommunity, addAnalytics, t.strategyWorkshop, t.communitySupport, t.analyticsPack]);

  const slaHours = urgency === 'standard' ? 72 : urgency === 'priority' ? 48 : 24;
  const etaDate = useMemo(() => {
    const d = new Date();
    d.setHours(d.getHours() + slaHours);
    return d.toLocaleString(language.code === 'fr' ? 'fr-FR' : language.code === 'en' ? 'en-US' : 'es-ES', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }, [slaHours, language.code]);

  const customPackBrief = useMemo(() => {
    const channelText = selectedChannels.map((c) => (c === 'twitter' ? 'X' : c)).join(', ');
    return `${channelText} | ${postQty} ${t.posts} | ${reelQty} ${t.reels} | ${adsQty} ${t.ads} | ${urgency === 'standard' ? t.standard : urgency === 'priority' ? t.priority : t.rush}`;
  }, [selectedChannels, postQty, reelQty, adsQty, urgency, t.posts, t.reels, t.ads, t.standard, t.priority, t.rush]);

  const handleAddAgencySub = () => {
    if (!agencyScaleKit) {
      toast({ title: t.alreadyExists, variant: 'destructive' });
      return;
    }
    addToCart({
      id: agencyScaleKit.id,
      name: getTranslation(agencyScaleKit.name),
      price: agencyScaleKit.price,
      type: agencyScaleKit.type === 'sub' ? 'sub' : 'one',
    });
    toast({ title: t.agencyAdded });
  };

  const handleAddCustomPack = () => {
    const channelText = selectedChannels.map((c) => c.toUpperCase()).join(', ');
    const urgencyText = urgency === 'standard' ? t.standard : urgency === 'priority' ? t.priority : t.rush;

    addToCart({
      id: `custom_pack_${Date.now()}`,
      name: `${customBaseProduct ? getTranslation(customBaseProduct.name) : 'Custom Package'} | ${channelText} | ${urgencyText}`,
      price: pricing.total,
      type: 'one',
      metadata: {
        kind: 'custom_package',
        brief: customPackBrief,
        channels: selectedChannels.map((c) => (c === 'twitter' ? 'X' : c)),
        addons: selectedAddons,
        urgency,
        slaHours,
        etaIso: new Date(Date.now() + slaHours * 60 * 60 * 1000).toISOString(),
      },
    });

    toast({ title: t.packageAdded });
    setIsSummaryOpen(false);
  };

  return (
    <section id="agency-studio" className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">{t.title}</h2>
            <p className="max-w-[920px] text-muted-foreground md:text-xl/relaxed">{t.subtitle}</p>
          </div>
        </div>

        <div className="mx-auto grid max-w-6xl gap-8 pt-12 lg:grid-cols-2">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                {t.agencyPartner}
              </CardTitle>
              <CardDescription>
                {t.fromCatalog}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {agencyScaleKit ? (
                <>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{getTranslation(agencyScaleKit.name)}</p>
                      <p className="text-sm text-muted-foreground">{getTranslation(agencyScaleKit.note)}</p>
                    </div>
                    <Badge variant="outline" className="shrink-0 border-primary text-primary">
                      {formatCurrency(agencyScaleKit.price, currency)}{t.perMonth}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{getTranslation(agencyScaleKit.description)}</p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">{t.alreadyExists}</p>
              )}
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleAddAgencySub} disabled={!agencyScaleKit}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                {t.addAgencySub}
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-accent/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                {t.onDemandTitle}
              </CardTitle>
              <CardDescription>{t.formula}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="font-semibold">{t.channels}</Label>
                <div className="grid grid-cols-2 gap-2">
                  {CHANNELS.map((channel) => (
                    <label key={channel} className="flex items-center gap-2 rounded-md border p-2 text-sm">
                      <Checkbox
                        checked={selectedChannels.includes(channel)}
                        onCheckedChange={() => toggleChannel(channel)}
                      />
                      <span className="capitalize">{channel === 'twitter' ? 'X' : channel}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="font-semibold">{t.volume}</Label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">{t.posts}</Label>
                    <Input type="number" min={1} max={60} value={postQty} onChange={(e) => setPostQty(Math.max(1, Number(e.target.value) || 1))} />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">{t.reels}</Label>
                    <Input type="number" min={0} max={40} value={reelQty} onChange={(e) => setReelQty(Math.max(0, Number(e.target.value) || 0))} />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">{t.ads}</Label>
                    <Input type="number" min={0} max={40} value={adsQty} onChange={(e) => setAdsQty(Math.max(0, Number(e.target.value) || 0))} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-semibold">{t.urgency}</Label>
                <RadioGroup value={urgency} onValueChange={(v: Urgency) => setUrgency(v)} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <label className="flex items-center gap-2 rounded-md border p-2 text-sm">
                    <RadioGroupItem value="standard" id="urgency-standard" />
                    <span>{t.standard}</span>
                  </label>
                  <label className="flex items-center gap-2 rounded-md border p-2 text-sm">
                    <RadioGroupItem value="priority" id="urgency-priority" />
                    <span>{t.priority}</span>
                  </label>
                  <label className="flex items-center gap-2 rounded-md border p-2 text-sm">
                    <RadioGroupItem value="rush" id="urgency-rush" />
                    <span>{t.rush}</span>
                  </label>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label className="font-semibold">{t.addons}</Label>
                <div className="space-y-2 text-sm">
                  <label className="flex items-center gap-2 rounded-md border p-2">
                    <Checkbox checked={addStrategy} onCheckedChange={(v) => setAddStrategy(v === true)} />
                    <span>{t.strategyWorkshop}</span>
                  </label>
                  <label className="flex items-center gap-2 rounded-md border p-2">
                    <Checkbox checked={addCommunity} onCheckedChange={(v) => setAddCommunity(v === true)} />
                    <span>{t.communitySupport}</span>
                  </label>
                  <label className="flex items-center gap-2 rounded-md border p-2">
                    <Checkbox checked={addAnalytics} onCheckedChange={(v) => setAddAnalytics(v === true)} />
                    <span>{t.analyticsPack}</span>
                  </label>
                </div>
              </div>

              <Separator />

              <div className="rounded-md bg-muted/40 p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold flex items-center gap-2">
                    <Gauge className="h-4 w-4" />
                    {t.estimate}
                  </p>
                  <p className="text-2xl font-bold">{formatCurrency(pricing.total, currency)}</p>
                </div>
                <div className="mt-2 text-xs text-muted-foreground space-y-1">
                  <p>Base: {formatCurrency(basePrice, currency)}</p>
                  <p>Canales: {formatCurrency(pricing.channelSurcharge, currency)}</p>
                  <p>Volumen: {formatCurrency(pricing.volumeCost, currency)}</p>
                  <p>Add-ons: {formatCurrency(pricing.addonCost, currency)}</p>
                  <p>Multiplicador urgencia: x{pricing.urgencyMultiplier.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => setIsSummaryOpen(true)}>
                <Rocket className="mr-2 h-4 w-4" />
                {t.addCustomToCart}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-lg border p-3 text-sm">
            <p className="font-semibold flex items-center gap-2"><Layers className="h-4 w-4" /> White label</p>
            <p className="text-muted-foreground mt-1">Entrega con marca de agencia y playbooks reutilizables.</p>
          </div>
          <div className="rounded-lg border p-3 text-sm">
            <p className="font-semibold flex items-center gap-2"><Sparkles className="h-4 w-4" /> On demand</p>
            <p className="text-muted-foreground mt-1">Sprints puntuales por volumen y urgencia sin contrato largo.</p>
          </div>
          <div className="rounded-lg border p-3 text-sm">
            <p className="font-semibold flex items-center gap-2"><Rocket className="h-4 w-4" /> Checkout directo</p>
            <p className="text-muted-foreground mt-1">Se agrega al carrito y sigue el flujo actual de pago/alta.</p>
          </div>
        </div>

        <Dialog open={isSummaryOpen} onOpenChange={setIsSummaryOpen}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>{t.summaryTitle}</DialogTitle>
              <DialogDescription>{t.summaryDescription}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 text-sm">
              <div className="rounded-md border p-3">
                <p className="font-semibold mb-1">{t.brief}</p>
                <p className="text-muted-foreground">{customPackBrief}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-md border p-3">
                  <p className="font-semibold">{t.sla}</p>
                  <p className="text-muted-foreground">{slaHours}h</p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="font-semibold">{t.estimatedDelivery}</p>
                  <p className="text-muted-foreground">{etaDate}</p>
                </div>
              </div>

              <div className="rounded-md border p-3">
                <p className="font-semibold mb-1">{t.selectedChannels}</p>
                <p className="text-muted-foreground capitalize">{selectedChannels.map((c) => (c === 'twitter' ? 'X' : c)).join(', ')}</p>
              </div>

              <div className="rounded-md border p-3">
                <p className="font-semibold mb-1">{t.selectedAddons}</p>
                <p className="text-muted-foreground">{selectedAddons.length ? selectedAddons.join(', ') : t.none}</p>
              </div>

              <div className="rounded-md bg-muted/40 p-3">
                <p className="font-semibold">{t.estimate}</p>
                <p className="text-2xl font-bold">{formatCurrency(pricing.total, currency)}</p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsSummaryOpen(false)}>{t.cancel}</Button>
              <Button onClick={handleAddCustomPack}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                {t.confirmAdd}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
