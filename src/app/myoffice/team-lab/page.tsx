
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Beaker, CheckCircle, Clock, Search, Settings, User, Bot, Loader2, Zap, Image as ImageIcon, ThumbsUp, RefreshCw, BarChart2, Video, Eye, Pencil, Send, Globe, Cpu, ChevronRight, Check, X, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { Project, ProjectPhase } from '@/lib/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { sampleAnswers } from '@/lib/data/dashboard-data';
import { analyzeBusinessEvaluation, AnalyzeBusinessEvaluationOutput } from '@/ai/flows/analyze-business-evaluation';
import { generateContentSchedule, GenerateContentScheduleOutput, ContentPost } from '@/ai/flows/generate-content-schedule-flow';
import { generateImageFromPrompt } from '@/ai/flows/generate-image-flow';
import type { GenerateImageOutput } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/use-language';
import { ScrollArea } from '@/components/ui/scroll-area';
import NextImage from 'next/image';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Bar, BarChart, XAxis, Cell } from "recharts"
import {
  runResearchAgent,
  runStrategyAgent,
  runCopywriterAgent,
  runVisualAgent,
  runSchedulerAgent,
  PLATFORMS,
  PLATFORM_META,
  type SocialPlatform,
  type PlatformPost,
  type ScheduledPost,
} from '@/ai/flows/swarm-orchestrator-flow';

// ═══════════════════════════════════════════════════════════════════════════════
// AI SWARM ORCHESTRATOR — DeerFlow-inspired multi-agent content pipeline
// ═══════════════════════════════════════════════════════════════════════════════

type SwarmMode = 'observe' | 'intervene';
type AgentIndex = 0 | 1 | 2 | 3 | 4;         // researcher=0 … scheduler=4
type AgentRunStatus = 'idle' | 'running' | 'done';

interface AgentDef {
  id: string;
  label: string;
  emoji: string;
  description: string;
}

const AGENT_DEFS: AgentDef[] = [
  { id: 'researcher',  label: 'Investigador',     emoji: '🔍', description: 'Analiza negocio y mercado' },
  { id: 'strategist',  label: 'Estratega',        emoji: '📊', description: 'Define pilares y tono' },
  { id: 'copywriter',  label: 'Copywriter',       emoji: '✍️', description: 'Escribe copy por plataforma' },
  { id: 'visual',      label: 'Dir. Visual',      emoji: '🎨', description: 'Prompts LTX-Video-2 / Imagen' },
  { id: 'scheduler',  label: 'Programador',       emoji: '📅', description: 'Horario óptimo Mixpost' },
];

const DEMO_CLIENTS = [
  { id: 'c1', name: 'James Bond — Cafetería Premium', desc: 'Cafetería de especialidad en CDMX, producto estrella: cold brew artesanal. Ticket promedio $120 MXN, segmento jóvenes profesionales 25-35.' },
  { id: 'c2', name: 'Jane Smith — Coaching Ejecutivo', desc: 'Coaching ejecutivo para líderes de empresa mediana. Programa de 3 meses. Target: C-Level y directores 35-50 años.' },
  { id: 'c3', name: 'Demo Brand — E-commerce Moda', desc: 'Tienda online de moda sustentable. Prendas eco-friendly para mujer 28-45. Envíos México y Latam.' },
];

