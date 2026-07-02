import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function Layout() {
  const { user, logout } = useAuth();
  const { darkMode, setDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-vh-100 bg-body-tertiary">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div className="container">
          <span className="navbar-brand fw-bold">Controle de Despesas</span>
          <div className="collapse navbar-collapse justify-content-end">
            <ul className="navbar-nav gap-2 align-items-center">
              <li className="nav-item">
                <NavLink className="nav-link" to="/dashboard">Dashboard</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/categories">Categorias</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/expenses">Despesas</NavLink>
              </li>
              <li className="nav-item">
                <button className="btn btn-outline-light btn-sm" onClick={() => setDarkMode(!darkMode)}>
                  {darkMode ? '☀️' : '🌙'}
                </button>
              </li>
              <li className="nav-item">
                <span className="navbar-text me-2">{user?.nome}</span>
              </li>
              <li className="nav-item">
                <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>Sair</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main className="container py-4">
        <Outlet />
      </main>
    </div>
  );
}
