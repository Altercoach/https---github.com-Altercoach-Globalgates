'use client';

import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KeyRound, CreditCard, BarChart, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { auth, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth.loggedIn) {
      router.push('/login');
    }
  }, [auth.loggedIn, router]);

  if (!auth.loggedIn) {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <p>Redirecting to login...</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <div className="container mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold font-headline">Client Dashboard</h1>
          <Button onClick={logout} variant="outline">Logout</Button>
        </header>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">User</CardTitle>
              <KeyRound className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="truncate text-lg font-bold">{auth.user?.email}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Subscription management coming soon.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Analytics</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
               <p className="text-muted-foreground">Funnel KPIs and leads coming soon.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Billing</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Payment history coming soon.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
