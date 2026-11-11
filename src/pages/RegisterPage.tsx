import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { errorMessage } from '../api';
import Alert from '../components/Alert';

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Tras el éxito, espera un momento para que se lea el mensaje y redirige al login
  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => navigate('/login', { state: { registered: true } }), 1500);
    return () => clearTimeout(timer);
  }, [success, navigate]);

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    // El backend acepta un email vacío, así que se valida aquí
    if (!form.email.trim() || !form.firstName.trim() || !form.lastName.trim() || !form.password) {
      setError('Completa todos los campos.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/users/register', {
        email: form.email.trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        password: form.password,
      });
      setSuccess(true);
    } catch (err) {
      setError(errorMessage(err)); // contraseña débil, email en uso, etc.
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="auth-card">
      <h1>Crear cuenta</h1>

      {success && <Alert type="success">Registro exitoso. Redirigiendo al login...</Alert>}
      {error && <Alert type="error">{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            autoComplete="email"
          />
        </label>

        <label>
          Nombre
          <input
            type="text"
            value={form.firstName}
            onChange={(e) => update('firstName', e.target.value)}
          />
        </label>

        <label>
          Apellido
          <input
            type="text"
            value={form.lastName}
            onChange={(e) => update('lastName', e.target.value)}
          />
        </label>

        <label>
          Contraseña
          <input
            type="password"
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            autoComplete="new-password"
          />
        </label>

        <p>Mínimo 8 caracteres, con al menos una mayúscula y un dígito.</p>

        <button type="submit" disabled={submitting || success}>
          {submitting ? 'Creando cuenta...' : 'Registrarme'}
        </button>
      </form>

      <p>
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </section>
  );
}