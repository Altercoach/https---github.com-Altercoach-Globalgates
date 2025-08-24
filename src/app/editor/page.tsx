
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EditorRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/editor/brand');
  }, [router]);

  return (
     <div className="flex h-full w-full items-center justify-center">
      <p>Loading Editor...</p>
    </div>
  );
}
