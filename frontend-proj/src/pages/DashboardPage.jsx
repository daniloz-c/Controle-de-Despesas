import { useEffect, useState } from 'react';
import api from '../services/api';

export default function DashboardPage() {
  const [stats, setStats] = useState({ total: 0, quantidade: 0, porCategoria: [] });
  const [latest, setLatest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [totalRes, countRes, categoryRes, expensesRes] = await Promise.all([
          api.get('/dashboard/total-expenses'),
          api.get('/dashboard/expenses-count'),
          api.get('/dashboard/expenses-by-category'),
          api.get('/expenses')
        ]);
        setStats({
          total: totalRes.data.total,
          quantidade: countRes.data.quantidade,
          porCategoria: categoryRes.data
        });
        setLatest(expensesRes.data);
      } catch (err) {
        setError('Não foi possível carregar o dashboard.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <div className="text-center py-5">Carregando dashboard...</div>;

  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">Total de gastos</h5>
              <p className="display-6">R$ {Number(stats.total).toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">Quantidade de despesas</h5>
              <p className="display-6">{stats.quantidade}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">Gastos por categoria</h5>
              <ul className="list-group list-group-flush">
                {stats.porCategoria.map((item) => (
                  <li key={item.categoria} className="list-group-item d-flex justify-content-between">
                    <span>{item.categoria}</span>
                    <strong>R$ {Number(item.total).toFixed(2)}</strong>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title">Últimas despesas cadastradas</h5>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Descrição</th>
                  <th>Categoria</th>
                  <th>Valor</th>
                  <th>Status</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {latest.map((item) => (
                  <tr key={item.id}>
                    <td>{item.descricao}</td>
                    <td>{item.categoria?.nome || '-'}</td>
                    <td>R$ {Number(item.valor).toFixed(2)}</td>
                    <td>{item.status}</td>
                    <td>{item.data}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
