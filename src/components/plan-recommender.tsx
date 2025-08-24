
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
  DialogClose
} from "@/components/ui/dialog";
import { Textarea } from './ui/textarea';
import { useSite } from '@/hooks/use-site';
import { recommendPlan } from '@/ai/flows/recommend-plan-flow';
import type { RecommendPlanOutput } from '@/ai/flows/recommend-plan-flow';
import { Loader, Wand, ShoppingCart, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/use-cart';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

export function PlanRecommender() {
    const [isOpen, setIsOpen] = useState(false);
    const [businessDescription, setBusinessDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [recommendation, setRecommendation] = useState<RecommendPlanOutput | null>(null);
    const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
    const { site } = useSite();
    const { toast } = useToast();
    const { addToCart } = useCart();

    const handleGetRecommendation = async () => {
        if (!businessDescription.trim()) {
            toast({ title: 'Por favor, describe tu negocio.', variant: 'destructive' });
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

            const products = result.productIds
                .map(id => site.products.find(p => p.id === id))
                .filter((p): p is Product => Boolean(p));

            setRecommendedProducts(products);

        } catch (error) {
            console.error('Failed to get recommendation:', error);
            toast({
                title: 'Error de IA',
                description: 'No se pudo obtener una recomendación. Por favor, inténtalo de nuevo.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddToCart = () => {
        recommendedProducts.forEach(p => addToCart(p));
        toast({
            title: '¡Planes añadidos!',
            description: 'Los planes recomendados están en tu carrito.',
        });
        setIsOpen(false);
    }
    
    const resetState = () => {
      setBusinessDescription('');
      setIsLoading(false);
      setRecommendation(null);
      setRecommendedProducts([]);
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) {
                resetState();
            }
        }}>
            <DialogTrigger asChild>
                <Button variant="default" size="lg" className="bg-accent hover:bg-accent/90 gap-2">
                    <Wand />
                    Obtener Recomendación de IA
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Asistente de Planes con IA</DialogTitle>
                    <DialogDescription>
                        Describe tu negocio y tus metas, y nuestra IA te recomendará el mejor paquete de servicios.
                    </DialogDescription>
                </DialogHeader>
                
                {!recommendation ? (
                    <div className="py-4 space-y-4">
                        <Textarea
                            placeholder="Ej: Somos una nueva cafetería en el centro, queremos atraer más clientes y construir una marca sólida en redes sociales."
                            rows={6}
                            value={businessDescription}
                            onChange={(e) => setBusinessDescription(e.target.value)}
                            disabled={isLoading}
                        />
                        <Button onClick={handleGetRecommendation} disabled={isLoading} className="w-full">
                            {isLoading ? <Loader className="animate-spin mr-2" /> : <Wand className="mr-2" />}
                            {isLoading ? 'Analizando tu negocio...' : 'Obtener Recomendación'}
                        </Button>
                    </div>
                ) : (
                    <div className="py-4 space-y-4">
                        <Card className="bg-primary/5">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <CheckCircle className="text-accent" />
                                    ¡Plan Recomendado para ti!
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-muted-foreground">{recommendation.reasoning}</p>
                                <div className='space-y-2'>
                                    {recommendedProducts.map(p => (
                                        <div key={p.id} className="flex justify-between items-center rounded-md border p-2 bg-background">
                                            <span>{p.name} <Badge variant="secondary" className="ml-2">{p.badge}</Badge></span>
                                            <span className="font-bold">${p.price}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button variant="ghost" onClick={() => setRecommendation(null)}>Probar de Nuevo</Button>
                            <Button onClick={handleAddToCart}>
                                <ShoppingCart className="mr-2" />
                                Añadir al Carrito
                            </Button>
                        </DialogFooter>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
