import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function RegisterPage() {
  const [form, setForm] = useState({ nome: '', email: '', senha: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await register(form);
      setSuccess('Conta criada com sucesso. Faça login.');
      setTimeout(() => navigate('/login'), 800);
    } catch (err) {
      setError(err.response?.data?.error || 'Não foi possível criar a conta.');
    }
  };

  return (
    <div className="row justify-content-center align-items-center min-vh-100">
      <div className="col-md-5">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h2 className="card-title mb-3">Criar conta</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Nome</label>
                <input className="form-control" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
              </div>
              <div className="mb-3">
                <label className="form-label">E-mail</label>
                <input className="form-control" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Senha</label>
                <input className="form-control" type="password" value={form.senha} onChange={(e) => setForm({ ...form, senha: e.target.value })} required />
              </div>
              <button className="btn btn-success w-100" disabled={loading}>{loading ? 'Criando...' : 'Criar conta'}</button>
            </form>
            <div className="mt-3 text-center">
              <Link to="/login">Voltar para login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
