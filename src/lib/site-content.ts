import type { SiteData } from '@/lib/types';
import { FEATURE_FLAGS } from './feature-flags';

const defaultAgentSystemPrompt = `Eres '[Agent Name]', un asistente experto de [Brand Name]. Tu rol es ser amigable, proactivo y muy eficiente.
OBJETIVO: Convertir visitantes en leads calificados y resolver dudas de primer nivel.
REGLAS:
1. SIEMPRE pide nombre, email y telefono para registrar un lead.
2. NUNCA ofrezcas descuentos a menos que se indique en la BASE DE CONOCIMIENTO.
3. Si no sabes una respuesta, di: "Excelente pregunta. Permiteme consultarlo con un especialista para darte la informacion precisa. ¿Me das tu correo para contactarte?". Y registra el lead. Para escalar, usa el correo: [Support Email].
4. NUNCA te refieras a ti mismo como una IA. Eres un miembro del equipo. Para escalar, usa frases como "consultare con el departamento tecnico".
5. Usa la BASE DE CONOCIMIENTO como tu unica fuente de verdad.
6. NUNCA atiendas a los contactos en la LISTA DE EXCLUSION. Si te contactan, responde: "¡Hola! En un momento te atiende un miembro del equipo." y no continues la conversacion.`;

const defaultAgentKnowledgeBase = `https://www.goldenkey.website/products
https://www.goldenkey.website/contact

Horario de atencion del equipo: Lunes a Viernes, 9am - 6pm (Hora del Pacifico).
Promocion actual: 10% de descuento en el plan 'Portal Maestro Digital' para nuevos clientes. Codigo: LAUNCH10.`;

