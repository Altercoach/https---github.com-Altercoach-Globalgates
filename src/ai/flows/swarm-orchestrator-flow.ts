'use server';
/**
 * AI Swarm Orchestrator — DeerFlow-inspired multi-agent content pipeline
 *
 * Architecture (inspired by ByteDance DeerFlow, MIT):
 *   Researcher → Strategist → Copywriter → Visual Director → Scheduler
 *
 * Each agent runs as an independent llm call and passes its output
 * as context to the next.  The user can Observe (auto-run) or
 * Intervene (review / edit between steps).
 *
 * Video generation delegated to LTX-Video-2 (Lightricks) via
 * /api/generate-video route handler.
 *
 * Multi-platform publishing compatible with Mixpost REST API.
 */

import { z } from 'zod';
import { ai, googleAI } from '@/ai/genkit';

// ── Platform catalogue ────────────────────────────────────────────────────────

export const PLATFORMS = [
  'instagram',
  'facebook',
  'twitter',
  'linkedin',
  'tiktok',
  'threads',   // Meta Threads ("Andromeda" ecosystem)
] as const;

export type SocialPlatform = (typeof PLATFORMS)[number];

export const PLATFORM_META: Record<
  SocialPlatform,
  { label: string; gradient: string; textColor: string; emoji: string; charLimit: number; videoSupport: boolean }
> = {
  instagram: {
    label: 'Instagram',
    gradient: 'from-purple-500 via-pink-500 to-orange-400',
    textColor: 'text-pink-600',
    emoji: '📸',
    charLimit: 2200,
    videoSupport: true,
  },
  facebook: {
    label: 'Facebook',
    gradient: 'from-blue-600 to-blue-800',
    textColor: 'text-blue-700',
    emoji: '👥',
    charLimit: 63206,
    videoSupport: true,
  },
  twitter: {
    label: 'X (Twitter)',
    gradient: 'from-gray-700 to-black',
    textColor: 'text-gray-800',
    emoji: '𝕏',
    charLimit: 280,
    videoSupport: false,
  },
  linkedin: {
    label: 'LinkedIn',
    gradient: 'from-sky-600 to-blue-700',
    textColor: 'text-sky-700',
    emoji: '💼',
    charLimit: 3000,
    videoSupport: false,
  },
  tiktok: {
    label: 'TikTok',
    gradient: 'from-pink-500 via-red-400 to-yellow-400',
    textColor: 'text-pink-700',
    emoji: '🎵',
    charLimit: 2200,
    videoSupport: true,
  },
  threads: {
    label: 'Threads (Meta/Andromeda)',
    gradient: 'from-gray-600 to-gray-900',
    textColor: 'text-gray-800',
    emoji: '🧵',
    charLimit: 500,
    videoSupport: true,
  },
};

// ── Shared zod schemas ────────────────────────────────────────────────────────

export const PlatformPostSchema = z.object({
  platform: z.enum(PLATFORMS),
  copy: z.string(),
  hashtags: z.array(z.string()),
  imagePrompt: z.string(),
  videoPrompt: z.string().optional(),
  imageUrl: z.string().optional(),
  videoUrl: z.string().optional(),
});

export type PlatformPost = z.infer<typeof PlatformPostSchema>;

export interface ScheduledPost extends PlatformPost {
  optimalTime: string;
  reasoning: string;
  scheduledAt: string;
}

// ── Fallback posts (demo mode) ────────────────────────────────────────────────

