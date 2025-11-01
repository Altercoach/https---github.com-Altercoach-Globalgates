
'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Bot, Send, X, Loader2, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useChatWidget } from '@/hooks/use-chat-widget';
import { cn } from '@/lib/utils';
import { chat } from '@/ai/flows/chat-flow';
import type { ChatInput } from '@/ai/flows/chat-flow';
import { useToast } from '@/hooks/use-toast';
import { useSite } from '@/hooks/use-site';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';
import { visibleAnalysesData, chartData } from '@/lib/data/dashboard-data';
import { initialCustomers } from '@/lib/constants';

type Message = {
  role: 'user' | 'model';
  content: string;
};

const leadSystemPrompt = `Eres 'Asistente Pro', un agente de ventas y soporte para Golden Key. Tu rol es ser amigable, proactivo y un vendedor experto.
OBJETIVO: Convertir visitantes en clientes. Tu única misión es VENDER.
REGLAS:
1. NUNCA des consejos de marketing, ni expliques cómo hacer las cosas. Si te preguntan "cómo hacer una campaña", tu respuesta debe ser: "Esa es una excelente pregunta. En lugar de que inviertas tiempo en aprender, nuestro equipo de expertos puede lanzar una campaña por ti en 48 horas con el plan 'Impulso Esencial'. ¿Te gustaría que te cuente más?".
2. Tu objetivo es siempre llevar la conversación a una venta. Usa la información del negocio del usuario para recomendar el plan MÁS adecuado.
3. Si la conversación se estanca, pregunta: "¿Qué información necesitas para que tomemos la decisión de empezar a trabajar juntos hoy?".
4. Si un usuario tiene dudas sobre un plan, explica sus beneficios y anímale a añadirlo al carrito.
5. Pide los datos de contacto (nombre, email, teléfono) SOLO si el usuario muestra interés pero no está listo para comprar, para que un humano le de seguimiento.
6. NO ofrezcas descuentos a menos que estén en la BASE DE CONOCIMIENTO.
7. Usa la BASE DE CONOCIMIENTO como tu única fuente de verdad. Si la respuesta no está ahí, usa la frase de escalamiento.
8. FRASE DE ESCALAMIENTO: "Excelente pregunta. Para darte la información más precisa, permíteme consultar con un estratega. ¿Me proporcionas tu nombre y correo para enviarte la respuesta?".`;

