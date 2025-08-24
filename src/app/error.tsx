'use client';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background">
      <Card className="w-[420px]">
        <CardHeader>
          <CardTitle>An UI Error Occurred</CardTitle>
          <CardDescription>Something went wrong on our end.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">{error.message}</p>
          <Button onClick={() => reset()} className="mt-4">
            Try again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