const FALLBACK_POSTS: Record<SocialPlatform, Omit<PlatformPost, 'platform'>> = {
  instagram: {
    copy: '✨ Cada día es una oportunidad de crecer. ¿Estás aprovechando todo tu potencial digital?\n\n📌 Descubre cómo ayudamos a marcas como la tuya a brillar en cada red.',
    hashtags: ['#marketing', '#crecimiento', '#negocio', '#emprendedor', '#socialmedia', '#estrategia'],
    imagePrompt:
      'Modern entrepreneur at minimal white desk, warm golden-hour lighting, brand moodboard on wall, shallow depth of field, Fujifilm X-T4 35mm f/1.4, editorial style',
  },
  facebook: {
    copy: '¿Sabías que las marcas con estrategia de contenido consistente generan 3× más leads?\n\nEn nuestro equipo ayudamos a negocios como el tuyo a crear presencia digital auténtica que convierte. 👇 Cuéntanos cuál es tu mayor reto.',
    hashtags: ['#marketing', '#negociosdigitales', '#estrategia'],
    imagePrompt:
      'Diverse creative team brainstorming around table with laptops and sticky notes, bright modern office, natural light from window, Canon EOS R5 50mm, lifestyle photography',
  },
  twitter: {
    copy: '🚀 El mejor momento para arrancar tu estrategia digital fue ayer. El segundo mejor es ahora. #marketing #growth',
    hashtags: ['#marketing', '#growth'],
    imagePrompt:
      'Bold minimalist typography on clean white background with electric blue accent lines, ultra-high contrast, editorial graphic design style',
  },
  linkedin: {
    copy: 'Las empresas que invierten en contenido estratégico ven un ROI promedio del 300 % en 6 meses.\n\nLa clave: consistencia + valor real para tu audiencia.\n\n📊 Tres pasos para lograrlo:\n1️⃣ Define tus pilares de contenido\n2️⃣ Publica con regularidad\n3️⃣ Mide y ajusta\n\n¿Cuál es tu mayor reto en marketing digital hoy?',
    hashtags: ['#marketingdigital', '#estrategiacontenido', '#liderazgo'],
    imagePrompt:
      'Professional infographic with upward-trending data chart, clean corporate blue and white palette, flat design icons, business metrics, white background',
  },
  tiktok: {
    copy: 'POV: encontraste la agencia que sí entiende tu negocio 🎯\n\nSwipe para ver cómo lo hacemos diferente ⬇️',
    hashtags: ['#marketing', '#negocios', '#emprendedor', '#marketingtips', '#tiktokbusiness'],
    imagePrompt:
      'Vibrant split-screen brand transformation reveal, bold Gen-Z color palette, dynamic typography animation, high-energy visual',
    videoPrompt:
      'Scene 1 (0-2s): Close-up of person frustrated scrolling social media. | Scene 2 (2-4s): Quick montage of brand transformation: new logo, vibrant posts, likes counter exploding. | Scene 3 (4-6s): Happy entrepreneur smiling at phone with metrics going up. Bold text overlay: "Esto también puede ser tú 🚀"',
  },
  threads: {
    copy: 'Hot take: la mayoría de las marcas publican por publicar.\n\nLa diferencia la hace el "por qué" detrás de cada post.\n\n¿Qué opinas?',
    hashtags: ['#marketing'],
    imagePrompt:
      'Candid lifestyle flat-lay of notebook, coffee cup and phone on wooden desk, warm natural tones, Instagram-worthy composition, authentic and unfiltered',
  },
};

function buildFallbackPosts(platforms: SocialPlatform[]): PlatformPost[] {
  return platforms.map((p) => ({ platform: p, ...FALLBACK_POSTS[p] }));
}

const DEFAULT_TIMES: Record<SocialPlatform, string> = {
  instagram: 'Martes 11am',
  facebook: 'Miércoles 1pm',
  twitter: 'Lunes 9am',
  linkedin: 'Jueves 8am',
  tiktok: 'Viernes 7pm',
  threads: 'Martes 7pm',
};

// ── Agent 1 — Researcher ──────────────────────────────────────────────────────

