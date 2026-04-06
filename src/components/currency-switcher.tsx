'use client';

import { useCurrency } from '@/hooks/use-currency';
import { CURRENCIES } from '@/lib/constants';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/hooks/use-language';

const labels = {
  es: {
    currency: 'Moneda',
  },
  en: {
    currency: 'Currency',
  },
  fr: {
    currency: 'Devise',
  },
};

export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();
  const { language } = useLanguage();
  const t = labels[language.code as keyof typeof labels] || labels.en;

  const handleValueChange = (currencyCode: string) => {
    const newCurrency = CURRENCIES.find((c) => c.code === currencyCode);
    if (newCurrency) {
      setCurrency(newCurrency);
    }
  };

  return (
    <Select value={currency.code} onValueChange={handleValueChange}>
      <SelectTrigger
        aria-label={t.currency}
        className="w-auto border-0 bg-transparent shadow-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
      >
        <SelectValue placeholder={t.currency} />
      </SelectTrigger>
      <SelectContent>
        {CURRENCIES.map((curr) => (
          <SelectItem key={curr.code} value={curr.code}>
            {curr.code}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
