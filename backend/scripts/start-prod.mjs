import { execSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const uploadDir = join(process.cwd(), 'uploads');
mkdirSync(uploadDir, { recursive: true });

const run = (cmd) => {
  console.log(`[start-prod] > ${cmd}`);
  execSync(cmd, { stdio: 'inherit', env: process.env });
};

try {
  run('npx prisma migrate deploy --schema=prisma/schema.prisma');
} catch (err) {
  console.error('[start-prod] prisma migrate deploy failed', err);
  process.exit(1);
}

try {
  run('node prisma/seed.mjs');
} catch (err) {
  console.warn('[start-prod] seed skipped/failed (non-fatal):', err?.message ?? err);
}

console.log('[start-prod] launching API...');
await import('../dist/main.js');