export async function runResearchAgent(
  clientDescription: string,
  lang = 'es'
): Promise<string> {
  try {
    const result = await ai.generate({
      model: googleAI.model('gemini-1.5-flash'),
      prompt: `Eres un investigador de marketing experto (idioma de respuesta: ${lang}).

Analiza este negocio y redacta un informe breve (máx 250 palabras) con:
• Audiencia objetivo principal (edad, intereses, plataformas preferidas)
• Fortalezas de marca y propuesta de valor
• Oportunidades clave en redes sociales
• Principales competidores y diferenciadores

Responde en texto limpio, sin markdown pesado.

Negocio:
${clientDescription}`,
    });
    return result.text?.trim() || 'Sin resultado de investigación.';
  } catch {
    return `Análisis de mercado (modo demo): Negocio con potencial de crecimiento digital. Audiencia principal 25-45 años activa en Instagram, LinkedIn y Threads. Fortalezas: buena calidad de producto y alta recompra. Oportunidades: contenido educativo, reels de producto y comunidad en Threads. Diferenciador clave: trato personalizado y entrega rápida.`;
  }
}

// ── Agent 2 — Strategist ──────────────────────────────────────────────────────

export async function runStrategyAgent(
  research: string,
  platforms: SocialPlatform[],
  lang = 'es'
): Promise<string> {
  try {
    const result = await ai.generate({
      model: googleAI.model('gemini-1.5-flash'),
      prompt: `Eres un estratega de contenido experto (idioma: ${lang}).

Basado en el análisis de mercado, crea una estrategia de contenido para: ${platforms.join(', ')}.

Define:
• 3-4 pilares de contenido con ejemplos
• Tono de voz y estilo comunicacional
• Frecuencia recomendada por plataforma
• 5 temas de alto impacto para el próximo mes
• KPIs clave a medir

Responde en texto limpio y estructurado.

Análisis de mercado:
${research}`,
    });
    return result.text?.trim() || 'Sin estrategia generada.';
  } catch {
    const ps = platforms.join(', ');
    return `Estrategia para ${ps} (modo demo):\n\nPilares de contenido: Educación de valor, Testimonios y casos de éxito, Productos estrella y novedades, Detrás de escena.\n\nTono: Cercano, profesional e inspirador.\n\nFrecuencia: 4-5 posts/semana en Instagram, 3x/semana Facebook, diario Twitter/Threads, 2x/semana LinkedIn, 3x/semana TikTok.\n\nTemas clave: Tutorial de uso, Historia de cliente, Promo temporal, Curiosidad del sector, Pregunta abierta a comunidad.`;
  }
}

// ── Agent 3 — Copywriter ──────────────────────────────────────────────────────

const CopywriterOutputSchema = z.object({
  posts: z.array(PlatformPostSchema),
});

export async function runCopywriterAgent(
  strategy: string,
  platforms: SocialPlatform[],
  lang = 'es'
): Promise<PlatformPost[]> {
  try {
    const { output } = await ai.generate({
      model: googleAI.model('gemini-1.5-pro'),
      output: { schema: CopywriterOutputSchema },
      prompt: `Eres copywriter experto en redes sociales (idioma de respuesta: ${lang}).

Crea UN post optimizado para CADA una de estas plataformas: ${platforms.join(', ')}.

Adapta el estilo a cada red:
- instagram: visual, emojis, 2-3 párrafos, 6-10 hashtags de nicho
- facebook: conversacional, más texto, 3-4 hashtags generales
- twitter: máx 270 chars, gancho fuerte, 1-2 hashtags
- linkedin: profesional, valor real, sin exceso de hashtags (2-3 max)
- tiktok: tono energético, CTA fuerte, menciona tipo de video y hashtags trending
- threads: casual, auténtico, conversacional, 0-2 hashtags

Para imagePrompt escribe una descripción detallada en INGLÉS para generación con IA (estilo fotográfico, colores, composición).
Para videoPrompt (solo tiktok/threads/instagram) describe 3 escenas de 2 segundos cada una.

Responde SOLO JSON válido siguiendo el schema exacto.

Estrategia de contenido:
${strategy}`,
    });
    return output?.posts ?? buildFallbackPosts(platforms);
  } catch {
    return buildFallbackPosts(platforms);
  }
}

