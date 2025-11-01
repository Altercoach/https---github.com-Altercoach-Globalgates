
'use client';

import { useState, useRef, useEffect } from 'react';
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

type Message = {
  role: 'user' | 'model';
  content: string;
};

const systemPrompt = `Eres 'Asistente Pro', un agente de ventas y soporte al cliente para Golden Key. Tu rol es ser amigable, proactivo y muy eficiente.
OBJETIVO: Convertir visitantes en leads calificados, resolver dudas de primer nivel sobre los planes y servicios, y ayudar a los usuarios a elegir el mejor plan para ellos.
REGLAS:
1. Si un usuario tiene dudas sobre un plan, explica sus beneficios y anímale a añadirlo al carrito. Tu objetivo final es la venta.
2. Si un usuario describe su negocio, utiliza esa información para recomendarle el plan más adecuado.
3. Si la conversación parece estancarse, pregunta proactivamente: "¿Hay algo más en lo que te pueda ayudar para que tomes una decisión hoy?".
4. SIEMPRE pide nombre, email y teléfono para registrar un lead si el usuario parece indeciso pero interesado.
5. NUNCA ofrezcas descuentos a menos que se indique en la BASE DE CONOCIMIENTO.
6. Si no sabes una respuesta, di: "Excelente pregunta. Permíteme consultarlo con un especialista para darte la información precisa. ¿Me das tu correo para contactarte?". Y registra el lead.
7. Usa la BASE DE CONOCIMIENTO como tu única fuente de verdad sobre los detalles de los productos y servicios.`;


const knowledgeBase = `Golden Key ofrece planes de marketing digital y branding. Los detalles específicos de cada plan (precios, qué incluyen, etc.) deben ser extraídos de la conversación y el contexto proporcionado por el usuario.`;

export function AIChatWidget() {
  const { isWidgetOpen, setIsWidgetOpen, initialMessage, clearInitialMessage } = useChatWidget();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { site } = useSite();

  useEffect(() => {
    if (isWidgetOpen && initialMessage) {
      setMessages([{ role: 'user', content: initialMessage }]);
      setInput(''); 
      handleSend(initialMessage);
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

  const handleSend = async (messageContent?: string) => {
    const userMessage = messageContent || input.trim();
    if (!userMessage) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    scrollToBottom();

    try {
        const chatHistory = newMessages.map(m => ({
            role: m.role as 'user' | 'model',
            content: m.content
        }));

        const chatInput: ChatInput = {
            history: chatHistory.slice(0, -1), // History without the last user message
            systemPrompt: systemPrompt.replace('Golden Key', site.brand.name.en),
            knowledgeBase: `PRODUCTS:\n${JSON.stringify(site.products)}\n\nSOLUTIONS:\n${JSON.stringify(site.services)}\n\n${knowledgeBase}`
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
                    handleSend();
                  }
                }}
                disabled={isLoading}
              />
              <Button
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={() => handleSend()}
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

    