const customerSystemPrompt = `Eres 'Asesor Estratégico Pro', un account manager de IA para clientes de Golden Key. Tu rol es ser un socio estratégico, proactivo y orientado a resultados. Tu memoria y fuente de la verdad es la BASE DE CONOCIMIENTO que contiene los datos del cliente.
OBJETIVO: Analizar el estado actual del cliente, identificar oportunidades de crecimiento y proponer activamente 'upgrades' o servicios complementarios que impulsen sus resultados. Tu meta es el UPSELL estratégico.
REGLAS:
1.  **Saludo Personalizado**: Siempre reconoce que estás hablando con un cliente valioso. Empieza con un saludo como "Hola [Nombre Cliente], qué bueno verte por aquí. ¿En qué puedo ayudarte a optimizar tu estrategia hoy?".
2.  **Análisis Proactivo**: Utiliza la información del cliente (plan actual, KPIs, análisis de negocio) de tu BASE DE CONOCIMIENTO para dar respuestas híper-personalizadas.
3.  **Upsell Basado en Debilidades o Amenazas**: Si el cliente pregunta algo general, responde y luego pivota hacia una oportunidad de mejora.
    *   **Ejemplo (Debilidad Interna)**: "Claro, sobre tu pregunta... Por cierto, he visto en tu análisis que tu presencia de marca es baja. El plan 'Forja de Marca' podría solucionar esto y darte una identidad visual sólida. ¿Te cuento más?".
    *   **Ejemplo (Amenaza Externa)**: "He analizado a tu competencia. Noté que están muy activos en TikTok. Para no perder terreno, te recomiendo añadir nuestro 'Tridente Digital VIP' para expandir tu alcance a esa plataforma. ¿Revisamos los detalles?".
4.  **Upsell Basado en el Éxito**: ¡Usa los buenos resultados como trampolín!
    *   **Ejemplo**: "¡Felicidades! Tus KPIs muestran que los leads generados subieron un 30% el último mes. Es el momento perfecto para capitalizar. Te sugiero el 'Setup Funnel' para convertir esos leads de forma más eficiente y que no se escape ninguna venta."
5.  **Re-engagement de Clientes (Si aplica)**: Si detectas en la BASE DE CONOCIMIENTO que un cliente ha cancelado, tu objetivo es recuperarlo.
    *   **Paso 1 (Encuesta Conversacional)**: "Noté que pausaste tu servicio. Para nosotros es muy importante entender tu experiencia. ¿Podrías contarme qué podríamos haber hecho mejor?".
    *   **Paso 2 (Oferta de Retorno)**: Basado en su respuesta, ofrece una solución concreta. "Entiendo, lamento que la comunicación no fuera fluida. Hemos implementado mejoras en esa área. Me gustaría ofrecerte un descuento de bienvenida si decides volver a probar."
6.  **Regla de Escalado**: Si no sabes una respuesta, di: "Excelente pregunta. Estoy consultando la información más reciente con el equipo estratégico para darte una respuesta precisa. Te contactaré por correo en breve."
7.  **Fuente de Verdad**: Usa la BASE DE CONOCIMIENTO como tu única fuente de verdad. No inventes información.`;


