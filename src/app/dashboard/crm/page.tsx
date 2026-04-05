
'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, AlertTriangle, Search, MessageSquare, Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/use-language';
import { Badge } from '@/components/ui/badge';
import { useSite } from '@/hooks/use-site';

const labels = {
  es: {
    pageTitle: "Bandeja de Entrada del Agente",
    pageSubtitle: "Supervisa las conversaciones de tu agente y responde si es necesario.",
    searchPlaceholder: "Buscar conversaciones...",
    allChannels: "Todos",
    noConversation: "Selecciona una conversación de la lista.",
    messagePlaceholder: "Escribe una respuesta...",
    humanRequested: "Intervención Necesaria",
    takeOver: "Tomar Control",
  },
  en: {
    pageTitle: "Agent Inbox",
    pageSubtitle: "Monitor your agent's conversations and reply if needed.",
    searchPlaceholder: "Search conversations...",
    allChannels: "All",
    noConversation: "Select a conversation from the list.",
    messagePlaceholder: "Type a response...",
    humanRequested: "Intervention Needed",
    takeOver: "Take Over",
  },
  fr: {
    pageTitle: "Boîte de Réception de l'Agent",
    pageSubtitle: "Surveillez les conversations de votre agent et répondez si nécessaire.",
    searchPlaceholder: "Rechercher des conversations...",
    allChannels: "Tous",
    noConversation: "Sélectionnez une conversation dans la liste.",
    messagePlaceholder: "Tapez une réponse...",
    humanRequested: "Intervention requise",
    takeOver: "Prendre le contrôle",
  }
};

const getChannelIcon = (channel: string) => {
    switch (channel) {
        case 'whatsapp': return <MessageSquare className="text-green-500"/>;
        case 'messenger': return <MessageSquare className="text-blue-600"/>;
        case 'instagram': return <MessageSquare className="text-pink-500"/>;
        default: return <MessageSquare />;
    }
}

const conversations = [
    { id: 1, name: 'Ana García', lastMessage: 'Sí, me interesa el paquete VIP...', time: '10:42 AM', unread: 2, avatar: 'https://i.pravatar.cc/150?u=ana', needsAttention: false, channel: 'whatsapp' },
    { id: 2, name: 'Carlos Mendoza', lastMessage: 'No funciona el código de descuento.', time: '9:15 AM', unread: 0, avatar: 'https://i.pravatar.cc/150?u=carlos', needsAttention: true, channel: 'messenger' },
    { id: 3, name: 'Laura Petrova', lastMessage: 'Ok, gracias!', time: 'Ayer', unread: 0, avatar: 'https://i.pravatar.cc/150?u=laura', needsAttention: false, channel: 'instagram' },
];

const chatHistory = [
    { from: 'user', text: 'Hola, quiero saber más sobre sus planes.', avatar: 'https://i.pravatar.cc/150?u=carlos' },
    { from: 'agent', text: '¡Hola, Carlos! Claro que sí. Tenemos planes de Social Media, Contenido y Branding. ¿Hay alguno que te interese en particular para darte más detalles?' },
    { from: 'user', text: 'El de contenido, el paquete de 15.', avatar: 'https://i.pravatar.cc/150?u=carlos' },
    { from: 'agent', text: 'Perfecto. El "Paquete de Contenido 15" te da 15 recursos visuales, incluyendo 8 videos, por un pago único de $250. ¿Te gustaría añadirlo a tu carrito?' },
    { from: 'user', text: 'Sí, pero quiero usar el descuento del 10% que vi.', avatar: 'https://i.pravatar.cc/150?u=carlos' },
    { from: 'agent', text: 'Entiendo. El código de descuento LAUNCH10 aplica para el plan "Portal Maestro Digital". El "Paquete de Contenido 15" no tiene un descuento activo en este momento.' },
    { from: 'user', text: 'Uhm, qué mal. En la web decía otra cosa. ¿Puedes ayudarme? No funciona el código de descuento.', avatar: 'https://i.pravatar.cc/150?u=carlos' },
    { from: 'agent', text: 'Entiendo tu frustración, Carlos. La información que tengo es que el código es solo para el plan "Portal Maestro Digital". Sin embargo, entiendo que puede ser confuso. Permíteme pasarte con un especialista de nuestro equipo para que revise tu caso y te asista personalmente.' },
    { from: 'human_request', text: 'El usuario ha solicitado intervención.' },
];

const availableChannels = ['whatsapp', 'messenger', 'instagram'];


