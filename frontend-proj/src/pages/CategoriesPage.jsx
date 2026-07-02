import { useEffect, useState } from 'react';
import api from '../services/api';

const emptyForm = { nome: '', descricao: '' };

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (err) {
      setError('Não foi possível carregar as categorias.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, form);
        setSuccess('Categoria atualizada com sucesso.');
      } else {
        await api.post('/categories', form);
        setSuccess('Categoria cadastrada com sucesso.');
      }
      setForm(emptyForm);
      setEditingId(null);
      await loadCategories();
    } catch (err) {
      setError(err.response?.data?.error || 'Não foi possível salvar a categoria.');
    }
  };

  const handleEdit = (category) => {
    setEditingId(category.id);
    setForm({ nome: category.nome, descricao: category.descricao || '' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja excluir esta categoria?')) return;
    try {
      await api.delete(`/categories/${id}`);
      setSuccess('Categoria removida com sucesso.');
      await loadCategories();
    } catch (err) {
      setError('Não foi possível excluir a categoria.');
    }
  };

  return (
    <div className="row g-4">
      <div className="col-lg-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <h4 className="card-title mb-3">{editingId ? 'Editar categoria' : 'Nova categoria'}</h4>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Nome</label>
                <input className="form-control" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Descrição</label>
                <textarea className="form-control" rows="3" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-primary" type="submit">{editingId ? 'Salvar' : 'Cadastrar'}</button>
                {editingId && (
                  <button className="btn btn-outline-secondary" type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }}>
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="col-lg-8">
        <div className="card shadow-sm">
          <div className="card-body">
            <h4 className="card-title mb-3">Categorias cadastradas</h4>
            {loading ? (
              <div className="text-muted">Carregando categorias...</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Descrição</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category) => (
                      <tr key={category.id}>
                        <td>{category.nome}</td>
                        <td>{category.descricao || '-'}</td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button className="btn btn-outline-primary" onClick={() => handleEdit(category)}>Editar</button>
                            <button className="btn btn-outline-danger" onClick={() => handleDelete(category.id)}>Excluir</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
