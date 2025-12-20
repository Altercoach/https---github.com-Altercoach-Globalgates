/**
 * @fileoverview This file contains all the feature flags available in the application.
 * These flags control access to different functionalities and are assigned to specific
 * plans in the site content configuration.
 */

export const FEATURE_FLAGS = {
  // 🧠 IA & Automation
  AI_CONTENT_GENERATION: 'ai_content_generation',
  AI_CAMPAIGN_PLANNER: 'ai_campaign_planner',
  AI_MARKETING_ASSISTANT: 'ai_marketing_assistant',
  AI_BUSINESS_DIAGNOSIS: 'ai_business_diagnosis',
  AI_FORM_AUTO_BUILDER: 'ai_form_auto_builder',
  AI_COPYWRITING_LONGFORM: 'ai_copywriting_longform',
  AI_MULTILINGUAL_GENERATION: 'ai_multilingual_generation',
  AI_IMAGE_GENERATION: 'ai_image_generation',
  AI_CONTENT_SCHEDULER: 'ai_content_scheduler',
  AI_INSIGHTS_AND_RECOMMENDATIONS: 'ai_insights_and_recommendations',

  // 🧩 Editor & UX
  VISUAL_EDITOR_V2: 'visual_editor_v2',
  DRAG_AND_DROP_SECTIONS: 'drag_and_drop_sections',
  BLOCK_BASED_CONTENT: 'block_based_content',
  ADVANCED_LAYOUT_CONTROLS: 'advanced_layout_controls',
  DARK_MODE_EDITOR: 'dark_mode_editor',
  REAL_TIME_PREVIEW: 'real_time_preview',
  INLINE_EDITING: 'inline_editing',
  UNDO_REDO_HISTORY: 'undo_redo_history',
  CONTENT_VERSIONING: 'content_versioning',
  EXPORT_SITE_JSON: 'export_site_json',

  // 🌐 Web & Publishing
  CUSTOM_DOMAINS: 'custom_domains',
  SUBDOMAIN_MAPPING: 'subdomain_mapping',
  SEO_ADVANCED_CONTROLS: 'seo_advanced_controls',
  META_TAGS_MANAGER: 'meta_tags_manager',
  ANALYTICS_INTEGRATION: 'analytics_integration',
  COOKIE_CONSENT_MANAGER: 'cookie_consent_manager',
  CDN_OPTIMIZATION: 'cdn_optimization',
  PERFORMANCE_AUTO_OPTIMIZE: 'performance_auto_optimize',

  // 📊 Marketing & Growth
  LEAD_CAPTURE_FORMS: 'lead_capture_forms',
  FUNNELS_BUILDER: 'funnels_builder',
  EMAIL_MARKETING_BASIC: 'email_marketing_basic',
  EMAIL_MARKETING_ADVANCED: 'email_marketing_advanced',
  WHATSAPP_INTEGRATION: 'whatsapp_integration',
  CRM_LIGHT: 'crm_light',
  CAMPAIGN_TRACKING: 'campaign_tracking',
  UTM_MANAGER: 'utm_manager',
  AB_TESTING: 'ab_testing',

  // 🧾 Monetization & Payments
  PRICING_PAGES: 'pricing_pages',
  SUBSCRIPTION_MANAGEMENT: 'subscription_management',
  ONE_TIME_PAYMENTS: 'one_time_payments',
  PAYMENT_LINKS: 'payment_links',
  INVOICING: 'invoicing',
  DISCOUNTS_COUPONS: 'discounts_coupons',
  AFFILIATE_PROGRAM: 'affiliate_program',
  REVENUE_DASHBOARD: 'revenue_dashboard',

  // 🔐 Security & Control
  ROLE_BASED_ACCESS: 'role_based_access',
  MULTI_USER_ACCOUNTS: 'multi_user_accounts',
  AUDIT_LOGS: 'audit_logs',
  ACTIVITY_HISTORY: 'activity_history',
  FEATURE_FLAG_ADMIN_PANEL: 'feature_flag_admin_panel',
  BACKUP_RESTORE: 'backup_restore',
  GDPR_TOOLS: 'gdpr_tools',

  // ⚙️ Infrastructure & Dev
  GENKIT_FLOW_GUARD: 'genkit_flow_guard',
  DRY_RUN_MODE: 'dry_run_mode',
  PRE_CHANGE_SNAPSHOT: 'pre_change_snapshot',
  AI_ACTION_LOGGING: 'ai_action_logging',
  ROLLBACK_MANAGER: 'rollback_manager',
  ENVIRONMENT_SWITCHING: 'environment_switching',
  STAGING_MODE: 'staging_mode',
  ERROR_MONITORING: 'error_monitoring',

  // Specific Questionnaire Flags
  'business-evaluation': 'business-evaluation',
  'brief-marketing': 'brief-marketing',
  'agent-training': 'agent-training',
  'satisfaction-survey': 'satisfaction-survey',
};
