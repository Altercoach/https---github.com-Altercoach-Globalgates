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

const labels = {
  es: {
    language: 'Idioma',
  },
  en: {
    language: 'Language',
  },
  fr: {
    language: 'Langue',
  },
};

export function LanguageSwitcher() {
  const { language, setLanguage, isTranslating } = useLanguage();
  const t = labels[language.code as keyof typeof labels] || labels.en;

  const handleValueChange = (langCode: string) => {
    const newLang = LANGUAGES.find((l) => l.code === langCode);
    if (newLang) {
      setLanguage(newLang);
    }
  };

  return (
    <Select value={language.code} onValueChange={handleValueChange} disabled={isTranslating}>
      <SelectTrigger
        aria-label={t.language}
        className="w-auto gap-2 border-0 bg-transparent shadow-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
      >
        <Globe className="h-4 w-4" />
        <SelectValue placeholder={t.language} />
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
