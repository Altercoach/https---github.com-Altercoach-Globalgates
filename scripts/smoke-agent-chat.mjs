#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';

const root = process.cwd();
const envPath = path.join(root, '.env.local');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

const checks = [];

const requireFile = (relativePath, description) => {
  const full = path.join(root, relativePath);
  const exists = fs.existsSync(full);
  checks.push({ ok: exists, label: `${description}: ${relativePath}` });
  return exists;
};

const fileHas = (relativePath, text, description) => {
  const full = path.join(root, relativePath);
  if (!fs.existsSync(full)) {
    checks.push({ ok: false, label: `${description}: archivo no existe (${relativePath})` });
    return;
  }
  const content = fs.readFileSync(full, 'utf8');
  checks.push({ ok: content.includes(text), label: `${description}: ${relativePath}` });
};

requireFile('src/app/(main)/chat/[slug]/page.tsx', 'Ruta compartible de chat existe');
fileHas('src/app/myoffice/agent/page.tsx', '/chat', 'MyOffice agent usa ruta /chat');
fileHas('src/app/dashboard/agent/page.tsx', '/chat', 'Dashboard agent usa ruta /chat');

const hasForeignDomain = (() => {
  const files = [
    'src/app/myoffice/agent/page.tsx',
    'src/app/dashboard/agent/page.tsx',
  ];
  for (const f of files) {
    const full = path.join(root, f);
    if (!fs.existsSync(full)) continue;
    const content = fs.readFileSync(full, 'utf8');
    if (content.includes('goldenkey.agency')) return true;
  }
  return false;
})();
checks.push({ ok: !hasForeignDomain, label: 'No hay dominio ajeno hardcodeado (goldenkey.agency)' });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
checks.push({ ok: !!siteUrl, label: 'NEXT_PUBLIC_SITE_URL esta definido en entorno' });
if (siteUrl) {
  checks.push({ ok: /^https:\/\//.test(siteUrl), label: 'NEXT_PUBLIC_SITE_URL usa https' });
}

const failed = checks.filter(c => !c.ok);
for (const c of checks) {
  console.log(`${c.ok ? 'OK' : 'FAIL'} - ${c.label}`);
}

if (failed.length > 0) {
  console.error(`\nSmoke test fallo con ${failed.length} validacion(es).`);
  process.exit(1);
}

console.log('\nSmoke test de agente/chat completado correctamente.');
