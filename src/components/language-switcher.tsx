'use client';

import { useLanguage } from '@/hooks/use-language';
import { LANGUAGES } from '@/lib/constants';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { language, setLanguage, isTranslating } = useLanguage();

  const handleValueChange = (langCode: string) => {
    const newLang = LANGUAGES.find((l) => l.code === langCode);
    if (newLang) {
      setLanguage(newLang);
    }
  };

  return (
    <Select value={language.code} onValueChange={handleValueChange} disabled={isTranslating}>
      <SelectTrigger className="w-auto gap-2 border-0 bg-transparent shadow-none focus:ring-0 focus:ring-offset-0">
        <Globe className="h-4 w-4" />
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        {LANGUAGES.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
