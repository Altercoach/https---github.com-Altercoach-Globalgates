
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { useCart } from '@/hooks/use-cart';
import { useCurrency } from '@/hooks/use-currency';
import { formatCurrency } from '@/lib/utils';
import { X } from 'lucide-react';

export function CartDrawer() {
  const { cart, removeFromCart, setQty, totals, checkout, isCartOpen, setIsCartOpen } = useCart();
  const { currency } = useCurrency();

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Tu Carrito</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto py-4">
          {cart.length === 0 ? (
            <p className="text-muted-foreground">Tu carrito está vacío.</p>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-start gap-4 rounded-lg border p-4">
                  <div className="flex-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.type === 'sub' ? 'Suscripción Mensual' : 'Pago Único'}
                    </p>
                    {item.type === 'one' && (
                      <div className="mt-2 flex items-center gap-2">
                        <label htmlFor={`qty-${item.id}`} className="text-sm">Cant:</label>
                        <Input
                          id={`qty-${item.id}`}
                          type="number"
                          value={item.qty}
                          onChange={(e) => setQty(item.id, parseInt(e.target.value))}
                          className="h-8 w-16"
                          min="1"
                          max="99"
                        />
                      </div>
                    )}
                     <p className="mt-2 text-sm text-muted-foreground">
                        Subtotal: {formatCurrency(item.price * item.qty, currency)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(item.price, currency)}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="mt-2 h-8 w-8 text-muted-foreground"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Eliminar artículo</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <SheetFooter className="mt-auto border-t pt-4">
          <div className="w-full space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Pagos únicos</span>
              <span>{formatCurrency(totals.oneTotal, currency)}</span>
            </div>
            <div className="flex justify-between">
              <span>Suscripciones</span>
              <span>{formatCurrency(totals.subTotal, currency)}/mes</span>
            </div>
            <div className="flex justify-between text-base font-bold">
              <span>Total</span>
              <span>{formatCurrency(totals.total, currency)}</span>
            </div>
            <Button 
                className="w-full bg-accent hover:bg-accent/90" 
                onClick={checkout}
                disabled={cart.length === 0}>
              Finalizar Compra
            </Button>
            <p className="text-xs text-muted-foreground">Las suscripciones se renuevan automáticamente. Puedes cancelar en cualquier momento en tu panel de control.</p>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
