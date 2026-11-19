import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db/pool.js';
const router = Router();
router.post('/login', async (req,res) => {
  const {email,password} = req.body || {};
  if (!email || !password) return res.status(400).json({message:'Email and password are required'});
  try {
    const result = await pool.query('SELECT id,name,email,password_hash,role,department FROM users WHERE LOWER(email)=LOWER($1)',[email]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password,user.password_hash))) return res.status(401).json({message:'Invalid email or password'});
    const payload = {id:user.id,name:user.name,email:user.email,role:user.role,department:user.department};
    const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'8h'});
    res.json({token,user:payload});
  } catch(e) { res.status(500).json({message:'Login failed'}); }
});
export default router;
