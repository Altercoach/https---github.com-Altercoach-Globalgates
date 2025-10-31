
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

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { currency } = useCurrency();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const isInfo = product.type === 'info';

  const handleInfoClick = () => {
    toast({
      title: 'Contáctanos',
      description: 'Por favor, contáctanos para activar este plan informativo.',
    });
  };

  const handleAddToCart = () => {
    addToCart(product);
  }

  return (
    <Dialog>
      <Card className="flex flex-col">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
              <CardTitle className="text-lg">{product.name}</CardTitle>
              <Badge variant="outline" className="shrink-0 border-accent text-accent">{product.badge}</Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="text-3xl font-bold">
              {product.price > 0 ? formatCurrency(product.price, currency) : (isInfo ? 'Variable' : 'Gratis')}
              {product.type === 'sub' && <span className="text-sm font-normal text-muted-foreground">/mes</span>}
          </div>
          <CardDescription className="mt-2 min-h-[40px]">{product.note}</CardDescription>
        </CardContent>
        <CardFooter className="flex flex-col items-stretch gap-2">
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full">Ver Detalles</Button>
            </DialogTrigger>
            {isInfo ? (
                <Button variant="default" className="w-full" onClick={handleInfoClick}>Solicitar Info</Button>
            ) : (
                <Button className="w-full" onClick={handleAddToCart}>
                    <ShoppingCart className="mr-2" />
                    Añadir al Carrito
                </Button>
            )}
        </CardFooter>
      </Card>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
          <div className="!mt-2">
            <Badge variant="outline" className="border-accent text-accent">{product.badge}</Badge>
          </div>
        </DialogHeader>
        <div className="py-4">
          <p>{product.description}</p>
          <div className="mt-4 text-2xl font-bold">
            {product.price > 0 ? formatCurrency(product.price, currency) : (isInfo ? 'Variable' : 'Gratis')}
            {product.type === 'sub' && <span className="text-sm font-normal text-muted-foreground">/mes</span>}
          </div>
        </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button variant="outline">Cerrar</Button>
            </DialogClose>
           {isInfo ? (
                <Button variant="default" className="w-full" onClick={() => { handleInfoClick(); }}>Solicitar Info</Button>
            ) : (
                <DialogClose asChild>
                    <Button onClick={handleAddToCart}>
                        <ShoppingCart className="mr-2" />
                        Añadir al Carrito
                    </Button>
                </DialogClose>
            )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
