
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { useCart } from '@/hooks/use-cart';
import { useCurrency } from '@/hooks/use-currency';
import { formatCurrency } from '@/lib/utils';
import { X } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

const labels = {
  es: {
    title: "Tu Carrito",
    description: "Revisa los productos en tu carrito. Las suscripciones se renuevan automáticamente.",
    empty: "Tu carrito está vacío.",
    monthlySub: "Suscripción Mensual",
    oneTime: "Pago Único",
    qty: "Cant:",
    subtotal: "Subtotal:",
    removeItem: "Eliminar artículo",
    oneTimePayments: "Pagos únicos",
    subscriptions: "Suscripciones",
    perMonth: "/mes",
    total: "Total",
    checkout: "Finalizar Compra",
    disclaimer: "Puedes cancelar en cualquier momento en tu panel de control."
  },
  en: {
    title: "Your Cart",
    description: "Review the products in your cart. Subscriptions are automatically renewed.",
    empty: "Your cart is empty.",
    monthlySub: "Monthly Subscription",
    oneTime: "One-time Payment",
    qty: "Qty:",
    subtotal: "Subtotal:",
    removeItem: "Remove item",
    oneTimePayments: "One-time payments",
    subscriptions: "Subscriptions",
    perMonth: "/month",
    total: "Total",
    checkout: "Checkout",
    disclaimer: "You can cancel at any time in your dashboard."
  },
  fr: {
    title: "Votre Panier",
    description: "Vérifiez les produits dans votre panier. Les abonnements sont renouvelés automatiquement.",
    empty: "Votre panier est vide.",
    monthlySub: "Abonnement Mensuel",
    oneTime: "Paiement Unique",
    qty: "Qté:",
    subtotal: "Sous-total:",
    removeItem: "Retirer l'article",
    oneTimePayments: "Paiements uniques",
    subscriptions: "Abonnements",
    perMonth: "/mois",
    total: "Total",
    checkout: "Passer à la caisse",
    disclaimer: "Vous pouvez annuler à tout moment dans votre tableau de bord."
  }
};

export function CartDrawer() {
  const { cart, removeFromCart, setQty, totals, checkout, isCartOpen, setIsCartOpen } = useCart();
  const { currency } = useCurrency();
  const { language } = useLanguage();
  const t = labels[language.code as keyof typeof labels] || labels.en;

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>{t.title}</SheetTitle>
          <SheetDescription>{t.description}</SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto py-4">
          {cart.length === 0 ? (
            <p className="text-muted-foreground">{t.empty}</p>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-start gap-4 rounded-lg border p-4">
                  <div className="flex-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.type === 'sub' ? t.monthlySub : t.oneTime}
                    </p>
                    {item.type === 'one' && (
                      <div className="mt-2 flex items-center gap-2">
                        <label htmlFor={`qty-${item.id}`} className="text-sm">{t.qty}</label>
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
                        {t.subtotal} {formatCurrency(item.price * item.qty, currency)}
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
                      <span className="sr-only">{t.removeItem}</span>
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
              <span>{t.oneTimePayments}</span>
              <span>{formatCurrency(totals.oneTotal, currency)}</span>
            </div>
            <div className="flex justify-between">
              <span>{t.subscriptions}</span>
              <span>{formatCurrency(totals.subTotal, currency)}{t.perMonth}</span>
            </div>
            <div className="flex justify-between text-base font-bold">
              <span>{t.total}</span>
              <span>{formatCurrency(totals.total, currency)}</span>
            </div>
            <Button 
                className="w-full" 
                onClick={checkout}
                disabled={cart.length === 0}>
              {t.checkout}
            </Button>
            <p className="text-xs text-muted-foreground">{t.disclaimer}</p>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

    