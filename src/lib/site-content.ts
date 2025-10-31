
import type { SiteData } from '@/lib/types';
import { defaultFeatures } from '@/lib/constants';

export const DEFAULT_SITE_CONTENT: SiteData = {
  brand: {
    name: {
      es: 'Golden Key',
      en: 'Golden Key',
      fr: 'Clé Dorée',
    },
    tagline: {
      es: 'Marketing Estratégico, Automatización e IA que abren las puertas a tu crecimiento',
      en: 'Strategic Marketing, Automation & AI that open the doors to your growth',
      fr: 'Marketing Stratégique, Automatisation et IA qui ouvrent les portes de votre croissance',
    },
    heroTitle: {
      es: 'Aumenta tus ventas, posiciona tu marca y estimula la preferencia.',
      en: 'Increase your sales, position your brand, and stimulate preference.',
      fr: 'Augmentez vos ventes, positionnez votre marque et stimulez la préférence.',
    },
    heroSubtitle: {
      es: 'Contrata ahora mismo campañas de marketing, embudos de ventas, automatizaciones y agentes de inteligencia a tu servicio 24/7.',
      en: 'Hire marketing campaigns, sales funnels, automations, and AI agents at your service 24/7.',
      fr: 'Engagez des campagnes marketing, des entonnoirs de vente, des automatisations et des agents IA à votre service 24/7.',
    },
    heroImage: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2832&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    colors: {
      gold: '#d4af37',
      ink: '#0f172a',
      bg: '#ffffff',
      slate: '#111315',
    },
  },
  services: [
    { id: 'svc-funnel', visible: true, title: { es: 'Creación de Embudo de Ventas', en: 'Sales Funnel Creation', fr: 'Création d\'Entonnoir de Vente' }, bullets: [
      { es: 'Landing Page optimizada para conversión', en: 'Landing Page optimized for conversion', fr: 'Page de destination optimisée pour la conversion' },
      { es: 'Formulario y base de datos de leads en la nube', en: 'Cloud-based lead form and database', fr: 'Formulaire et base de données de prospects dans le cloud' },
      { es: 'Agente de IA con respuestas automáticas o botones', en: 'AI Agent with automatic responses or buttons', fr: 'Agent IA avec réponses automatiques ou boutons' },
      { es: 'Integración con CRM', en: 'CRM Integration', fr: 'Intégration CRM' },
    ]},
    { id: 'svc-branding', visible: true, title: { es: 'Posicionamiento de Marca', en: 'Brand Positioning', fr: 'Positionnement de Marque' }, bullets: [
      { es: 'Diseño de campañas de anuncios', en: 'Ad campaign design', fr: 'Conception de campagnes publicitaires' },
      { es: 'Publicaciones programadas', en: 'Scheduled posts', fr: 'Publications programmées' },
      { es: 'Segmentación detallada de audiencia', en: 'Detailed audience segmentation', fr: 'Segmentation détaillée de l\'audience' },
    ]},
    { id: 'svc-content', visible: true, title: { es: 'Marketing de Contenidos', en: 'Content Marketing', fr: 'Marketing de Contenu' }, bullets: [
      { es: '15 publicaciones mensuales en Instagram', en: '15 monthly posts on Instagram', fr: '15 publications mensuelles sur Instagram' },
      { es: '15 publicaciones mensuales en Facebook', en: '15 monthly posts on Facebook', fr: '15 publications mensuelles sur Facebook' },
      { es: 'Calendario editorial y copy persuasivo', en: 'Editorial calendar and persuasive copy', fr: 'Calendrier éditorial et copie persuasive' },
    ]},
    { id: 'svc-loyalty', visible: true, title: { es: 'Fidelización de Clientes', en: 'Customer Loyalty', fr: 'Fidélisation de la Clientèle' }, bullets: [
      { es: 'Contenido de valor (interesante, innovador, divertido, informativo)', en: 'Valuable content (interesting, innovative, fun, informative)', fr: 'Contenu de valeur (intéressant, innovant, amusant, informatif)' },
      { es: 'Estrategias de lealtad personalizadas', en: 'Personalized loyalty strategies', fr: 'Stratégies de fidélité personnalisées' },
    ]},
    { id: 'svc-research', visible: true, title: { es: 'Investigación de Mercado', en: 'Market Research', fr: 'Étude de Marché' }, bullets: [
      { es: 'Análisis de perfil de cliente ideal (avatar)', en: 'Ideal customer profile analysis (avatar)', fr: 'Analyse du profil client idéal (avatar)' },
      { es: 'Investigación de insights clave', en: 'Key insights research', fr: 'Recherche d\'insights clés' },
      { es: 'Sugerencias de imagen corporativa', en: 'Corporate image suggestions', fr: 'Suggestions d\'image de marque' },
      { es: 'Documento de brief publicitario', en: 'Advertising brief document', fr: 'Document de brief publicitaire' },
    ]},
  ],
  products: [
    { id: 'p-funnel-setup', name: { es: 'Setup Funnel (Landing + Formularios + Agente IA)', en: 'Funnel Setup (Landing + Forms + AI Agent)', fr: 'Configuration d\'Entonnoir (Landing + Formulaires + Agent IA)' }, type: 'one', price: 300, badge: { es: 'Pago Único', en: 'One-time', fr: 'Unique' }, note: { es: 'Incluye integración y pruebas. Ideal para iniciar tu embudo de ventas.', en: 'Includes integration and testing. Ideal to start your sales funnel.', fr: 'Inclut l\'intégration et les tests. Idéal pour démarrer votre entonnoir de vente.'}, description: { es: 'Este paquete de pago único configura tu embudo de ventas inicial. Incluye una landing page optimizada, formularios en la nube para capturar leads y un Agente de IA básico para interactuar con tus visitantes.', en: 'This one-time payment package sets up your initial sales funnel. It includes an optimized landing page, cloud forms to capture leads, and a basic AI Agent to interact with your visitors.', fr: 'Ce forfait unique configure votre entonnoir de vente initial. Il comprend une page de destination optimisée, des formulaires cloud pour capturer des prospects et un agent IA de base pour interagir avec vos visiteurs.'}, features: JSON.parse(JSON.stringify(defaultFeatures)) },
    { id: 'p-ai-agent', name: { es: 'Agente de IA (Setup Inicial)', en: 'AI Agent (Initial Setup)', fr: 'Agent IA (Configuration Initiale)' }, type: 'one', price: 700, badge: { es: 'IA', en: 'AI', fr: 'IA' }, note: { es: 'Entrenamiento e integración del agente inteligente.', en: 'Training and integration of the smart agent.', fr: 'Formation et intégration de l\'agent intelligent.' }, description: { es: 'Implementamos un Agente de IA entrenado con tu información para responder preguntas, calificar prospectos y agendar citas. Un pago único por la configuración completa.', en: 'We implement an AI Agent trained with your information to answer questions, qualify prospects, and schedule appointments. A one-time payment for the complete setup.', fr: 'Nous mettons en œuvre un agent IA formé avec vos informations pour répondre aux questions, qualifier les prospects et planifier des rendez-vous. Un paiement unique pour la configuration complète.' }, features: JSON.parse(JSON.stringify(defaultFeatures)) },
    { id: 'p-research', name: { es: 'Investigación de Mercado Completa', en: 'Complete Market Research', fr: 'Étude de Marché Complète' }, type: 'one', price: 2000, badge: { es: 'Pro', en: 'Pro', fr: 'Pro' }, note: { es: 'Gratis al contratar un plan anual de Marketing.', en: 'Free when hiring an annual Marketing plan.', fr: 'Gratuit lors de la souscription à un plan Marketing annuel.' }, description: { es: 'Análisis profundo de tu competencia, cliente ideal y mercado. Entregamos un brief publicitario completo y sugerencias de imagen corporativa. Este servicio es gratuito al contratar un plan de marketing anual.', en: 'In-depth analysis of your competition, ideal customer, and market. We deliver a complete advertising brief and corporate image suggestions. This service is free when you purchase an annual marketing plan.', fr: 'Analyse approfondie de votre concurrence, de votre client idéal et de votre marché. Nous livrons un brief publicitaire complet et des suggestions d\'image de marque. Ce service est gratuit lors de la souscription à un plan marketing annuel.' }, features: JSON.parse(JSON.stringify(defaultFeatures)) },
    { id: 's-ai-agent-maint', name: { es: 'Mantenimiento Agente IA (mensual)', en: 'AI Agent Maintenance (monthly)', fr: 'Maintenance Agent IA (mensuel)' }, type: 'sub', price: 45, badge: { es: 'Mensual', en: 'Monthly', fr: 'Mensuel' }, note: { es: 'Monitoreo y ajustes del agente.', en: 'Agent monitoring and adjustments.', fr: 'Surveillance et ajustements de l\'agent.' }, description: { es: 'Aseguramos el rendimiento óptimo de tu Agente de IA con monitoreo constante, ajustes y optimizaciones. Este es un plan de suscripción mensual.', en: 'We ensure the optimal performance of your AI Agent with constant monitoring, adjustments, and optimizations. This is a monthly subscription plan.', fr: 'Nous assurons la performance optimale de votre Agent IA avec un suivi constant, des ajustements et des optimisations. Il s\'agit d\'un plan d\'abonnement mensuel.' }, features: JSON.parse(JSON.stringify(defaultFeatures)) },
    { id: 's-content-15', name: { es: 'Marketing de Contenido (15 + 15 / mes)', en: 'Content Marketing (15 + 15 / month)', fr: 'Marketing de Contenu (15 + 15 / mois)' }, type: 'sub', price: 350, badge: { es: 'Contenido', en: 'Content', fr: 'Contenu' }, note: { es: 'Pauta publicitaria (costo de anuncios) no incluida.', en: 'Advertising spend (ad cost) not included.', fr: 'Dépenses publicitaires (coût des annonces) non incluses.' }, description: { es: 'Creación de 15 publicaciones para Instagram y 15 para Facebook cada mes, incluye calendario editorial, copy persuasivo y diseños. No incluye el costo de la pauta publicitaria (anuncios).', en: 'Creation of 15 posts for Instagram and 15 for Facebook each month, includes editorial calendar, persuasive copy, and designs. Does not include the cost of ad spend (advertisements).', fr: 'Création de 15 publications pour Instagram et 15 pour Facebook chaque mois, inclut un calendrier éditorial, une copie persuasive et des designs. N\'inclut pas le coût des dépenses publicitaires (annonces).' }, features: JSON.parse(JSON.stringify(defaultFeatures)) },
    { id: 's-brand-8', name: { es: 'Branding (8 pub / mes)', en: 'Branding (8 posts / month)', fr: 'Branding (8 pub / mois)' }, type: 'sub', price: 200, badge: { es: 'Marca', en: 'Branding', fr: 'Marque' }, note: { es: 'Requiere pauta mín. de $250 USD/mes (no incluida).', en: 'Requires min. ad spend of $250 USD/month (not included).', fr: 'Nécessite une dépense publicitaire min. de 250 $US/mois (non incluse).' }, description: { es: 'Desarrollamos 8 publicaciones de marca al mes para posicionar tu empresa. Este plan requiere una inversión mínima de $250 USD en pauta publicitaria, no incluida en el precio.', en: 'We develop 8 brand posts per month to position your company. This plan requires a minimum ad spend of $250 USD, not included in the price.', fr: 'Nous développons 8 publications de marque par mois pour positionner votre entreprise. Ce plan nécessite une dépense publicitaire minimale de 250 $US, non incluse dans le prix.' }, features: JSON.parse(JSON.stringify(defaultFeatures)) },
    { id: 'i-brand-4', name: { es: 'Branding (4 pub / mes)', en: 'Branding (4 posts / month)', fr: 'Branding (4 pub / mois)' }, type: 'info', price: 0, badge: { es: 'Info', en: 'Info', fr: 'Info' }, note: { es: 'Costo = monto de la pauta (mín. $250 USD).', en: 'Cost = ad spend amount (min. $250 USD).', fr: 'Coût = montant des dépenses publicitaires (min. 250 $US).' }, description: { es: 'Este es un plan informativo. Creamos 4 publicaciones de marca al mes y el costo del servicio equivale a tu inversión en pauta publicitaria, con un mínimo de $250 USD. Contáctanos para activarlo.', en: 'This is an informational plan. We create 4 brand posts per month, and the service cost equals your ad spend, with a minimum of $250 USD. Contact us to activate it.', fr: 'Ceci est un plan d\'information. Nous créons 4 publications de marque par mois, et le coût du service équivaut à vos dépenses publicitaires, avec un minimum de 250 $US. Contactez-nous pour l\'activer.' }, features: JSON.parse(JSON.stringify(defaultFeatures)) },
  ],
};
