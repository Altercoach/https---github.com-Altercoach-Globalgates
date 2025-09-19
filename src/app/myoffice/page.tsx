
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MyOfficeRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/myoffice/brand');
  }, [router]);

  return (
     <div className="flex h-full w-full items-center justify-center">
      <p>Cargando Oficina...</p>
    </div>
  );
}
