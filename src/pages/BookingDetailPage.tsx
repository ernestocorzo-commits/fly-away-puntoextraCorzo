import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api';
import Alert from '../components/Alert';
import { formatDateTime } from '../utils/format';

interface BookingDetail {
  id: number;
  bookingDate: string;
  flightId: number;
  flightNumber: string;
  airlineName: string;
  estDepartureTime: string;
  estArrivalTime: string;
  customerFirstName: string;
  customerLastName: string;
}

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api
      .get<BookingDetail>(`/flights/book/${id}`)
      .then((res) => active && setBooking(res.data))
      .catch(() => active && setError('No se pudo cargar la reserva. Puede que ya no exista.'))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) return <p>Cargando reserva...</p>;

  return (
    <section>
      <h1>Reserva #{id}</h1>

      {error && <Alert type="error">{error}</Alert>}

      {booking && (
        <dl className="detail">
          <dt>Pasajero</dt>
          <dd>
            {booking.customerFirstName} {booking.customerLastName}
          </dd>
          <dt>Vuelo</dt>
          <dd>{booking.flightNumber}</dd>
          <dt>Aerolínea</dt>
          <dd>{booking.airlineName}</dd>
          <dt>Salida</dt>
          <dd>{formatDateTime(booking.estDepartureTime)}</dd>
          <dt>Llegada</dt>
          <dd>{formatDateTime(booking.estArrivalTime)}</dd>
          <dt>Reservado el</dt>
          <dd>{formatDateTime(booking.bookingDate)}</dd>
        </dl>
      )}

      <p>
        <Link to="/bookings">← Volver a mis reservas</Link>
      </p>
    </section>
  );
}