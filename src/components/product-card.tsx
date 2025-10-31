
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/types';
import { useCurrency } from '@/hooks/use-currency';
import { useCart } from '@/hooks/use-cart';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
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
import { ShoppingCart } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

interface ProductCardProps {
  product: Product;
}

const labels = {
  es: {
    contactUs: "Contáctanos",
    infoPlanContact: "Por favor, contáctanos para activar este plan informativo.",
    viewDetails: "Ver Detalles",
    requestInfo: "Solicitar Info",
    addToCart: "Añadir al Carrito",
    close: "Cerrar",
    monthly: "/mes",
    variable: "Variable",
    free: "Gratis"
  },
  en: {
    contactUs: "Contact Us",
    infoPlanContact: "Please contact us to activate this informational plan.",
    viewDetails: "View Details",
    requestInfo: "Request Info",
    addToCart: "Add to Cart",
    close: "Close",
    monthly: "/month",
    variable: "Variable",
    free: "Free"
  },
  fr: {
    contactUs: "Contactez-nous",
    infoPlanContact: "Veuillez nous contacter pour activer ce plan d'information.",
    viewDetails: "Voir les détails",
    requestInfo: "Demander des informations",
    addToCart: "Ajouter au panier",
    close: "Fermer",
    monthly: "/mois",
    variable: "Variable",
    free: "Gratuit"
  }
};

export function ProductCard({ product }: ProductCardProps) {
  const { currency } = useCurrency();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { language } = useLanguage();
  const t = labels[language.code as keyof typeof labels] || labels.en;
  
  const isInfo = product.type === 'info';

  const handleInfoClick = () => {
    toast({
      title: t.contactUs,
      description: t.infoPlanContact,
    });
  };

  const handleAddToCart = () => {
    addToCart(product);
  }

  const badge = product.badge[language.code as keyof typeof product.badge] || product.badge.en;

  return (
    <Dialog>
      <Card className="flex flex-col">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
              <CardTitle className="text-lg">{product.name}</CardTitle>
              <Badge variant="outline" className="shrink-0 border-accent text-accent">{badge}</Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="text-3xl font-bold">
              {product.price > 0 ? formatCurrency(product.price, currency) : (isInfo ? t.variable : t.free)}
              {product.type === 'sub' && <span className="text-sm font-normal text-muted-foreground">{t.monthly}</span>}
          </div>
          <CardDescription className="mt-2 min-h-[40px]">{product.note}</CardDescription>
        </CardContent>
        <CardFooter className="flex flex-col items-stretch gap-2">
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full">{t.viewDetails}</Button>
            </DialogTrigger>
            {isInfo ? (
                <Button variant="default" className="w-full" onClick={handleInfoClick}>{t.requestInfo}</Button>
            ) : (
                <Button className="w-full" onClick={handleAddToCart}>
                    <ShoppingCart className="mr-2" />
                    {t.addToCart}
                </Button>
            )}
        </CardFooter>
      </Card>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
          <div className="!mt-2">
            <Badge variant="outline" className="border-accent text-accent">{badge}</Badge>
          </div>
        </DialogHeader>
        <div className="py-4">
          <p>{product.description}</p>
          <div className="mt-4 text-2xl font-bold">
            {product.price > 0 ? formatCurrency(product.price, currency) : (isInfo ? t.variable : t.free)}
            {product.type === 'sub' && <span className="text-sm font-normal text-muted-foreground">{t.monthly}</span>}
          </div>
        </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button variant="outline">{t.close}</Button>
            </DialogClose>
           {isInfo ? (
                <Button variant="default" className="w-full" onClick={() => { handleInfoClick(); }}>{t.requestInfo}</Button>
            ) : (
                <DialogClose asChild>
                    <Button onClick={handleAddToCart}>
                        <ShoppingCart className="mr-2" />
                        {t.addToCart}
                    </Button>
                </DialogClose>
            )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
