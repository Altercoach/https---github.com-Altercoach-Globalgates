'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Beaker, CheckCircle, Clock, Loader2, PlayCircle, Settings, User } from 'lucide-react';
import { initialCustomers } from '@/lib/constants';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Project, ProjectPhase, projectPhases } from '@/lib/types';


const initialProjects: Project[] = [
  {
    id: 'proj_002',
    customerId: 'cus_002',
    customerName: 'Jane Smith',
    currentPhase: 'execution',
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
    customerName: 'John Doe',
    currentPhase: 'research',
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
    customerName: 'Emily Brown',
    currentPhase: 'onboarding',
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
        if(isCurrent) return <Loader2 className="h-5 w-5 text-primary animate-spin" />;
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }

    return (
        <Card className={`transition-all ${isCurrent ? 'border-primary shadow-lg' : isCompleted ? 'bg-muted/50' : 'border-dashed'}`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-medium">{phase.name}</CardTitle>
                {getIcon()}
            </CardHeader>
            <CardContent>
                <p className="text-xs text-muted-foreground">
                    {isCompleted ? 'Completado' : isCurrent ? 'En progreso...' : 'Pendiente'}
                </p>
            </CardContent>
            <CardFooter>
                 <Button variant="ghost" size="sm" className="w-full text-xs justify-start" disabled={!isCurrent && !isCompleted}>
                    <Settings className="mr-2 h-3 w-3" /> Ver/Editar Detalles
                </Button>
            </CardFooter>
        </Card>
    )
}


export default function TeamLabPage() {
    const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(initialProjects[0].id);
    
    const selectedProject = initialProjects.find(p => p.id === selectedProjectId);

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
                    <CardTitle className="flex items-center gap-2"><User /> Selección de Cliente</CardTitle>
                    <CardDescription>
                        Elige un proyecto de cliente para ver el estado de su flujo de trabajo automatizado.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="max-w-md">
                        <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                            <SelectTrigger id="client-select">
                                <SelectValue placeholder="Elige un cliente..." />
                            </SelectTrigger>
                            <SelectContent>
                                {initialProjects.map(project => (
                                    <SelectItem key={project.id} value={project.id}>
                                        {project.customerName} - (Proyecto: {project.id})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {selectedProject && (
                 <Card>
                    <CardHeader>
                        <CardTitle>Flujo de Trabajo para: {selectedProject.customerName}</CardTitle>
                        <CardDescription>Este es el estado en tiempo real de las fases del proyecto. Puedes intervenir en la fase actual.</CardDescription>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                        <div className="flex items-start gap-4 pb-4">
                            {selectedProject.phases.map((phase, index) => (
                               <div key={phase.id} className="min-w-[220px]">
                                 <PhaseCard 
                                    phase={phase}
                                    isCurrent={phase.id === selectedProject.currentPhase}
                                    isCompleted={phase.status === 'completed'}
                                />
                               </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
