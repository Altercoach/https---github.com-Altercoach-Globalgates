
import type { SiteData } from '@/lib/types';

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
      "id": "solution-1",
      "visible": true,
      "title": {
        "es": "Branding",
        "en": "Branding",
        "fr": "Image de marque"
      },
      "bullets": [
        {
          "es": "Estrategia y concepto de marca.",
          "en": "Brand strategy and concept.",
          "fr": "Stratégie et concept de marque."
        },
        {
          "es": "Diseño de identidad visual.",
          "en": "Visual identity design.",
          "fr": "Conception d'identité visuelle."
        },
        {
          "es": "Posicionamiento en el mercado.",
          "en": "Market positioning.",
          "fr": "Positionnement sur le marché."
        }
      ]
    },
    {
      "id": "solution-2",
      "visible": true,
      "title": {
        "es": "Marketing de Contenidos",
        "en": "Content Marketing",
        "fr": "Marketing de Contenu"
      },
      "bullets": [
        {
          "es": "Creación de contenido valioso.",
          "en": "Creation of valuable content.",
          "fr": "Création de contenu de valeur."
        },
        {
          "es": "Estrategia de redes sociales.",
          "en": "Social media strategy.",
          "fr": "Stratégie des réseaux sociaux."
        },
        {
          "es": "Publicación y análisis de resultados.",
          "en": "Publishing and results analysis.",
          "fr": "Publication et analyse des résultats."
        }
      ]
    },
    {
      "id": "solution-3",
      "visible": true,
      "title": {
        "es": "Funnels y Automatización",
        "en": "Funnels & Automation",
        "fr": "Entonnoirs et Automatisation"
      },
      "bullets": [
        {
          "es": "Diseño de embudos de conversión.",
          "en": "Conversion funnel design.",
          "fr": "Conception d'entonnoirs de conversion."
        },
        {
          "es": "Automatización de marketing y ventas.",
          "en": "Marketing and sales automation.",
          "fr": "Automatisation du marketing et des ventes."
        },
        {
          "es": "Integración con Agentes de IA.",
          "en": "Integration with AI Agents.",
          "fr": "Intégration avec des Agents IA."
        }
      ]
    },
    {
      "id": "svc_1719541577936",
      "visible": true,
      "title": {
        "es": "SEO y Posicionamiento Web",
        "en": "SEO and Web Positioning",
        "fr": "SEO et Positionnement Web"
      },
      "bullets": [
        {
          "es": "Análisis de competencia y palabras clave con IA.",
          "en": "AI-powered competitor and keyword analysis.",
          "fr": "Analyse de la concurrence et des mots-clés par l'IA."
        },
        {
          "es": "Optimización on-page y creación de contenido estratégico.",
          "en": "On-page optimization and strategic content creation.",
          "fr": "Optimisation on-page et création de contenu stratégique."
        },
        {
          "es": "Monitoreo de rankings y reportes de visibilidad mensuales.",
          "en": "Ranking monitoring and monthly visibility reports.",
          "fr": "Suivi du classement et rapports de visibilité mensuels."
        }
      ]
    }
  ],
  "products": [
    {
      "id": "prod_sm_1",
      "visible": true,
      "name": {
        "es": "Impulso Esencial (1 Red)",
        "en": "Essential Boost (1 Network)",
        "fr": "Boost Essentiel (1 Réseau)"
      },
      "type": "sub",
      "price": 100,
      "badge": {
        "es": "Popular",
        "en": "Popular",
        "fr": "Populaire"
      },
      "note": {
        "es": "Perfecto para empezar a construir tu presencia online.",
        "en": "Perfect for starting to build your online presence.",
        "fr": "Parfait pour commencer à construire votre présence en ligne."
      },
      "description": {
        "es": "Este plan te da todo lo que necesitas para arrancar en una red social. Incluye estrategia de contenido, 12 publicaciones al mes y un reporte mensual de rendimiento.",
        "en": "This plan gives you everything you need to get started on one social network. It includes content strategy, 12 posts per month, and a monthly performance report.",
        "fr": "Ce forfait vous donne tout ce dont vous avez besoin pour démarrer sur un réseau social. Il comprend une stratégie de contenu, 12 publications par mois et un rapport de performance mensuel."
      },
      "features": [
        {
          "id": "business-evaluation",
          "name": "Business Evaluation (Doctor RX)",
          "stage": "onboarding",
          "enabled": true,
          "href": "/myoffice/questionnaires/business-evaluation-001"
        },
        {
          "id": "brief-marketing",
          "name": "Professional Marketing Brief",
          "stage": "onboarding",
          "enabled": false,
          "href": "/myoffice/questionnaires/edit"
        },
        {
          "id": "agent-training",
          "name": "AI Agent Training",
          "stage": "onboarding",
          "enabled": false,
          "href": "/myoffice/questionnaires/edit"
        },
        {
          "id": "satisfaction-survey",
          "name": "Satisfaction Survey",
          "stage": "campaign_end",
          "enabled": true,
          "href": "/myoffice/questionnaires/edit"
        }
      ]
    },
    {
      "id": "prod_sm_2",
      "visible": true,
      "name": {
        "es": "Dúo Conexión (2 Redes)",
        "en": "Duo Connection (2 Networks)",
        "fr": "Connexion Duo (2 Réseaux)"
      },
      "type": "sub",
      "price": 350,
      "badge": {
        "es": "Más Valor",
        "en": "More Value",
        "fr": "Plus de Valeur"
      },
      "note": {
        "es": "Expande tu alcance y conecta con tu audiencia en dos plataformas clave.",
        "en": "Expand your reach and connect with your audience on two key platforms.",
        "fr": "Étendez votre portée et connectez-vous avec votre public sur deux plateformes clés."
      },
      "description": {
        "es": "Cubre dos redes sociales a tu elección, con 16 publicaciones mensuales (8 por red), gestión de comunidad básica y un reporte quincenal.",
        "en": "Covers two social networks of your choice, with 16 monthly posts (8 per network), basic community management, and a bi-weekly report.",
        "fr": "Couvre deux réseaux sociaux de votre choix, avec 16 publications par mois (8 par réseau), une gestion de communauté de base et un rapport bimensuel."
      },
      "features": [
        {
          "id": "business-evaluation",
          "name": "Business Evaluation (Doctor RX)",
          "stage": "onboarding",
          "enabled": true,
          "href": "/myoffice/questionnaires/business-evaluation-001"
        },
        {
          "id": "brief-marketing",
          "name": "Professional Marketing Brief",
          "stage": "onboarding",
          "enabled": false,
          "href": "/myoffice/questionnaires/edit"
        },
        {
          "id": "agent-training",
          "name": "AI Agent Training",
          "stage": "onboarding",
          "enabled": false,
          "href": "/myoffice/questionnaires/edit"
        },
        {
          "id": "satisfaction-survey",
          "name": "Satisfaction Survey",
          "stage": "campaign_end",
          "enabled": true,
          "href": "/myoffice/questionnaires/edit"
        }
      ]
    },
    {
      "id": "prod_sm_3",
      "visible": true,
      "name": {
        "es": "Tridente Digital VIP (3 Redes)",
        "en": "VIP Digital Trident (3 Networks)",
        "fr": "Trident Numérique VIP (3 Réseaux)"
      },
      "type": "sub",
      "price": 850,
      "badge": {
        "es": "Pro",
        "en": "Pro",
        "fr": "Pro"
      },
      "note": {
        "es": "Dominio total en 3 redes, con estrategia avanzada y soporte prioritario.",
        "en": "Total domination on 3 networks, with advanced strategy and priority support.",
        "fr": "Domination totale sur 3 réseaux, avec stratégie avancée et support prioritaire."
      },
      "description": {
        "es": "El paquete definitivo. 24 publicaciones al mes, gestión de comunidad completa, reportes semanales, una sesión de estrategia mensual y soporte prioritario.",
        "en": "The ultimate package. 24 posts per month, full community management, weekly reports, a monthly strategy session, and priority support.",
        "fr": "Le forfait ultime. 24 publications par mois, gestion complète de la communauté, rapports hebdomadaires, une session de stratégie mensuelle et un support prioritaire."
      },
      "features": [
        {
          "id": "business-evaluation",
          "name": "Business Evaluation (Doctor RX)",
          "stage": "onboarding",
          "enabled": true,
          "href": "/myoffice/questionnaires/business-evaluation-001"
        },
        {
          "id": "brief-marketing",
          "name": "Professional Marketing Brief",
          "stage": "onboarding",
          "enabled": true,
          "href": "/myoffice/questionnaires/edit"
        },
        {
          "id": "agent-training",
          "name": "AI Agent Training",
          "stage": "onboarding",
          "enabled": false,
          "href": "/myoffice/questionnaires/edit"
        },
        {
          "id": "satisfaction-survey",
          "name": "Satisfaction Survey",
          "stage": "campaign_end",
          "enabled": true,
          "href": "/myoffice/questionnaires/edit"
        }
      ]
    },
    {
      "id": "prod_funnel",
      "visible": true,
      "name": {
        "es": "Setup Funnel de Conversión",
        "en": "Conversion Funnel Setup",
        "fr": "Configuration de l'Entonnoir de Conversion"
      },
      "type": "one",
      "price": 450,
      "badge": {
        "es": "Popular",
        "en": "Popular",
        "fr": "Populaire"
      },
      "note": {
        "es": "Diseñamos y construimos tu embudo de ventas para capturar y convertir leads.",
        "en": "We design and build your sales funnel to capture and convert leads.",
        "fr": "Nous concevons et construisons votre entonnoir de vente pour capturer et convertir des prospects."
      },
      "description": {
        "es": "Incluye el diseño de la estrategia del embudo, creación de hasta 3 landing pages, configuración de formularios y la integración de un agente de IA básico para calificación de leads.",
        "en": "Includes funnel strategy design, creation of up to 3 landing pages, form setup, and integration of a basic AI agent for lead qualification.",
        "fr": "Comprend la conception de la stratégie de l'entonnoir, la création de jusqu'à 3 pages de destination, la configuration de formulaires et l'intégration d'un agent IA de base pour la qualification des prospects."
      },
      "features": [
        {
          "id": "business-evaluation",
          "name": "Business Evaluation (Doctor RX)",
          "stage": "onboarding",
          "enabled": true,
          "href": "/myoffice/questionnaires/business-evaluation-001"
        },
        {
          "id": "brief-marketing",
          "name": "Professional Marketing Brief",
          "stage": "onboarding",
          "enabled": true,
          "href": "/myoffice/questionnaires/edit"
        },
        {
          "id": "agent-training",
          "name": "AI Agent Training",
          "stage": "onboarding",
          "enabled": true,
          "href": "/myoffice/questionnaires/edit"
        },
        {
          "id": "satisfaction-survey",
          "name": "Satisfaction Survey",
          "stage": "campaign_end",
          "enabled": false,
          "href": "/myoffice/questionnaires/edit"
        }
      ]
    },
    {
      "id": "prod_seo_1",
      "visible": true,
      "name": {
        "es": "Ascenso SEO Estratégico",
        "en": "Strategic SEO Ascent",
        "fr": "Ascension SEO Stratégique"
      },
      "type": "sub",
      "price": 950,
      "badge": {
        "es": "Nuevo",
        "en": "New",
        "fr": "Nouveau"
      },
      "note": {
        "es": "Servicio mensual para mejorar tu ranking en Google y atraer tráfico orgánico.",
        "en": "Monthly service to improve your Google ranking and attract organic traffic.",
        "fr": "Service mensuel pour améliorer votre classement Google et attirer du trafic organique."
      },
      "description": {
        "es": "Nuestro plan de SEO más completo. Incluye una auditoría SEO inicial, investigación de palabras clave, optimización on-page, creación de 4 artículos de blog optimizados al mes y monitoreo de ranking.",
        "en": "Our most comprehensive SEO plan. Includes an initial SEO audit, keyword research, on-page optimization, creation of 4 optimized blog articles per month, and rank tracking.",
        "fr": "Notre plan SEO le plus complet. Comprend un audit SEO initial, une recherche de mots-clés, une optimisation on-page, la création de 4 articles de blog optimisés par mois et un suivi du classement."
      },
      "features": [
        {
          "id": "business-evaluation",
          "name": "Business Evaluation (Doctor RX)",
          "stage": "onboarding",
          "enabled": true,
          "href": "/myoffice/questionnaires/business-evaluation-001"
        },
        {
          "id": "brief-marketing",
          "name": "Professional Marketing Brief",
          "stage": "onboarding",
          "enabled": true,
          "href": "/myoffice/questionnaires/edit"
        },
        {
          "id": "agent-training",
          "name": "AI Agent Training",
          "stage": "onboarding",
          "enabled": false,
          "href": "/myoffice/questionnaires/edit"
        },
        {
          "id": "satisfaction-survey",
          "name": "Satisfaction Survey",
          "stage": "campaign_end",
          "enabled": true,
          "href": "/myoffice/questionnaires/edit"
        }
      ]
    }
  ]
};

  