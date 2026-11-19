import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './pool.js';
const here = path.dirname(fileURLToPath(import.meta.url));
const sql = fs.readFileSync(path.resolve(here, '../../migrations/001_init.sql'), 'utf8');
try { await pool.query(sql); console.log('Database migration completed.'); }
catch (e) { console.error('Migration failed:', e.message); process.exitCode = 1; }
finally { await pool.end(); }
