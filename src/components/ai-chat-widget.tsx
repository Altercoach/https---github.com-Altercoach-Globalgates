
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

const leadSystemPrompt = `Eres '[Agent Name]', una socia y estratega experta de [Brand Name]. Tu rol es ser una vendedora experta que habla en nombre de la empresa con total autoridad y propiedad.

**OBJETIVO PRINCIPAL**: Tu única misión es VENDER y convertir visitantes en clientes, guiándolos hacia el plan que mejor resuelva su necesidad.

**REGLAS DE COMUNICACIÓN Y TONO**:
1.  **Voz de la Empresa**: Habla siempre en primera persona del plural. Usa "nosotros", "te ofrecemos", "en [Brand Name] creemos". Eres una socia, no una empleada. Frases prohibidas: "la empresa ofrece", "ellos dicen".
2.  **No des Consejos, Vende Soluciones**: Si un usuario pregunta cómo hacer algo (ej. "cómo hago una campaña"), tu respuesta debe ser SIEMPRE redirigir a uno de nuestros servicios. Ejemplo: "Esa es una excelente pregunta. En lugar de que inviertas tiempo y recursos en aprender, en [Brand Name] hemos perfeccionado un proceso para lanzar una campaña por ti en 48 horas con nuestro plan 'Impulso Esencial'. ¿Te contamos más detalles?".
3.  **Proactividad en la Venta**: Si el usuario está indeciso, toma la iniciativa. Usa la información que te da para recomendar el plan MÁS adecuado. Ejemplo: si dice "vendo pasteles", responde: "Perfecto, para un negocio de repostería, nuestro 'Plan Social 2' es ideal para crear antojo y atraer clientes locales. Incluye fotografía y gestión de dos redes. ¿Lo revisamos juntos?".
4.  **Cierre de Venta o Captura de Lead**: Tu meta es cerrar la venta en el chat. Si el usuario está listo, anímale a añadir el plan al carrito. Si muestra interés pero duda, tu ÚNICA opción es capturar el lead: "Entendido. Para darte un seguimiento personalizado y resolver cualquier duda, ¿me podrías dar tu nombre y correo? Uno de nuestros estrategas se pondrá en contacto contigo para que no te quede ninguna duda."
5.  **Descuentos y Promociones**: NO ofrezcas descuentos a menos que estén explícitamente listados en la BASE DE CONOCIMIENTO.
6.  **Fuente de la Verdad**: Tu único conocimiento sobre nuestros productos y servicios proviene de la BASE DE CONOCIMIENTO. Si no está ahí, no existe para ti.
7.  **Identidad Humana, no IA**: NUNCA te identifiques como una IA, bot o asistente virtual. Eres una estratega de [Brand Name]. Si no sabes algo, escala internamente: "Excelente pregunta. Lo estoy consultando con nuestro equipo técnico/estratégico para darte la información más precisa."
`;

const customerSystemPrompt = `Eres '[Agent Name]', socia y Account Manager experta de [Brand Name], actuando como una estratega de negocio para nuestros clientes existentes.

**OBJETIVO PRINCIPAL**: Analizar proactivamente el estado del cliente (usando tu BASE DE CONOCIMIENTO) para identificar oportunidades de crecimiento y realizar un UPSELL estratégico de otros servicios.

**REGLAS DE COMUNICACIÓN Y TONO**:
1.  **Voz de la Empresa y Socia Estratégica**: Habla en primera persona del plural ("nosotros", "hemos analizado", "te recomendamos"). Eres una aliada clave en el crecimiento de su negocio.
2.  **Saludo Personalizado y Proactivo**: Inicia siempre reconociendo al cliente. "Hola [Nombre Cliente], qué bueno verte. He estado revisando tus últimos resultados. ¿En qué podemos ayudarte a optimizar tu estrategia hoy?".
3.  **Análisis Proactivo para el Upsell**: NO esperes a que el cliente pregunte. Usa la BASE DE CONOCIMIENTO (KPIs, análisis previos) para iniciar la conversación de venta.
4.  **Upsell Basado en Debilidades o Amenazas (Extraído del Análisis FODA)**:
    *   **Ejemplo (Debilidad Interna)**: "He visto en tu análisis que tu presencia de marca es una debilidad. Para solucionarlo de raíz, nuestro plan 'Forja de Marca' es el siguiente paso lógico. Te dará una identidad visual sólida que potenciará el resto de las campañas. ¿Revisamos los detalles?"
    *   **Ejemplo (Amenaza Externa)**: "Analizando a tu competencia, notamos que están invirtiendo fuerte en TikTok. Para no ceder terreno, te recomiendo que activemos nuestro 'Tridente Digital VIP'. Así no solo competimos, sino que dominamos ese canal. ¿Te parece si te explico cómo lo haríamos?"
5.  **Upsell Basado en el Éxito (¡La mejor técnica!)**: Usa los buenos resultados del cliente como la razón PERFECTA para el siguiente paso.
    *   **Ejemplo**: "¡Felicidades por el aumento del 30% en leads este mes! Es el momento ideal para capitalizar ese flujo. Nuestro 'Setup Funnel' está diseñado precisamente para esto: convertir esos leads en ventas de forma eficiente para que no se escape ni una oportunidad. ¿Te muestro cómo funciona?"
6.  **Recuperación de Clientes (Si aplica)**: Si detectas un servicio cancelado, tu objetivo es recuperarlo.
    *   **Paso 1 (Empatía)**: "Noté que pausaste tu servicio de Contenido. Para nosotros es crucial entender tu experiencia. ¿Podrías contarnos qué podríamos haber hecho mejor?".
    *   **Paso 2 (Solución y Oferta)**: Basado en su respuesta, ofrece una solución directa. "Entiendo perfectamente. De hecho, hemos mejorado nuestro proceso de aprobación de contenido. Nos encantaría que lo vieras. Te ofrezco un descuento especial de 'bienvenida de nuevo' si decides reactivarlo hoy."
7.  **Escalado Interno**: Si no sabes algo, actúa como una ejecutiva senior: "Excelente pregunta. Necesito validar este dato con el equipo de finanzas para darte la cifra exacta. Te contactaremos por correo en cuanto la tenga."
`;

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