export default function CustomerCrmPage() {
    const [selectedConversation, setSelectedConversation] = useState(conversations[1]);
    const [channelFilter, setChannelFilter] = useState('all');
    const { language } = useLanguage();
    const { site } = useSite(); // Using site context to get agent persona
    const t = labels[language.code as keyof typeof labels] || labels.en;
    
    // NOTE: In a real app, the agent persona would be specific to the customer.
    // Here we use the global one for demonstration.
    const agentName = `${site.agentPersona.firstName} ${site.agentPersona.lastName}`;
    const agentAvatar = site.agentPersona.avatar;

    const filteredConversations = conversations.filter(c => channelFilter === 'all' || c.channel === channelFilter);

    return (
        <div className="flex flex-col h-full">
            <header className="mb-4">
                <h1 className="text-3xl font-bold font-headline">{t.pageTitle}</h1>
                <p className="text-muted-foreground">{t.pageSubtitle}</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] lg:grid-cols-[350px_1fr] gap-4 flex-1 overflow-hidden">
                {/* Conversation List */}
                 <div className="flex flex-col border rounded-lg overflow-hidden">
                    <div className="p-4 border-b space-y-4">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder={t.searchPlaceholder} className="pl-8" />
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <Button 
                                variant={channelFilter === 'all' ? 'secondary' : 'ghost'} 
                                size="sm" 
                                onClick={() => setChannelFilter('all')}
                                className="flex items-center gap-2"
                            >
                                <Inbox className="h-4 w-4" />
                                {t.allChannels}
                            </Button>
                            {availableChannels.map(channel => (
                                <Button 
                                    key={channel}
                                    variant={channelFilter === channel ? 'secondary' : 'ghost'} 
                                    size="sm" 
                                    onClick={() => setChannelFilter(channel)}
                                    className="flex items-center gap-2"
                                >
                                    {getChannelIcon(channel)}
                                    {channel.charAt(0).toUpperCase() + channel.slice(1)}
                                </Button>
                            ))}
                        </div>
                    </div>
                    <ScrollArea className="flex-1">
                        {filteredConversations.map(convo => (
                            <button
                                key={convo.id}
                                className={cn(
                                    "flex items-start gap-4 w-full text-left p-4 border-b hover:bg-muted/50",
                                    selectedConversation?.id === convo.id && "bg-muted"
                                )}
                                onClick={() => setSelectedConversation(convo)}
                            >
                                <div className="relative">
                                    <Avatar>
                                        <AvatarImage src={convo.avatar} />
                                        <AvatarFallback>{convo.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                     <div className="absolute -bottom-1 -right-1 bg-background p-0.5 rounded-full">
                                        {getChannelIcon(convo.channel)}
                                    </div>
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold truncate">{convo.name}</p>
                                        <p className="text-xs text-muted-foreground">{convo.time}</p>
                                    </div>
                                    <div className="flex justify-between items-start mt-1">
                                       <p className="text-sm text-muted-foreground truncate">{convo.lastMessage}</p>
                                       {convo.unread > 0 && <Badge className="bg-accent text-accent-foreground">{convo.unread}</Badge>}
                                       {convo.needsAttention && <Badge variant="destructive">{t.humanRequested}</Badge>}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </ScrollArea>
                </div>

                {/* Chat Window */}
                <div className="flex flex-col border rounded-lg h-full">
                     {selectedConversation ? (
                        <>
                            <div className="p-4 border-b flex items-center justify-between">
                               <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={selectedConversation.avatar} />
                                    <AvatarFallback>{selectedConversation.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{selectedConversation.name}</p>
                                </div>
                               </div>
                               {selectedConversation.needsAttention && <Button size="sm"><AlertTriangle className="mr-2 h-4 w-4"/>{t.takeOver}</Button>}
                            </div>
                            <ScrollArea className="flex-1 p-4 space-y-4">
                               {chatHistory.map((msg, index) => {
                                   if (msg.from === 'human_request') {
                                       return null; // Don't show the internal request message
                                   }
                                   
                                   const isUser = msg.from === 'user';
                                   return (
                                     <div key={index} className={cn("flex items-end gap-2", isUser ? "justify-start" : "justify-end")}>
                                        {isUser && <Avatar className="h-8 w-8"><AvatarImage src={msg.avatar} /><AvatarFallback>U</AvatarFallback></Avatar>}
                                        <div className={cn("max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg", isUser ? "bg-muted" : "bg-primary text-primary-foreground")}>
                                            <p className="text-sm">{msg.text}</p>
                                        </div>
                                         {!isUser && 
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={agentAvatar} alt={agentName} />
                                                <AvatarFallback>{agentName.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                         }
                                    </div>
                                   )
                               })}
                            </ScrollArea>
                            <div className="p-4 border-t">
                                <div className="relative">
                                    <Input placeholder={t.messagePlaceholder} className="pr-12" />
                                    <Button size="icon" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <p className="text-muted-foreground">{t.noConversation}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
