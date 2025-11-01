
import type { SiteData } from '@/lib/types';

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
    heroImage: '/hero-default.jpg',
    colors: {
      gold: '#d4af37',
      ink: '#0f172a',
      bg: '#ffffff',
      slate: '#111315',
    },
  },
  services: [
    { 
      id: 'svc-social-media', 
      visible: true, 
      title: { es: 'Gestión de Redes Sociales', en: 'Social Media Management', fr: 'Gestion des Réseaux Sociaux' }, 
      bullets: [
        { es: 'Creatividad humana con IA predictiva para máximo ROI.', en: 'Human creativity with predictive AI for maximum ROI.', fr: 'Créativité humaine avec IA prédictive pour un ROI maximal.' },
        { es: 'Lanzamiento express en 24-48 horas y monitoreo 24/7.', en: 'Express launch in 24-48 hours and 24/7 monitoring.', fr: 'Lancement express en 24-48 heures et surveillance 24/7.' },
        { es: 'Soporte VIP y reportes mensuales con insights accionables.', en: 'VIP support and monthly reports with actionable insights.', fr: 'Support VIP et rapports mensuels avec des informations exploitables.' },
      ]
    },
    { 
      id: 'svc-ugc', 
      visible: true, 
      title: { es: 'Creación de Contenido (UGC)', en: 'Content Creation (UGC)', fr: 'Création de Contenu (UGC)' }, 
      bullets: [
        { es: 'Scripts vendedores optimizados por IA para persuasión.', en: 'AI-optimized sales scripts for persuasion.', fr: 'Scripts de vente optimisés par IA pour la persuasion.' },
        { es: 'Acceso a más de 3,500 creadores de contenido.', en: 'Access to over 3,500 content creators.', fr: 'Accès à plus de 3 500 créateurs de contenu.' },
        { es: 'Análisis predictivo de performance para campañas virales.', en: 'Predictive performance analysis for viral campaigns.', fr: 'Analyse prédictive des performances pour les campagnes virales.' },
      ]
    },
    { 
      id: 'svc-branding', 
      visible: true, 
      title: { es: 'Diseño Gráfico y Marca', en: 'Graphic Design and Branding', fr: 'Design Graphique et Image de Marque' }, 
      bullets: [
        { es: 'Creación de identidad visual premium (logos, manual de marca).', en: 'Premium visual identity creation (logos, brand manual).', fr: 'Création d\'identité visuelle premium (logos, manuel de marque).' },
        { es: 'Diseño de recursos para marketing (flyers, tarjetas, menús).', en: 'Design of marketing assets (flyers, cards, menus).', fr: 'Conception de supports marketing (flyers, cartes, menus).' },
        { es: 'Proceso en etapas con IA para variaciones de diseño rápidas.', en: 'Staged process with AI for quick design variations.', fr: 'Processus par étapes avec IA pour des variations de conception rapides.' },
      ]
    },
    { 
      id: 'svc-all-in-one', 
      visible: false, 
      title: { es: 'Paquetes Integrales Todo-en-Uno', en: 'All-in-One Comprehensive Packages', fr: 'Packages Complets Tout-en-Un' }, 
      bullets: [
        { es: 'Solución completa: web, redes sociales y campañas.', en: 'Complete solution: web, social media, and campaigns.', fr: 'Solution complète : web, réseaux sociaux et campagnes.' },
        { es: 'Desarrollo web express y embudo de ventas con IA.', en: 'Express web development and AI sales funnel.', fr: 'Développement web express et entonnoir de vente IA.' },
        { es: 'Ahorro del 30% en comparación con servicios separados.', en: '30% savings compared to separate services.', fr: '30% d\'économies par rapport aux services séparés.' },
      ]
    },
    { 
      id: 'svc-corporate', 
      visible: false, 
      title: { es: 'Soluciones Corporativas', en: 'Corporate Solutions', fr: 'Solutions d\'Entreprise' }, 
      bullets: [
        { es: 'Registro y protección de marca (Trademark).', en: 'Brand registration and protection (Trademark).', fr: 'Enregistrement et protection de la marque (Trademark).' },
        { es: 'Valoración financiera de negocios para M&A o inversión.', en: 'Business valuation for M&A or investment.', fr: 'Évaluation d\'entreprise pour M&A ou investissement.' },
        { es: 'Asesoría para la creación de fundaciones y A.C.', en: 'Consulting for the creation of foundations and non-profits.', fr: 'Conseil pour la création de fondations et d\'OSBL.' },
      ]
    },
  ],
  products: [
    { 
      id: 'prod_sm_1', visible: true, name: { es: 'Impulso Esencial (1 Red)', en: 'Essential Boost (1 Network)', fr: 'Boost Essentiel (1 Réseau)' }, type: 'sub', price: 500,
      badge: { es: 'Social Media', en: 'Social Media', fr: 'Réseaux Sociaux' },
      note: { es: 'Gestión elite para una red social clave. Ideal para arrancar.', en: 'Elite management for one key social network. Ideal to start.', fr: 'Gestion élite pour un réseau social clé. Idéal pour démarrer.'},
      description: { es: 'Servicio de manejo de perfiles en redes sociales, combinando creatividad humana con IA predictiva. Un community manager dedicado crea contenido personalizado, mientras un especialista en campañas optimiza ads para máximo ROI.', en: 'Social media profile management service, combining human creativity with predictive AI. A dedicated community manager creates personalized content, while a campaign specialist optimizes ads for maximum ROI.', fr: 'Service de gestion de profils de réseaux sociaux, alliant créativité humaine et IA prédictive. Un community manager dédié crée du contenu personnalisé, tandis qu\'un spécialiste des campagnes optimise les publicités pour un ROI maximal.' },
      longDescription: { es: 'Este es nuestro servicio estrella para manejar perfiles en redes sociales de manera elite. Reduce tu carga operativa en 80%, permitiendo enfocarte en tu negocio principal, mientras nuestra IA analiza datos históricos para sugerir ajustes automáticos, logrando hasta 30% más crecimiento orgánico que estrategias manuales.', en: 'This is our flagship service for elite social media profile management. It reduces your operational load by 80%, allowing you to focus on your core business, while our AI analyzes historical data to suggest automatic adjustments, achieving up to 30% more organic growth than manual strategies.', fr: 'C\'est notre service phare pour une gestion d\'élite des profils de réseaux sociaux. Il réduit votre charge opérationnelle de 80%, vous permettant de vous concentrer sur votre cœur de métier, tandis que notre IA analyse les données historiques pour suggérer des ajustements automatiques, réalisant jusqu\'à 30% de croissance organique en plus que les stratégies manuelles.'},
      whatIncludes: {es: '- Parrilla de contenido mensual (15 diseños, hasta 6 videos).\n- Respuestas a mensajes y comentarios (L-V 9-17h, 24/7 con IA básica).\n- 2 propuestas de campañas publicitarias iniciales.\n- Reporte mensual detallado con métricas y recomendaciones IA.', en: '- Monthly content schedule (15 designs, up to 6 videos).\n- Responses to messages and comments (Mon-Fri 9-5, 24/7 with basic AI).\n- 2 initial ad campaign proposals.\n- Detailed monthly report with metrics and AI recommendations.', fr: '- Calendrier de contenu mensuel (15 conceptions, jusqu\'à 6 vidéos).\n- Réponses aux messages et commentaires (Lun-Ven 9-17h, 24/7 avec IA de base).\n- 2 propositions initiales de campagnes publicitaires.\n- Rapport mensuel détaillé avec métriques et recommandations IA.'},
      whatFor: {es: 'Ideal para negocios que quieren visibilidad constante sin equipo interno, como tiendas online o servicios locales. Aumenta reservas, seguidores y conversión a ventas reales.', en: 'Ideal for businesses that want constant visibility without an in-house team, such as online stores or local services. Increases bookings, followers, and conversion to real sales.', fr: 'Idéal pour les entreprises qui veulent une visibilité constante sans équipe interne, comme les boutiques en ligne ou les services locaux. Augmente les réservations, les abonnés et la conversion en ventes réelles.'}
    },
    { 
      id: 'prod_sm_2', visible: true, name: { es: 'Dúo Conexión (2 Redes)', en: 'Connection Duo (2 Networks)', fr: 'Duo Connexion (2 Réseaux)' }, type: 'sub', price: 750,
      badge: { es: 'Social Media', en: 'Social Media', fr: 'Réseaux Sociaux' },
      note: { es: 'Sinergia entre 2 redes. Perfecto para e-commerce.', en: 'Synergy between 2 networks. Perfect for e-commerce.', fr: 'Synergie entre 2 réseaux. Parfait pour l\'e-commerce.'},
      description: { es: 'Amplía tu alcance gestionando dos redes sociales en paralelo (ej. Facebook + Instagram) para una estrategia cohesiva y mayor impacto de marca.', en: 'Expand your reach by managing two social networks in parallel (e.g., Facebook + Instagram) for a cohesive strategy and greater brand impact.', fr: 'Étendez votre portée en gérant deux réseaux sociaux en parallèle (par ex. Facebook + Instagram) pour une stratégie cohérente et un plus grand impact de marque.' },
    },
    { 
      id: 'prod_sm_3', visible: true, name: { es: 'Tridente Digital (3 Redes)', en: 'Digital Trident (3 Networks)', fr: 'Trident Numérique (3 Réseaux)' }, type: 'sub', price: 1000,
      badge: { es: 'Social Media', en: 'Social Media', fr: 'Réseaux Sociaux' },
      note: { es: 'Cobertura amplia para marcas en expansión (ej. +TikTok).', en: 'Broad coverage for expanding brands (e.g., +TikTok).', fr: 'Large couverture pour les marques en expansion (par ex. +TikTok).'},
      description: { es: 'Domina tres plataformas clave para una cobertura de audiencia más amplia. Ideal para marcas que buscan expandirse a nuevos demográficos, como TikTok.', en: 'Master three key platforms for broader audience coverage. Ideal for brands looking to expand into new demographics, such as TikTok.', fr: 'Maîtrisez trois plateformes clés pour une couverture d\'audience plus large. Idéal pour les marques cherchant à s\'étendre à de nouveaux groupes démographiques, comme TikTok.' },
    },
    { 
      id: 'prod_sm_4', visible: true, name: { es: 'Presencia Profesional (4 Redes)', en: 'Professional Presence (4 Networks)', fr: 'Présence Professionnelle (4 Réseaux)' }, type: 'sub', price: 1500,
      badge: { es: 'Social Media', en: 'Social Media', fr: 'Réseaux Sociaux' },
      note: { es: 'Presencia profesional sólida, incluye LinkedIn para B2B.', en: 'Solid professional presence, includes LinkedIn for B2B.', fr: 'Présence professionnelle solide, inclut LinkedIn pour le B2B.'},
      description: { es: 'Establece una presencia profesional robusta en cuatro redes, incluyendo LinkedIn para conectar con una audiencia B2B y corporativa.', en: 'Establish a robust professional presence on four networks, including LinkedIn to connect with a B2B and corporate audience.', fr: 'Établissez une présence professionnelle robuste sur quatre réseaux, y compris LinkedIn pour vous connecter avec un public B2B et corporatif.' },
    },
    { 
      id: 'prod_sm_5', visible: true, name: { es: 'Dominio Omni-Channel (6 Redes)', en: 'Omni-Channel Domination (6 Networks)', fr: 'Domination Omni-Canal (6 Réseaux)' }, type: 'sub', price: 2500,
      badge: { es: 'Social Media', en: 'Social Media', fr: 'Réseaux Sociaux' },
      note: { es: 'Dominio total para marcas internacionales y de gran escala.', en: 'Total domination for international and large-scale brands.', fr: 'Domination totale pour les marques internationales et à grande échelle.'},
      description: { es: 'El paquete definitivo para un dominio omni-canal. Gestionamos hasta 6 redes sociales para una exposición masiva y un alcance global.', en: 'The ultimate package for omni-channel domination. We manage up to 6 social networks for massive exposure and global reach.', fr: 'Le package ultime pour une domination omni-canal. Nous gérons jusqu\'à 6 réseaux sociaux pour une exposition massive et une portée mondiale.' },
    },
    
    { 
      id: 'prod_sm_vip_1', visible: true, name: { es: 'Impulso Esencial VIP (1 Red)', en: 'Essential Boost VIP (1 Network)', fr: 'Boost Essentiel VIP (1 Réseau)' }, type: 'sub', price: 600,
      badge: { es: 'Gestión VIP', en: 'VIP Management', fr: 'Gestion VIP' },
      note: { es: 'Gestión de 1 red con revisión y aprobación premium.', en: 'Management of 1 network with premium review and approval.', fr: 'Gestion de 1 réseau avec examen et approbation premium.'},
      description: { es: 'Versión avanzada del Boost estándar, con énfasis en revisión colaborativa para perfección. Diseños se envían con watermark para aprobación rápida, y sugerencias IA de timing óptimo.', en: 'Advanced version of the standard Boost, with an emphasis on collaborative review for perfection. Designs are sent with a watermark for quick approval, and AI suggestions for optimal timing.', fr: 'Version avancée du Boost standard, avec un accent sur l\'examen collaboratif pour la perfection. Les conceptions sont envoyées avec un filigrane pour une approbation rapide, et des suggestions IA pour un timing optimal.' },
    },
    { 
      id: 'prod_sm_vip_2', visible: true, name: { es: 'Dúo Conexión VIP (2 Redes)', en: 'Connection Duo VIP (2 Networks)', fr: 'Duo Connexion VIP (2 Réseaux)' }, type: 'sub', price: 850,
      badge: { es: 'Gestión VIP', en: 'VIP Management', fr: 'Gestion VIP' },
      note: { es: 'Sinergia en 2 redes con feedback y control total.', en: 'Synergy on 2 networks with feedback and full control.', fr: 'Synergie sur 2 réseaux avec feedback et contrôle total.'},
      description: { es: 'Ideal para estrategias de e-commerce que requieren una alineación de marca perfecta entre dos plataformas, con ciclos de revisión ilimitados en la primera ronda.', en: 'Ideal for e-commerce strategies requiring perfect brand alignment between two platforms, with unlimited review cycles in the first round.', fr: 'Idéal pour les stratégies de commerce électronique nécessitant un alignement de marque parfait entre deux plateformes, avec des cycles de révision illimités au premier tour.' },
    },
    { 
      id: 'prod_sm_vip_3', visible: true, name: { es: 'Tridente Digital VIP (3 Redes)', en: 'Digital Trident VIP (3 Networks)', fr: 'Trident Numérique VIP (3 Réseaux)' }, type: 'sub', price: 1200,
      badge: { es: 'Gestión VIP', en: 'VIP Management', fr: 'Gestion VIP' },
      note: { es: 'Estrategia multi-plataforma con aprobación de alto nivel.', en: 'Multi-platform strategy with high-level approval.', fr: 'Stratégie multi-plateforme avec approbation de haut niveau.'},
      description: { es: 'Para marcas que necesitan una voz consistente y controlada a través de tres canales, con análisis predictivo de la IA para maximizar el impacto de cada publicación.', en: 'For brands that need a consistent and controlled voice across three channels, with predictive AI analysis to maximize the impact of each post.', fr: 'Pour les marques qui ont besoin d\'une voix cohérente et contrôlée sur trois canaux, avec une analyse prédictive par IA pour maximiser l\'impact de chaque publication.' },
    },
     { 
      id: 'prod_sm_vip_4', visible: true, name: { es: 'Presencia Profesional VIP (4 Redes)', en: 'Professional Presence VIP (4 Networks)', fr: 'Présence Professionnelle VIP (4 Réseaux)' }, type: 'sub', price: 1800,
      badge: { es: 'Gestión VIP', en: 'VIP Management', fr: 'Gestion VIP' },
      note: { es: 'Cobertura B2B y B2C con control y revisión detallada.', en: 'B2B and B2C coverage with detailed control and review.', fr: 'Couverture B2B et B2C avec contrôle et examen détaillés.'},
      description: { es: 'Un paquete robusto para empresas que interactúan tanto con clientes como con otras empresas, asegurando un mensaje pulido y estratégico en todas las plataformas.', en: 'A robust package for companies that interact with both customers and other businesses, ensuring a polished and strategic message across all platforms.', fr: 'Un package robuste pour les entreprises qui interagissent à la fois avec les clients et d\'autres entreprises, garantissant un message soigné et stratégique sur toutes les plateformes.' },
    },
     { 
      id: 'prod_sm_vip_5', visible: true, name: { es: 'Dominio Omni-Channel VIP (6 Redes)', en: 'Omni-Channel Domination VIP (6 Networks)', fr: 'Domination Omni-Canal VIP (6 Réseaux)' }, type: 'sub', price: 3000,
      badge: { es: 'Gestión VIP', en: 'VIP Management', fr: 'Gestion VIP' },
      note: { es: 'Máxima personalización y estrategia omni-canal de élite.', en: 'Maximum customization and elite omni-channel strategy.', fr: 'Personnalisation maximale et stratégie omni-canal d\'élite.'},
      description: { es: 'Nuestro servicio más exclusivo, para marcas globales que requieren una gestión impecable y una estrategia de contenido altamente personalizada y reactiva en 6 plataformas.', en: 'Our most exclusive service, for global brands requiring flawless management and a highly personalized and reactive content strategy across 6 platforms.', fr: 'Notre service le plus exclusif, pour les marques mondiales nécessitant une gestion sans faille et une stratégie de contenu hautement personnalisée et réactive sur 6 plateformes.' },
    },
    { 
      id: 'prod_cp_1', visible: true, name: { es: 'Diseño Individual', en: 'Single Design', fr: 'Design Unique' }, type: 'one', price: 50,
      badge: { es: 'Contenido', en: 'Content', fr: 'Contenu' },
      note: { es: '1 imagen fija para uso rápido. Entrega en 1-2 días.', en: '1 still image for quick use. Delivery in 1-2 days.', fr: '1 image fixe pour une utilisation rapide. Livraison en 1-2 jours.'},
      description: { es: 'Perfecto para una publicación urgente o una pequeña promoción. Nos das el texto y la idea, y te entregamos un diseño profesional en formato JPG/PNG.', en: 'Perfect for an urgent post or a small promotion. You give us the text and the idea, and we deliver a professional design in JPG/PNG format.', fr: 'Parfait pour une publication urgente ou une petite promotion. Vous nous donnez le texte et l\'idée, et nous livrons un design professionnel au format JPG/PNG.' },
    },
    { 
      id: 'prod_cp_2', visible: true, name: { es: 'Paquete de Contenido 15', en: 'Content Pack 15', fr: 'Pack Contenu 15' }, type: 'one', price: 250,
      badge: { es: 'Contenido', en: 'Content', fr: 'Contenu' },
      note: { es: 'Creación de 15 recursos visuales. Incluye hasta 8 videos.', en: 'Creation of 15 visual assets. Includes up to 8 videos.', fr: 'Création de 15 ressources visuelles. Comprend jusqu\'à 8 vidéos.'},
      description: { es: 'Servicio standalone para generar recursos visuales premium en Canva (editables), basado en tu brief. No incluye publicación, pero sí optimización IA para viralidad.', en: 'Standalone service to generate premium visual assets in Canva (editable), based on your brief. Does not include publishing, but does include AI optimization for virality.', fr: 'Service autonome pour générer des ressources visuelles premium dans Canva (modifiables), basé sur votre brief. Ne comprend pas la publication, mais inclut l\'optimisation IA pour la viralité.' },
    },
    { 
      id: 'prod_cp_3', visible: true, name: { es: 'Paquete de Contenido 20', en: 'Content Pack 20', fr: 'Pack Contenu 20' }, type: 'one', price: 300,
      badge: { es: 'Contenido', en: 'Content', fr: 'Contenu' },
      note: { es: '20 recursos, incluyendo 10 videos y variaciones automáticas con IA.', en: '20 assets, including 10 videos and automatic AI variations.', fr: '20 ressources, dont 10 vidéos et des variations automatiques par IA.'},
      description: { es: 'Un paquete más grande para quienes necesitan un flujo constante de contenido. La IA sugiere variaciones de diseño para A/B testing.', en: 'A larger package for those who need a constant flow of content. AI suggests design variations for A/B testing.', fr: 'Un package plus grand pour ceux qui ont besoin d\'un flux constant de contenu. L\'IA suggère des variations de design pour les tests A/B.' },
    },
    { 
      id: 'prod_cp_4', visible: true, name: { es: 'Paquete de Contenido 30', en: 'Content Pack 30', fr: 'Pack Contenu 30' }, type: 'one', price: 350,
      badge: { es: 'Contenido', en: 'Content', fr: 'Contenu' },
      note: { es: '30 recursos con 15 videos y optimización de engagement completa.', en: '30 assets with 15 videos and full engagement optimization.', fr: '30 ressources avec 15 vidéos et optimisation complète de l\'engagement.'},
      description: { es: 'Nuestro paquete de contenido más completo, ideal para tener material para más de un mes y para campañas de alto impacto.', en: 'Our most complete content package, ideal for having material for more than a month and for high-impact campaigns.', fr: 'Notre pack de contenu le plus complet, idéal pour avoir du matériel pour plus d\'un mois et pour des campagnes à fort impact.' },
    },
    
    { 
      id: 'prod_ugc_1', visible: true, name: { es: 'Creadores Auténticos (UGC)', en: 'Authentic Creators (UGC)', fr: 'Créateurs Authentiques (UGC)' }, type: 'one', price: 500,
      badge: { es: 'UGC', en: 'UGC', fr: 'UGC' },
      note: { es: 'Video auténtico con creador real para máxima confianza y conversión.', en: 'Authentic video with a real creator for maximum trust and conversion.', fr: 'Vidéo authentique avec un vrai créateur pour une confiance et une conversion maximales.'},
      description: { es: 'Videos publicitarios auténticos con creadores reales. Incluye script vendedor optimizado por IA, edición pro, y trafficker por 30 días para monitoreo. UGC genera 5x más confianza que ads tradicionales.', en: 'Authentic advertising videos with real creators. Includes AI-optimized sales script, pro editing, and a trafficker for 30 days for monitoring. UGC generates 5x more trust than traditional ads.', fr: 'Vidéos publicitaires authentiques avec de vrais créateurs. Comprend un script de vente optimisé par IA, un montage professionnel et un trafficker pendant 30 jours pour le suivi. L\'UGC génère 5 fois plus de confiance que les publicités traditionnelles.' },
    },

     { 
      id: 'prod_aio_1', visible: true, name: { es: 'Portal Maestro Digital', en: 'Digital Master Gateway', fr: 'Portail Maître Numérique' }, type: 'sub', price: 1500,
      badge: { es: 'Todo-en-Uno', en: 'All-in-One', fr: 'Tout-en-Un' },
      note: { es: 'Paquete integral: redes, web y campañas en un ecosistema cohesivo.', en: 'Comprehensive package: networks, web, and campaigns in a cohesive ecosystem.', fr: 'Package complet : réseaux, web et campagnes dans un écosystème cohérent.'},
      description: { es: 'Nuestro paquete para dominar el digital. Incluye desarrollo web express (7 días), 15 diseños para FB/IG, 8 videos para TikTok, embudo de IA para leads automáticos, y $50 en ads iniciales. Ahorra 30% vs. servicios separados.', en: 'Our package to master digital. Includes express web development (7 days), 15 designs for FB/IG, 8 videos for TikTok, AI funnel for automatic leads, and $50 in initial ads. Save 30% vs. separate services.', fr: 'Notre forfait pour maîtriser le numérique. Comprend le développement web express (7 jours), 15 créations pour FB/IG, 8 vidéos pour TikTok, un entonnoir IA pour les prospects automatiques et 50 $ de publicités initiales. Économisez 30% par rapport aux services séparés.' },
    },

     { 
      id: 'prod_brand_1', visible: true, name: { es: 'Forja de Marca', en: 'Brand Forge', fr: 'Forge de Marque' }, type: 'one', price: 750,
      badge: { es: 'Branding', en: 'Branding', fr: 'Marque' },
      note: { es: 'Creación de identidad visual: 3 propuestas de logo y manual de marca.', en: 'Visual identity creation: 3 logo proposals and brand manual.', fr: 'Création d\'identité visuelle : 3 propositions de logo et manuel de marque.'},
      description: { es: 'Creación de identidad visual premium, desde logos a recursos. Proceso en etapas con IA para variaciones rápidas. Construye un branding duradero, con manual para consistencia.', en: 'Creation of premium visual identity, from logos to assets. Staged process with AI for quick variations. Build lasting branding, with a manual for consistency.', fr: 'Création d\'identité visuelle premium, des logos aux ressources. Processus par étapes avec IA pour des variations rapides. Construisez une image de marque durable, avec un manuel pour la cohérence.' },
    },
    { 
      id: 'prod_brand_2', visible: true, name: { es: 'Diseño de Flyer "Spark"', en: 'Flyer Design "Spark"', fr: 'Design de Flyer "Spark"' }, type: 'one', price: 150,
      badge: { es: 'Branding', en: 'Branding', fr: 'Marque' },
      note: { es: 'Diseño de flyer (frente y vuelta) con optimización IA y QR interactivo.', en: 'Flyer design (front and back) with AI optimization and interactive QR.', fr: 'Conception de flyer (recto-verso) avec optimisation IA et QR interactif.'},
      description: { es: 'Un flyer no es solo papel. Diseñamos una pieza de marketing potente, con un QR que puedes ligar a tu web o a una promoción especial, y analizamos el diseño con IA para maximizar la atención.', en: 'A flyer is not just paper. We design a powerful marketing piece, with a QR that you can link to your website or a special promotion, and we analyze the design with AI to maximize attention.', fr: 'Un flyer n\'est pas seulement du papier. Nous concevons une pièce de marketing puissante, avec un QR que vous pouvez lier à votre site web ou à une promotion spéciale, et nous analysons le design avec l\'IA pour maximiser l\'attention.' },
    },
    { 
      id: 'prod_brand_3', visible: true, name: { es: 'Tarjeta de Presentación Elite', en: 'Elite Business Card', fr: 'Carte de Visite Élite' }, type: 'one', price: 150,
      badge: { es: 'Branding', en: 'Branding', fr: 'Marque' },
      note: { es: 'Diseño de tarjeta de presentación con QR interactivo y acabados premium.', en: 'Business card design with interactive QR and premium finishes.', fr: 'Conception de carte de visite avec QR interactif et finitions premium.'},
      description: { es: 'Eleva tu networking con una tarjeta que impresiona. Incluimos un QR que lleva a tu LinkedIn, portafolio o web, y te asesoramos en acabados de impresión de lujo.', en: 'Elevate your networking with a card that impresses. We include a QR that links to your LinkedIn, portfolio, or website, and we advise you on luxury printing finishes.', fr: 'Élevez votre réseautage avec une carte qui impressionne. Nous incluons un QR qui mène à votre LinkedIn, portfolio ou site web, et nous vous conseillons sur les finitions d\'impression de luxe.' },
    },
    { 
      id: 'prod_brand_4', visible: true, name: { es: 'Infografía de Impacto', en: 'Impact Infographic', fr: 'Infographie d\'Impact' }, type: 'one', price: 100,
      badge: { es: 'Branding', en: 'Branding', fr: 'Marque' },
      note: { es: 'Visualización de datos en formato 1080x1080 para redes sociales.', en: 'Data visualization in 1080x1080 format for social media.', fr: 'Visualisation de données au format 1080x1080 pour les réseaux sociaux.'},
      description: { es: 'Transformamos datos complejos en una infografía clara, atractiva y fácil de compartir, perfecta para educar a tu audiencia en redes sociales.', en: 'We transform complex data into a clear, attractive, and easy-to-share infographic, perfect for educating your audience on social media.', fr: 'Nous transformons des données complexes en une infographie claire, attrayante et facile à partager, parfaite pour éduquer votre public sur les réseaux sociaux.' },
    },
     { 
      id: 'prod_brand_5', visible: true, name: { es: 'Menú Digital Interactivo', en: 'Interactive Digital Menu', fr: 'Menu Numérique Interactif' }, type: 'one', price: 400,
      badge: { es: 'Branding', en: 'Branding', fr: 'Marque' },
      note: { es: 'Menú digital para restaurantes con enlaces, imágenes y diseño profesional.', en: 'Digital menu for restaurants with links, images, and professional design.', fr: 'Menu numérique pour restaurants avec liens, images et design professionnel.'},
      description: { es: 'Moderniza tu restaurante con un menú digital accesible vía QR. Atractivo, fácil de actualizar y con posibilidad de enlazar a tus redes o sistema de pedidos.', en: 'Modernize your restaurant with a digital menu accessible via QR. Attractive, easy to update, and with the ability to link to your networks or ordering system.', fr: 'Modernisez votre restaurant avec un menu numérique accessible via QR. Attrayant, facile à mettre à jour et avec la possibilité de créer un lien vers vos réseaux ou votre système de commande.' },
    },
    { 
      id: 'prod_brand_6', visible: true, name: { es: 'Diseño de Packaging Pro', en: 'Pro Packaging Design', fr: 'Design d\'Emballage Pro' }, type: 'one', price: 500,
      badge: { es: 'Branding', en: 'Branding', fr: 'Marque' },
      note: { es: 'Diseño de empaque para producto con render 3D para visualización.', en: 'Product packaging design with 3D render for visualization.', fr: 'Conception d\'emballage de produit avec rendu 3D pour visualisation.'},
      description: { es: 'El empaque es el primer contacto físico con tu producto. Creamos un diseño que no solo protege, sino que enamora y comunica el valor de tu marca desde el estante.', en: 'Packaging is the first physical contact with your product. We create a design that not only protects, but also captivates and communicates the value of your brand from the shelf.', fr: 'L\'emballage est le premier contact physique avec votre produit. Nous créons un design qui non seulement protège, mais qui séduit et communique la valeur de votre marque dès le rayon.' },
    },

    { 
      id: 'prod_ent_1', visible: true, name: { es: 'Escudo de Marca (Trademark)', en: 'Trademark Shield', fr: 'Bouclier de Marque (Trademark)' }, type: 'one', price: 3750,
      badge: { es: 'Corporativo', en: 'Corporate', fr: 'Corporatif' },
      note: { es: 'Registro y protección de tu marca a nivel nacional.', en: 'Registration and protection of your brand nationwide.', fr: 'Enregistrement et protection de votre marque au niveau national.'},
      description: { es: 'Asegura la exclusividad de tu nombre o logo. Incluye búsqueda de viabilidad, gestión del registro ante la autoridad competente y monitoreo por 1 año con IA para detectar posibles infracciones.', en: 'Ensure the exclusivity of your name or logo. Includes feasibility search, registration management with the competent authority, and 1-year AI monitoring to detect possible infringements.', fr: 'Assurez l\'exclusivité de votre nom ou logo. Comprend une recherche de faisabilité, la gestion de l\'enregistrement auprès de l\'autorité compétente et une surveillance par IA d\'un an pour détecter les infractions possibles.' },
    },
    { 
      id: 'prod_ent_2', visible: true, name: { es: 'Valoración de Negocio', en: 'Business Valuation', fr: 'Évaluation d\'Entreprise' }, type: 'one', price: 17500,
      badge: { es: 'Corporativo', en: 'Corporate', fr: 'Corporatif' },
      note: { es: 'Análisis financiero para determinar el valor de tu empresa.', en: 'Financial analysis to determine the value of your company.', fr: 'Analyse financière pour déterminer la valeur de votre entreprise.'},
      description: { es: 'Servicio de consultoría de alto nivel para fusiones, adquisiciones o rondas de inversión. Un equipo de analistas financieros y una IA de valoración determinan el valor real de tu negocio en el mercado.', en: 'High-level consulting service for mergers, acquisitions, or investment rounds. A team of financial analysts and a valuation AI determine the real market value of your business.', fr: 'Service de conseil de haut niveau pour les fusions, acquisitions ou levées de fonds. Une équipe d\'analystes financiers et une IA d\'évaluation déterminent la valeur marchande réelle de votre entreprise.' },
    },
    { 
      id: 'prod_ent_3', visible: true, name: { es: 'Creación de Fundación', en: 'Foundation Setup', fr: 'Création de Fondation' }, type: 'one', price: 10000,
      badge: { es: 'Corporativo', en: 'Corporate', fr: 'Corporatif' },
      note: { es: 'Establecimiento de una fundación o A.C. para fines filantrópicos.', en: 'Establishment of a foundation or non-profit for philanthropic purposes.', fr: 'Création d\'une fondation ou d\'une association à but non lucratif à des fins philanthropiques.'},
      description: { es: 'Te guiamos en todo el proceso legal y administrativo para constituir una Asociación Civil o Fundación, permitiéndole canalizar tus esfuerzos de responsabilidad social de manera formal y estructurada.', en: 'We guide you through the entire legal and administrative process to establish a Civil Association or Foundation, allowing you to channel your social responsibility efforts in a formal and structured way.', fr: 'Nous vous guidons tout au long du processus juridique et administratif pour créer une Association Civile ou une Fondation, vous permettant de canaliser vos efforts de responsabilité sociale de manière formelle et structurée.' },
    },
  ],
};
