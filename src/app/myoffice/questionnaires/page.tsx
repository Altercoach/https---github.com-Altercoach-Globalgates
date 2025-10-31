
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, FileText, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { es, enUS, fr } from 'date-fns/locale';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useLanguage } from '@/hooks/use-language';

const sampleQuestionnaires = [
  {
    id: 'brief-001',
    clientEmail: 'cliente.a@example.com',
    type: 'Evaluación de Negocio',
    type_en: 'Business Evaluation',
    type_fr: 'Évaluation d\'Entreprise',
    status: 'Completado',
    date: new Date('2024-05-10'),
  },
  {
    id: 'brief-marketing-002',
    clientEmail: 'cliente.b@example.com',
    type: 'Brief de Marketing Profesional',
    type_en: 'Professional Marketing Brief',
    type_fr: 'Brief de Marketing Professionnel',
    status: 'Pendiente',
    date: new Date('2024-05-15'),
  },
  {
    id: 'agent-training-001',
    clientEmail: 'cliente.c@example.com',
    type: 'Entrenamiento de Agente IA',
    type_en: 'AI Agent Training',
    type_fr: 'Formation d\'Agent IA',
    status: 'Completado',
    date: new Date('2024-05-18'),
  }
];

const labels = {
  es: {
    pageTitle: "Cuestionarios de Clientes",
    pageSubtitle: "Crea, envía y revisa los cuestionarios de tus clientes.",
    newQuestionnaire: "Nuevo Cuestionario",
    templatesTitle: "Gestión de Plantillas",
    templatesDescription: "Actualmente, puedes asignar la \"Evaluación de Negocio\" o el \"Brief de Marketing\". En el futuro, desde aquí podrás crear y gestionar tus propias plantillas de formularios.",
    recentSubmissions: "Envíos Recientes",
    recentSubmissionsDesc: "Lista de cuestionarios enviados a clientes.",
    client: "Cliente",
    type: "Tipo",
    sentDate: "Fecha de Envío",
    status: "Estado",
    actions: "Acciones",
    viewResponses: "Ver Respuestas",
    viewSubmission: "Ver Envío",
    completed: "Completado",
    pending: "Pendiente",
  },
  en: {
    pageTitle: "Customer Questionnaires",
    pageSubtitle: "Create, send, and review your customers' questionnaires.",
    newQuestionnaire: "New Questionnaire",
    templatesTitle: "Template Management",
    templatesDescription: "Currently, you can assign the \"Business Evaluation\" or \"Marketing Brief\". In the future, you will be able to create and manage your own form templates from here.",
    recentSubmissions: "Recent Submissions",
    recentSubmissionsDesc: "List of questionnaires sent to customers.",
    client: "Client",
    type: "Type",
    sentDate: "Sent Date",
    status: "Status",
    actions: "Actions",
    viewResponses: "View Responses",
    viewSubmission: "View Submission",
    completed: "Completed",
    pending: "Pending",
  },
  fr: {
    pageTitle: "Questionnaires Clients",
    pageSubtitle: "Créez, envoyez et examinez les questionnaires de vos clients.",
    newQuestionnaire: "Nouveau Questionnaire",
    templatesTitle: "Gestion des Modèles",
    templatesDescription: "Actuellement, vous pouvez assigner \"l'Évaluation d'Entreprise\" ou le \"Brief de Marketing\". À l'avenir, vous pourrez créer et gérer vos propres modèles de formulaires à partir d'ici.",
    recentSubmissions: "Soumissions Récentes",
    recentSubmissionsDesc: "Liste des questionnaires envoyés aux clients.",
    client: "Client",
    type: "Type",
    sentDate: "Date d'envoi",
    status: "Statut",
    actions: "Actions",
    viewResponses: "Voir les Réponses",
    viewSubmission: "Voir la Soumission",
    completed: "Complété",
    pending: "En attente",
  }
};


export default function QuestionnairesPage() {
  const { language } = useLanguage();
  const t = labels[language.code as keyof typeof labels] || labels.en;
  const locale = { es, en: enUS, fr }[language.code] || enUS;

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold">{t.pageTitle}</h1>
          <p className="text-muted-foreground">{t.pageSubtitle}</p>
        </div>
        <Button asChild>
          <Link href="/myoffice/questionnaires/new">
            <PlusCircle className="mr-2" />
            {t.newQuestionnaire}
          </Link>
        </Button>
      </header>

      <Alert>
        <FileText className="h-4 w-4" />
        <AlertTitle>{t.templatesTitle}</AlertTitle>
        <AlertDescription>{t.templatesDescription}</AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>{t.recentSubmissions}</CardTitle>
          <CardDescription>{t.recentSubmissionsDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.client}</TableHead>
                <TableHead>{t.type}</TableHead>
                <TableHead>{t.sentDate}</TableHead>
                <TableHead>{t.status}</TableHead>
                <TableHead className="text-right">{t.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleQuestionnaires.map((q) => {
                const isCompleted = q.status === 'Completado';
                const typeKey = `type_${language.code}` as keyof typeof q;
                const questionnaireType = q[typeKey] || q.type;

                return (
                  <TableRow key={q.id}>
                    <TableCell className="font-medium">{q.clientEmail}</TableCell>
                    <TableCell>{questionnaireType}</TableCell>
                    <TableCell>{format(q.date, "dd MMM, yyyy", { locale })}</TableCell>
                    <TableCell>
                      <Badge variant={isCompleted ? 'default' : 'secondary'} className={isCompleted ? 'bg-accent text-accent-foreground' : ''}>
                        {isCompleted ? <CheckCircle className="mr-1 h-3 w-3" /> : <Clock className="mr-1 h-3 w-3" />}
                        {isCompleted ? t.completed : t.pending}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/myoffice/questionnaires/${q.id}`}>
                          {isCompleted ? t.viewResponses : t.viewSubmission}
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
