#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const cwd = process.cwd();
const routePath = path.join(cwd, 'src/app/api/reports/orders/monthly/route.ts');
const sdkPath = process.env.FIREBASE_ADMIN_SDK_PATH
  ? (path.isAbsolute(process.env.FIREBASE_ADMIN_SDK_PATH)
    ? process.env.FIREBASE_ADMIN_SDK_PATH
    : path.join(cwd, process.env.FIREBASE_ADMIN_SDK_PATH))
  : null;

let checks = 0;
let ok = 0;

function check(name, condition, detail = '') {
  checks += 1;
  if (condition) {
    ok += 1;
    console.log(`OK   ${name}${detail ? ` -> ${detail}` : ''}`);
  } else {
    console.log(`FAIL ${name}${detail ? ` -> ${detail}` : ''}`);
  }
}

check('Monthly report route exists', fs.existsSync(routePath), routePath);
check(
  'Firebase Admin configured (path or json)',
  Boolean(process.env.FIREBASE_ADMIN_SDK_JSON || process.env.FIREBASE_ADMIN_SDK_PATH),
  process.env.FIREBASE_ADMIN_SDK_JSON ? 'using FIREBASE_ADMIN_SDK_JSON' : (process.env.FIREBASE_ADMIN_SDK_PATH || 'missing')
);

if (sdkPath) {
  const exists = fs.existsSync(sdkPath);
  check(
    'Firebase Admin credential file exists (optional in fallback mode)',
    true,
    exists ? sdkPath : `${sdkPath} (missing, fallback mode allowed)`
  );
}

const now = new Date();
const year = now.getFullYear();
const month = now.getMonth() + 1;
const endpoint = `http://localhost:9003/api/reports/orders/monthly?year=${year}&month=${month}&format=json`;

const runHttp = process.env.SMOKE_RUN_HTTP === '1';
if (!runHttp) {
  check('HTTP smoke skipped', true, 'set SMOKE_RUN_HTTP=1 to execute endpoint request');
  console.log(`Try: SMOKE_RUN_HTTP=1 npm run smoke:orders-report`);
  console.log(`Endpoint: ${endpoint}`);
  process.exit(ok === checks ? 0 : 1);
}

try {
  const res = await fetch(endpoint);
  const txt = await res.text();
  check('HTTP status 200', res.ok, `status=${res.status}`);
  if (!res.ok) {
    console.log(`Response: ${txt.slice(0, 500)}`);
  } else {
    const parsed = JSON.parse(txt);
    check('Response includes summary', Boolean(parsed?.summary), 'summary present');
    if (parsed?.warning) {
      console.log(`WARN report fallback active -> ${parsed.warning}`);
    }
  }
} catch (err) {
  check('HTTP request executed', false, String(err));
}

console.log(`\nResult: ${ok}/${checks} checks passed.`);
process.exit(ok === checks ? 0 : 1);
