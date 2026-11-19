import { Router } from 'express';
import { pool } from '../db/pool.js';
import { allowRoles } from '../middleware/auth.js';
import { slaHours } from '../utils/sla.js';
const router = Router();
const staff = ['support','admin'];
router.get('/', async (req,res) => {
  try {
    const params=[];
    let where='';
    if (req.user.role==='employee') { params.push(req.user.id); where='WHERE r.requester_id=$1'; }
    const q = await pool.query(
      `SELECT r.*, u.name AS requester_name, a.name AS assignee_name
       FROM service_requests r JOIN users u ON u.id=r.requester_id
       LEFT JOIN users a ON a.id=r.assignee_id ${where}
       ORDER BY r.created_at DESC`,params);
    res.json(q.rows);
  } catch(e) { res.status(500).json({message:'Could not load requests'}); }
});
router.post('/', async (req,res) => {
  const {title,description,category,priority='Medium'}=req.body||{};
  if (!title?.trim() || !description?.trim() || !['IT','HR','Facilities'].includes(category) || !['Low','Medium','High','Urgent'].includes(priority))
    return res.status(400).json({message:'Enter a title, description, valid category and priority'});
  try {
    const due = new Date(Date.now()+slaHours(priority)*3600000);
    const q=await pool.query(
      `INSERT INTO service_requests(title,description,category,priority,requester_id,due_at)
       VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
      [title.trim(),description.trim(),category,priority,req.user.id,due]);
    await pool.query('INSERT INTO activity_logs(actor_id,request_id,action,details) VALUES($1,$2,$3,$4)',
      [req.user.id,q.rows[0].id,'Request created',title.trim()]);
    res.status(201).json(q.rows[0]);
  } catch(e) { res.status(500).json({message:'Could not create request'}); }
});
router.patch('/:id', allowRoles(...staff), async (req,res) => {
  const {status,priority,assignee_id}=req.body||{};
  const statuses=['Open','In Progress','Waiting for Employee','Resolved','Closed'];
  const priorities=['Low','Medium','High','Urgent'];
  if (status && !statuses.includes(status)) return res.status(400).json({message:'Invalid status'});
  if (priority && !priorities.includes(priority)) return res.status(400).json({message:'Invalid priority'});
  try {
    const old=await pool.query('SELECT id FROM service_requests WHERE id=$1',[req.params.id]);
    if (!old.rowCount) return res.status(404).json({message:'Request not found'});
    const q=await pool.query(
      `UPDATE service_requests SET status=COALESCE($1,status), priority=COALESCE($2,priority),
       assignee_id=CASE WHEN $3::int IS NULL THEN assignee_id ELSE $3 END,
       updated_at=NOW() WHERE id=$4 RETURNING *`,
      [status||null,priority||null,assignee_id===undefined?null:Number(assignee_id),req.params.id]);
    await pool.query('INSERT INTO activity_logs(actor_id,request_id,action,details) VALUES($1,$2,$3,$4)',
      [req.user.id,req.params.id,'Request updated',JSON.stringify(req.body)]);
    res.json(q.rows[0]);
  } catch(e) { res.status(500).json({message:'Could not update request'}); }
});
router.get('/:id/comments', async (req,res) => {
  try {
    const own=await pool.query('SELECT requester_id FROM service_requests WHERE id=$1',[req.params.id]);
    if (!own.rowCount) return res.status(404).json({message:'Request not found'});
    if (req.user.role==='employee' && own.rows[0].requester_id!==req.user.id) return res.status(403).json({message:'Forbidden'});
    const q=await pool.query(`SELECT c.*,u.name AS author_name FROM comments c JOIN users u ON u.id=c.author_id WHERE request_id=$1 ORDER BY c.created_at`,[req.params.id]);
    res.json(q.rows);
  } catch(e) { res.status(500).json({message:'Could not load comments'}); }
});
router.post('/:id/comments', async (req,res) => {
  const body=req.body?.body?.trim();
  if (!body) return res.status(400).json({message:'Comment cannot be empty'});
  try {
    const own=await pool.query('SELECT requester_id FROM service_requests WHERE id=$1',[req.params.id]);
    if (!own.rowCount) return res.status(404).json({message:'Request not found'});
    if (req.user.role==='employee' && own.rows[0].requester_id!==req.user.id) return res.status(403).json({message:'Forbidden'});
    const q=await pool.query('INSERT INTO comments(request_id,author_id,body) VALUES($1,$2,$3) RETURNING *',[req.params.id,req.user.id,body]);
    await pool.query('INSERT INTO activity_logs(actor_id,request_id,action,details) VALUES($1,$2,$3,$4)',[req.user.id,req.params.id,'Comment added','']);
    res.status(201).json(q.rows[0]);
  } catch(e) { res.status(500).json({message:'Could not add comment'}); }
});
export default router;