// Platform Preview Card (Mixpost-style)
function PlatformPreviewCard({
  post,
  scheduled,
  onGenerateVideo,
  generatingVideo,
  brandName,
}: {
  post: ScheduledPost;
  scheduled?: ScheduledPost;
  onGenerateVideo: (post: ScheduledPost) => void;
  generatingVideo: boolean;
  brandName: string;
}) {
  const meta = PLATFORM_META[post.platform];
  const copyLen = post.copy.length;
  const overLimit = copyLen > meta.charLimit;
  const pct = Math.min((copyLen / meta.charLimit) * 100, 100);

  return (
    <Card className="overflow-hidden flex flex-col">
      {/* Platform header */}
      <div className={cn('bg-gradient-to-r p-3 flex items-center gap-2', meta.gradient)}>
        <span className="text-xl">{meta.emoji}</span>
        <span className="text-white font-semibold text-sm">{meta.label}</span>
        {scheduled && (
          <Badge className="ml-auto bg-white/20 text-white border-0 text-xs">
            📅 {scheduled.optimalTime}
          </Badge>
        )}
      </div>

      {/* Post preview */}
      <CardContent className="p-3 flex-1 space-y-2">
        {/* Simulated profile row */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-xs text-primary-foreground font-bold">
            {brandName.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs font-semibold">@{brandName.toLowerCase().replace(/\s+/g, '_').substring(0, 18)}</span>
        </div>

        {/* Image placeholder */}
        <div className="rounded-md bg-muted h-28 flex items-center justify-center text-muted-foreground text-xs border border-dashed relative overflow-hidden">
          {post.imageUrl ? (
            <NextImage src={post.imageUrl} alt="Generated" fill className="object-cover" />
          ) : post.videoUrl ? (
            <video src={post.videoUrl} className="absolute inset-0 w-full h-full object-cover" muted loop playsInline autoPlay />
          ) : (
            <span className="text-center px-2">{post.imagePrompt.substring(0, 60)}…</span>
          )}
        </div>

        {/* Copy */}
        <p className="text-xs leading-relaxed line-clamp-4 whitespace-pre-line">{post.copy}</p>

        {/* Hashtags */}
        {post.hashtags.length > 0 && (
          <p className={cn('text-xs', meta.textColor)}>
            {post.hashtags.map((h) => `#${h.replace('#', '')}`).join(' ')}
          </p>
        )}

        {/* Char counter */}
        <div className="space-y-0.5">
          <Progress value={pct} className={cn('h-1', overLimit ? '[&>div]:bg-red-500' : '')} />
          <p className={cn('text-xs text-right', overLimit ? 'text-red-500 font-medium' : 'text-muted-foreground')}>
            {copyLen}/{meta.charLimit}
          </p>
        </div>
      </CardContent>

      {/* Actions */}
      <CardFooter className="p-2 gap-2 flex-col">
        {meta.videoSupport && (
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs"
            disabled={generatingVideo}
            onClick={() => onGenerateVideo(post)}
          >
            {generatingVideo ? (
              <><Loader2 className="mr-1 h-3 w-3 animate-spin" />Generando video…</>
            ) : (
              <><Video className="mr-1 h-3 w-3" />Generar video LTX-Video-2</>
            )}
          </Button>
        )}
        {scheduled && (
          <p className="text-xs text-muted-foreground text-center w-full">💡 {scheduled.reasoning}</p>
        )}
      </CardFooter>
    </Card>
  );
}

// Agent step card
function AgentCard({
  def,
  index,
  status,
  output,
  editedOutput,
  swarmMode,
  waitingAt,
  onEdit,
  onApprove,
}: {
  def: AgentDef;
  index: AgentIndex;
  status: AgentRunStatus;
  output: string;
  editedOutput: string;
  swarmMode: SwarmMode;
  waitingAt: number;
  onEdit: (idx: AgentIndex, val: string) => void;
  onApprove: (idx: AgentIndex) => void;
}) {
  const isWaiting = swarmMode === 'intervene' && status === 'done' && waitingAt === index;
  const [isExpanded, setIsExpanded] = useState(false);
  const [localEdit, setLocalEdit] = useState(editedOutput);

  useEffect(() => {
    setLocalEdit(editedOutput);
  }, [editedOutput]);

  return (
    <div
      className={cn(
        'min-w-[200px] max-w-[220px] rounded-xl border p-3 flex flex-col gap-2 transition-all',
        status === 'running' && 'border-primary shadow-md shadow-primary/20',
        status === 'done' && !isWaiting && 'border-green-500/40 bg-green-50/30 dark:bg-green-950/20',
        isWaiting && 'border-amber-400 shadow-md shadow-amber-300/30',
        status === 'idle' && 'border-dashed opacity-60'
      )}
    >
      <div className="flex items-center justify-between gap-1">
        <span className="text-lg">{def.emoji}</span>
        <span className="font-semibold text-xs flex-1">{def.label}</span>
        {status === 'running' && <Loader2 className="h-3 w-3 animate-spin text-primary" />}
        {status === 'done' && !isWaiting && <Check className="h-3 w-3 text-green-600" />}
        {isWaiting && <Zap className="h-3 w-3 text-amber-500 animate-pulse" />}
        {status === 'idle' && <Clock className="h-3 w-3 text-muted-foreground" />}
      </div>
      <p className="text-xs text-muted-foreground">{def.description}</p>

      {status === 'done' && output && (
        <div className="space-y-1">
          {!isExpanded ? (
            <button
              onClick={() => setIsExpanded(true)}
              className="text-xs text-primary underline underline-offset-2 hover:no-underline text-left"
            >
              Ver resultado…
            </button>
          ) : (
            <>
              {isWaiting ? (
                <Textarea
                  value={localEdit}
                  onChange={(e) => {
                    setLocalEdit(e.target.value);
                    onEdit(index, e.target.value);
                  }}
                  rows={4}
                  className="text-xs"
                />
              ) : (
                <ScrollArea className="h-24 rounded border bg-muted/40 p-1">
                  <p className="text-xs whitespace-pre-wrap">{output}</p>
                </ScrollArea>
              )}
              <button onClick={() => setIsExpanded(false)} className="text-xs text-muted-foreground hover:text-foreground">
                Contraer
              </button>
            </>
          )}
        </div>
      )}

      {isWaiting && (
        <Button size="sm" className="w-full text-xs mt-1" onClick={() => onApprove(index)}>
          <Check className="mr-1 h-3 w-3" /> Aprobar y continuar
        </Button>
      )}
    </div>
  );
}

// ── Main Swarm Section ─────────────────────────────────────────────────────────
function SwarmSection() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const lang = language.code;

  // Control state
  const [swarmMode, setSwarmMode] = useState<SwarmMode>('observe');
  const [selectedClient, setSelectedClient] = useState(DEMO_CLIENTS[0].id);
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>(['instagram', 'facebook', 'threads']);
  const [mixpostUrl, setMixpostUrl] = useState('');

  // Pipeline state
  const [agentStatuses, setAgentStatuses] = useState<AgentRunStatus[]>(['idle', 'idle', 'idle', 'idle', 'idle']);
  const [agentOutputs, setAgentOutputs] = useState<string[]>(['', '', '', '', '']);
  const [agentEdits, setAgentEdits] = useState<string[]>(['', '', '', '', '']);
  const [waitingAt, setWaitingAt] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState(false);

  // Results
  const [platformPosts, setPlatformPosts] = useState<ScheduledPost[]>([]);
  const [generatingVideoPlatform, setGeneratingVideoPlatform] = useState<SocialPlatform | null>(null);

  const client = DEMO_CLIENTS.find((c) => c.id === selectedClient) ?? DEMO_CLIENTS[0];
  const isDone = platformPosts.length > 0;

  const setStatus = (idx: number, s: AgentRunStatus) =>
    setAgentStatuses((prev) => prev.map((v, i) => (i === idx ? s : v)));

  const setOutput = (idx: number, text: string) => {
    setAgentOutputs((prev) => prev.map((v, i) => (i === idx ? text : v)));
    setAgentEdits((prev) => prev.map((v, i) => (i === idx ? text : v)));
  };

  const handleEdit = (idx: AgentIndex, val: string) => {
    setAgentEdits((prev) => prev.map((v, i) => (i === idx ? val : v)));
  };

  const togglePlatform = (p: SocialPlatform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(p) ? (prev.length > 1 ? prev.filter((x) => x !== p) : prev) : [...prev, p]
    );
  };

  // Step runner
  const runStep = useCallback(
    async (
      stepIdx: number,
      inputs: { research?: string; strategy?: string; posts?: PlatformPost[] }
    ) => {
      setStatus(stepIdx, 'running');
      let result: string | PlatformPost[] | ScheduledPost[] = '';

      try {
        switch (stepIdx) {
          case 0:
            result = await runResearchAgent(client.desc, lang);
            break;
          case 1:
            result = await runStrategyAgent(inputs.research ?? '', selectedPlatforms, lang);
            break;
          case 2:
            result = await runCopywriterAgent(inputs.strategy ?? '', selectedPlatforms, lang);
            break;
          case 3:
            result = await runVisualAgent((inputs.posts as PlatformPost[]) ?? [], lang);
            break;
          case 4:
            result = await runSchedulerAgent((inputs.posts as PlatformPost[]) ?? [], lang);
            break;
        }
      } catch {
        toast({ title: `Agente ${AGENT_DEFS[stepIdx].label} falló`, description: 'Se usará modo demo.', variant: 'destructive' });
      }

      setStatus(stepIdx, 'done');

      // Store output text for steps 0-1
      if (stepIdx <= 1) {
        setOutput(stepIdx, result as string);
      } else if (stepIdx === 2 || stepIdx === 3) {
        setOutput(stepIdx, JSON.stringify(result, null, 2).substring(0, 300) + '…');
      } else if (stepIdx === 4) {
        const scheduled = result as ScheduledPost[];
        setOutput(stepIdx, scheduled.map((p) => `${p.platform}: ${p.optimalTime}`).join('\n'));
        setPlatformPosts(scheduled);
        setIsRunning(false);
        toast({ title: '🐝 Enjambre completado', description: `${scheduled.length} posts creados y programados.` });
      }

      return result;
    },
    [client.desc, lang, selectedPlatforms, toast]
  );

  // Observe mode: auto-chain all steps
  const runAllSteps = useCallback(async () => {
    setIsRunning(true);
    setPlatformPosts([]);
    setAgentStatuses(['idle', 'idle', 'idle', 'idle', 'idle']);
    setAgentOutputs(['', '', '', '', '']);
    setWaitingAt(-1);

    const research = (await runStep(0, {})) as string;
    const strategy = (await runStep(1, { research })) as string;
    const copyPosts = (await runStep(2, { strategy })) as PlatformPost[];
    const visualPosts = (await runStep(3, { posts: copyPosts })) as PlatformPost[];
    await runStep(4, { posts: visualPosts });
  }, [runStep]);

  // Intervene mode: one step at a time, user approves each
  const startInterveneMode = useCallback(async () => {
    setIsRunning(true);
    setPlatformPosts([]);
    setAgentStatuses(['idle', 'idle', 'idle', 'idle', 'idle']);
    setAgentOutputs(['', '', '', '', '']);
    setWaitingAt(-1);

    await runStep(0, {});
    setWaitingAt(0); // pause for user approval
  }, [runStep]);

  const handleApprove = useCallback(
    async (idx: AgentIndex) => {
      setWaitingAt(-1);
      const research = agentEdits[0];
      const strategy = agentEdits[1];
      let copyPosts: PlatformPost[] = [];
      let visualPosts: PlatformPost[] = [];

      if (idx === 0) {
        await runStep(1, { research });
        setWaitingAt(1);
      } else if (idx === 1) {
        await runStep(2, { strategy });
        setWaitingAt(2);
      } else if (idx === 2) {
        try { copyPosts = JSON.parse(agentEdits[2]); } catch { copyPosts = []; }
        await runStep(3, { posts: copyPosts });
        setWaitingAt(3);
      } else if (idx === 3) {
        try { visualPosts = JSON.parse(agentEdits[3]); } catch { visualPosts = []; }
        await runStep(4, { posts: visualPosts });
        // step 4 sets isRunning=false and waitingAt stays -1
      }
    },
    [agentEdits, runStep]
  );

  const handleStart = () => {
    if (swarmMode === 'observe') runAllSteps();
    else startInterveneMode();
  };

  const handleReset = () => {
    setIsRunning(false);
    setAgentStatuses(['idle', 'idle', 'idle', 'idle', 'idle']);
    setAgentOutputs(['', '', '', '', '']);
    setAgentEdits(['', '', '', '', '']);
    setWaitingAt(-1);
    setPlatformPosts([]);
  };

  // LTX-Video generation
  const handleGenerateVideo = async (post: ScheduledPost) => {
    if (!post.videoPrompt && !post.imagePrompt) return;
    setGeneratingVideoPlatform(post.platform);
    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: post.videoPrompt ?? post.imagePrompt,
          aspectRatio: post.platform === 'tiktok' || post.platform === 'threads' || post.platform === 'instagram' ? '9:16' : '16:9',
          durationSeconds: 5,
        }),
      });
      const data = await response.json() as { videoUrl?: string; isDemoMode?: boolean; error?: string };
      if (data.error) throw new Error(data.error);
      setPlatformPosts((prev) =>
        prev.map((p) => (p.platform === post.platform ? { ...p, videoUrl: data.videoUrl } : p))
      );
      toast({
        title: data.isDemoMode ? '🎬 Video demo (LTX-Video-2)' : '🎬 Video generado',
        description: data.isDemoMode ? 'Agrega HF_API_TOKEN para usar LTX-Video-2 real.' : `Video de ${post.platform} listo.`,
      });
    } catch (err) {
      toast({ title: 'Error generando video', description: String(err), variant: 'destructive' });
    } finally {
      setGeneratingVideoPlatform(null);
    }
  };

  // Mixpost publish
  const handlePublishToMixpost = async () => {
    const url = mixpostUrl.trim();
    try {
      const res = await fetch('/api/mixpost/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mixpostBaseUrl: url || undefined,
          posts: platformPosts.map((post) => ({
            platform: post.platform,
            copy: post.copy,
            hashtags: post.hashtags,
            scheduledAt: post.scheduledAt,
          })),
        }),
      });

      const data = await res.json() as {
        sent?: number;
        total?: number;
        error?: string;
        usedEnvBaseUrl?: boolean;
        usedApiToken?: boolean;
      };

      if (!res.ok) {
        throw new Error(data.error || 'No se pudo publicar en Mixpost');
      }

      toast({
        title: `✅ ${data.sent ?? 0}/${data.total ?? platformPosts.length} posts enviados a Mixpost`,
        description: `${data.usedEnvBaseUrl ? 'Usando MIXPOST_BASE_URL de entorno.' : 'Usando URL manual.'} ${data.usedApiToken ? 'Token aplicado.' : 'Sin token (modo abierto/local).'}`,
      });
    } catch (err) {
      toast({
        title: 'Error al conectar con Mixpost',
        description: err instanceof Error ? err.message : 'Verifica la URL y credenciales de Mixpost.',
        variant: 'destructive'
      });
    }
  };

  const handleExportJSON = () => {
    const json = JSON.stringify({ generatedAt: new Date().toISOString(), client: client.name, posts: platformPosts }, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `swarm-posts-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <Card className="border-primary/30 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Cpu className="h-5 w-5 text-primary" />
              Concertador de IAs — Enjambre 🐝
            </CardTitle>
            <CardDescription className="mt-1">
              5 agentes especializados (DeerFlow pattern) crean y programan contenido para cada red. Powered by{' '}
              <a href="https://github.com/Lightricks/LTX-Video" target="_blank" rel="noopener noreferrer" className="underline">LTX-Video-2</a>{' '}
              +{' '}
              <a href="https://github.com/inovector/mixpost" target="_blank" rel="noopener noreferrer" className="underline">Mixpost</a>{' '}
              + Threads Meta (Andromeda).
            </CardDescription>
          </div>
          {isRunning && !isDone && (
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <X className="mr-1 h-3 w-3" /> Cancelar
            </Button>
          )}
          {isDone && (
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RefreshCw className="mr-1 h-3 w-3" /> Reiniciar enjambre
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* ── Controls ── */}
        {!isRunning && !isDone && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mode */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Modo</Label>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={swarmMode === 'observe' ? 'default' : 'outline'}
                  onClick={() => setSwarmMode('observe')}
                  className="flex-1"
                >
                  <Eye className="mr-1 h-3 w-3" /> Solo observar
                </Button>
                <Button
                  size="sm"
                  variant={swarmMode === 'intervene' ? 'default' : 'outline'}
                  onClick={() => setSwarmMode('intervene')}
                  className="flex-1"
                >
                  <Pencil className="mr-1 h-3 w-3" /> Intervenir
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {swarmMode === 'observe'
                  ? 'Los 5 agentes corren en secuencia automática.'
                  : 'Puedes editar el output de cada agente antes de continuar.'}
              </p>
            </div>

            {/* Client */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Cliente</Label>
              <div className="flex flex-col gap-1">
                {DEMO_CLIENTS.map((c) => (
                  <label key={c.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="swarm-client"
                      value={c.id}
                      checked={selectedClient === c.id}
                      onChange={() => setSelectedClient(c.id)}
                      className="accent-primary"
                    />
                    <span className="text-xs">{c.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Platforms */}
            <div className="space-y-2 md:col-span-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Plataformas de destino
              </Label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((p) => {
                  const meta = PLATFORM_META[p];
                  const checked = selectedPlatforms.includes(p);
                  return (
                    <button
                      key={p}
                      onClick={() => togglePlatform(p)}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all',
                        checked
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'border-muted-foreground/30 text-muted-foreground hover:border-primary/60'
                      )}
                    >
                      <span>{meta.emoji}</span>
                      <span>{p === 'threads' ? 'Threads (Andromeda)' : meta.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Agent Pipeline ── */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold">Pipeline de agentes</span>
          </div>
          <div className="overflow-x-auto pb-2">
            <div className="flex items-start gap-3 min-w-max">
              {AGENT_DEFS.map((def, idx) => (
                <div key={def.id} className="flex items-start gap-3">
                  <AgentCard
                    def={def}
                    index={idx as AgentIndex}
                    status={agentStatuses[idx]}
                    output={agentOutputs[idx]}
                    editedOutput={agentEdits[idx]}
                    swarmMode={swarmMode}
                    waitingAt={waitingAt}
                    onEdit={handleEdit}
                    onApprove={handleApprove}
                  />
                  {idx < AGENT_DEFS.length - 1 && (
                    <ChevronRight className="h-4 w-4 text-muted-foreground mt-6 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Start button ── */}
        {!isRunning && !isDone && (
          <Button
            className="w-full"
            size="lg"
            onClick={handleStart}
            disabled={selectedPlatforms.length === 0}
          >
            <Zap className="mr-2 h-4 w-4" />
            Iniciar enjambre para {client.name.split('—')[0].trim()}
          </Button>
        )}

        {/* ── Platform Previews (Mixpost-style) ── */}
        {isDone && (
          <div className="space-y-4">
            <Separator />
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Vista previa por plataforma — estilo Mixpost
              </h3>
              <div className="flex gap-2 flex-wrap">
                <Button size="sm" variant="outline" onClick={handleExportJSON}>
                  <Send className="mr-1 h-3 w-3" /> Exportar JSON
                </Button>
              </div>
            </div>

            {/* Grid preview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {platformPosts.map((post) => (
                <PlatformPreviewCard
                  key={post.platform}
                  post={post}
                  scheduled={post}
                  onGenerateVideo={handleGenerateVideo}
                  generatingVideo={generatingVideoPlatform === post.platform}
                  brandName={client.name.split('—')[0].trim()}
                />
              ))}
            </div>

            {/* Mixpost publish bar */}
            <Card className="bg-muted/30">
              <CardHeader className="pb-2 pt-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Publicar con Mixpost
                  <Badge variant="outline" className="text-xs font-normal">MIT — self-hosted</Badge>
                </CardTitle>
                <CardDescription className="text-xs">
                  Conecta tu instancia de{' '}
                  <a href="https://github.com/inovector/mixpost" target="_blank" rel="noopener noreferrer" className="underline">
                    Mixpost
                  </a>{' '}
                  para programar en todas las plataformas con un click.
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-3 space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="https://tu-mixpost.dominio.com"
                    value={mixpostUrl}
                    onChange={(e) => setMixpostUrl(e.target.value)}
                    className="text-xs"
                  />
                  <Button onClick={handlePublishToMixpost} size="sm">
                    <Send className="mr-1 h-3 w-3" /> Enviar a Mixpost
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Configura también <code className="bg-muted rounded px-1">MIXPOST_BASE_URL</code> y{' '}
                  <code className="bg-muted rounded px-1">MIXPOST_API_TOKEN</code> en{' '}
                  <code className="bg-muted rounded px-1">.env.local</code> para integración automática.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXISTING PROJECT DATA & SIMULATOR DIALOGS
// ═══════════════════════════════════════════════════════════════════════════════

const initialProjects: Project[] = [
  {
    id: 'proj_001',
    customerId: 'cus_001',
    customerName: 'James Bond (Agente 007)',
    currentPhase: 'planning',
    status: 'Active',
    phases: [
      { id: 'onboarding', status: 'completed', name: 'Onboarding y Evaluación' },
      { id: 'research', status: 'completed', name: 'Investigación y Estrategia' },
      { id: 'planning', status: 'in_progress', name: 'Planificación y Calendario' },
      { id: 'execution', status: 'pending', name: 'Generación y Ejecución' },
      { id: 'closure', status: 'pending', name: 'Optimización y Cierre' },
    ]
  },
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

// --- SIMULATOR DIALOGS ---

const AnalysisReviewDialog = ({ project, phase }: { project: Project, phase: ProjectPhase }) => {
    // ... (This component remains largely the same)
    const [isLoading, setIsLoading] = useState(false);
    const [analysis, setAnalysis] = useState<AnalyzeBusinessEvaluationOutput | null>(null);
    const { toast } = useToast();
    const { language } = useLanguage();

    const handleRunAnalysis = async () => {
        setIsLoading(true);
        setAnalysis(null);
        try {
            const result = await analyzeBusinessEvaluation({ 
                answersJson: JSON.stringify(sampleAnswers.eval),
                targetLanguage: language.code,
            });
            setAnalysis(result);
            toast({ title: "Análisis completado", description: "La IA ha generado el análisis FODA y las recomendaciones." });
        } catch {
                        console.error("Analysis failed");
                        setAnalysis({
                            swot: {
                                strengths: 'Producto diferencial, buena calidad percibida y alta recompra de clientes frecuentes.',
                                weaknesses: 'Baja presencia digital y calendario de contenido inconsistente.',
                                opportunities: 'Mayor demanda local y crecimiento en formatos de video corto.',
                                threats: 'Competidores con alta inversion en pauta y promociones agresivas.',
                            },
                            recommendations: 'Priorizar contenido semanal de producto estrella, activar pauta local y reforzar captacion con ofertas por temporada.',
                        });
                        toast({
                            title: "Modo demo activado",
                            description: "Se mostró un analisis de respaldo para continuar la validacion.",
                        });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full text-xs justify-start">
                    <Bot className="mr-2 h-3 w-3" /> Ejecutar y Revisar
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl">
                 <DialogHeader>
                    <DialogTitle>Simulador: {phase.name}</DialogTitle>
                    <DialogDescription>
                        Revisando el cliente: {project.customerName}. Aquí puedes simular la ejecución de la IA y auditar la calidad del resultado.
                    </DialogDescription>
                </DialogHeader>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 max-h-[60vh] overflow-y-auto">
                     {/* Input Data */}
                    <div className="space-y-4">
                        <h4 className="font-semibold">Entrada: Respuestas del Cuestionario (Ejemplo)</h4>
                        <Card className="bg-muted/50">
                            <CardContent className="p-4 space-y-4 text-sm">
                                {Object.entries(sampleAnswers.eval).map(([section, answers]: [string, Record<string, string>]) => (
                                <div key={section}>
                                    <h5 className="font-semibold mb-1">{section}</h5>
                                    {Object.entries(answers).map(([question, answer]: [string, string]) => (
                                    <div key={question} className="text-xs">
                                        <p className="text-muted-foreground">{question}</p>
                                        <p className="font-medium pl-2">{answer}</p>
                                    </div>
                                    ))}
                                </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                     {/* AI Output */}
                    <div className="space-y-4">
                         <h4 className="font-semibold">Salida: Análisis de IA</h4>
                        <Card>
                            <CardHeader>
                                <Button onClick={handleRunAnalysis} disabled={isLoading}>
                                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analizando...</> : <><Bot className="mr-2 h-4 w-4" /> Ejecutar Análisis de Negocio</>}
                                </Button>
                            </CardHeader>
                            <CardContent>
                                {isLoading && <p className="text-sm text-muted-foreground">La IA está trabajando...</p>}
                                {analysis && (
                                    <div className="prose prose-sm max-w-none">
                                        <h4>Análisis FODA</h4>
                                        <p><strong>Fortalezas:</strong> {analysis.swot.strengths}</p>
                                        <p><strong>Debilidades:</strong> {analysis.swot.weaknesses}</p>
                                        <p><strong>Oportunidades:</strong> {analysis.swot.opportunities}</p>
                                        <p><strong>Amenazas:</strong> {analysis.swot.threats}</p>
                                        <h4 className="mt-4">Recomendaciones Estratégicas</h4>
                                        <p className="whitespace-pre-wrap">{analysis.recommendations}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

const ContentScheduleDialog = ({ project, phase }: { project: Project, phase: ProjectPhase }) => {
    // ... (This component is now visually improved)
    const [isLoading, setIsLoading] = useState(false);
    const [schedule, setSchedule] = useState<GenerateContentScheduleOutput | null>(null);
    const { toast } = useToast();

    const clientBusinessDescription = `Cliente: ${project.customerName}, Plan: Dúo Conexión VIP. Resumen: Cafetería de especialidad con producto estrella (cold brew) pero baja presencia de marca. Objetivo: Aumentar brand awareness y tráfico a tienda física.`;

    const handleRunGenerator = async () => {
        setIsLoading(true);
        setSchedule(null);
        try {
            const result = await generateContentSchedule({ clientBusiness: clientBusinessDescription });
            setSchedule(result);
            toast({ title: "Parrilla generada", description: "Se ha creado el calendario de contenido mensual." });
        } catch {
                        setSchedule({
                            posts: [
                                { postNumber: '1', format: 'Reel', topic: 'Producto estrella', copyIn: 'Reel mostrando preparacion de cold brew artesanal', copyOut: 'Descubre nuestro cold brew artesanal y visitanos hoy.' },
                                { postNumber: '2', format: 'Carrusel', topic: 'Diferenciales', copyIn: 'Carrusel con 5 razones para elegir nuestra cafeteria', copyOut: '5 razones por las que nuestra comunidad vuelve cada semana.' },
                                { postNumber: '3', format: 'Historia', topic: 'Promocion fin de semana', copyIn: 'Story con promo 2x1 en horario definido', copyOut: 'Este fin de semana: promo especial para clientes frecuentes.' },
                            ],
                        });
                        toast({ title: "Modo demo activado", description: "Se cargo una parrilla de respaldo para la demostracion." });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full text-xs justify-start">
                    <Bot className="mr-2 h-3 w-3" /> Ejecutar y Revisar
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl">
                 <DialogHeader>
                    <DialogTitle>Simulador: {phase.name}</DialogTitle>
                    <DialogDescription>Revisando el cliente: {project.customerName}. Simula la generación de la parrilla de contenido mensual.</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 max-h-[70vh] overflow-y-auto">
                    <div className="space-y-4">
                        <h4 className="font-semibold">Entrada: Perfil del Cliente e Instrucciones</h4>
                        <Card className="bg-muted/50"><CardContent className="p-4 text-xs font-mono">{clientBusinessDescription}</CardContent></Card>
                    </div>
                    <div className="space-y-4">
                        <h4 className="font-semibold">Salida: Parrilla de Contenido Generada</h4>
                        <Card>
                            <CardHeader>
                                <Button onClick={handleRunGenerator} disabled={isLoading}>
                                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generando...</> : <><Bot className="mr-2 h-4 w-4" /> Generar Parrilla</>}
                                </Button>
                            </CardHeader>
                            <CardContent>
                                {isLoading && <p>La IA está creando el calendario...</p>}
                                {schedule && (
                                  <ScrollArea className="h-[400px] border rounded-md">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>#</TableHead>
                                                <TableHead>Formato</TableHead>
                                                <TableHead>Tema</TableHead>
                                                <TableHead>Copy</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {schedule.posts.map(post => (
                                                <TableRow key={post.postNumber}>
                                                    <TableCell>{post.postNumber}</TableCell>
                                                    <TableCell>{post.format}</TableCell>
                                                    <TableCell>{post.topic}</TableCell>
                                                    <TableCell className="text-xs">{post.copyOut}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                  </ScrollArea>
                                )}
                            </CardContent>
                            {schedule && <CardFooter><Button className="w-full"><ThumbsUp className="mr-2"/>Guardar Parrilla Aprobada</Button></CardFooter>}
                        </Card>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

const ImageGenerationDialog = ({ project, phase }: { project: Project, phase: ProjectPhase }) => {
    // ... (This is the new image generation simulator)
    const [isLoading, setIsLoading] = useState(false);
    const [schedule, setSchedule] = useState<GenerateContentScheduleOutput | null>(null);
    const [selectedPost, setSelectedPost] = useState<ContentPost | null>(null);
    const [imageOutput, setImageOutput] = useState<GenerateImageOutput | null>(null);
    const { toast } = useToast();

    const getSchedule = async () => {
        if (schedule) return;
        setIsLoading(true);
        try {
            const result = await generateContentSchedule({ clientBusiness: `Cliente: ${project.customerName}` });
            setSchedule(result);
            if (result.posts.length > 0) setSelectedPost(result.posts[0]);
        } catch {
            toast({ title: "Error al cargar la parrilla", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }

    const handleRunImageGenerator = async () => {
        if (!selectedPost) return;
        setIsLoading(true);
        setImageOutput(null);
        try {
            const result = await generateImageFromPrompt({ creativeBrief: selectedPost.copyIn, aspectRatio: '1:1' });
            setImageOutput(result);
            toast({ title: "Imagen generada con éxito" });
        } catch {
            setImageOutput({
              imageUrl: `https://picsum.photos/seed/${project.id}${selectedPost.postNumber}/512`,
              refinedPrompt: selectedPost.copyIn,
              cost: 0,
              model: 'demo-fallback',
            });
            toast({ title: "Modo demo activado", description: "Se genero una imagen de respaldo para continuar la revision." });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog onOpenChange={(open) => open && getSchedule()}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full text-xs justify-start">
                    <ImageIcon className="mr-2 h-3 w-3" /> Ejecutar y Revisar
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl">
                 <DialogHeader>
                    <DialogTitle>Simulador: {phase.name}</DialogTitle>
                    <DialogDescription>Genera una imagen para un post del cliente: {project.customerName}.</DialogDescription>
                </DialogHeader>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 max-h-[70vh] overflow-y-auto">
                    <div className="space-y-4">
                        <h4 className="font-semibold">Entrada: Posts de la Parrilla</h4>
                        <Card className="bg-muted/50">
                            <CardContent className="p-2">
                                <ScrollArea className="h-64">
                                    <div className="space-y-2 p-2">
                                    {schedule?.posts.map(post => (
                                        <Button key={post.postNumber} variant={selectedPost?.postNumber === post.postNumber ? 'secondary' : 'ghost'} onClick={() => setSelectedPost(post)} className="w-full justify-start h-auto text-left">
                                            <div>
                                                <p className="font-semibold">Post #{post.postNumber}: {post.topic}</p>
                                                <p className="text-xs text-muted-foreground">{post.copyIn.substring(0, 50)}...</p>
                                            </div>
                                        </Button>
                                    ))}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="space-y-4">
                        <h4 className="font-semibold">Salida: Imagen Generada por IA</h4>
                        <Card>
                            <CardHeader>
                                <Button onClick={handleRunImageGenerator} disabled={isLoading || !selectedPost}>
                                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generando...</> : <><Bot className="mr-2 h-4 w-4" /> Generar Imagen para Post #{selectedPost?.postNumber}</>}
                                </Button>
                            </CardHeader>
                            <CardContent className="min-h-64 flex flex-col items-center justify-center text-center">
                                {isLoading ? <Loader2 className="h-8 w-8 animate-spin text-muted-foreground"/> :
                                imageOutput?.imageUrl ? (
                                   <div className="space-y-2">
                                      <NextImage src={imageOutput.imageUrl || `https://picsum.photos/seed/${project.id}${selectedPost?.postNumber}/512`} alt="Generated image" width={256} height={256} className="rounded-lg border"/>
                                      <p className="text-xs text-muted-foreground max-w-xs mx-auto"><strong>Prompt usado:</strong> {imageOutput.refinedPrompt}</p>
                                   </div>
                                ) : <p className="text-sm text-muted-foreground">Selecciona un post y genera su imagen.</p>}
                            </CardContent>
                             {imageOutput && <CardFooter className="flex justify-center gap-2"><Button><ThumbsUp className="mr-2"/>Aprobar</Button><Button variant="outline"><RefreshCw className="mr-2"/>Regenerar</Button></CardFooter>}
                        </Card>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
};

