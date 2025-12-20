
'use client';

import { useState, useEffect } from 'react';
import { useSite } from '@/hooks/use-site';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import type { SiteData, Product, MultilingualString } from '@/lib/types';
import { PlusCircle, Trash2, FileText, Info, Eye, EyeOff, GripVertical, Save, ExternalLink } from 'lucide-react';
import { FEATURE_FLAGS } from '@/lib/feature-flags';
import { useLanguage } from '@/hooks/use-language';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Link from 'next/link';
import { Checkbox } from '@/components/ui/checkbox';


const labels = {
  es: {
    pageTitle: "Planes y Servicios",
    pageSubtitle: "Gestiona los planes y servicios que ofreces. Arrastra para reordenar.",
    addProduct: "Añadir Plan",
    newProduct: "Nuevo Plan",
    newProductDesc: "Una breve descripción.",
    newProductDetail: "Descripción detallada del nuevo plan.",
    newBadge: "Nuevo",
    nameLabel: "Nombre",
    typeLabel: "Tipo",
    priceLabel: "Precio (USD)",
    noteLabel: "Nota (Descripción corta)",
    badgeLabel: "Etiqueta",
    fullDescLabel: "Descripción Completa",
    includedFeaturesTitle: "Funcionalidades Incluidas (Formularios y Opciones)",
    formFeaturesTitle: "Formularios de Onboarding",
    platformFeaturesTitle: "Funcionalidades de la Plataforma",
    saveChanges: "Guardar Cambios",
    productTypes: { one: 'Pago Único', sub: 'Suscripción', info: 'Informativo' },
    editingLanguage: "Estás editando el contenido en",
    visible: "Visible en la página principal"
  },
  en: {
    pageTitle: "Plans & Services",
    pageSubtitle: "Manage the plans and services you offer. Drag to reorder.",
    addProduct: "Add Plan",
    newProduct: "New Plan",
    newProductDesc: "A short description.",
    newProductDetail: "Detailed description of the new plan.",
    newBadge: "New",
    nameLabel: "Name",
    typeLabel: "Type",
    priceLabel: "Price (USD)",
    noteLabel: "Note (Short description)",
    badgeLabel: "Badge",
    fullDescLabel: "Full Description",
    includedFeaturesTitle: "Included Features (Forms & Options)",
    formFeaturesTitle: "Onboarding Forms",
    platformFeaturesTitle: "Platform Features",
    saveChanges: "Save Changes",
    productTypes: { one: 'One-time Payment', sub: 'Subscription', info: 'Informational' },
    editingLanguage: "You are editing the content in",
    visible: "Visible on homepage"
  },
  fr: {
    pageTitle: "Forfaits et Services",
    pageSubtitle: "Gérez les forfaits et les services que vous proposez. Faites glisser pour réorganiser.",
    addProduct: "Ajouter un Forfait",
    newProduct: "Nouveau Forfait",
    newProductDesc: "Une courte description.",
    newProductDetail: "Description détaillée du nouveau forfait.",
    newBadge: "Nouveau",
    nameLabel: "Nom",
    typeLabel: "Type",
    priceLabel: "Prix (USD)",
    noteLabel: "Note (Description courte)",
    badgeLabel: "Badge",
    fullDescLabel: "Description Complète",
    includedFeaturesTitle: "Fonctionnalités Incluses (Formulaires & Options)",
    formFeaturesTitle: "Formulaires d'Onboarding",
    platformFeaturesTitle: "Fonctionnalités de la Plateforme",
    saveChanges: "Enregistrer les Modifications",
    productTypes: { one: 'Paiement Unique', sub: 'Abonnement', info: 'Informationnel' },
    editingLanguage: "Vous éditez le contenu en",
    visible: "Visible sur la page d'accueil"
  }
};

