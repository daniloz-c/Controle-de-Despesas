require('dotenv').config();
const express=require('express');const cors=require('cors');const routes=require('./routes');
const app=express();
app.use(cors({origin:process.env.FRONTEND_ORIGIN||'http://localhost:5173'}));
app.use(express.json({limit:'1mb'}));
app.get('/health',(req,res)=>res.json({status:'ok'}));
app.use(routes);
app.use((err,req,res,next)=>{console.error(err);res.status(500).json({error:'Erro interno do servidor.'});});
module.exports=app;
