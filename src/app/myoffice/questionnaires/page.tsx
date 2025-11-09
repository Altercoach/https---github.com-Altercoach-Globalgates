
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, FileText, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/hooks/use-language';

const sampleTemplates = [
  {
    id: 'business-evaluation-001',
    name: 'Cuestionario de Evaluación de Negocio',
    description: 'Para análisis de negocio (Doctor RX).',
    href: '/questionnaire/business-evaluation-001'
  },
  {
    id: 'brief-marketing',
    name: 'Brief de Marketing Profesional',
    description: 'Para clientes que contratan campañas de marketing.',
    href: '/questionnaire/brief-marketing'
  },
  {
    id: 'agent-training',
    name: 'Entrenamiento de Agente IA',
    description: 'Para configurar el asistente virtual del cliente.',
    href: '/questionnaire/agent-training'
  },
  {
    id: 'satisfaction-survey',
    name: 'Encuesta de Satisfacción',
    description: 'Para enviar al finalizar un proyecto o campaña.',
    href: '/questionnaire/satisfaction-survey'
  }
];


const labels = {
  es: {
    pageTitle: "Gestión de Plantillas de Cuestionarios",
    pageSubtitle: "Crea, edita y gestiona las plantillas de cuestionarios que asignas a tus clientes.",
    newQuestionnaire: "Crear Nueva Plantilla con IA",
    templateList: "Plantillas Disponibles",
    templateListDesc: "Estas son las plantillas que puedes asignar a tus planes de servicio.",
    name: "Nombre de la Plantilla",
    description: "Descripción",
    actions: "Acciones",
    edit: "Ver / Editar",
    delete: "Eliminar"
  },
  en: {
    pageTitle: "Questionnaire Template Management",
    pageSubtitle: "Create, edit, and manage the questionnaire templates you assign to your clients.",
    newQuestionnaire: "Create New Template with AI",
    templateList: "Available Templates",
    templateListDesc: "These are the templates you can assign to your service plans.",
    name: "Template Name",
    description: "Description",
    actions: "Actions",
    edit: "View / Edit",
    delete: "Delete"
  },
  fr: {
    pageTitle: "Gestion des Modèles de Questionnaire",
    pageSubtitle: "Créez, modifiez et gérez les modèles de questionnaire que vous assignez à vos clients.",
    newQuestionnaire: "Créer un Nouveau Modèle avec l'IA",
    templateList: "Modèles Disponibles",
    templateListDesc: "Ce sont les modèles que vous pouvez assigner à vos plans de service.",
    name: "Nom du Modèle",
    description: "Description",
    actions: "Actions",
    edit: "Voir / Modifier",
    delete: "Supprimer"
  }
};


export default function QuestionnairesPage() {
  const { language } = useLanguage();
  const t = labels[language.code as keyof typeof labels] || labels.en;

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

      <Card>
        <CardHeader>
          <CardTitle>{t.templateList}</CardTitle>
          <CardDescription>{t.templateListDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.name}</TableHead>
                <TableHead>{t.description}</TableHead>
                <TableHead className="text-right">{t.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleTemplates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground"/>
                        {template.name}
                    </TableCell>
                    <TableCell>{template.description}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={template.href}>
                          <Edit className="mr-2 h-3 w-3" />
                          {t.edit}
                        </Link>
                      </Button>
                       <Button variant="destructive" size="sm" disabled>
                          <Trash2 className="mr-2 h-3 w-3" />
                          {t.delete}
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
