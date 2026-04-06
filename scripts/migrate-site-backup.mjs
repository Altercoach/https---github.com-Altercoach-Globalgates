#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const [, , inputPath, outputPath] = process.argv;

if (!inputPath) {
  console.error('Uso: node scripts/migrate-site-backup.mjs <input.json> [output.json]');
  process.exit(1);
}

const resolvedInput = path.resolve(process.cwd(), inputPath);
if (!fs.existsSync(resolvedInput)) {
  console.error(`No existe el archivo de entrada: ${resolvedInput}`);
  process.exit(1);
}

const raw = fs.readFileSync(resolvedInput, 'utf8');
let parsed;
try {
  parsed = JSON.parse(raw);
} catch {
  console.error('El archivo no es JSON valido.');
  process.exit(1);
}

const site = parsed?.site ?? parsed;
if (!site || typeof site !== 'object') {
  console.error('El JSON no contiene un objeto de configuracion valido en "site" ni en raiz.');
  process.exit(1);
}

if (!site.brand || !site.agentPersona || !Array.isArray(site.products) || !Array.isArray(site.services)) {
  console.error('La configuracion no cumple estructura minima (brand, agentPersona, products, services).');
  process.exit(1);
}

const migrated = {
  exportedAt: new Date().toISOString(),
  version: 1,
  site,
};

const finalOutput = outputPath
  ? path.resolve(process.cwd(), outputPath)
  : path.resolve(process.cwd(), `${path.basename(inputPath, path.extname(inputPath))}.migrated.json`);

fs.writeFileSync(finalOutput, `${JSON.stringify(migrated, null, 2)}\n`, 'utf8');
console.log(`Backup migrado generado en: ${finalOutput}`);
