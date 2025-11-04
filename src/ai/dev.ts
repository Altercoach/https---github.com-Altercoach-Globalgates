'use client';

import { config } from 'dotenv';
config();

import '@/ai/flows/translate-site-content.ts';
import '@/ai/flows/recommend-plan-flow.ts';
import '@/ai/flows/analyze-business-evaluation.ts';
import '@/ai/flows/generate-agent-prompt.ts';
import '@/ai/flows/chat-flow.ts';
import '@/ai/flows/generate-content-schedule-flow.ts';
