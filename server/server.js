// ===== 202f Academy — Express progress sync server =====
// Runs on port 8787 (dev) or PORT env (production).
// Endpoints consumed by src/lib/sync.ts:
//   GET    /api/progress/:deviceId
//   PUT    /api/progress/:deviceId  {state}
//   DELETE /api/progress/:deviceId

import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const PORT = Number(process.env.PORT) || 8787;
const HOST = process.env.HOST || '0.0.0.0';
const DATA_FILE = process.env.DATA_FILE || './data/progress.json';
const MAX_BYTES = Number(process.env.MAX_BYTES) || 262144;
const ALLOW_ORIGIN = process.env.ALLOW_ORIGIN || '*';
const DIST_DIR = process.env.DIST_DIR || path.join(__dirname, '..', 'dist');

const app = express();

app.use(cors({ origin: ALLOW_ORIGIN, methods: ['GET', 'PUT', 'DELETE', 'OPTIONS'] }));
app.use(express.json({ limit: `${MAX_BYTES}b` }));

// In-memory + file storage
let devices = new Map();
let writeQueue = Promise.resolve();

function ensureDataDir() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function loadDevices() {
  try {
    ensureDataDir();
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      devices = new Map(parsed.devices || []);
      return;
    }
  } catch (e) {
    console.warn('Could not load progress data:', e.message);
  }
  devices = new Map();
}

function saveDevices() {
  ensureDataDir();
  const tmp = DATA_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify({ devices: Array.from(devices.entries()) }, null, 2));
  fs.renameSync(tmp, DATA_FILE);
}

// Health
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: '202f-barista-os', devices: devices.size, uptime: process.uptime() });
});

// Get progress for a device
app.get('/api/progress/:id', (req, res) => {
  const { id } = req.params;
  if (!id || id.length < 4) {
    return res.status(400).json({ ok: false, error: 'invalid_id' });
  }
  const state = devices.get(id) || null;
  res.json({ ok: true, state, updatedAt: new Date().toISOString() });
});

// Save progress for a device (atomic write via queue)
app.put('/api/progress/:id', (req, res) => {
  const { id } = req.params;
  const { state } = req.body || {};
  if (!id || id.length < 4) {
    return res.status(400).json({ ok: false, error: 'invalid_id' });
  }
  if (!state || typeof state !== 'object') {
    return res.status(400).json({ ok: false, error: 'invalid_state' });
  }

  writeQueue = writeQueue.then(() => {
    devices.set(id, state);
    saveDevices();
    return res.json({ ok: true, updatedAt: new Date().toISOString(), devices: devices.size });
  }).catch((err) => {
    console.error('Write error:', err);
    if (!res.headersSent) {
      res.status(500).json({ ok: false, error: 'write_failed' });
    }
  });
});

// Delete device progress
app.delete('/api/progress/:id', (req, res) => {
  const { id } = req.params;
  if (!id || id.length < 4) {
    return res.status(400).json({ ok: false, error: 'invalid_id' });
  }
  const had = devices.delete(id);
  if (had) saveDevices();
  res.json({ ok: true });
});

// SPA fallback — serve built dist if present
if (fs.existsSync(path.join(DIST_DIR, 'index.html'))) {
  app.use(express.static(DIST_DIR));
  app.get(/^\/(?!api\/).*/, (_req, res) => {
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
} else {
  app.get('/api', (_req, res) => {
    res.json({ ok: true, service: '202f-barista-os', note: 'API only; dist not built' });
  });
}

loadDevices();

app.listen(PORT, HOST, () => {
  console.log(`202f barista-os sync server listening on http://${HOST}:${PORT}`);
});

export default app;