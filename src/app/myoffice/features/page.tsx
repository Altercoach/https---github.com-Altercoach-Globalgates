"use client";

import { useFeatureFlags } from '@/contexts/feature-flag-context';
import { FEATURE_FLAGS } from '@/lib/feature-flags';
import { RouteGuard } from '@/components/auth/route-guard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

const featureGroups = [
  { title: '🧠 IA & Automatización', keys: [
    'AI_CONTENT_GENERATION', 'AI_CAMPAIGN_PLANNER', 'AI_MARKETING_ASSISTANT', 'AI_BUSINESS_DIAGNOSIS', 'AI_FORM_AUTO_BUILDER', 'AI_COPYWRITING_LONGFORM', 'AI_MULTILINGUAL_GENERATION', 'AI_IMAGE_GENERATION', 'AI_CONTENT_SCHEDULER', 'AI_INSIGHTS_AND_RECOMMENDATIONS'] },
  { title: '🧩 Editor & UX', keys: [
    'VISUAL_EDITOR_V2', 'DRAG_AND_DROP_SECTIONS', 'BLOCK_BASED_CONTENT', 'ADVANCED_LAYOUT_CONTROLS', 'DARK_MODE_EDITOR', 'REAL_TIME_PREVIEW', 'INLINE_EDITING', 'UNDO_REDO_HISTORY', 'CONTENT_VERSIONING', 'EXPORT_SITE_JSON'] },
  { title: '🌐 Web & Publicación', keys: [
    'CUSTOM_DOMAINS', 'SUBDOMAIN_MAPPING', 'SEO_ADVANCED_CONTROLS', 'META_TAGS_MANAGER', 'ANALYTICS_INTEGRATION', 'COOKIE_CONSENT_MANAGER', 'CDN_OPTIMIZATION', 'PERFORMANCE_AUTO_OPTIMIZE'] },
  { title: '📊 Marketing & Growth', keys: [
    'LEAD_CAPTURE_FORMS', 'FUNNELS_BUILDER', 'EMAIL_MARKETING_BASIC', 'EMAIL_MARKETING_ADVANCED', 'WHATSAPP_INTEGRATION', 'CRM_LIGHT', 'CAMPAIGN_TRACKING', 'UTM_MANAGER', 'AB_TESTING'] },
  { title: '🧾 Monetización & Pagos', keys: [
    'PRICING_PAGES', 'SUBSCRIPTION_MANAGEMENT', 'ONE_TIME_PAYMENTS', 'PAYMENT_LINKS', 'INVOICING', 'DISCOUNTS_COUPONS', 'AFFILIATE_PROGRAM', 'REVENUE_DASHBOARD'] },
  { title: '🔐 Seguridad & Control', keys: [
    'ROLE_BASED_ACCESS', 'MULTI_USER_ACCOUNTS', 'AUDIT_LOGS', 'ACTIVITY_HISTORY', 'FEATURE_FLAG_ADMIN_PANEL', 'BACKUP_RESTORE', 'GDPR_TOOLS'] },
  { title: '⚙️ Infraestructura & Dev', keys: [
    'GENKIT_FLOW_GUARD', 'DRY_RUN_MODE', 'PRE_CHANGE_SNAPSHOT', 'AI_ACTION_LOGGING', 'ROLLBACK_MANAGER', 'ENVIRONMENT_SWITCHING', 'STAGING_MODE', 'ERROR_MONITORING'] },
  { title: '📝 Cuestionarios', keys: [
    'business-evaluation', 'brief-marketing', 'agent-training', 'satisfaction-survey'] },
];

export default function FeatureFlagAdminPanel() {
  const { enabledFlags, isFeatureEnabled, setFeatureFlag, toggleFeatureFlag } = useFeatureFlags();
  const [search, setSearch] = useState('');

  return (
    <RouteGuard requireAuth requireRole="admin">
      <div className="max-w-3xl mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Panel de Features (Admin)</CardTitle>
            <input
              type="text"
              placeholder="Buscar feature..."
              className="mt-2 w-full rounded border px-2 py-1 text-sm"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </CardHeader>
          <CardContent className="space-y-6">
            {featureGroups.map(group => {
              const filteredKeys = group.keys.filter(key => {
                const name = FEATURE_FLAGS[key as keyof typeof FEATURE_FLAGS] || key;
                return name.toLowerCase().includes(search.toLowerCase()) || key.toLowerCase().includes(search.toLowerCase());
              });
              if (filteredKeys.length === 0) return null;
              return (
                <div key={group.title}>
                  <h3 className="font-semibold mb-2 text-accent-foreground">{group.title}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {filteredKeys.map(key => (
                      <div key={key} className="flex items-center gap-2 p-2 rounded hover:bg-muted transition">
                        <Switch
                          id={key}
                          checked={!!isFeatureEnabled(key)}
                          onCheckedChange={val => setFeatureFlag(key, val)}
                        />
                        <Label htmlFor={key} className="cursor-pointer">
                          {FEATURE_FLAGS[key as keyof typeof FEATURE_FLAGS] || key}
                        </Label>
                        <span className="text-xs text-muted-foreground">({key})</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </RouteGuard>
  );
}