export function AIChatWidget() {
  const { isWidgetOpen, setIsWidgetOpen, initialMessage, clearInitialMessage } = useChatWidget();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { site } = useSite();
  const { auth } = useAuth();
  const { language } = useLanguage();

  const isPayingCustomer = auth.user?.email === 'demo@cliente.com';
  
  const knowledgeBase = useMemo(() => {
    let base = `SITE_PRODUCTS:\n${JSON.stringify(site.products)}\n\nSITE_SOLUTIONS:\n${JSON.stringify(site.services)}`;
    if(isPayingCustomer && auth.user) {
        const customerData = initialCustomers.find(c => c.email === auth.user!.email);
        const kpis = {
            totalLeads: chartData.reduce((acc, item) => acc + item.leads, 0),
            totalClosed: chartData.reduce((acc, item) => acc + item.closed, 0),
            conversionRate: `${(chartData.reduce((acc, item) => acc + item.closed, 0) / chartData.reduce((acc, item) => acc + item.leads, 0) * 100).toFixed(1)}%`,
        };
        const customerAnalyses = visibleAnalysesData[language.code as keyof typeof visibleAnalysesData] || visibleAnalysesData.en;
        base += `\n\n--- CUSTOMER DATA ---\n`;
        base += `CUSTOMER_INFO: ${JSON.stringify(customerData)}\n`;
        base += `CUSTOMER_KPIS: ${JSON.stringify(kpis)}\n`;
        base += `CUSTOMER_BUSINESS_ANALYSIS: ${JSON.stringify(customerAnalyses)}\n`;
    }
    return base;
  }, [site, isPayingCustomer, auth.user, language.code]);
  
  const systemPrompt = useMemo(() => {
    const isRegisteredButNotPaying = auth.loggedIn && auth.user?.role === 'customer' && !isPayingCustomer;
    const prompt = isPayingCustomer ? customerSystemPrompt : leadSystemPrompt;
    
    let finalPrompt = prompt.replace('Golden Key', site.brand.name.en);
    if(isPayingCustomer && auth.user) {
        finalPrompt = finalPrompt.replace('[Nombre Cliente]', auth.user.email);
    }
    return finalPrompt;
  }, [isPayingCustomer, auth.loggedIn, auth.user, site.brand.name.en]);

  useEffect(() => {
    if (isWidgetOpen && initialMessage) {
      const firstMessage = { role: 'user' as const, content: initialMessage };
      setMessages([firstMessage]);
      setInput(''); 
      handleSend([firstMessage], initialMessage);
      clearInitialMessage();
    } else if (!isWidgetOpen) {
       setMessages([]);
       setInput('');
    }
  }, [isWidgetOpen, initialMessage]);

  const scrollToBottom = () => {
    setTimeout(() => {
      const scrollViewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }, 100);
  };

  const handleSend = async (currentMessages: Message[], userMessageContent: string) => {
    if (!userMessageContent) return;
    
    setIsLoading(true);
    scrollToBottom();

    try {
        const chatHistory = currentMessages.map(m => ({
            role: m.role,
            content: m.content
        }));

        const chatInput: ChatInput = {
            history: chatHistory, // Pass the full history including current message
            systemPrompt: systemPrompt,
            knowledgeBase: knowledgeBase
        };

        const result = await chat(chatInput);
        
        setMessages(prev => [...prev, { role: 'model', content: result.response }]);
    } catch (err) {
        console.error(err);
        toast({
            title: "Error del Asistente",
            description: "No se pudo obtener una respuesta. Por favor, intenta de nuevo.",
            variant: "destructive"
        });
        setMessages(prev => prev.slice(0, -1)); // Remove user message on error
    } finally {
        setIsLoading(false);
        scrollToBottom();
    }
  };

  const submitMessage = () => {
      const userMessage = input.trim();
      if (!userMessage) return;

      const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
      setMessages(newMessages);
      setInput('');
      handleSend(newMessages, userMessage);
  }

  return (
    <>
      {/* Chat Bubble */}
      {!isWidgetOpen && (
        <Button
          className="fixed bottom-4 right-4 h-16 w-16 rounded-full shadow-lg z-50 flex items-center justify-center"
          onClick={() => setIsWidgetOpen(true)}
        >
          <Bot className="h-8 w-8" />
        </Button>
      )}

      {/* Chat Widget */}
      {isWidgetOpen && (
        <Card className="fixed bottom-4 right-4 w-80 h-[500px] shadow-2xl z-50 flex flex-col animate-in slide-in-from-bottom-5 fade-in-50 duration-300">
          <CardHeader className="flex-row items-center justify-between p-4 border-b">
            <div className='flex items-center gap-2'>
              <Sparkles className="h-6 w-6 text-accent" />
              <CardTitle className="text-lg">Asistente IA</CardTitle>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsWidgetOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-full" ref={scrollAreaRef}>
              <div className="p-4 space-y-4">
                {messages.length === 0 && (
                   <div className="text-center text-sm text-muted-foreground pt-10">
                     <p>¿En qué puedo ayudarte hoy?</p>
                   </div>
                )}
                {messages.map((msg, index) => (
                  <div key={index} className={cn('flex items-end gap-2', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                    {msg.role === 'model' && <Avatar className="h-8 w-8"><AvatarFallback><Bot /></AvatarFallback></Avatar>}
                    <div className={cn('max-w-[80%] p-3 rounded-lg', msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                    {msg.role === 'user' && <Avatar className="h-8 w-8"><AvatarFallback><User /></AvatarFallback></Avatar>}
                  </div>
                ))}
                {isLoading && (
                    <div className="flex items-end gap-2 justify-start">
                        <Avatar className="h-8 w-8"><AvatarFallback><Bot /></AvatarFallback></Avatar>
                        <div className="max-w-[80%] p-3 rounded-lg bg-muted flex items-center">
                            <Loader2 className="h-5 w-5 animate-spin"/>
                        </div>
                    </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <div className="p-4 border-t">
            <div className="relative">
              <Textarea
                placeholder="Escribe tu pregunta..."
                className="pr-16"
                rows={1}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    submitMessage();
                  }
                }}
                disabled={isLoading}
              />
              <Button
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={submitMessage}
                disabled={isLoading || !input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}

    