// ── Agent 4 — Visual Director (LTX-Video prompts) ────────────────────────────

export async function runVisualAgent(
  posts: PlatformPost[],
  lang = 'es'
): Promise<PlatformPost[]> {
  try {
    const enhanced: PlatformPost[] = [];
    for (const post of posts) {
      try {
        const result = await ai.generate({
          model: googleAI.model('gemini-1.5-flash'),
          prompt: `Eres director creativo visual experto en contenido generado por IA (idioma: ${lang}).

Mejora este imagePrompt para que sea óptimo para LTX-Video-2 (Lightricks) o Imagen 3 (Google).
Un buen prompt incluye: estilo fotográfico/cinematográfico, iluminación específica, paleta de colores, composición, tipo de lente/plano, movimiento de cámara.

${post.platform === 'tiktok' || post.platform === 'instagram' || post.platform === 'threads'
  ? `También escribe un videoPrompt para LTX-Video-2 con 3 escenas de 2-3 segundos cada una para un Reel vertical 9:16.`
  : ''}

Plataforma: ${post.platform}
Copy: ${post.copy.substring(0, 120)}
imagePrompt actual: ${post.imagePrompt}

Responde SOLO con JSON: {"imagePrompt":"...","videoPrompt":"..."}`,
        });
        try {
          const txt = result.text?.trim() || '{}';
          const cleaned = txt.replace(/^```json\s*/i, '').replace(/```\s*$/i, '');
          const parsed = JSON.parse(cleaned) as { imagePrompt?: string; videoPrompt?: string };
          enhanced.push({
            ...post,
            imagePrompt: parsed.imagePrompt ?? post.imagePrompt,
            videoPrompt: parsed.videoPrompt ?? post.videoPrompt,
          });
        } catch {
          enhanced.push(post);
        }
      } catch {
        enhanced.push(post);
      }
    }
    return enhanced;
  } catch {
    return posts;
  }
}

// ── Agent 5 — Scheduler ───────────────────────────────────────────────────────

const SchedulerOutputSchema = z.object({
  items: z.array(
    z.object({
      platform: z.string(),
      optimalTime: z.string(),
      reasoning: z.string(),
    })
  ),
});

export async function runSchedulerAgent(
  posts: PlatformPost[],
  lang = 'es'
): Promise<ScheduledPost[]> {
  const platformList = posts.map((p) => p.platform).join(', ');
  try {
    const { output } = await ai.generate({
      model: googleAI.model('gemini-1.5-flash'),
      output: { schema: SchedulerOutputSchema },
      prompt: `Eres experto en scheduling de redes sociales (idioma: ${lang}).

Para estas plataformas: ${platformList}
Sugiere el mejor día y hora de publicación (zona horaria: América Latina, UTC-5 a UTC-3).
Basa la recomendación en datos de engagement por plataforma.

Responde SOLO JSON del schema.`,
    });
    const items = output?.items ?? [];
    return posts.map((post, i) => {
      const sched = items[i] ?? {
        optimalTime: DEFAULT_TIMES[post.platform],
        reasoning: 'Alta actividad de audiencia según benchmarks de la industria.',
      };
      return {
        ...post,
        optimalTime: sched.optimalTime,
        reasoning: sched.reasoning,
        scheduledAt: new Date(Date.now() + (i + 1) * 24 * 3600 * 1000).toISOString(),
      };
    });
  } catch {
    return posts.map((post, i) => ({
      ...post,
      optimalTime: DEFAULT_TIMES[post.platform],
      reasoning: 'Alta actividad de audiencia según benchmarks de la industria.',
      scheduledAt: new Date(Date.now() + (i + 1) * 24 * 3600 * 1000).toISOString(),
    }));
  }
}