const OptimizationDialog = ({ project, phase }: { project: Project, phase: ProjectPhase }) => {
    // ... (This is the new optimization simulator)
    const chartData = [ { month: 'A', conversion: 4.5 }, { month: 'B', conversion: 5.2 } ];
    const chartConfig = { conversion: { label: 'Conversión', color: 'hsl(var(--chart-1))' } } satisfies ChartConfig;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full text-xs justify-start">
                    <BarChart2 className="mr-2 h-3 w-3" /> Ejecutar y Revisar
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                 <DialogHeader>
                    <DialogTitle>Simulador: {phase.name}</DialogTitle>
                    <DialogDescription>Simula el análisis de rendimiento de campaña y la generación de insights para {project.customerName}.</DialogDescription>
                </DialogHeader>
                 <div className="py-4 space-y-6">
                    <Card>
                        <CardHeader><CardTitle className="text-base">Análisis de Performance (Simulado)</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-3 gap-4 text-center">
                            <div><p className="text-2xl font-bold">120,450</p><p className="text-xs text-muted-foreground">Impresiones</p></div>
                            <div><p className="text-2xl font-bold">3,612</p><p className="text-xs text-muted-foreground">Clics</p></div>
                            <div><p className="text-2xl font-bold">3.0%</p><p className="text-xs text-muted-foreground">CTR</p></div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader><CardTitle className="text-base">Simulación de Prueba A/B</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <div className="text-sm font-semibold">Copy A: &quot;Descubre nuestro Cold Brew artesanal.&quot; - <Badge variant="destructive">Perdedor (4.5% CVR)</Badge></div>
                                <div className="text-sm font-semibold">Copy B: &quot;El Cold Brew que te cambiará la vida. ¡Pruébalo hoy!&quot; - <Badge className="bg-green-500 text-white">Ganador (5.2% CVR)</Badge></div>
                            </div>
                            <ChartContainer config={chartConfig} className="h-[100px] w-full">
                                <BarChart accessibilityLayer data={chartData} layout="vertical" margin={{ left: -20, right: 20 }}>
                                    <XAxis type="number" dataKey="conversion" hide />
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                                    <Bar dataKey="conversion" layout="vertical" radius={5}>
                                         {chartData.map((_, index) => <Cell key={`cell-${index}`} fill={index === 0 ? 'hsl(var(--chart-2))' : 'hsl(var(--chart-1))'} />)}
                                    </Bar>
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader><CardTitle className="text-base">Insights y Recomendaciones de IA</CardTitle></CardHeader>
                        <CardContent>
                             <ul className="list-disc list-inside space-y-1 text-sm">
                                <li>**Optimizar:** Incrementar presupuesto en campañas de video, mostraron 15% más engagement.</li>
                                <li>**Enfocar:** El segmento de 25-34 años tuvo la tasa de conversión más alta. Crear audiencia lookalike.</li>
                                <li>**Sugerencia:** Lanzar promoción de &quot;2x1 en Cold Brew&quot; los fines de semana para capitalizar el tráfico.</li>
                            </ul>
                        </CardContent>
                    </Card>
                 </div>
            </DialogContent>
        </Dialog>
    )
};


