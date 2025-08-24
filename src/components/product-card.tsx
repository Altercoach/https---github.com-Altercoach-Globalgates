'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/types';
import { useCurrency } from '@/hooks/use-currency';
import { useCart } from '@/hooks/use-cart';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

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
      title: 'Contact Us',
      description: 'Please contact us to activate this informational plan.',
    });
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
            <CardTitle className="text-lg">{product.name}</CardTitle>
            <Badge variant="secondary" className="bg-accent/20 text-accent-foreground shrink-0">{product.badge}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="text-3xl font-bold">
            {product.price > 0 ? formatCurrency(product.price, currency) : (isInfo ? 'Variable' : formatCurrency(0, currency))}
            {product.type === 'sub' && <span className="text-sm font-normal text-muted-foreground">/month</span>}
        </div>
        <CardDescription className="mt-2 min-h-[40px]">{product.note}</CardDescription>
      </CardContent>
      <CardFooter>
        {isInfo ? (
            <Button variant="outline" className="w-full" onClick={handleInfoClick}>Request Info</Button>
        ) : (
            <Button className="w-full bg-accent hover:bg-accent/90" onClick={() => addToCart(product)}>Add to Cart</Button>
        )}
      </CardFooter>
    </Card>
  );
}
