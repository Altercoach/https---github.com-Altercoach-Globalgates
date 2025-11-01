
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
    free: "Gratis",
    whatIncludes: "Qué Incluye",
    whatFor: "Para Qué Sirve",
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
    free: "Free",
    whatIncludes: "What's Included",
    whatFor: "What It's For",
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
    free: "Gratuit",
    whatIncludes: "Ce qui est inclus",
    whatFor: "À quoi ça sert",
  }
};

export function ProductCard({ product }: ProductCardProps) {
  const { currency } = useCurrency();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { language, getTranslation } = useLanguage();
  const t = labels[language.code] || labels.en;
  
  const isInfo = product.type === 'info';

  const productName = getTranslation(product.name);
  const productBadge = getTranslation(product.badge);
  const productNote = getTranslation(product.note);
  const productDescription = getTranslation(product.description);
  const longDescription = product.longDescription ? getTranslation(product.longDescription) : null;
  const whatIncludes = product.whatIncludes ? getTranslation(product.whatIncludes) : null;
  const whatFor = product.whatFor ? getTranslation(product.whatFor) : null;

  const handleInfoClick = () => {
    toast({
      title: t.contactUs,
      description: t.infoPlanContact,
    });
  };

  const handleAddToCart = () => {
    // Pass the name in the current language to the cart
    addToCart({ ...product, name: productName });
  }


  return (
    <Dialog>
      <Card className="flex flex-col">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
              <CardTitle className="text-lg">{productName}</CardTitle>
              {productBadge && <Badge variant="outline" className="shrink-0 border-accent text-accent">{productBadge}</Badge>}
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="text-3xl font-bold">
              {product.price > 0 ? formatCurrency(product.price, currency) : (isInfo ? t.variable : t.free)}
              {product.type === 'sub' && <span className="text-sm font-normal text-muted-foreground">{t.monthly}</span>}
          </div>
          <CardDescription className="mt-2 min-h-[40px]">{productNote}</CardDescription>
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

      <DialogContent className="sm:max-w-xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{productName}</DialogTitle>
          {productBadge && (
            <DialogDescription>
              <Badge variant="outline" className="border-accent text-accent mt-2">{productBadge}</Badge>
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="py-4 overflow-y-auto pr-6 text-sm">
          <p className="text-muted-foreground">{productDescription}</p>

          {(longDescription || whatIncludes || whatFor) && <div className="space-y-4 mt-4">
              {longDescription && <p>{longDescription}</p>}
              {whatIncludes && (
                <div>
                  <h4 className="font-semibold mb-2">{t.whatIncludes}</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {whatIncludes.split('\n').map((item, index) => item.trim() && <li key={index}>{item.replace(/^-/,'').trim()}</li>)}
                  </ul>
                </div>
              )}
               {whatFor && (
                <div>
                  <h4 className="font-semibold mb-2 mt-4">{t.whatFor}</h4>
                  <p className="text-muted-foreground">{whatFor}</p>
                </div>
              )}
            </div>
          }
          
          <div className="mt-4 text-2xl font-bold">
            {product.price > 0 ? formatCurrency(product.price, currency) : (isInfo ? t.variable : t.free)}
            {product.type === 'sub' && <span className="text-sm font-normal text-muted-foreground">{t.monthly}</span>}
          </div>
        </div>
        <DialogFooter className="mt-auto pt-4 border-t">
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
