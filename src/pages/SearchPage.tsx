import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import api, { errorMessage } from '../api';
import { useAuth } from '../auth/useAuth';
import Alert from '../components/Alert';
import { addBookingId } from '../utils/bookingStorage';
import { formatDateTime, toIso } from '../utils/format';

interface Flight {
  id: number;
  flightNumber: string;
  airlineName: string;
  estDepartureTime: string;
  estArrivalTime: string;
  availableSeats: number;
}

interface Filters {
  flightNumber: string;
  airlineName: string;
  from: string;
  to: string;
}

type Notice = { type: 'error' | 'success'; text: string; bookingId?: number };

const emptyFilters: Filters = { flightNumber: '', airlineName: '', from: '', to: '' };

async function fetchFlights(filters: Filters): Promise<Flight[]> {
  const { data } = await api.get<{ items: Flight[] }>('/flights/search', {
    params: {
      flightNumber: filters.flightNumber.trim() || undefined,
      airlineName: filters.airlineName.trim() || undefined,
      estDepartureTimeFrom: toIso(filters.from),
      estDepartureTimeTo: toIso(filters.to),
    },
  });
  return data.items; // la lista viene dentro de "items"
}

export default function SearchPage() {
  const { token, user } = useAuth();

  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [searched, setSearched] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [bookingFlightId, setBookingFlightId] = useState<number | null>(null);

  // Al entrar, se muestran todos los vuelos (sin filtros)
  useEffect(() => {
    let active = true;
    fetchFlights(emptyFilters)
      .then((items) => active && setFlights(items))
      .catch((err) => active && setNotice({ type: 'error', text: errorMessage(err) }))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  function updateFilter(field: keyof Filters, value: string) {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }

  async function runSearch(next: Filters) {
    setNotice(null);
    if (next.from && next.to && next.from > next.to) {
      setNotice({ type: 'error', text: 'La fecha "desde" no puede ser posterior a "hasta".' });
      return;
    }
    setLoading(true);
    try {
      setFlights(await fetchFlights(next));
      setSearched(true);
    } catch (err) {
      setNotice({ type: 'error', text: errorMessage(err) });
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    runSearch(filters);
  }

  function handleClear() {
    setFilters(emptyFilters);
    setSearched(false);
    runSearch(emptyFilters);
  }

  async function handleBook(flight: Flight) {
    setNotice(null);
    setBookingFlightId(flight.id);
    try {
      const { data } = await api.post<{ id: number }>('/flights/book', { flightId: flight.id });
      if (user) addBookingId(user.email, data.id);
      setFlights((prev) =>
        prev.map((f) =>
          f.id === flight.id ? { ...f, availableSeats: f.availableSeats - 1 } : f,
        ),
      );
      setNotice({
        type: 'success',
        text: `Reserva confirmada para el vuelo ${flight.flightNumber}. ID de reserva: ${data.id}.`,
        bookingId: data.id,
      });
    } catch (err) {
      setNotice({ type: 'error', text: errorMessage(err) });
    } finally {
      setBookingFlightId(null);
    }
  }

  return (
    <section>
      <h1>Buscar vuelos</h1>

      <form className="search-form" onSubmit={handleSubmit}>
        <label>
          Número de vuelo
          <input
            type="text"
            value={filters.flightNumber}
            onChange={(e) => updateFilter('flightNumber', e.target.value)}
            placeholder="LA101"
          />
        </label>

        <label>
          Aerolínea
          <input
            type="text"
            value={filters.airlineName}
            onChange={(e) => updateFilter('airlineName', e.target.value)}
            placeholder="LATAM"
          />
        </label>

        <label>
          Salida desde
          <input
            type="datetime-local"
            value={filters.from}
            onChange={(e) => updateFilter('from', e.target.value)}
          />
        </label>

        <label>
          Salida hasta
          <input
            type="datetime-local"
            value={filters.to}
            onChange={(e) => updateFilter('to', e.target.value)}
          />
        </label>

        <button type="submit" disabled={loading}>
          Buscar
        </button>
        <button type="button" onClick={handleClear} disabled={loading}>
          Limpiar
        </button>
      </form>

      {notice && (
        <Alert type={notice.type}>
          {notice.text}{' '}
          {notice.bookingId !== undefined && (
            <Link to={`/bookings/${notice.bookingId}`}>Ver detalle</Link>
          )}
        </Alert>
      )}

      {loading ? (
        <p>Buscando vuelos...</p>
      ) : flights.length === 0 ? (
        <p>
          {searched
            ? 'No encontramos vuelos con esos criterios. Prueba con otros filtros.'
            : 'No hay vuelos disponibles por ahora.'}
        </p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Vuelo</th>
              <th>Aerolínea</th>
              <th>Salida</th>
              <th>Llegada</th>
              <th>Asientos</th>
              {token && <th></th>}
            </tr>
          </thead>
          <tbody>
            {flights.map((flight) => (
              <tr key={flight.id}>
                <td>{flight.flightNumber}</td>
                <td>{flight.airlineName}</td>
                <td>{formatDateTime(flight.estDepartureTime)}</td>
                <td>{formatDateTime(flight.estArrivalTime)}</td>
                <td>{flight.availableSeats}</td>
                {token && (
                  <td>
                    <button
                      onClick={() => handleBook(flight)}
                      disabled={
                        !user || flight.availableSeats === 0 || bookingFlightId === flight.id
                      }
                    >
                      {bookingFlightId === flight.id
                        ? 'Reservando...'
                        : flight.availableSeats === 0
                          ? 'Agotado'
                          : 'Reservar'}
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}