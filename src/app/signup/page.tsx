'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { hasPurchased } = useCart();
  const { toast } = useToast();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API endpoint
    toast({
      title: 'Account Created!',
      description: 'You can now log in with your new credentials.',
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>Sign up to manage your services.</CardDescription>
        </CardHeader>
        <CardContent>
          {!hasPurchased && (
            <Alert variant="default" className="mb-4 bg-accent/10 border-accent/30">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Sign Up Disabled</AlertTitle>
              <AlertDescription>
                To create an account, please purchase one of our plans first.
              </AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSignup} className="space-y-4">
            <fieldset disabled={!hasPurchased} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={!hasPurchased}>
                Create Account
              </Button>
            </fieldset>
             <Button variant="outline" className="w-full" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
