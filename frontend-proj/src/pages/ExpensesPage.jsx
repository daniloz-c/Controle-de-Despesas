import { useEffect, useState } from 'react';
import api from '../services/api';

const emptyForm = {
  descricao: '',
  valor: '',
  data: '',
  status: 'PENDENTE',
  categoriaId: ''
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filters, setFilters] = useState({ categoria: '', status: '', dataInicio: '', dataFim: '', valorMin: '', valorMax: '' });

  const loadCategories = async () => {
    const response = await api.get('/categories');
    setCategories(response.data);
  };

  const loadExpenses = async (params = filters) => {
    setLoading(true);
    try {
      const query = {};
      if (params.categoria) query.categoria = params.categoria;
      if (params.status) query.status = params.status;
      if (params.dataInicio) query.dataInicio = params.dataInicio;
      if (params.dataFim) query.dataFim = params.dataFim;
      if (params.valorMin) query.valorMin = params.valorMin;
      if (params.valorMax) query.valorMax = params.valorMax;

      const response = await api.get('/expenses', { params: query });
      setExpenses(response.data);
    } catch (err) {
      setError('Não foi possível carregar as despesas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await loadCategories();
      await loadExpenses(filters);
    };
    init();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const payload = {
        ...form,
        valor: Number(form.valor),
        categoriaId: Number(form.categoriaId)
      };

      if (editingId) {
        await api.put(`/expenses/${editingId}`, payload);
        setSuccess('Despesa atualizada com sucesso.');
      } else {
        await api.post('/expenses', payload);
        setSuccess('Despesa cadastrada com sucesso.');
      }
      setForm(emptyForm);
      setEditingId(null);
      await loadExpenses(filters);
    } catch (err) {
      setError(err.response?.data?.error || 'Não foi possível salvar a despesa.');
    }
  };

  const handleEdit = (expense) => {
    setEditingId(expense.id);
    setForm({
      descricao: expense.descricao,
      valor: expense.valor,
      data: expense.data,
      status: expense.status,
      categoriaId: expense.categoriaId || expense.categoria?.id || ''
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja excluir esta despesa?')) return;
    try {
      await api.delete(`/expenses/${id}`);
      setSuccess('Despesa removida com sucesso.');
      await loadExpenses(filters);
    } catch (err) {
      setError('Não foi possível excluir a despesa.');
    }
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();
    loadExpenses(filters);
  };

  return (
    <div className="row g-4">
      <div className="col-lg-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <h4 className="card-title mb-3">{editingId ? 'Editar despesa' : 'Nova despesa'}</h4>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Descrição</label>
                <input className="form-control" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Valor</label>
                <input className="form-control" type="number" step="0.01" value={form.valor} onChange={(e) => setForm({ ...form, valor: e.target.value })} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Data</label>
                <input className="form-control" type="date" value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Status</label>
                <select className="form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="PENDENTE">PENDENTE</option>
                  <option value="PAGA">PAGA</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Categoria</label>
                <select className="form-select" value={form.categoriaId} onChange={(e) => setForm({ ...form, categoriaId: e.target.value })} required>
                  <option value="">Selecione</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.nome}</option>
                  ))}
                </select>
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
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="card-title">Filtros</h5>
            <form className="row g-2" onSubmit={handleApplyFilters}>
              <div className="col-md-3">
                <select className="form-select" value={filters.categoria} onChange={(e) => setFilters({ ...filters, categoria: e.target.value })}>
                  <option value="">Todas</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.nome}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <select className="form-select" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
                  <option value="">Todos</option>
                  <option value="PENDENTE">PENDENTE</option>
                  <option value="PAGA">PAGA</option>
                </select>
              </div>
              <div className="col-md-2">
                <input className="form-control" type="date" value={filters.dataInicio} onChange={(e) => setFilters({ ...filters, dataInicio: e.target.value })} />
              </div>
              <div className="col-md-2">
                <input className="form-control" type="date" value={filters.dataFim} onChange={(e) => setFilters({ ...filters, dataFim: e.target.value })} />
              </div>
              <div className="col-md-1">
                <input className="form-control" type="number" step="0.01" placeholder="Min" value={filters.valorMin} onChange={(e) => setFilters({ ...filters, valorMin: e.target.value })} />
              </div>
              <div className="col-md-1">
                <input className="form-control" type="number" step="0.01" placeholder="Max" value={filters.valorMax} onChange={(e) => setFilters({ ...filters, valorMax: e.target.value })} />
              </div>
              <div className="col-md-1">
                <button className="btn btn-outline-primary w-100" type="submit">Filtrar</button>
              </div>
            </form>
          </div>
        </div>

        <div className="card shadow-sm">
          <div className="card-body">
            <h4 className="card-title mb-3">Despesas</h4>
            {loading ? (
              <div className="text-muted">Carregando despesas...</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Descrição</th>
                      <th>Categoria</th>
                      <th>Valor</th>
                      <th>Status</th>
                      <th>Data</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((expense) => (
                      <tr key={expense.id}>
                        <td>{expense.descricao}</td>
                        <td>{expense.categoria?.nome || '-'}</td>
                        <td>R$ {Number(expense.valor).toFixed(2)}</td>
                        <td>{expense.status}</td>
                        <td>{expense.data}</td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button className="btn btn-outline-primary" onClick={() => handleEdit(expense)}>Editar</button>
                            <button className="btn btn-outline-danger" onClick={() => handleDelete(expense.id)}>Excluir</button>
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
