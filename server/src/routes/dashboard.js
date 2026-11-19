import { Router } from 'express';
import { pool } from '../db/pool.js';
import { allowRoles } from '../middleware/auth.js';
const router=Router();
router.get('/summary',allowRoles('support','admin'),async(req,res)=>{
 try {
  const q=await pool.query(`SELECT COUNT(*)::int AS total,
   COUNT(*) FILTER(WHERE status='Open')::int AS open,
   COUNT(*) FILTER(WHERE status='In Progress')::int AS in_progress,
   COUNT(*) FILTER(WHERE status='Resolved')::int AS resolved,
   COUNT(*) FILTER(WHERE due_at<NOW() AND status NOT IN ('Resolved','Closed'))::int AS overdue
   FROM service_requests`);
  const cats=await pool.query('SELECT category,COUNT(*)::int AS count FROM service_requests GROUP BY category ORDER BY category');
  res.json({...q.rows[0],byCategory:cats.rows});
 } catch(e){res.status(500).json({message:'Could not load dashboard'});}
});
router.get('/activity',allowRoles('support','admin'),async(req,res)=>{
 try {
  const q=await pool.query(`SELECT l.*,u.name AS actor_name FROM activity_logs l LEFT JOIN users u ON u.id=l.actor_id ORDER BY l.created_at DESC LIMIT 30`);
  res.json(q.rows);
 }catch(e){res.status(500).json({message:'Could not load activity'});}
});
router.get('/agents',allowRoles('support','admin'),async(req,res)=>{
 try {const q=await pool.query("SELECT id,name,email FROM users WHERE role IN ('support','admin') ORDER BY name");res.json(q.rows);}
 catch(e){res.status(500).json({message:'Could not load agents'});}
});
export default router;
