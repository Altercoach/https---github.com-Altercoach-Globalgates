
import type { SiteData } from '@/lib/types';
import { FEATURE_FLAGS } from './feature-flags';

export const DEFAULT_SITE_CONTENT: SiteData = {
  "brand": {
    "name": {
      "es": "Golden Key",
      "en": "Golden Key",
      "fr": "Golden Key"
    },
    "tagline": {
      "es": "Marketing Estratégico, Automatización e IA que abren las puertas a tu crecimiento",
      "en": "Strategic Marketing, Automation & AI that open the doors to your growth",
      "fr": "Marketing Stratégique, Automatisation et IA qui ouvrent les portes de votre croissance"
    },
    "heroTitle": {
      "es": "Aumenta tus ventas, posiciona tu marca y estimula la preferencia.",
      "en": "Increase your sales, position your brand, and stimulate preference.",
      "fr": "Augmentez vos ventes, positionnez votre marque et stimulez la préférence."
    },
    "heroSubtitle": {
      "es": "Contrata ahora mismo campañas de marketing, embudos de ventas, automatizaciones y agentes de inteligencia a tu servicio 24/7.",
      "en": "Hire marketing campaigns, sales funnels, automations, and AI agents at your service 24/7.",
      "fr": "Engagez des campagnes marketing, des entonnoirs de vente, des automatisations et des agents IA à votre service 24/7."
    },
    "heroImage": "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    "colors": {
      "gold": "#d4af37",
      "ink": "#0f172a",
      "bg": "#ffffff",
      "slate": "#111315"
    }
  },
  "agentPersona": {
    "firstName": "Anna Lucia",
    "lastName": "Satch",
    "avatar": "https://i.pravatar.cc/150?u=a042581f4e29026704d"
  },
  "services": [
    {
      "id": "solution-sm",
      "visible": true,
      "title": { "es": "Gestión de Redes Sociales", "en": "Social Media Management", "fr": "Gestion des Réseaux Sociaux" },
      "bullets": [
        { "es": "Estrategia y calendario de contenidos.", "en": "Content strategy and calendar.", "fr": "Stratégie et calendrier de contenu." },
        { "es": "Creación y publicación de posts, historias y reels.", "en": "Creation and publishing of posts, stories, and reels.", "fr": "Création et publication de posts, stories et reels." },
        { "es": "Análisis de engagement y reportes de métricas.", "en": "Engagement analysis and metrics reporting.", "fr": "Analyse de l'engagement et rapports de métriques." }
      ]
    },
    {
      "id": "solution-launch",
      "visible": true,
      "title": { "es": "Lanzamiento de Marca", "en": "Brand Launch", "fr": "Lancement de Marque" },
      "bullets": [
        { "es": "Diseño de identidad visual y branding completo.", "en": "Visual identity design and complete branding.", "fr": "Conception d'identité visuelle et branding complet." },
        { "es": "Creación de sitio web o landing page.", "en": "Website or landing page creation.", "fr": "Création de site web ou de landing page." },
        { "es": "Configuración inicial de redes sociales y SEO.", "en": "Initial social media and SEO setup.", "fr": "Configuration initiale des réseaux sociaux et du SEO." }
      ]
    },
    {
      "id": "solution-marketing",
      "visible": true,
      "title": { "es": "Marketing Digital y Funnels", "en": "Digital Marketing & Funnels", "fr": "Marketing Numérique et Entonnoirs" },
      "bullets": [
        { "es": "Diseño de embudos de conversión.", "en": "Conversion funnel design.", "fr": "Conception d'entonnoirs de conversion." },
        { "es": "Automatización de marketing con IA.", "en": "AI-powered marketing automation.", "fr": "Automatisation du marketing par l'IA." },
        { "es": "Integración con CRM y WhatsApp.", "en": "CRM and WhatsApp integration.", "fr": "Intégration CRM et WhatsApp." }
      ]
    },
    {
      "id": "solution-web",
      "visible": true,
      "title": { "es": "Web y Tecnología", "en": "Web & Technology", "fr": "Web et Technologie" },
      "bullets": [
        { "es": "Desarrollo de sitios web y SaaS a medida.", "en": "Custom website and SaaS development.", "fr": "Développement de sites web et de SaaS sur mesure." },
        { "es": "Integración de IA y sistemas de pago.", "en": "AI and payment systems integration.", "fr": "Intégration de l'IA et des systèmes de paiement." },
        { "es": "Optimización de rendimiento y seguridad.", "en": "Performance and security optimization.", "fr": "Optimisation des performances et de la sécurité." }
      ]
    },
    {
      "id": "solution-legal",
      "visible": true,
      "title": { "es": "Servicios Corporativos", "en": "Corporate Services", "fr": "Services aux Entreprises" },
      "bullets": [
        { "es": "Creación de empresas y asociaciones.", "en": "Company and association formation.", "fr": "Création d'entreprises et d'associations." },
        { "es": "Asesoría legal y fiscal para ONGs.", "en": "Legal and tax advisory for NGOs.", "fr": "Conseil juridique et fiscal pour les ONG." },
        { "es": "Gestión de cumplimiento normativo (compliance).", "en": "Regulatory compliance management.", "fr": "Gestion de la conformité réglementaire." }
      ]
    },
    {
      "id": "solution-seo",
      "visible": true,
      "title": { "es": "SEO y Posicionamiento Web", "en": "SEO and Web Positioning", "fr": "SEO et Positionnement Web" },
      "bullets": [
        { "es": "Análisis de competencia y palabras clave con IA.", "en": "AI-powered competitor and keyword analysis.", "fr": "Analyse de la concurrence et des mots-clés par l'IA." },
        { "es": "Optimización on-page y creación de contenido estratégico.", "en": "On-page optimization and strategic content creation.", "fr": "Optimisation on-page et création de contenu stratégique." },
        { "es": "Monitoreo de rankings y reportes de visibilidad mensuales.", "en": "Ranking monitoring and monthly visibility reports.", "fr": "Suivi du classement et rapports de visibilité mensuels." }
      ]
    }
  ],
  "products": [
    {
      "id": "prod_social_1",
      "visible": true,
      "name": { "es": "Plan Social 1", "en": "Social Plan 1", "fr": "Plan Social 1" },
      "type": "sub",
      "price": 150,
      "badge": { "es": "Inicial", "en": "Starter", "fr": "Débutant" },
      "note": { "es": "1 red social, 8 posts, 4 historias, reporte simple.", "en": "1 social network, 8 posts, 4 stories, simple report.", "fr": "1 réseau social, 8 posts, 4 stories, rapport simple." },
      "description": { "es": "Ideal para empezar. Incluye 1 red (IG o FB), 8 publicaciones y 4 historias al mes, copywriting, diseño estándar y un reporte mensual.", "en": "Ideal to get started. Includes 1 network (IG or FB), 8 posts and 4 stories per month, copywriting, standard design, and a monthly report.", "fr": "Idéal pour commencer. Comprend 1 réseau (IG ou FB), 8 publications et 4 stories par mois, copywriting, design standard et un rapport mensuel." },
      "features": [FEATURE_FLAGS.AI_MARKETING_ASSISTANT]
    },
    {
      "id": "prod_social_2",
      "visible": true,
      "name": { "es": "Plan Social 2", "en": "Social Plan 2", "fr": "Plan Social 2" },
      "type": "sub",
      "price": 350,
      "badge": { "es": "Crecimiento", "en": "Growth", "fr": "Croissance" },
      "note": { "es": "2 redes, 12 posts, 8 historias, gestión de comentarios.", "en": "2 networks, 12 posts, 8 stories, comment management.", "fr": "2 réseaux, 12 posts, 8 stories, gestion des commentaires." },
      "description": { "es": "Expande tu alcance a 2 redes. Incluye 12 publicaciones, 8 historias, copywriting optimizado, diseño personalizado y gestión de comentarios.", "en": "Expand your reach to 2 networks. Includes 12 posts, 8 stories, optimized copywriting, custom design, and comment management.", "fr": "Étendez votre portée à 2 réseaux. Comprend 12 publications, 8 stories, copywriting optimisé, design personnalisé et gestion des commentaires." },
      "features": [FEATURE_FLAGS.AI_CONTENT_GENERATION, FEATURE_FLAGS.CRM_LIGHT]
    },
    {
      "id": "prod_social_3",
      "visible": true,
      "name": { "es": "Plan Social 3 (Growth)", "en": "Social Plan 3 (Growth)", "fr": "Plan Social 3 (Croissance)" },
      "type": "sub",
      "price": 850,
      "badge": { "es": "Pro", "en": "Pro", "fr": "Pro" },
      "note": { "es": "3 redes, 20 posts, reels, optimización IA, soporte prioritario.", "en": "3 networks, 20 posts, reels, AI optimization, priority support.", "fr": "3 réseaux, 20 posts, reels, optimisation IA, support prioritaire." },
      "description": { "es": "Dominio en 3 redes con 20 publicaciones, 12 historias, reels, optimización IA, análisis de engagement y soporte prioritario.", "en": "Dominate 3 networks with 20 posts, 12 stories, reels, AI optimization, engagement analysis, and priority support.", "fr": "Dominez 3 réseaux avec 20 publications, 12 stories, reels, optimisation IA, analyse d'engagement et support prioritaire." },
      "features": [FEATURE_FLAGS.AI_CONTENT_SCHEDULER, FEATURE_FLAGS.AI_CAMPAIGN_PLANNER, FEATURE_FLAGS.ANALYTICS_INTEGRATION]
    },
    {
      "id": "prod_launch_1",
      "visible": true,
      "name": { "es": "Paquete Emprendedor", "en": "Entrepreneur Package", "fr": "Pack Entrepreneur" },
      "type": "one",
      "price": 500,
      "badge": { "es": "Lanzamiento", "en": "Launch", "fr": "Lancement" },
      "note": { "es": "Todo lo básico para lanzar tu marca: logo, landing page y redes.", "en": "All the basics to launch your brand: logo, landing page, and social media.", "fr": "Tous les basiques pour lancer votre marque : logo, landing page et réseaux sociaux." },
      "description": { "es": "Incluye identidad de marca básica, logo simple, una landing page, configuración de 1 red social y 5 publicaciones de lanzamiento.", "en": "Includes basic brand identity, simple logo, a landing page, setup of 1 social network, and 5 launch posts.", "fr": "Comprend une identité de marque de base, un logo simple, une page de destination, la configuration d'un réseau social et 5 publications de lancement." },
      "features": [FEATURE_FLAGS.LEAD_CAPTURE_FORMS]
    },
    {
      "id": "prod_launch_2",
      "visible": true,
      "name": { "es": "Paquete Marca Profesional", "en": "Professional Brand Package", "fr": "Pack Marque Professionnelle" },
      "type": "one",
      "price": 1500,
      "badge": { "es": "Completo", "en": "Complete", "fr": "Complet" },
      "note": { "es": "Branding completo, sitio web de 5 secciones y SEO básico.", "en": "Full branding, 5-section website, and basic SEO.", "fr": "Branding complet, site web de 5 sections et SEO de base." },
      "description": { "es": "Incluye branding completo con manual básico, sitio web de 5 secciones, configuración de 2 redes, 10 publicaciones y SEO básico con Pixel & Analytics.", "en": "Includes full branding with a basic manual, a 5-section website, setup of 2 social networks, 10 posts, and basic SEO with Pixel & Analytics.", "fr": "Comprend un branding complet avec un manuel de base, un site web de 5 sections, la configuration de 2 réseaux sociaux, 10 publications et un SEO de base avec Pixel & Analytics." },
      "features": [FEATURE_FLAGS.SEO_ADVANCED_CONTROLS, FEATURE_FLAGS.ANALYTICS_INTEGRATION]
    },
    {
      "id": "prod_legal_1",
      "visible": true,
      "name": { "es": "Creación de Empresa (México)", "en": "Company Formation (Mexico)", "fr": "Création d'Entreprise (Mexique)" },
      "type": "one",
      "price": 1200,
      "badge": { "es": "Corporativo", "en": "Corporate", "fr": "Entreprise" },
      "note": { "es": "Constitución legal de tu empresa en México.", "en": "Legal incorporation of your company in Mexico.", "fr": "Constitution légale de votre entreprise au Mexique." },
      "description": { "es": "Asesoría sobre el tipo de sociedad, redacción de acta constitutiva, obtención de RFC, alta en el SAT y asistencia para apertura de cuenta bancaria. No incluye derechos notariales.", "en": "Advice on the type of company, drafting of the articles of incorporation, obtaining RFC, registration with the SAT, and assistance with opening a bank account. Notary fees not included.", "fr": "Conseils sur le type d'entreprise, rédaction des statuts, obtention du RFC, inscription au SAT et aide à l'ouverture d'un compte bancaire. Frais de notaire non inclus." },
      "features": []
    },
    {
      "id": "prod_seo_sub",
      "visible": true,
      "name": { "es": "Ascenso SEO Estratégico", "en": "Strategic SEO Ascent", "fr": "Ascension SEO Stratégique" },
      "type": "sub",
      "price": 950,
      "badge": { "es": "Avanzado", "en": "Advanced", "fr": "Avancé" },
      "note": { "es": "Servicio mensual para dominar los resultados de búsqueda y atraer tráfico orgánico.", "en": "Monthly service to dominate search results and attract organic traffic.", "fr": "Service mensuel pour dominer les résultats de recherche et attirer du trafic organique." },
      "description": { "es": "Nuestro plan SEO más completo. Incluye auditoría inicial, investigación de palabras clave, optimización on-page, creación de 4 artículos de blog optimizados por IA al mes y monitoreo de rankings.", "en": "Our most comprehensive SEO plan. Includes an initial audit, keyword research, on-page optimization, creation of 4 AI-optimized blog articles per month, and rank tracking.", "fr": "Notre plan SEO le plus complet. Comprend un audit initial, une recherche de mots-clés, une optimisation on-page, la création de 4 articles de blog optimisés par l'IA par mois et un suivi du classement." },
      "features": [
        FEATURE_FLAGS.SEO_ADVANCED_CONTROLS, 
        FEATURE_FLAGS.AI_CONTENT_GENERATION, 
        FEATURE_FLAGS.ANALYTICS_INTEGRATION,
        FEATURE_FLAGS.AI_INSIGHTS_AND_RECOMMENDATIONS
      ]
    }
  ]
};
