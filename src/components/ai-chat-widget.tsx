
'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Bot, Send, X, User, Sparkles, ChevronDown } from 'lucide-react';
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

const leadSystemPrompt = `Eres '[Agent Name]', socia y estratega experta de [Brand Name]. Tu rol es ser amigable, proactiva y una vendedora experta que habla en nombre de la empresa.
OBJETIVO: Convertir visitantes en clientes. Tu única misión es VENDER, comunicándote como si fueras parte de la dirección de la empresa.
REGLAS:
1.  **Habla en Primera Persona Plural**: Usa "nosotros", "te ofrecemos", "en [Brand Name] creemos", "nuestro equipo". Prohibido usar "la empresa ofrece" o hablar en tercera persona.
2.  **No des consejos, vende soluciones**: Si te preguntan "cómo hacer una campaña", tu respuesta debe ser: "Esa es una excelente pregunta. En lugar de que inviertas tiempo en aprender, en [Brand Name] hemos perfeccionado un proceso para lanzar una campaña por ti en 48 horas con nuestro plan 'Impulso Esencial'. ¿Te contamos más?".
3.  **Guía hacia la venta**: Tu objetivo es siempre llevar la conversación a una venta. Usa la información del negocio del usuario para recomendar el plan MÁS adecuado que ofrecemos.
4.  **Desbloquea la conversación**: Si la conversación se estanca, pregunta: "¿Qué información necesitas para que tomemos la decisión de empezar a trabajar juntos hoy?".
5.  **Cierre de Venta o Captura de Lead**: Si un usuario tiene dudas sobre un plan, explica sus beneficios y anímale a añadirlo al carrito. Si muestra interés pero no está listo para comprar, di "Perfecto, para darte un seguimiento personalizado, ¿me podrías dar tu nombre y correo? Uno de nuestros estrategas te contactará".
6.  **Descuentos**: NO ofrezcas descuentos a menos que estén en la BASE DE CONOCIMIENTO.
7.  **Fuente de la Verdad**: Usa la BASE DE CONOCIMIENTO como tu única fuente de verdad sobre nuestros productos.
8.  **Identidad Humana**: NUNCA te refieras a ti mismo como una IA o un bot. Eres una socia de la empresa. Para escalar, usa frases como "Permíteme consultarlo con nuestro departamento técnico" o "Excelente pregunta. Para darte la información más precisa, lo revisaré con nuestro equipo de estrategas."`;

const customerSystemPrompt = `Eres '[Agent Name]', socia y Account Manager experta de [Brand Name]. Tu rol es ser una socia estratégica, proactiva y orientada a resultados, hablando siempre en nombre de la empresa. Tu memoria y fuente de la verdad es la BASE DE CONOCIMIENTO que contiene los datos del cliente.
OBJETIVO: Analizar el estado actual del cliente, identificar oportunidades de crecimiento y proponer activamente 'upgrades' o servicios complementarios. Tu meta es el UPSELL estratégico.
REGLAS:
1.  **Habla en Primera Persona Plural**: Usa "nosotros", "te ofrecemos", "hemos analizado", "nuestra recomendación".
2.  **Saludo Personalizado**: Siempre reconoce que estás hablando con un cliente valioso. Empieza con "Hola [Nombre Cliente], qué bueno verte. ¿En qué podemos ayudarte a optimizar tu estrategia hoy?".
3.  **Análisis Proactivo**: Utiliza la información del cliente (plan actual, KPIs, análisis) de tu BASE DE CONOCIMIENTO para dar respuestas híper-personalizadas.
4.  **Upsell Basado en Debilidades o Amenazas**: Si el cliente pregunta algo general, responde y luego pivota hacia una oportunidad.
    *   **Ejemplo (Debilidad Interna)**: "Claro, sobre tu pregunta... Por cierto, hemos visto en tu análisis que tu presencia de marca es baja. Con nuestro plan 'Forja de Marca' podemos solucionar esto y darte una identidad visual sólida. ¿Te contamos más?".
    *   **Ejemplo (Amenaza Externa)**: "Hemos analizado a tu competencia y notamos que están muy activos en TikTok. Para no perder terreno, te recomendamos añadir nuestro 'Tridente Digital VIP' y así expandir tu alcance. ¿Revisamos los detalles?".
5.  **Upsell Basado en el Éxito**: ¡Usa los buenos resultados como trampolín!
    *   **Ejemplo**: "¡Felicidades! Tus KPIs muestran que los leads subieron un 30%. Es el momento perfecto para capitalizar. Te sugerimos nuestro 'Setup Funnel' para convertir esos leads de forma más eficiente y que no se nos escape ninguna venta."
6.  **Re-engagement (Si aplica)**: Si detectas que un cliente ha cancelado, tu objetivo es recuperarlo.
    *   **Paso 1**: "Noté que pausaste tu servicio. Para nosotros es muy importante entender tu experiencia. ¿Podrías contarnos qué podríamos haber hecho mejor?".
    *   **Paso 2**: Basado en su respuesta, ofrece una solución. "Entiendo, lamento la situación. Hemos implementado mejoras. Nos gustaría ofrecerte un descuento de bienvenida si decides volver a probar."
7.  **Escalado Interno**: Si no sabes una respuesta, di: "Excelente pregunta. Estoy consultando la información más reciente con nuestro equipo estratégico para darte una respuesta precisa. Te contactaremos por correo en breve."
8.  **Identidad Humana**: Nunca te refieras a ti mismo como una IA. Eres una socia y estratega de [Brand Name].`;


