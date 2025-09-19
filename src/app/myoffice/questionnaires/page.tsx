
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, FileText, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Datos de ejemplo
const sampleQuestionnaires = [
  {
    id: 'brief-001',
    clientEmail: 'cliente.a@example.com',
    type: 'Evaluación de Negocio',
    status: 'Completado',
    date: new Date('2024-05-10'),
  },
  {
    id: 'brief-002',
    clientEmail: 'cliente.b@example.com',
    type: 'Evaluación de Negocio',
    status: 'Pendiente',
    date: new Date('2024-05-15'),
  },
];

export default function QuestionnairesPage() {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold">Cuestionarios de Clientes</h1>
          <p className="text-muted-foreground">Crea, envía y revisa los cuestionarios de tus clientes.</p>
        </div>
        <Button asChild>
          <Link href="/myoffice/questionnaires/new">
            <PlusCircle className="mr-2" />
            Nuevo Cuestionario
          </Link>
        </Button>
      </header>

      <Alert>
        <FileText className="h-4 w-4" />
        <AlertTitle>Gestión de Plantillas</AlertTitle>
        <AlertDescription>
          Actualmente, solo está disponible la plantilla "Evaluación de Negocio". En el futuro, desde aquí podrás crear y gestionar tus propias plantillas de formularios.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Envíos Recientes</CardTitle>
          <CardDescription>Lista de cuestionarios enviados a clientes.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Fecha de Envío</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleQuestionnaires.map((q) => (
                <TableRow key={q.id}>
                  <TableCell className="font-medium">{q.clientEmail}</TableCell>
                  <TableCell>{q.type}</TableCell>
                  <TableCell>{format(q.date, "dd MMM, yyyy", { locale: es })}</TableCell>
                  <TableCell>
                    <Badge variant={q.status === 'Completado' ? 'default' : 'secondary'} className={q.status === 'Completado' ? 'bg-green-100 text-green-800' : ''}>
                      {q.status === 'Completado' ? <CheckCircle className="mr-1" /> : <Clock className="mr-1" />}
                      {q.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/myoffice/questionnaires/${q.id}`}>
                        {q.status === 'Completado' ? 'Ver Respuestas' : 'Ver Envío'}
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

    