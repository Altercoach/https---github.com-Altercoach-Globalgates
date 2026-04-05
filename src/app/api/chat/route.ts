import { NextResponse } from 'next/server';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const ChatHistorySchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const ChatInputSchema = z.object({
  history: z.array(ChatHistorySchema),
  systemPrompt: z.string(),
  knowledgeBase: z.string(),
  language: z.string(),
});

const getFallbackResponse = (language: string) => {
  const fallbackByLanguage: Record<string, string> = {
    es: 'En este momento nuestro asistente IA esta temporalmente no disponible por configuracion del servidor. Te podemos ayudar con informacion de planes y darte seguimiento por WhatsApp o correo.',
    en: 'Our AI assistant is temporarily unavailable due to a server configuration issue. We can still help with plan details and follow up via WhatsApp or email.',
    fr: 'Notre assistant IA est temporairement indisponible en raison d\'une configuration serveur. Nous pouvons tout de meme vous aider avec les informations sur les offres et un suivi par WhatsApp ou e-mail.',
  };

  return fallbackByLanguage[language] || fallbackByLanguage.en;
};

export async function POST(request: Request) {
  let requestedLanguage = 'en';

  try {
    const body = await request.json();
    const parsed = ChatInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ response: getFallbackResponse(requestedLanguage) });
    }

    requestedLanguage = parsed.data.language;

    const apiKey = process.env.GOOGLE_GENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ response: getFallbackResponse(requestedLanguage) });
    }

    const systemInstruction = `${parsed.data.systemPrompt}\n\nYou MUST respond in the following language: ${parsed.data.language}.\n\n--- KNOWLEDGE BASE ---\n${parsed.data.knowledgeBase}\n--- END KNOWLEDGE BASE ---`;

    const payload = {
      system_instruction: {
        parts: [{ text: systemInstruction }],
      },
      contents: parsed.data.history.map((item) => ({
        role: item.role,
        parts: [{ text: item.content }],
      })),
      generationConfig: {
        temperature: 0.5,
      },
    };

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    if (!geminiResponse.ok) {
      console.error('Gemini API error:', geminiResponse.status, await geminiResponse.text());
      return NextResponse.json({ response: getFallbackResponse(requestedLanguage) });
    }

    const geminiJson = await geminiResponse.json();
    const text = geminiJson?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ response: getFallbackResponse(requestedLanguage) });
    }

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error('Error in /api/chat:', error);
    return NextResponse.json({ response: getFallbackResponse(requestedLanguage) });
  }
}