const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res, next) => {
  try {
    const { nome, email, senha } = req.body;
    if (!nome?.trim() || !email?.trim() || !senha || senha.length < 8)
      return res.status(400).json({ error: 'Informe nome, e-mail e senha com pelo menos 8 caracteres.' });
    const hash = await bcrypt.hash(senha, 12);
    const [result] = await db.execute('INSERT INTO usuarios (nome,email,senha_hash) VALUES (?,?,?)', [nome.trim(), email.trim().toLowerCase(), hash]);
    res.status(201).json({ id: result.insertId, nome: nome.trim(), email: email.trim().toLowerCase() });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Este e-mail já está cadastrado.' });
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, senha } = req.body;
    const [rows] = await db.execute('SELECT id,nome,email,senha_hash FROM usuarios WHERE email = ?', [String(email || '').trim().toLowerCase()]);
    if (!rows.length || !(await bcrypt.compare(senha || '', rows[0].senha_hash)))
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
    const user = { id: rows[0].id, nome: rows[0].nome, email: rows[0].email };
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
    res.json({ user, token });
  } catch (err) { next(err); }
};
