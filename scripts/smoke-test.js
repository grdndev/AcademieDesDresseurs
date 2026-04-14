za  #!/usr/bin/env node
// Simple smoke test for backend endpoints from host or container
// Usage: node scripts/smoke-test.js --mode=host|container

const endpoints = [
  '/health',
  '/api/cards',
  '/api/decks',
  '/api/accessories',
  '/api/cards/popular/list',
  '/api/cards/new/list',
  '/api/orders'
];

const args = process.argv.slice(2);
const modeArg = args.find(a => a.startsWith('--mode='));
const mode = modeArg ? modeArg.split('=')[1] : 'host';

const base = mode === 'container' ? 'http://api:5001' : 'http://localhost:5001';

async function check(url) {
  try {
    const res = await fetch(url, { method: 'GET' });
    const text = await res.text();
    const truncated = text.length > 800 ? text.slice(0, 800) + '... (truncated)' : text;
    console.log(`${url} -> ${res.status}`);
    console.log(truncated);
    console.log('--------------------------------------------------');
  } catch (err) {
    console.error(`${url} -> ERROR: ${err.message}`);
    console.log('--------------------------------------------------');
  }
}

(async () => {
  console.log(`Smoke test mode: ${mode} (base: ${base})\n`);
  for (const ep of endpoints) {
    await check(base + ep);
  }
})();
