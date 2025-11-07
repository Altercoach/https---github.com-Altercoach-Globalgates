
import type { ChartConfig } from '@/components/ui/chart';
import { Project } from '@/lib/types';


export const chartData = [
  { month: "Enero", leads: 186, closed: 20 },
  { month: "Febrero", leads: 305, closed: 35 },
  { month: "Marzo", leads: 237, closed: 25 },
  { month: "Abril", leads: 273, closed: 40 },
  { month: "Mayo", leads: 209, closed: 22 },
  { month: "Junio", leads: 214, closed: 31 },
];

export const chartConfig = {
  leads: {
    label: "Leads Generados",
    color: "hsl(var(--chart-1))",
  },
  closed: {
    label: "Ventas Cerradas",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;


export const projectWorkflowData: Project = {
    id: 'proj_002',
    customerId: 'cus_002',
    customerName: 'Jane Smith',
    currentPhase: 'closure',
    phases: [
      { id: 'onboarding', status: 'completed', name: 'Onboarding y Evaluación', details: 'Formularios completados el 15/05/24' },
      { id: 'research', status: 'completed', name: 'Investigación y Estrategia', details: 'Análisis SWOT y de competencia finalizado.' },
      { id: 'planning', status: 'completed', name: 'Planificación y Calendario', details: 'Parrilla de contenido generada y aprobada.' },
      { id: 'execution', status: 'completed', name: 'Generación y Ejecución', details: '15 de 15 posts generados y publicados.' },
      { id: 'closure', status: 'in_progress', name: 'Optimización y Cierre', details: 'Analizando métricas finales de la campaña.' },
    ]
};


export const pendingActionsData = {
  es: [
    { id: 'brief-marketing', title: 'Brief de Marketing Profesional', description: 'Completa este formulario para que podamos crear tu estrategia.', href: '/questionnaire/brief-marketing'},
    { id: 'eval-negocio', title: 'Evaluación de Negocio (Doctor RX)', description: 'Ayúdanos a entender tu negocio para un diagnóstico preciso.', href: '/questionnaire/eval-001'},
    { id: 'agent-training', title: 'Entrenamiento de Agente IA', description: 'Proporciona la información para configurar tu asistente virtual.', href: '/questionnaire/agent-training'},
    { id: 'satisfaction-survey', title: 'Encuesta de Satisfacción', description: 'Tu opinión nos ayuda a mejorar nuestros servicios.', href: '/questionnaire/satisfaction-survey'},
  ],
  en: [
    { id: 'brief-marketing', title: 'Professional Marketing Brief', description: 'Complete this form so we can create your strategy.', href: '/questionnaire/brief-marketing'},
    { id: 'eval-negocio', title: 'Business Evaluation (Doctor RX)', description: 'Help us understand your business for an accurate diagnosis.', href: '/questionnaire/eval-001'},
    { id: 'agent-training', title: 'AI Agent Training', description: 'Provide the information to configure your virtual assistant.', href: '/questionnaire/agent-training'},
    { id: 'satisfaction-survey', title: 'Satisfaction Survey', description: 'Your feedback helps us improve our services.', href: '/questionnaire/satisfaction-survey'},
  ],
  fr: [
    { id: 'brief-marketing', title: 'Brief de Marketing Professionnel', description: 'Remplissez ce formulaire pour que nous puissions créer votre stratégie.', href: '/questionnaire/brief-marketing'},
    { id: 'eval-negocio', title: 'Évaluation d\'Entreprise (Docteur RX)', description: 'Aidez-nous à comprendre votre entreprise pour un diagnostic précis.', href: '/questionnaire/eval-001'},
    { id: 'agent-training', title: 'Formation d\'Agent IA', description: 'Fournissez les informations pour configurer votre assistant virtuel.', href: '/questionnaire/agent-training'},
    { id: 'satisfaction-survey', title: 'Enquête de Satisfaction', description: 'Vos commentaires nous aident à améliorer nos services.', href: '/questionnaire/satisfaction-survey'},
  ]
}

// THIS IS DEPRECATED AND WILL BE REMOVED.
// The analysis is now part of the project workflow.
export const visibleAnalysesData = {
  es: [ { id: 'analysis-eval-001', title: 'Análisis de Evaluación de Negocio', analysis: { swot: { strengths: "Producto estrella (cold brew) con alta demanda potencial.", weaknesses: "Poca presencia de marca y falta de un canal de ventas digital claro.", opportunities: "Mercado local en crecimiento para cafés de especialidad.", threats: "Competencia de cafeterías establecidas en la zona centro." }, recommendations: "1. **Lanzar Campaña de Branding Local**: Enfocarse en Instagram para dar a conocer el 'cold brew'.\n2. **Implementar Funnel de Ventas**: Crear una landing page para capturar leads interesados en pedidos grandes.\n\n**Plan Sugerido**: Contratar 'Setup Funnel' y 'Marketing de Contenido'." } } ],
  en: [ { id: 'analysis-eval-001', title: 'Business Evaluation Analysis', analysis: { swot: { strengths: "Star product (cold brew) with high potential demand.", weaknesses: "Low brand presence and lack of a clear digital sales channel.", opportunities: "Growing local market for specialty coffees.", threats: "Competition from established coffee shops downtown." }, recommendations: "1. **Launch Local Branding Campaign**: Focus on Instagram to promote the 'cold brew'.\n2. **Implement Sales Funnel**: Create a landing page to capture leads interested in large orders.\n\n**Suggested Plan**: Hire 'Setup Funnel' and 'Content Marketing'." } } ],
  fr: [ { id: 'analysis-eval-001', title: 'Analyse de l\'Évaluation d\'Entreprise', analysis: { swot: { strengths: "Produit phare (cold brew) avec une forte demande potentielle.", weaknesses: "Faible présence de marque et absence de canal de vente numérique clair.", opportunities: "Marché local en croissance pour les cafés de spécialité.", threats: "Concurrence des cafés établis au centre-ville." }, recommendations: "1. **Lancer une campagne de branding locale**: Se concentrer sur Instagram pour faire connaître le 'cold brew'.\n2. **Mettre en place un entonnoir de vente**: Créer une page de destination pour capturer les prospects intéressés par les grosses commandes.\n\n**Plan suggéré**: Engager 'Setup Funnel' et 'Marketing de Contenu'." } } ],
};

    