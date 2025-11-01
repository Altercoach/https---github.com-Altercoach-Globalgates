
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
    { id: 'svc-social-media', visible: true, title: { es: 'Gestión de Redes Sociales', en: 'Social Media Management', fr: 'Gestion des Réseaux Sociaux' }, bullets: [
      { es: 'Creatividad humana con IA predictiva', en: 'Human creativity with predictive AI', fr: 'Créativité humaine avec IA prédictive' },
      { es: 'Lanzamiento express en 24-48 horas', en: 'Express launch in 24-48 hours', fr: 'Lancement express en 24-48 heures' },
      { es: 'Monitoreo 24/7 y reportes con insights', en: '24/7 monitoring and reports with insights', fr: 'Surveillance 24/7 et rapports avec insights' },
    ]},
    { id: 'svc-ugc', visible: true, title: { es: 'Videos UGC Auténticos', en: 'Authentic UGC Videos', fr: 'Vidéos UGC Authentiques' }, bullets: [
      { es: 'Scripts vendedores optimizados por IA', en: 'AI-optimized sales scripts', fr: 'Scripts de vente optimisés par IA' },
      { es: 'Más de 3,500 creadores disponibles', en: 'Over 3,500 creators available', fr: 'Plus de 3 500 créateurs disponibles' },
      { es: 'Análisis predictivo de performance', en: 'Predictive performance analysis', fr: 'Analyse prédictive de la performance' },
    ]},
    { id: 'svc-branding', visible: true, title: { es: 'Diseño Gráfico y Marca', en: 'Graphic Design and Branding', fr: 'Design Graphique et Image de Marque' }, bullets: [
      { es: 'Creación de identidad visual premium', en: 'Premium visual identity creation', fr: 'Création d\'identité visuelle premium' },
      { es: 'Proceso en etapas con IA para variaciones', en: 'Staged process with AI for variations', fr: 'Processus par étapes avec IA pour les variations' },
      { es: 'Manual de marca para consistencia total', en: 'Brand manual for total consistency', fr: 'Manuel de marque pour une cohérence totale' },
    ]},
  ],
  products: [
    // Golden Social Boost
    { id: 'prod_gsb_1', name: { es: 'Golden Starter Boost (1 Red)', en: 'Golden Starter Boost (1 Network)', fr: 'Golden Starter Boost (1 Réseau)' }, type: 'sub', price: 500,
      badge: { es: 'Social Media', en: 'Social Media', fr: 'Réseaux Sociaux' },
      note: { es: 'Gestión elite para una red social clave. Ideal para arrancar.', en: 'Elite management for one key social network. Ideal to start.', fr: 'Gestion élite pour un réseau social clé. Idéal pour démarrer.'},
      description: { es: 'Servicio de manejo de perfiles en redes sociales, combinando creatividad humana con IA predictiva. Un community manager dedicado crea contenido personalizado, mientras un especialista en campañas optimiza ads para máximo ROI.', en: 'Social media profile management service, combining human creativity with predictive AI. A dedicated community manager creates personalized content, while a campaign specialist optimizes ads for maximum ROI.', fr: 'Service de gestion de profils de réseaux sociaux, alliant créativité humaine et IA prédictive. Un community manager dédié crée du contenu personnalisé, tandis qu\'un spécialiste des campagnes optimise les publicités pour un ROI maximal.' },
      longDescription: { es: 'Este es nuestro servicio estrella para manejar perfiles en redes sociales de manera elite. Reduce tu carga operativa en 80%, permitiendo enfocarte en tu negocio principal, mientras nuestra IA analiza datos históricos para sugerir ajustes automáticos, logrando hasta 30% más crecimiento orgánico que estrategias manuales.', en: 'This is our flagship service for elite social media profile management. It reduces your operational load by 80%, allowing you to focus on your core business, while our AI analyzes historical data to suggest automatic adjustments, achieving up to 30% more organic growth than manual strategies.', fr: 'C\'est notre service phare pour une gestion d\'élite des profils de réseaux sociaux. Il réduit votre charge opérationnelle de 80%, vous permettant de vous concentrer sur votre cœur de métier, tandis que notre IA analyse les données historiques pour suggérer des ajustements automatiques, réalisant jusqu\'à 30% de croissance organique en plus que les stratégies manuelles.'},
      whatIncludes: {es: '- Parrilla de contenido mensual (15 diseños, hasta 6 videos).\n- Respuestas a mensajes y comentarios (L-V 9-17h, 24/7 con IA básica).\n- 2 propuestas de campañas publicitarias iniciales.\n- Reporte mensual detallado con métricas y recomendaciones IA.', en: '- Monthly content schedule (15 designs, up to 6 videos).\n- Responses to messages and comments (Mon-Fri 9-5, 24/7 with basic AI).\n- 2 initial ad campaign proposals.\n- Detailed monthly report with metrics and AI recommendations.', fr: '- Calendrier de contenu mensuel (15 conceptions, jusqu\'à 6 vidéos).\n- Réponses aux messages et commentaires (Lun-Ven 9-17h, 24/7 avec IA de base).\n- 2 propositions initiales de campagnes publicitaires.\n- Rapport mensuel détaillé avec métriques et recommandations IA.'},
      whatFor: {es: 'Ideal para negocios que quieren visibilidad constante sin equipo interno, como tiendas online o servicios locales. Aumenta reservas, seguidores y conversión a ventas reales.', en: 'Ideal for businesses that want constant visibility without an in-house team, such as online stores or local services. Increases bookings, followers, and conversion to real sales.', fr: 'Idéal pour les entreprises qui veulent une visibilité constante sans équipe interne, comme les boutiques en ligne ou les services locaux. Augmente les réservations, les abonnés et la conversion en ventes réelles.'}
    },
    { id: 'prod_gsb_2', name: { es: 'Golden Connect Duo (2 Redes)', en: 'Golden Connect Duo (2 Networks)', fr: 'Golden Connect Duo (2 Réseaux)' }, type: 'sub', price: 750,
      badge: { es: 'Social Media', en: 'Social Media', fr: 'Réseaux Sociaux' },
      note: { es: 'Sinergia entre 2 redes. Perfecto para e-commerce.', en: 'Synergy between 2 networks. Perfect for e-commerce.', fr: 'Synergie entre 2 réseaux. Parfait pour l\'e-commerce.'},
      description: { es: 'Amplía tu alcance gestionando dos redes sociales en paralelo (ej. Facebook + Instagram) para una estrategia cohesiva y mayor impacto de marca.', en: 'Expand your reach by managing two social networks in parallel (e.g., Facebook + Instagram) for a cohesive strategy and greater brand impact.', fr: 'Étendez votre portée en gérant deux réseaux sociaux en parallèle (par ex. Facebook + Instagram) pour une stratégie cohérente et un plus grand impact de marque.' },
    },
    { id: 'prod_gsb_3', name: { es: 'Golden Flow Trio (3 Redes)', en: 'Golden Flow Trio (3 Networks)', fr: 'Golden Flow Trio (3 Réseaux)' }, type: 'sub', price: 1000,
      badge: { es: 'Social Media', en: 'Social Media', fr: 'Réseaux Sociaux' },
      note: { es: 'Cobertura amplia para marcas en expansión (ej. +TikTok).', en: 'Broad coverage for expanding brands (e.g., +TikTok).', fr: 'Large couverture pour les marques en expansion (par ex. +TikTok).'},
      description: { es: 'Domina tres plataformas clave para una cobertura de audiencia más amplia. Ideal para marcas que buscan expandirse a nuevos demográficos, como TikTok.', en: 'Master three key platforms for broader audience coverage. Ideal for brands looking to expand into new demographics, such as TikTok.', fr: 'Maîtrisez trois plateformes clés pour une couverture d\'audience plus large. Idéal pour les marques cherchant à s\'étendre à de nouveaux groupes démographiques, comme TikTok.' },
    },
    { id: 'prod_gsb_vip_1', name: { es: 'Golden Starter Boost VIP (1 Red)', en: 'Golden Starter Boost VIP (1 Network)', fr: 'Golden Starter Boost VIP (1 Réseau)' }, type: 'sub', price: 600,
      badge: { es: 'VIP Review', en: 'VIP Review', fr: 'Examen VIP' },
      note: { es: 'Gestión de 1 red con revisión y aprobación premium.', en: 'Management of 1 network with premium review and approval.', fr: 'Gestion de 1 réseau avec examen et approbation premium.'},
      description: { es: 'Versión avanzada del Boost estándar, con énfasis en revisión colaborativa para perfección. Diseños se envían con watermark para aprobación rápida, y sugerencias IA de timing óptimo.', en: 'Advanced version of the standard Boost, with an emphasis on collaborative review for perfection. Designs are sent with a watermark for quick approval, and AI suggestions for optimal timing.', fr: 'Version avancée du Boost standard, avec un accent sur l\'examen collaboratif pour la perfection. Les conceptions sont envoyées avec un filigrane pour une approbation rapide, et des suggestions IA pour un timing optimal.' },
    },
     { id: 'prod_gcp_15', name: { es: 'Golden Content Pack 15', en: 'Golden Content Pack 15', fr: 'Golden Content Pack 15' }, type: 'one', price: 250,
      badge: { es: 'Contenido', en: 'Content', fr: 'Contenu' },
      note: { es: 'Creación de 15 assets visuales. Incluye hasta 8 videos.', en: 'Creation of 15 visual assets. Includes up to 8 videos.', fr: 'Création de 15 ressources visuelles. Comprend jusqu\'à 8 vidéos.'},
      description: { es: 'Servicio standalone para generar assets visuales premium en Canva (editables), basado en tu brief. No incluye publicación, pero sí optimización IA para viralidad.', en: 'Standalone service to generate premium visual assets in Canva (editable), based on your brief. Does not include publishing, but does include AI optimization for virality.', fr: 'Service autonome pour générer des ressources visuelles premium dans Canva (modifiables), basé sur votre brief. Ne comprend pas la publication, mais inclut l\'optimisation IA pour la viralité.' },
    },
    { id: 'prod_gac_1', name: { es: 'Golden Authentic Creators (1 Video UGC)', en: 'Golden Authentic Creators (1 UGC Video)', fr: 'Golden Authentic Creators (1 Vidéo UGC)' }, type: 'one', price: 500,
      badge: { es: 'UGC', en: 'UGC', fr: 'UGC' },
      note: { es: 'Video auténtico con creador real para máxima confianza y conversión.', en: 'Authentic video with a real creator for maximum trust and conversion.', fr: 'Vidéo authentique avec un vrai créateur pour une confiance et une conversion maximales.'},
      description: { es: 'Videos publicitarios auténticos con creadores reales. Incluye script vendedor optimizado por IA, edición pro, y trafficker por 30 días para monitoreo. UGC genera 5x más confianza que ads tradicionales.', en: 'Authentic advertising videos with real creators. Includes AI-optimized sales script, pro editing, and a trafficker for 30 days for monitoring. UGC generates 5x more trust than traditional ads.', fr: 'Vidéos publicitaires authentiques avec de vrais créateurs. Comprend un script de vente optimisé par IA, un montage professionnel et un trafficker pendant 30 jours pour le suivi. L\'UGC génère 5 fois plus de confiance que les publicités traditionnelles.' },
    },
     { id: 'prod_gmg_1', name: { es: 'Golden Master Gateway', en: 'Golden Master Gateway', fr: 'Golden Master Gateway' }, type: 'sub', price: 1500,
      badge: { es: 'Todo-en-Uno', en: 'All-in-One', fr: 'Tout-en-Un' },
      note: { es: 'Paquete integral: redes, web y campañas en un ecosistema cohesivo.', en: 'Comprehensive package: networks, web, and campaigns in a cohesive ecosystem.', fr: 'Package complet : réseaux, web et campagnes dans un écosystème cohérent.'},
      description: { es: 'Nuestro paquete para dominar el digital. Incluye desarrollo web express (7 días), 15 diseños para FB/IG, 8 videos para TikTok, embudo de IA para leads automáticos, y $50 en ads iniciales. Ahorra 30% vs. servicios separados.', en: 'Our package to master digital. Includes express web development (7 days), 15 designs for FB/IG, 8 videos for TikTok, AI funnel for automatic leads, and $50 in initial ads. Save 30% vs. separate services.', fr: 'Notre forfait pour maîtriser le numérique. Comprend le développement web express (7 jours), 15 créations pour FB/IG, 8 vidéos pour TikTok, un entonnoir IA pour les prospects automatiques et 50 $ de publicités initiales. Économisez 30% par rapport aux services séparés.' },
    },
     { id: 'prod_gbe_1', name: { es: 'Golden Brand Forge', en: 'Golden Brand Forge', fr: 'Golden Brand Forge' }, type: 'one', price: 750,
      badge: { es: 'Branding', en: 'Branding', fr: 'Marque' },
      note: { es: 'Creación de identidad visual: 3 propuestas de logo y manual de marca.', en: 'Visual identity creation: 3 logo proposals and brand manual.', fr: 'Création d\'identité visuelle : 3 propositions de logo et manuel de marque.'},
      description: { es: 'Creación de identidad visual premium, desde logos a assets. Proceso en etapas con IA para variaciones rápidas. Construye un branding duradero, con manual para consistencia.', en: 'Creation of premium visual identity, from logos to assets. Staged process with AI for quick variations. Build lasting branding, with a manual for consistency.', fr: 'Création d\'identité visuelle premium, des logos aux ressources. Processus par étapes avec IA pour des variations rapides. Construisez une image de marque durable, avec un manuel pour la cohérence.' },
    },
  ],
};
