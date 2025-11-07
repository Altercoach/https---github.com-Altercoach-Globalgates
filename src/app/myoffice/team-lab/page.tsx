
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Beaker, CheckCircle, Clock, Search, Settings, User, ChevronDown } from 'lucide-react';
import { initialCustomers } from '@/lib/constants';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Project, ProjectPhase, projectPhases } from '@/lib/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const initialProjects: Project[] = [
  {
    id: 'proj_002',
    customerId: 'cus_002',
    customerName: 'Jane Smith (demo@cliente.com)',
    currentPhase: 'execution',
    status: 'Active',
    phases: [
      { id: 'onboarding', status: 'completed', name: 'Onboarding y Evaluación' },
      { id: 'research', status: 'completed', name: 'Investigación y Estrategia' },
      { id: 'planning', status: 'completed', name: 'Planificación y Calendario' },
      { id: 'execution', status: 'in_progress', name: 'Generación y Ejecución' },
      { id: 'closure', status: 'pending', name: 'Optimización y Cierre' },
    ]
  },
   {
    id: 'proj_001',
    customerId: 'cus_001',
    customerName: 'John Doe (john.doe@example.com)',
    currentPhase: 'research',
    status: 'Active',
    phases: [
      { id: 'onboarding', status: 'completed', name: 'Onboarding y Evaluación' },
      { id: 'research', status: 'in_progress', name: 'Investigación y Estrategia' },
      { id: 'planning', status: 'pending', name: 'Planificación y Calendario' },
      { id: 'execution', status: 'pending', name: 'Generación y Ejecución' },
      { id: 'closure', status: 'pending', name: 'Optimización y Cierre' },
    ]
  },
  {
    id: 'proj_004',
    customerId: 'cus_004',
    customerName: 'Emily Brown (emily.b@example.com)',
    currentPhase: 'onboarding',
    status: 'Suspended',
     phases: [
      { id: 'onboarding', status: 'pending', name: 'Onboarding y Evaluación' },
      { id: 'research', status: 'pending', name: 'Investigación y Estrategia' },
      { id: 'planning', status: 'pending', name: 'Planificación y Calendario' },
      { id: 'execution', status: 'pending', name: 'Generación y Ejecución' },
      { id: 'closure', status: 'pending', name: 'Optimización y Cierre' },
    ]
  }
];


const PhaseCard = ({ phase, isCurrent, isCompleted }: { phase: ProjectPhase, isCurrent: boolean, isCompleted: boolean }) => {
    
    const getIcon = () => {
        if(isCompleted) return <CheckCircle className="h-5 w-5 text-green-500" />;
        if(isCurrent) return <div className="h-5 w-5 rounded-full bg-orange-500 animate-pulse" />;
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }

    const progressValue = isCompleted ? 100 : isCurrent ? 50 : 0;
    const progressColor = isCompleted ? "bg-green-500" : isCurrent ? "bg-orange-500" : "bg-muted";

    return (
        <Card className={cn('transition-all w-full', { 'border-primary shadow-lg': isCurrent, 'bg-muted/30': isCompleted, 'border-dashed': !isCurrent && !isCompleted })}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-medium">{phase.name}</CardTitle>
                {getIcon()}
            </CardHeader>
            <CardContent>
                <p className="text-xs text-muted-foreground">
                    {isCompleted ? 'Completado' : isCurrent ? 'En progreso...' : 'Pendiente'}
                </p>
                 <Progress value={progressValue} className={cn("h-1 mt-2", {'[&>*]:animate-pulse': isCurrent})} indicatorClassName={progressColor} />
            </CardContent>
            <CardFooter>
                 <Button variant="ghost" size="sm" className="w-full text-xs justify-start text-muted-foreground" disabled={!isCurrent && !isCompleted}>
                    <Settings className="mr-2 h-3 w-3" /> Ver/Editar Detalles
                </Button>
            </CardFooter>
        </Card>
    )
}


export default function TeamLabPage() {
    const [searchTerm, setSearchTerm] = useState('');
    
    const filteredProjects = useMemo(() => {
        if (!searchTerm) return initialProjects;
        return initialProjects.filter(p => p.customerName.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [searchTerm]);

    const getStatusBadgeVariant = (status: Project['status']): 'default' | 'secondary' | 'destructive' | 'outline' => {
        switch (status) {
            case 'Active': return 'default';
            case 'Suspended': return 'secondary';
            case 'Canceled': return 'destructive';
            default: return 'outline';
        }
    }

    return (
        <div className="space-y-6">
            <header>
                <div className="flex items-center gap-3 mb-2">
                    <Beaker className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold font-headline">Team Lab: Supervisión de Proyectos</h1>
                </div>
                <p className="text-muted-foreground">
                    Supervisa el flujo de trabajo automatizado de cada cliente y toma el control manual cuando sea necesario.
                </p>
            </header>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><User /> Lista de Clientes y Proyectos</CardTitle>
                    <CardDescription>
                        Busca un cliente y expande para ver el estado de su flujo de trabajo automatizado.
                    </CardDescription>
                    <div className="relative pt-4">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Buscar por nombre de cliente..." 
                            className="pl-8" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Accordion type="multiple" className="w-full">
                       {filteredProjects.map(project => (
                           <AccordionItem value={project.id} key={project.id}>
                               <AccordionTrigger className="px-6 py-4 hover:bg-muted/50 text-left">
                                   <div className="flex items-center gap-4">
                                     <Badge variant={getStatusBadgeVariant(project.status)} className={project.status === 'Active' ? 'bg-green-600/80 text-white' : ''}>{project.status}</Badge>
                                     <div className="flex flex-col">
                                        <span className="font-semibold">{project.customerName}</span>
                                        <span className="text-xs text-muted-foreground">Proyecto ID: {project.id}</span>
                                     </div>
                                   </div>
                               </AccordionTrigger>
                               <AccordionContent className="bg-muted/20 p-4">
                                  <div className="overflow-x-auto">
                                      <div className="flex items-start gap-4 pb-4">
                                          {project.phases.map((phase) => (
                                             <div key={phase.id} className="min-w-[240px]">
                                               <PhaseCard 
                                                  phase={phase}
                                                  isCurrent={phase.id === project.currentPhase}
                                                  isCompleted={phase.status === 'completed'}
                                              />
                                             </div>
                                          ))}
                                      </div>
                                  </div>
                               </AccordionContent>
                           </AccordionItem>
                       ))}
                    </Accordion>
                     {filteredProjects.length === 0 && (
                        <div className="p-6 text-center text-muted-foreground">
                            No se encontraron clientes con ese nombre.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