export const DEFAULT_SITE_CONTENT: SiteData = {
  brand: {
    name: { es: 'Goldek Key International', en: 'Goldek Key International', fr: 'Goldek Key International' },
    tagline: { es: 'Estrategia digital con IA para hacer crecer tu negocio.', en: 'AI-powered digital strategy to grow your business.', fr: 'Strategie numerique pilotee par IA pour faire croitre votre entreprise.' },
    heroTitle: { es: 'Transforma tu negocio con Inteligencia Artificial', en: 'Transform Your Business with Artificial Intelligence', fr: 'Transformez votre entreprise avec l\'Intelligence Artificielle' },
    heroSubtitle: { es: 'Estrategias de marketing digital, automatizacion y agentes IA para empresas que quieren crecer.', en: 'Digital marketing strategies, automation and AI agents for businesses that want to grow.', fr: 'Strategies de marketing numerique, automatisation et agents IA pour les entreprises qui veulent croitre.' },
    heroImage: '/hero-default.jpg',
    colors: { gold: '#D4AF37', ink: '#1a1a2e', bg: '#f8f9fa', slate: '#64748b' },
  },
  agentPersona: {
    firstName: 'Aria',
    lastName: 'Gates',
    avatar: '/favicon.ico',
  },
  agentConfig: {
    isActive: true,
    gender: 'female',
    systemPrompt: defaultAgentSystemPrompt,
    knowledgeBase: defaultAgentKnowledgeBase,
    supportEmail: 'atencion@goldenkey.website',
    exclusionList: 'proveedor@email.com\n+1234567890',
    sharePath: '/chat',
    apiKeys: {
      whatsapp: '',
      instagram: '',
      messenger: '',
      linkedin: '',
      twitter: '',
    },
  },
  socialLinks: {
    facebook: '',
    instagram: '',
    x: '',
    linkedin: '',
    youtube: '',
    tiktok: '',
    whatsapp: '',
    threads: '',
  },
  services: [
    {
      id: 'solution-sm',
      visible: true,
      title: { es: 'Marketing en Redes Sociales', en: 'Social Media Marketing', fr: 'Marketing sur les Reseaux Sociaux' },
      bullets: [
        { es: 'Gestion profesional de Instagram, Facebook, TikTok y LinkedIn.', en: 'Professional management of Instagram, Facebook, TikTok and LinkedIn.', fr: 'Gestion professionnelle d\'Instagram, Facebook, TikTok et LinkedIn.' },
        { es: 'Contenido estrategico generado con IA y revisado por expertos.', en: 'Strategic content generated with AI and reviewed by experts.', fr: 'Contenu strategique genere par IA et revise par des experts.' },
        { es: 'Reportes de desempeno mensuales con metricas clave.', en: 'Monthly performance reports with key metrics.', fr: 'Rapports de performance mensuels avec indicateurs cles.' },
      ],
      features: [FEATURE_FLAGS.AI_MARKETING_ASSISTANT, FEATURE_FLAGS.AI_CONTENT_GENERATION],
      agents: [{ id: 'ai_marketing_assistant', name: 'AI Marketing Assistant', enabled: true }],
    },
    {
      id: 'solution-seo',
      visible: true,
      title: { es: 'SEO y Posicionamiento Web', en: 'SEO and Web Positioning', fr: 'SEO et Positionnement Web' },
      bullets: [
        { es: 'Analisis de competencia y palabras clave con IA.', en: 'AI-powered competitor and keyword analysis.', fr: 'Analyse de la concurrence et des mots-cles par l\'IA.' },
        { es: 'Optimizacion on-page y creacion de contenido estrategico.', en: 'On-page optimization and strategic content creation.', fr: 'Optimisation on-page et creation de contenu strategique.' },
        { es: 'Monitoreo de rankings y reportes de visibilidad mensuales.', en: 'Ranking monitoring and monthly visibility reports.', fr: 'Suivi du classement et rapports de visibilite mensuels.' },
      ],
      features: [FEATURE_FLAGS.ANALYTICS_INTEGRATION],
    },
    {
      id: 'solution-ads',
      visible: true,
      title: { es: 'Publicidad Digital (Meta y Google Ads)', en: 'Digital Advertising (Meta & Google Ads)', fr: 'Publicite Numerique (Meta et Google Ads)' },
      bullets: [
        { es: 'Campanas segmentadas en Facebook, Instagram y Google.', en: 'Targeted campaigns on Facebook, Instagram and Google.', fr: 'Campagnes ciblees sur Facebook, Instagram et Google.' },
        { es: 'Optimizacion continua de anuncios para maximizar el ROI.', en: 'Continuous ad optimization to maximize ROI.', fr: 'Optimisation continue des annonces pour maximiser le ROI.' },
        { es: 'Integra con IA para ajuste automatico de pujas y audiencias.', en: 'AI integration for automatic bid and audience adjustment.', fr: 'Integration IA pour ajustement automatique des encheres et audiences.' },
      ],
      features: [FEATURE_FLAGS.AI_CAMPAIGN_PLANNER],
    },
    {
      id: 'solution-agency-partner',
      visible: true,
      title: { es: 'Programa para Agencias (White Label)', en: 'Agency Partner Program (White Label)', fr: 'Programme Partenaire Agence (Marque Blanche)' },
      bullets: [
        { es: 'Operacion white label para que tu agencia escale sin ampliar equipo interno.', en: 'White-label operations so your agency can scale without expanding your internal team.', fr: 'Operations en marque blanche pour faire evoluer votre agence sans agrandir votre equipe interne.' },
        { es: 'Produccion mensual multicanal (IG, FB, LinkedIn, Threads, TikTok) con enjambre de IAs.', en: 'Monthly multi-channel production (IG, FB, LinkedIn, Threads, TikTok) with AI swarm workflows.', fr: 'Production mensuelle multicanal (IG, FB, LinkedIn, Threads, TikTok) avec workflow d essaim IA.' },
        { es: 'SLAs, tablero colaborativo y entregables listos para revender a tus clientes.', en: 'SLAs, collaborative dashboard, and deliverables ready to resell to your clients.', fr: 'SLA, tableau collaboratif et livrables prets a revendre a vos clients.' },
      ],
      features: [FEATURE_FLAGS.AGENCY_WHITE_LABEL, FEATURE_FLAGS.AI_CONTENT_SCHEDULER, FEATURE_FLAGS.AI_INSIGHTS_AND_RECOMMENDATIONS],
      agents: [
        { id: 'agency_orchestrator', name: 'Agency Orchestrator', enabled: true },
        { id: 'ai_marketing_assistant', name: 'AI Marketing Assistant', enabled: true },
      ],
    },
    {
      id: 'solution-on-demand-studio',
      visible: true,
      title: { es: 'Studio On Demand (A la Carta)', en: 'On-Demand Studio (A la Carte)', fr: 'Studio On-Demand (A la Carte)' },
      bullets: [
        { es: 'Activa sprint creativo por horas o entregables: copies, piezas, micro-videos y anuncios.', en: 'Activate creative sprints by hours or deliverables: copies, assets, micro-videos, and ads.', fr: 'Activez des sprints creatifs par heures ou livrables : copies, visuels, micro-videos et annonces.' },
        { es: 'Define prioridad, presupuesto y fecha; el sistema arma paquete personalizado automaticamente.', en: 'Set priority, budget, and due date; the system assembles a personalized package automatically.', fr: 'Definissez priorite, budget et date; le systeme assemble automatiquement un package personnalise.' },
        { es: 'Ideal para lanzamientos, temporadas altas o picos de demanda.', en: 'Ideal for launches, peak seasons, or sudden demand spikes.', fr: 'Ideal pour les lancements, hautes saisons ou pics de demande.' },
      ],
      features: [FEATURE_FLAGS.ON_DEMAND_STUDIO, FEATURE_FLAGS.CUSTOM_PACKAGE_BUILDER, FEATURE_FLAGS.ONE_TIME_PAYMENTS],
      agents: [
        { id: 'swarm_scheduler', name: 'Swarm Scheduler', enabled: true },
      ],
    },
  ],
  products: [
    {
      id: 'prod_social_1',
      visible: true,
      type: 'sub',
      price: 150,
      name: { es: 'Plan Social Inicial', en: 'Starter Social Plan', fr: 'Plan Social Initial' },
      badge: { es: 'Inicial', en: 'Starter', fr: 'Debutant' },
      note: { es: '1 red social, 8 posts, 4 historias, reporte simple.', en: '1 social network, 8 posts, 4 stories, simple report.', fr: '1 reseau social, 8 posts, 4 stories, rapport simple.' },
      description: { es: 'Ideal para empezar. Incluye 1 red (IG o FB), 8 publicaciones y 4 historias al mes.', en: 'Ideal to get started. Includes 1 network (IG or FB), 8 posts and 4 stories per month.', fr: 'Ideal pour commencer. Comprend 1 reseau (IG ou FB), 8 publications et 4 stories par mois.' },
      features: [FEATURE_FLAGS.AI_MARKETING_ASSISTANT],
      agents: [{ id: 'ai_marketing_assistant', name: 'AI Marketing Assistant', enabled: true }],
      bundleId: 'bundle_social',
    },
    {
      id: 'prod_social_2',
      visible: true,
      type: 'sub',
      price: 350,
      name: { es: 'Plan Social Crecimiento', en: 'Growth Social Plan', fr: 'Plan Social Croissance' },
      badge: { es: 'Crecimiento', en: 'Growth', fr: 'Croissance' },
      note: { es: '2 redes, 12 posts, 8 historias, gestion de comentarios.', en: '2 networks, 12 posts, 8 stories, comment management.', fr: '2 reseaux, 12 posts, 8 stories, gestion des commentaires.' },
      description: { es: 'Expande tu alcance a 2 redes. Incluye 12 publicaciones, 8 historias y gestion de comentarios.', en: 'Expand your reach to 2 networks. Includes 12 posts, 8 stories and comment management.', fr: 'Etendez votre portee a 2 reseaux. Comprend 12 publications, 8 stories et gestion des commentaires.' },
      features: [FEATURE_FLAGS.AI_CONTENT_GENERATION, FEATURE_FLAGS.CRM_LIGHT],
    },
    {
      id: 'prod_social_3',
      visible: true,
      type: 'sub',
      price: 850,
      name: { es: 'Plan Social Pro', en: 'Pro Social Plan', fr: 'Plan Social Pro' },
      badge: { es: 'Pro', en: 'Pro', fr: 'Pro' },
      note: { es: '3 redes, 20 posts, reels, optimizacion IA, soporte prioritario.', en: '3 networks, 20 posts, reels, AI optimization, priority support.', fr: '3 reseaux, 20 posts, reels, optimisation IA, support prioritaire.' },
      description: { es: 'Dominio en 3 redes con 20 publicaciones, 12 historias, reels y soporte prioritario.', en: 'Dominate 3 networks with 20 posts, 12 stories, reels and priority support.', fr: 'Dominez 3 reseaux avec 20 publications, 12 stories, reels et support prioritaire.' },
      features: [FEATURE_FLAGS.AI_CONTENT_SCHEDULER, FEATURE_FLAGS.AI_CAMPAIGN_PLANNER, FEATURE_FLAGS.ANALYTICS_INTEGRATION],
    },
    {
      id: 'prod_ai_agent',
      visible: true,
      type: 'sub',
      price: 200,
      name: { es: 'Agente IA 24/7', en: 'AI Agent 24/7', fr: 'Agent IA 24/7' },
      badge: { es: 'IA', en: 'AI', fr: 'IA' },
      note: { es: 'Atencion automatizada por WhatsApp, Messenger e Instagram DMs.', en: 'Automated support via WhatsApp, Messenger and Instagram DMs.', fr: 'Support automatise via WhatsApp, Messenger et Instagram DMs.' },
      description: { es: 'Agente conversacional con IA para atender a tus clientes en todos los canales de mensajeria.', en: 'Conversational AI agent to serve your customers across all messaging channels.', fr: 'Agent conversationnel IA pour servir vos clients sur tous les canaux de messagerie.' },
      features: [FEATURE_FLAGS.AI_MARKETING_ASSISTANT],
      agents: [{ id: 'ai_marketing_assistant', name: 'AI Marketing Assistant', enabled: true }],
    },
    {
      id: 'prod_agency_scale_kit',
      visible: true,
      type: 'sub',
      price: 1200,
      name: { es: 'Agency Scale Kit', en: 'Agency Scale Kit', fr: 'Agency Scale Kit' },
      badge: { es: 'Agencias', en: 'Agencies', fr: 'Agences' },
      note: { es: 'White label + gestor dedicado + 5 cuentas cliente incluidas.', en: 'White label + dedicated manager + 5 client accounts included.', fr: 'Marque blanche + gestionnaire dedie + 5 comptes clients inclus.' },
      description: { es: 'Plan de subscripcion para agencias que quieren revender servicios digitales bajo su marca.', en: 'Subscription plan for agencies that want to resell digital services under their own brand.', fr: 'Abonnement pour les agences qui souhaitent revendre des services numeriques sous leur propre marque.' },
      features: [FEATURE_FLAGS.AGENCY_WHITE_LABEL, FEATURE_FLAGS.MULTI_USER_ACCOUNTS, FEATURE_FLAGS.CUSTOM_DOMAINS],
      agents: [
        { id: 'agency_orchestrator', name: 'Agency Orchestrator', enabled: true },
      ],
      bundleId: 'bundle_agency_hub',
    },
    {
      id: 'prod_custom_pack_on_demand',
      visible: true,
      type: 'one',
      price: 450,
      name: { es: 'Paquete On Demand Personalizado', en: 'Custom On-Demand Package', fr: 'Pack On-Demand Personnalise' },
      badge: { es: 'A la carta', en: 'A la carte', fr: 'A la carte' },
      note: { es: 'Pago unico. Define piezas, canales y velocidad de entrega.', en: 'One-time payment. Define assets, channels, and delivery speed.', fr: 'Paiement unique. Definissez livrables, canaux et vitesse de livraison.' },
      description: { es: 'Configura un paquete a medida para una necesidad puntual sin contratar suscripcion mensual.', en: 'Configure a tailored package for a specific need without a monthly subscription.', fr: 'Configurez un package sur mesure pour un besoin ponctuel sans abonnement mensuel.' },
      features: [FEATURE_FLAGS.ON_DEMAND_STUDIO, FEATURE_FLAGS.CUSTOM_PACKAGE_BUILDER, FEATURE_FLAGS.ONE_TIME_PAYMENTS],
      bundleId: 'bundle_agency_hub',
    },
  ],
  bundles: [
    {
      id: 'bundle_social',
      visible: true,
      name: { es: 'Bundle Social', en: 'Social Bundle', fr: 'Bundle Social' },
      description: { es: 'Todos los planes sociales con IA y analitica.', en: 'All social plans with AI and analytics.', fr: 'Tous les plans sociaux avec IA et analytique.' },
      products: ['prod_social_1', 'prod_social_2', 'prod_social_3'],
      services: ['solution-sm'],
      features: [FEATURE_FLAGS.AI_MARKETING_ASSISTANT, FEATURE_FLAGS.ANALYTICS_INTEGRATION],
      agents: [
        { id: 'ai_marketing_assistant', name: 'AI Marketing Assistant', enabled: true },
        { id: 'crm_bot', name: 'CRM Bot', enabled: false },
      ],
    },
    {
      id: 'bundle_agency_hub',
      visible: true,
      name: { es: 'Agency Hub + On Demand', en: 'Agency Hub + On Demand', fr: 'Agency Hub + On-Demand' },
      description: { es: 'Bundle para agencias: operacion white label, studio a la carta y automatizacion multicanal.', en: 'Bundle for agencies: white-label operations, a la carte studio, and multi-channel automation.', fr: 'Bundle pour agences : operations marque blanche, studio a la carte et automatisation multicanal.' },
      products: ['prod_agency_scale_kit', 'prod_custom_pack_on_demand', 'prod_ai_agent'],
      services: ['solution-agency-partner', 'solution-on-demand-studio', 'solution-sm'],
      features: [
        FEATURE_FLAGS.AGENCY_WHITE_LABEL,
        FEATURE_FLAGS.ON_DEMAND_STUDIO,
        FEATURE_FLAGS.CUSTOM_PACKAGE_BUILDER,
        FEATURE_FLAGS.AI_CONTENT_SCHEDULER,
        FEATURE_FLAGS.AI_INSIGHTS_AND_RECOMMENDATIONS,
      ],
      agents: [
        { id: 'agency_orchestrator', name: 'Agency Orchestrator', enabled: true },
        { id: 'swarm_scheduler', name: 'Swarm Scheduler', enabled: true },
        { id: 'ai_marketing_assistant', name: 'AI Marketing Assistant', enabled: true },
      ],
    },
  ],
};