const PhaseCard = ({ project, phase, isCurrent, isCompleted }: { project: Project, phase: ProjectPhase, isCurrent: boolean, isCompleted: boolean }) => {
    
    const isSimulatorClient = project.customerName.includes("James Bond");

    const getIcon = () => {
        if(isCompleted) return <CheckCircle className="h-5 w-5 text-green-500" />;
        if(isCurrent) return <Zap className="h-5 w-5 text-orange-500 animate-pulse" />;
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }

    const progressValue = isCompleted ? 100 : isCurrent ? 50 : 0;
    
    const renderAction = () => {
        if (!isSimulatorClient) {
            return (
                <Button variant="ghost" size="sm" className="w-full text-xs justify-start text-muted-foreground" disabled>
                    <Settings className="mr-2 h-3 w-3" /> Ver Detalles (Auto)
                </Button>
            )
        }
        
        switch(phase.id) {
            case 'research':
                return <AnalysisReviewDialog project={project} phase={phase} />;
            case 'planning':
                return <ContentScheduleDialog project={project} phase={phase} />;
            case 'execution':
                return <ImageGenerationDialog project={project} phase={phase} />;
             case 'closure':
                return <OptimizationDialog project={project} phase={phase} />;
            default:
                 return (
                    <Button variant="ghost" size="sm" className="w-full text-xs justify-start text-muted-foreground" disabled>
                        <Settings className="mr-2 h-3 w-3" /> Próximamente
                    </Button>
                 )
        }
    }


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
                 {isCurrent && (
                     <div className="mt-2 space-y-1">
                        <Progress value={progressValue} className="h-1" indicatorClassName="bg-orange-500" />
                    </div>
                )}
            </CardContent>
            <CardFooter>
                 {renderAction()}
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
                    Supervisa el flujo de trabajo automatizado de cada cliente. Usa a &quot;James Bond&quot; para simular y validar las tareas de la IA.
                </p>
            </header>

      {/* AI Swarm Orchestrator — NEW */}
      <SwarmSection />

      <Separator />

      {/* Existing project supervision */}
      <header>
        <div className="flex items-center gap-3 mb-1">
          <User className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-bold">Supervisión de Proyectos</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Supervisa el flujo de trabajo automatizado de cada cliente. Usa a &quot;James Bond&quot; para simular y validar las tareas de la IA.
        </p>
      </header>

      <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><User /> Lista de Clientes y Proyectos</CardTitle>
                    <CardDescription>
                        Busca un cliente y expande para ver el estado de su flujo de trabajo.
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
                                                  project={project}
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
