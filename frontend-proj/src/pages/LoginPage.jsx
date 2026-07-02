import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', senha: '' });
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Falha ao entrar.');
    }
  };

  return (
    <div className="row justify-content-center align-items-center min-vh-100">
      <div className="col-md-5">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h2 className="card-title mb-3">Entrar</h2>
            <p className="text-muted">Acesse o sistema de controle de despesas.</p>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">E-mail</label>
                <input className="form-control" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Senha</label>
                <input className="form-control" type="password" value={form.senha} onChange={(e) => setForm({ ...form, senha: e.target.value })} required />
              </div>
              <button className="btn btn-primary w-100" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
            </form>
            <div className="mt-3 text-center">
              <Link to="/register">Criar conta</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
