import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../auth/useAuth';
import Alert from '../components/Alert';
import { getBookingIds } from '../utils/bookingStorage';
import { formatDateTime } from '../utils/format';

interface Booking {
  id: number;
  bookingDate: string;
  flightId: number;
  flightNumber: string;
  airlineName: string;
  estDepartureTime: string;
  estArrivalTime: string;
}

export default function BookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [missing, setMissing] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let active = true;
    const ids = getBookingIds(user.email);

    // Si una reserva ya no existe (por ejemplo, tras reiniciar el backend), devuelve null
    Promise.all(
      ids.map((id) =>
        api
          .get<Booking>(`/flights/book/${id}`)
          .then((res) => res.data)
          .catch(() => null),
      ),
    ).then((results) => {
      if (!active) return;
      const found = results.filter((b): b is Booking => b !== null);
      setBookings(found.sort((a, b) => b.id - a.id)); // las más recientes primero
      setMissing(results.length - found.length);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [user]);

  if (loading) return <p>Cargando tus reservas...</p>;

  return (
    <section>
      <h1>Mis reservas</h1>

      {missing > 0 && (
        <Alert type="error">
          {missing} reserva(s) guardada(s) ya no existen en el servidor y no se muestran.
        </Alert>
      )}

      {bookings.length === 0 ? (
        <p>
          Aún no tienes reservas. <Link to="/search">Busca un vuelo</Link> para reservar.
        </p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Reserva</th>
              <th>Vuelo</th>
              <th>Aerolínea</th>
              <th>Salida</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>#{b.id}</td>
                <td>{b.flightNumber}</td>
                <td>{b.airlineName}</td>
                <td>{formatDateTime(b.estDepartureTime)}</td>
                <td>
                  <Link to={`/bookings/${b.id}`}>Ver detalle</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}