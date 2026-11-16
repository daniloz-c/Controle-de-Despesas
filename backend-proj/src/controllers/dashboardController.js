const db=require('../config/database');
exports.total=async(req,res,next)=>{try{const [[r]]=await db.execute('SELECT COALESCE(SUM(valor),0) total FROM despesas WHERE usuario_id=?',[req.user.id]);res.json(r);}catch(e){next(e);}};
exports.count=async(req,res,next)=>{try{const [[r]]=await db.execute('SELECT COUNT(*) quantidade FROM despesas WHERE usuario_id=?',[req.user.id]);res.json(r);}catch(e){next(e);}};
exports.byCategory=async(req,res,next)=>{try{const [rows]=await db.execute('SELECT c.nome categoria,COALESCE(SUM(d.valor),0) total FROM categorias c LEFT JOIN despesas d ON d.categoria_id=c.id AND d.usuario_id=? WHERE c.usuario_id=? GROUP BY c.id,c.nome ORDER BY c.nome',[req.user.id,req.user.id]);res.json(rows);}catch(e){next(e);}};
