import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

export default function Navbar() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav>
      {token ? (
        <>
          <Link to="/search">Búsqueda</Link>
          <Link to="/bookings">Mis reservas</Link>
          {user && <span>{user.firstName} {user.lastName}</span>}
          <button onClick={handleLogout}>Cerrar sesión</button>
        </>
      ) : (
        <>
          <Link to="/login">Iniciar sesión</Link>
          <Link to="/register">Registrarse</Link>
        </>
      )}
    </nav>
  );
}