import bcrypt from 'bcryptjs';
import { pool } from './pool.js';
const demoPassword = await bcrypt.hash('Demo@123', 10);
try {
  const people = [
    ['Aarav Admin','admin@arrowstack.demo','admin','Operations'],
    ['Sana Support','support@arrowstack.demo','support','IT'],
    ['Riya Employee','employee@arrowstack.demo','employee','Marketing']
  ];
  for (const [name,email,role,department] of people) {
    await pool.query(
      `INSERT INTO users(name,email,password_hash,role,department) VALUES($1,$2,$3,$4,$5)
       ON CONFLICT(email) DO NOTHING`, [name,email,demoPassword,role,department]
    );
  }
  const emp = await pool.query("SELECT id FROM users WHERE email='employee@arrowstack.demo'");
  const support = await pool.query("SELECT id FROM users WHERE email='support@arrowstack.demo'");
  const count = await pool.query('SELECT COUNT(*)::int AS n FROM service_requests');
  if (count.rows[0].n === 0) {
    await pool.query(
      `INSERT INTO service_requests(title,description,category,priority,status,requester_id,assignee_id,due_at)
       VALUES
       ('Laptop VPN is not connecting','VPN disconnects immediately after sign-in. Please help me access internal tools.','IT','High','Open',$1,NULL,NOW()+INTERVAL '8 hours'),
       ('Update employee contact details','My office extension has changed. Please update the directory.','HR','Low','In Progress',$1,$2,NOW()+INTERVAL '3 days'),
       ('Meeting room projector issue','Projector in meeting room B is not displaying HDMI input.','Facilities','Medium','Waiting for Employee',$1,$2,NOW()+INTERVAL '2 days')`,
      [emp.rows[0].id,support.rows[0].id]
    );
  }
  console.log('Seed complete. Demo password: Demo@123');
} catch(e) { console.error('Seed failed:',e.message); process.exitCode=1; }
finally { await pool.end(); }
