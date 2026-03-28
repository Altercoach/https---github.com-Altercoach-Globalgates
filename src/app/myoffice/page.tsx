
'use client';


import { RouteGuard } from '@/components/auth/route-guard';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/hooks/use-language';

const labels = {
  es: {
    loadingOffice: "Cargando Oficina..."
  },
  en: {
    loadingOffice: "Loading Office..."
  },
  fr: {
    loadingOffice: "Chargement du bureau..."
  }
};

export default function MyOfficeRedirectPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const t = labels[language.code as keyof typeof labels] || labels.en;

  useEffect(() => {
    router.replace('/myoffice/brand');
  }, [router]);

  return (
    <RouteGuard requireAuth requireRole="admin">
      <div className="flex h-full w-full items-center justify-center">
        <p>{t.loadingOffice}</p>
      </div>
    </RouteGuard>
  );
}