const featureNames = {
  es: {
    // Formularios
    'business-evaluation': 'Evaluación de Negocio (Doctor RX)',
    'brief-marketing': 'Brief de Marketing Profesional',
    'agent-training': 'Entrenamiento de Agente IA',
    'satisfaction-survey': 'Encuesta de Satisfacción',
    // IA & Automatización
    'ai_content_generation': 'Generación de Contenido IA',
    'ai_campaign_planner': 'Planificador de Campañas IA',
    'ai_marketing_assistant': 'Asistente de Marketing IA',
    'ai_business_diagnosis': 'Diagnóstico de Negocio IA',
    'ai_form_auto_builder': 'Autoconstructor de Formularios IA',
    'ai_copywriting_longform': 'Copywriting Extenso con IA',
    'ai_multilingual_generation': 'Generación Multilingüe IA',
    'ai_image_generation': 'Generación de Imágenes IA',
    'ai_content_scheduler': 'Programador de Contenido IA',
    'ai_insights_and_recommendations': 'Insights y Recomendaciones IA',
    // Editor & UX
    'visual_editor_v2': 'Editor Visual V2',
    'drag_and_drop_sections': 'Arrastrar y Soltar Secciones',
    'block_based_content': 'Contenido Basado en Bloques',
    'advanced_layout_controls': 'Controles de Diseño Avanzados',
    'dark_mode_editor': 'Editor en Modo Oscuro',
    'real_time_preview': 'Vista Previa en Tiempo Real',
    'inline_editing': 'Edición en Línea',
    'undo_redo_history': 'Historial de Deshacer/Rehacer',
    'content_versioning': 'Versionado de Contenido',
    'export_site_json': 'Exportar Sitio (JSON)',
    // Web & Publicación
    'custom_domains': 'Dominios Personalizados',
    'subdomain_mapping': 'Mapeo de Subdominios',
    'seo_advanced_controls': 'Controles SEO Avanzados',
    'meta_tags_manager': 'Gestor de Meta Tags',
    'analytics_integration': 'Integración de Analíticas',
    'cookie_consent_manager': 'Gestor de Consentimiento de Cookies',
    'cdn_optimization': 'Optimización de CDN',
    'performance_auto_optimize': 'Auto-optimización de Rendimiento',
    // Marketing & Growth
    'lead_capture_forms': 'Formularios de Captura de Leads',
    'funnels_builder': 'Constructor de Embudos (Funnels)',
    'email_marketing_basic': 'Email Marketing Básico',
    'email_marketing_advanced': 'Email Marketing Avanzado',
    'whatsapp_integration': 'Integración con WhatsApp',
    'crm_light': 'CRM Ligero',
    'campaign_tracking': 'Seguimiento de Campañas',
    'utm_manager': 'Gestor de UTMs',
    'ab_testing': 'Pruebas A/B',
    // Monetización & Pagos
    'pricing_pages': 'Páginas de Precios',
    'subscription_management': 'Gestión de Suscripciones',
    'one_time_payments': 'Pagos Únicos',
    'payment_links': 'Enlaces de Pago',
    'invoicing': 'Facturación',
    'discounts_coupons': 'Descuentos y Cupones',
    'affiliate_program': 'Programa de Afiliados',
    'revenue_dashboard': 'Panel de Ingresos',
    // Seguridad & Control
    'role_based_access': 'Acceso Basado en Roles',
    'multi_user_accounts': 'Cuentas Multi-usuario',
    'audit_logs': 'Registros de Auditoría',
    'activity_history': 'Historial de Actividad',
    'feature_flag_admin_panel': 'Panel de Admin de Feature Flags',
    'backup_restore': 'Copia de Seguridad y Restauración',
    'gdpr_tools': 'Herramientas GDPR',
    // Infraestructura & Dev
    'genkit_flow_guard': 'Guardián de Flujos Genkit',
    'dry_run_mode': 'Modo de Prueba (Dry Run)',
    'pre_change_snapshot': 'Snapshot Pre-cambio',
    'ai_action_logging': 'Registro de Acciones de IA',
    'rollback_manager': 'Gestor de Reversiones',
    'environment_switching': 'Cambio de Entorno',
    'staging_mode': 'Modo de Staging',
    'error_monitoring': 'Monitoreo de Errores',
  },
  en: {
    // Forms
    'business-evaluation': 'Business Evaluation (Doctor RX)',
    'brief-marketing': 'Professional Marketing Brief',
    'agent-training': 'AI Agent Training',
    'satisfaction-survey': 'Satisfaction Survey',
    // AI & Automation
    'ai_content_generation': 'AI Content Generation',
    'ai_campaign_planner': 'AI Campaign Planner',
    'ai_marketing_assistant': 'AI Marketing Assistant',
    'ai_business_diagnosis': 'AI Business Diagnosis',
    'ai_form_auto_builder': 'AI Form Auto-Builder',
    'ai_copywriting_longform': 'AI Long-form Copywriting',
    'ai_multilingual_generation': 'AI Multilingual Generation',
    'ai_image_generation': 'AI Image Generation',
    'ai_content_scheduler': 'AI Content Scheduler',
    'ai_insights_and_recommendations': 'AI Insights & Recommendations',
    // Editor & UX
    'visual_editor_v2': 'Visual Editor V2',
    'drag_and_drop_sections': 'Drag & Drop Sections',
    'block_based_content': 'Block-based Content',
    'advanced_layout_controls': 'Advanced Layout Controls',
    'dark_mode_editor': 'Dark Mode Editor',
    'real_time_preview': 'Real-time Preview',
    'inline_editing': 'Inline Editing',
    'undo_redo_history': 'Undo/Redo History',
    'content_versioning': 'Content Versioning',
    'export_site_json': 'Export Site (JSON)',
    // Web & Publishing
    'custom_domains': 'Custom Domains',
    'subdomain_mapping': 'Subdomain Mapping',
    'seo_advanced_controls': 'Advanced SEO Controls',
    'meta_tags_manager': 'Meta Tags Manager',
    'analytics_integration': 'Analytics Integration',
    'cookie_consent_manager': 'Cookie Consent Manager',
    'cdn_optimization': 'CDN Optimization',
    'performance_auto_optimize': 'Performance Auto-optimize',
    // Marketing & Growth
    'lead_capture_forms': 'Lead Capture Forms',
    'funnels_builder': 'Funnels Builder',
    'email_marketing_basic': 'Basic Email Marketing',
    'email_marketing_advanced': 'Advanced Email Marketing',
    'whatsapp_integration': 'WhatsApp Integration',
    'crm_light': 'Light CRM',
    'campaign_tracking': 'Campaign Tracking',
    'utm_manager': 'UTM Manager',
    'ab_testing': 'A/B Testing',
    // Monetization & Payments
    'pricing_pages': 'Pricing Pages',
    'subscription_management': 'Subscription Management',
    'one_time_payments': 'One-time Payments',
    'payment_links': 'Payment Links',
    'invoicing': 'Invoicing',
    'discounts_coupons': 'Discounts & Coupons',
    'affiliate_program': 'Affiliate Program',
    'revenue_dashboard': 'Revenue Dashboard',
    // Security & Control
    'role_based_access': 'Role-based Access',
    'multi_user_accounts': 'Multi-user Accounts',
    'audit_logs': 'Audit Logs',
    'activity_history': 'Activity History',
    'feature_flag_admin_panel': 'Feature Flag Admin Panel',
    'backup_restore': 'Backup & Restore',
    'gdpr_tools': 'GDPR Tools',
    // Infrastructure & Dev
    'genkit_flow_guard': 'Genkit Flow Guard',
    'dry_run_mode': 'Dry Run Mode',
    'pre_change_snapshot': 'Pre-change Snapshot',
    'ai_action_logging': 'AI Action Logging',
    'rollback_manager': 'Rollback Manager',
    'environment_switching': 'Environment Switching',
    'staging_mode': 'Staging Mode',
    'error_monitoring': 'Error Monitoring',
  },
  fr: {
    // Forms
    'business-evaluation': 'Évaluation d\'Entreprise (Docteur RX)',
    'brief-marketing': 'Brief de Marketing Professionnel',
    'agent-training': 'Formation d\'Agent IA',
    'satisfaction-survey': 'Enquête de Satisfaction',
    // Add other French translations if needed
  }
}


