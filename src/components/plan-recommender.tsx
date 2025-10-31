

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from './ui/textarea';
import { useSite } from '@/hooks/use-site';
import { recommendPlan } from '@/ai/flows/recommend-plan-flow';
import type { RecommendPlanOutput } from '@/ai/flows/recommend-plan-flow';
import { Loader, Wand, ShoppingCart, CheckCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/use-cart';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { formatCurrency } from '@/lib/utils';
import { useCurrency } from '@/hooks/use-currency';
import { useLanguage } from '@/hooks/use-language';

const labels = {
  es: {
    trigger: "Obtener Recomendación de IA",
    title: "Asistente de Planes con IA",
    description: "Describe tu negocio y tus metas, y nuestra IA te recomendará el mejor paquete de servicios.",
    placeholder: "Ej: Somos una nueva cafetería en el centro, queremos atraer más clientes y construir una marca sólida en redes sociales.",
    getRecommendation: "Obtener Recomendación",
    sendInfo: "Enviar información",
    analyzing: "Analizando...",
    pleaseDescribe: "Por favor, describe tu negocio.",
    errorTitle: "Error de IA",
    errorDescription: "No se pudo obtener una recomendación. Por favor, inténtalo de nuevo.",
    planAdded: "¡Planes añadidos!",
    planAddedDescription: "Los planes recomendados están en tu carrito.",
    recommendedPlan: "¡Plan Recomendado para ti!",
    addToCart: "Añadir al Carrito",
    startOver: "Empezar de Nuevo",
  },
  en: {
    trigger: "Get AI Recommendation",
    title: "AI Plan Assistant",
    description: "Describe your business and goals, and our AI will recommend the best service package.",
    placeholder: "e.g., We are a new coffee shop downtown, we want to attract more customers and build a strong brand on social media.",
    getRecommendation: "Get Recommendation",
    sendInfo: "Send Information",
    analyzing: "Analyzing...",
    pleaseDescribe: "Please describe your business.",
    errorTitle: "AI Error",
    errorDescription: "Could not get a recommendation. Please try again.",
    planAdded: "Plans added!",
    planAddedDescription: "The recommended plans are in your cart.",
    recommendedPlan: "Recommended Plan for You!",
    addToCart: "Add to Cart",
    startOver: "Start Over",
  },
    fr: {
    trigger: "Obtenir une Recommandation IA",
    title: "Assistant de Forfaits IA",
    description: "Décrivez votre entreprise et vos objectifs, et notre IA vous recommandera le meilleur forfait de services.",
    placeholder: "Ex : Nous sommes un nouveau café en centre-ville, nous voulons attirer plus de clients et construire une marque forte sur les réseaux sociaux.",
    getRecommendation: "Obtenir une Recommandation",
    sendInfo: "Envoyer les informations",
    analyzing: "Analyse en cours...",
    pleaseDescribe: "Veuillez décrire votre entreprise.",
    errorTitle: "Erreur IA",
    errorDescription: "Impossible d'obtenir une recommandation. Veuillez réessayer.",
    planAdded: "Forfaits ajoutés !",
    planAddedDescription: "Les forfaits recommandés sont dans votre panier.",
    recommendedPlan: "Forfait Recommandé pour Vous !",
    addToCart: "Ajouter au Panier",
    startOver: "Recommencer",
  }
};


export function PlanRecommender() {
    const [isOpen, setIsOpen] = useState(false);
    const [businessDescription, setBusinessDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [recommendation, setRecommendation] = useState<RecommendPlanOutput | null>(null);
    const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
    const { site } = useSite();
    const { toast } = useToast();
    const { addToCart } = useCart();
    const { currency } = useCurrency();
    const { language } = useLanguage();
    const t = labels[language.code as keyof typeof labels] || labels.en;

    const handleGetRecommendation = async () => {
        if (!businessDescription.trim()) {
            toast({ title: t.pleaseDescribe, variant: 'destructive' });
            return;
        }
        setIsLoading(true);
        setRecommendation(null);
        setRecommendedProducts([]);

        try {
            const result = await recommendPlan({
                businessDescription,
                products: JSON.stringify(site.products),
            });
            setRecommendation(result);

            if (result.productIds.length > 0) {
              const products = result.productIds
                  .map(id => site.products.find(p => p.id === id))
                  .filter((p): p is Product => Boolean(p));
              setRecommendedProducts(products);
            }

        } catch (error) {
            console.error('Failed to get recommendation:', error);
            toast({
                title: t.errorTitle,
                description: t.errorDescription,
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddToCart = () => {
        recommendedProducts.forEach(p => addToCart(p));
        toast({
            title: t.planAdded,
            description: t.planAddedDescription,
        });
        setIsOpen(false);
    }
    
    const resetState = () => {
      setBusinessDescription('');
      setIsLoading(false);
      setRecommendation(null);
      setRecommendedProducts([]);
    }

    const hasRecommendation = recommendation && recommendation.productIds.length > 0;
    const isAskingQuestion = recommendation && recommendation.productIds.length === 0;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) {
                resetState();
            }
        }}>
            <DialogTrigger asChild>
                <Button variant="default" size="lg" className="gap-2">
                    <Wand />
                    {t.trigger}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{t.title}</DialogTitle>
                    <DialogDescription>{t.description}</DialogDescription>
                </DialogHeader>
                
                <div className="py-4 space-y-4">
                    {isAskingQuestion && (
                        <Card className="bg-primary/5">
                             <CardContent className="pt-6">
                                <p className="text-muted-foreground">{recommendation.reasoning}</p>
                            </CardContent>
                        </Card>
                    )}

                    {!hasRecommendation && (
                        <div className="space-y-4">
                            <Textarea
                                placeholder={t.placeholder}
                                rows={isAskingQuestion ? 3 : 6}
                                value={businessDescription}
                                onChange={(e) => setBusinessDescription(e.target.value)}
                                disabled={isLoading}
                            />
                            <Button onClick={handleGetRecommendation} disabled={isLoading || !businessDescription.trim()} className="w-full">
                                {isLoading ? <Loader className="animate-spin mr-2" /> : <Wand className="mr-2" />}
                                {isLoading ? t.analyzing : (isAskingQuestion ? t.sendInfo : t.getRecommendation)}
                            </Button>
                        </div>
                    )}
                    
                    {hasRecommendation && (
                         <Card className="bg-muted">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <CheckCircle className="text-accent" />
                                    {t.recommendedPlan}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-muted-foreground">{recommendation.reasoning}</p>
                                <div className='space-y-2'>
                                    {recommendedProducts.map(p => (
                                        <div key={p.id} className="flex justify-between items-center rounded-md border p-2 bg-background">
                                            <span>{p.name} <Badge variant="secondary" className="ml-2">{p.badge}</Badge></span>
                                            <span className="font-bold">{formatCurrency(p.price, currency)}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <DialogFooter className="gap-2 sm:gap-0 sm:justify-between w-full">
                    {hasRecommendation && (
                        <>
                            <Button variant="ghost" onClick={resetState}>
                                <RefreshCw className="mr-2"/>
                                {t.startOver}
                            </Button>
                            <Button onClick={handleAddToCart}>
                                <ShoppingCart className="mr-2" />
                                {t.addToCart}
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
