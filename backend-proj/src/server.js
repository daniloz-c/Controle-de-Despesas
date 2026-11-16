require('dotenv').config();
if(!process.env.JWT_SECRET||process.env.JWT_SECRET.length<32){console.error('Defina JWT_SECRET com pelo menos 32 caracteres no arquivo .env');process.exit(1);}
const app=require('./app');const db=require('./config/database');const port=Number(process.env.PORT||3000);
db.query('SELECT 1').then(()=>app.listen(port,()=>console.log(`API disponível em http://localhost:${port}`))).catch(err=>{console.error('Não foi possível conectar ao MySQL:',err.message);process.exit(1);});