const SortableProductItem = ({ product, children }: { product: Product, children: React.ReactNode }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: product.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="flex items-center gap-2">
        <button {...listeners} className="cursor-grab p-2 text-muted-foreground hover:bg-muted rounded-md">
          <GripVertical />
        </button>
        <div className="flex-grow">{children}</div>
      </div>
    </div>
  );
};

export default function ProductsEditorPage() {
  const { site, setSite } = useSite();
  const { language } = useLanguage();
  const langCode = language.code as keyof MultilingualString;
  const t = labels[langCode] || labels.en;
  const featureTranslations = featureNames[langCode] || featureNames.en;
  const [openAccordionItem, setOpenAccordionItem] = useState<string | undefined>();
  
  const handleUpdate = (updater: (currentDraft: SiteData) => SiteData) => {
    setSite(updater);
  };
  
  const handleProductUpdate = (id: string, field: keyof Product, value: any, isMultilingual: boolean) => {
    handleUpdate(prev => ({
      ...prev,
      products: prev.products.map(p => {
        if (p.id === id) {
          if (isMultilingual) {
            const multilingualValue = p[field as keyof Product] as MultilingualString;
            return { ...p, [field]: { ...multilingualValue, [langCode]: value } };
          }
          return { ...p, [field]: value };
        }
        return p;
      })
    }));
  };

  const handleFeatureToggle = (productId: string, featureFlag: string, enabled: boolean) => {
    handleUpdate(prev => ({
        ...prev,
        products: prev.products.map(p => {
            if (p.id === productId) {
                const newFeatures = enabled
                    ? [...p.features, featureFlag]
                    : p.features.filter(f => f !== featureFlag);
                return { ...p, features: newFeatures };
            }
            return p;
        })
    }));
  };

  const addNewProduct = () => {
    const newId = `prod_${Date.now()}`;
    const newProduct: Product = {
        id: newId,
        visible: true,
        name: { en: 'New Plan', es: 'Nuevo Plan', fr: 'Nouveau Forfait' },
        type: 'one',
        price: 100,
        badge: { en: 'New', es: 'Nuevo', fr: 'Nouveau' },
        note: { en: 'A short description.', es: 'Una breve descripción.', fr: 'Une courte description.' },
        description: { en: 'Detailed description of the new plan.', es: 'Descripción detallada del nuevo plan.', fr: 'Description détaillée du nouveau forfait.' },
        features: []
    };
    handleUpdate(prev => ({ ...prev, products: [newProduct, ...prev.products] }));
    setOpenAccordionItem(newId);
  };

  const removeProduct = (id: string) => {
    handleUpdate(prev => ({ ...prev, products: prev.products.filter(p => p.id !== id) }));
  }
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      handleUpdate(prevSite => {
        const oldIndex = prevSite.products.findIndex(p => p.id === active.id);
        const newIndex = prevSite.products.findIndex(p => p.id === over.id);
        return {
          ...prevSite,
          products: arrayMove(prevSite.products, oldIndex, newIndex),
        };
      });
    }
  };
  
  const allFeatureFlags = Object.keys(FEATURE_FLAGS);
  const formFeatures = allFeatureFlags.filter(flag => ['business-evaluation', 'brief-marketing', 'agent-training', 'satisfaction-survey'].includes(flag));
  const platformFeatures = allFeatureFlags.filter(flag => !formFeatures.includes(flag));

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
          <div>
            <h1 className="font-headline text-3xl font-bold">{t.pageTitle}</h1>
            <p className="text-muted-foreground">{t.pageSubtitle}</p>
          </div>
          <Button onClick={addNewProduct} variant="outline">
              <PlusCircle className="mr-2" />
              {t.addProduct}
          </Button>
      </header>

      <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>{`${t.editingLanguage} ${language.name}`}</AlertTitle>
      </Alert>

      <Card>
        <CardContent className="p-0">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={site.products.map(p => p.id)} strategy={verticalListSortingStrategy}>
              <Accordion 
                  type="single" 
                  collapsible 
                  className="w-full"
                  value={openAccordionItem}
                  onValueChange={setOpenAccordionItem}
              >
                {site.products.map(product => (
                  <SortableProductItem key={product.id} product={product}>
                    <AccordionItem value={product.id} className="border-b last:border-b-0">
                        <div className="flex items-center justify-between px-6 py-4 hover:bg-muted/50">
                            <AccordionTrigger className="flex-1 text-left p-0 hover:no-underline">
                                <div>
                                    <p className="font-semibold">{product.name[langCode] || product.name.en}</p>
                                    <p className="text-sm text-muted-foreground">{t.productTypes[product.type]}</p>
                                </div>
                            </AccordionTrigger>
                            <div className="flex items-center gap-4 pl-4">
                                <Switch
                                    id={`visible-${product.id}`}
                                    checked={product.visible}
                                    onCheckedChange={(checked) => handleProductUpdate(product.id, 'visible', checked, false)}
                                    aria-label={t.visible}
                                />
                                <Label htmlFor={`visible-${product.id}`} className="text-sm font-normal text-muted-foreground">
                                    {product.visible ? <Eye className="h-4 w-4"/> : <EyeOff className="h-4 w-4"/>}
                                </Label>
                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive flex-shrink-0" onClick={() => removeProduct(product.id)}>
                                    <Trash2 />
                                </Button>
                            </div>
                        </div>
                        <AccordionContent>
                          <div className="p-6 pt-2 space-y-4 bg-muted/20">
                              <div><Label>{t.nameLabel}</Label>
                                <Input 
                                  value={product.name[langCode]} 
                                  onChange={e => handleProductUpdate(product.id, 'name', e.target.value, true)} 
                                />
                              </div>

                              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                                <div><Label>{t.typeLabel}</Label>
                                    <Select value={product.type} onValueChange={(v) => handleProductUpdate(product.id, 'type', v, false)}>
                                        <SelectTrigger><SelectValue/></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="one">{t.productTypes.one}</SelectItem>
                                            <SelectItem value="sub">{t.productTypes.sub}</SelectItem>
                                            <SelectItem value="info">{t.productTypes.info}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div><Label>{t.priceLabel}</Label><Input type="number" value={product.price} onChange={e => handleProductUpdate(product.id, 'price', Number(e.target.value), false)} /></div>
                                <div><Label>{t.badgeLabel}</Label><Input value={product.badge[langCode]} onChange={e => handleProductUpdate(product.id, 'badge', e.target.value, true)} /></div>
                              </div>
                              <div><Label>{t.noteLabel}</Label><Input value={product.note[langCode]} onChange={e => handleProductUpdate(product.id, 'note', e.target.value, true)} /></div>
                              <div>
                                <Label>{t.fullDescLabel}</Label>
                                <Textarea value={product.description[langCode]} onChange={e => handleProductUpdate(product.id, 'description', e.target.value, true)} rows={4} />
                              </div>
                              
                              <Separator className="my-6 bg-border" />

                              <div>
                                <h4 className="font-semibold text-md mb-4 flex items-center gap-2"><FileText className="h-5 w-5 text-accent"/> {t.includedFeaturesTitle}</h4>
                                
                                {formFeatures.length > 0 && (
                                    <div className='mb-4'>
                                        <h5 className="font-medium text-sm text-muted-foreground mb-2">{t.formFeaturesTitle}</h5>
                                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                                            {formFeatures.map(flag => (
                                                <div key={flag} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`feature-${product.id}-${flag}`}
                                                        checked={product.features.includes(flag)}
                                                        onCheckedChange={(checked) => handleFeatureToggle(product.id, flag, !!checked)}
                                                    />
                                                    <label
                                                      htmlFor={`feature-${product.id}-${flag}`}
                                                      className="text-sm font-medium text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
                                                    >
                                                      {featureTranslations[flag as keyof typeof featureTranslations] || flag}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {platformFeatures.length > 0 && (
                                     <div>
                                        <h5 className="font-medium text-sm text-muted-foreground mb-2">{t.platformFeaturesTitle}</h5>
                                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                                            {platformFeatures.map(flag => (
                                                <div key={flag} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`feature-${product.id}-${flag}`}
                                                        checked={product.features.includes(flag)}
                                                        onCheckedChange={(checked) => handleFeatureToggle(product.id, flag, !!checked)}
                                                    />
                                                    <label
                                                      htmlFor={`feature-${product.id}-${flag}`}
                                                      className="text-sm font-medium text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
                                                    >
                                                      {featureTranslations[flag as keyof typeof featureTranslations] || flag}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                              </div>
                          </div>
                        </AccordionContent>
                    </AccordionItem>
                  </SortableProductItem>
                ))}
              </Accordion>
            </SortableContext>
          </DndContext>
        </CardContent>
      </Card>
    </div>
  );
}

    