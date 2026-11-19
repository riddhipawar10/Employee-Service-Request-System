import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { pool } from './db/pool.js';
import authRoutes from './routes/auth.js';
import requestRoutes from './routes/requests.js';
import dashboardRoutes from './routes/dashboard.js';
import { authenticate } from './middleware/auth.js';
dotenv.config();
const app=express();
app.use(helmet());
app.use(cors({origin:process.env.CLIENT_URL||'http://localhost:5173'}));
app.use(express.json({limit:'1mb'}));
app.get('/api/health',async(req,res)=>{
 try{await pool.query('SELECT 1');res.json({status:'ok',database:'connected'});}
 catch{res.status(503).json({status:'error',database:'disconnected'});}
});
app.use('/api/auth',authRoutes);
app.use('/api/requests',authenticate,requestRoutes);
app.use('/api/dashboard',authenticate,dashboardRoutes);
app.use((err,req,res,next)=>{console.error(err);res.status(500).json({message:'Unexpected server error'});});
const port=process.env.PORT||5000;
app.listen(port,()=>console.log(`API running at http://localhost:${port}`));
