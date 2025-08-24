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

export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();

  const handleValueChange = (currencyCode: string) => {
    const newCurrency = CURRENCIES.find((c) => c.code === currencyCode);
    if (newCurrency) {
      setCurrency(newCurrency);
    }
  };

  return (
    <Select value={currency.code} onValueChange={handleValueChange}>
      <SelectTrigger className="w-auto border-0 bg-transparent shadow-none focus:ring-0 focus:ring-offset-0">
        <SelectValue placeholder="Currency" />
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