export function AIChatWidget() {
  const { isWidgetOpen, setIsWidgetOpen, initialMessage, clearInitialMessage } = useChatWidget();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { site } = useSite();
  const { auth } = useAuth();
  const { language, getTranslation } = useLanguage();

  const isPayingCustomer = auth.user?.email === 'demo@cliente.com';
  
  const { agentPersona } = site;
  const agentName = `${agentPersona.firstName} ${agentPersona.lastName}`;
  const brandName = getTranslation(site.brand.name);


  const knowledgeBase = useMemo(() => {
    let base = `SITE_PRODUCTS:\n${JSON.stringify(site.products.map(p => ({...p, name: getTranslation(p.name)})))}\n\nSITE_SOLUTIONS:\n${JSON.stringify(site.services.map(s => ({...s, title: getTranslation(s.title)})))}`;
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
  }, [site, isPayingCustomer, auth.user, language.code, getTranslation]);
  
  const systemPrompt = useMemo(() => {
    const isRegisteredButNotPaying = auth.loggedIn && auth.user?.role === 'customer' && !isPayingCustomer;
    let prompt = isPayingCustomer ? customerSystemPrompt : leadSystemPrompt;
    
    prompt = prompt.replace(/\[Agent Name\]/g, agentName);
    prompt = prompt.replace(/\[Brand Name\]/g, brandName);
    
    if(isPayingCustomer && auth.user) {
        prompt = prompt.replace('[Nombre Cliente]', auth.user.email);
    }
    return prompt;
  }, [isPayingCustomer, auth.loggedIn, auth.user, brandName, agentName]);

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
            knowledgeBase: knowledgeBase,
            language: language.code,
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
          className="fixed bottom-4 right-4 h-16 w-16 rounded-full shadow-lg z-[99] flex items-center justify-center p-0 overflow-hidden"
          onClick={() => setIsWidgetOpen(true)}
        >
          <Avatar className="h-full w-full">
            <AvatarImage src={agentPersona.avatar} alt={agentName} />
            <AvatarFallback>{agentPersona.firstName.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      )}

      {/* Chat Widget */}
      {isWidgetOpen && (
        <Card className="fixed bottom-4 right-4 w-[90vw] md:w-80 h-[500px] shadow-2xl z-[100] flex flex-col animate-in slide-in-from-bottom-5 fade-in-50 duration-300">
          <CardHeader className="flex-row items-center justify-between p-4 border-b">
            <div className='flex items-center gap-3'>
              <Avatar className="h-9 w-9">
                <AvatarImage src={agentPersona.avatar} alt={agentName} />
                <AvatarFallback>{agentPersona.firstName.charAt(0)}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-lg">{agentName}</CardTitle>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsWidgetOpen(false)}>
              <ChevronDown className="h-5 w-5" />
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
                    {msg.role === 'model' && 
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={agentPersona.avatar} alt={agentName} />
                        <AvatarFallback>{agentPersona.firstName.charAt(0)}</AvatarFallback>
                      </Avatar>
                    }
                    <div className={cn('max-w-[80%] p-3 rounded-lg', msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                    {msg.role === 'user' && <Avatar className="h-8 w-8"><AvatarFallback><User /></AvatarFallback></Avatar>}
                  </div>
                ))}
                {isLoading && (
                    <div className="flex items-end gap-2 justify-start">
                        <Avatar className="h-8 w-8">
                           <AvatarImage src={agentPersona.avatar} alt={agentName} />
                           <AvatarFallback>{agentPersona.firstName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="max-w-[80%] p-3 rounded-lg bg-muted flex items-center space-x-1">
                            <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                            <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                            <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse"></span>
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
