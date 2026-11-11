import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { errorMessage } from '../api';
import { useAuth } from '../auth/useAuth';
import Alert from '../components/Alert';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // RegisterPage manda este estado al redirigir tras un registro exitoso
  const justRegistered = Boolean(location.state?.registered);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Ingresa tu email y tu contraseña.');
      return;
    }

    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate('/search', { replace: true });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="auth-card">
      <h1>Iniciar sesión</h1>

      {justRegistered && !error && (
        <Alert type="success">Cuenta creada. Ahora puedes iniciar sesión.</Alert>
      )}
      {error && <Alert type="error">{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </label>

        <label>
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>

        <button type="submit" disabled={submitting}>
          {submitting ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>

      <p>
        ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
      </p>
    </section>
  );
}