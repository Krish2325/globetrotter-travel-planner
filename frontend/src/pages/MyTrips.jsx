import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { PlusCircle, Map, Search, Trash2, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

const MESHES = ['trip-card-mesh-1','trip-card-mesh-2','trip-card-mesh-3','trip-card-mesh-4','trip-card-mesh-5','trip-card-mesh-6'];
const STATUS_BADGE = {
  PLANNING: 'badge-teal', CONFIRMED: 'badge-blue', ONGOING: 'badge-amber',
  COMPLETED: 'badge-sage', CANCELLED: 'badge-red',
};
const STATUSES = ['ALL', 'PLANNING', 'CONFIRMED', 'ONGOING', 'COMPLETED', 'CANCELLED'];

export default function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [q, setQ] = useState('');
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    api.get('/trips').then(({ data }) => setTrips(data)).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this trip and all its data? This cannot be undone.')) return;
    setDeleting(id);
    await api.delete(`/trips/${id}`);
    setTrips(trips.filter(t => t.id !== id));
    setDeleting(null);
  };

  const filtered = trips.filter(t => {
    if (filter !== 'ALL' && t.status !== filter) return false;
    if (q && !t.title.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">My Trips</h1>
          <p className="page-subtitle">{trips.length} trip{trips.length !== 1 ? 's' : ''} planned</p>
        </div>
        <Link to="/trips/new" className="btn-primary">
          <PlusCircle className="w-4 h-4" /> New Trip
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-100" />
          <input
            type="text" placeholder="Search trips…" className="input pl-10"
            value={q} onChange={e => setQ(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUSES.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 ${filter === s ? 'bg-teal-700 border-teal-500 text-ink-900' : 'bg-cream-100 border-cream-300 text-ink-300 hover:bg-cream-200'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton h-56" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-16 text-center">
          <Map className="w-14 h-14 text-ink-900/20 mx-auto mb-4" />
          <p className="text-ink-300 font-medium text-lg">No trips found</p>
          <p className="text-ink-900/25 text-sm mt-1">Try a different filter or create a new trip</p>
          <Link to="/trips/new" className="btn-primary mt-6 inline-flex"><PlusCircle className="w-4 h-4" />Create Trip</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((trip, idx) => (
            <div key={trip.id} className="card-hover overflow-hidden group">
              <Link to={`/trips/${trip.id}`} className="block">
                <div className={`h-32 ${MESHES[idx % MESHES.length]} relative`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className={`badge ${STATUS_BADGE[trip.status]}`}>{trip.status}</span>
                  </div>
                </div>
              </Link>
              <div className="p-4">
                <Link to={`/trips/${trip.id}`}>
                  <h3 className="font-semibold text-ink-900 group-hover:text-teal-500 transition-colors line-clamp-1">{trip.title}</h3>
                </Link>
                <div className="flex items-center gap-1.5 text-ink-300 text-xs mt-1.5">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(trip.startDate), 'MMM d')} – {format(new Date(trip.endDate), 'MMM d, yyyy')}
                </div>
                {trip.stops?.length > 0 && (
                  <div className="flex items-center gap-1.5 text-ink-100 text-xs mt-1">
                    <MapPin className="w-3 h-3" />
                    {trip.stops.map(s => s.city?.name).filter(Boolean).slice(0, 3).join(' · ')}
                  </div>
                )}
                <div className="flex items-center justify-between mt-3">
                  <Link to={`/trips/${trip.id}/itinerary`} className="text-xs text-teal-600 hover:text-teal-500 font-medium transition-colors inline-flex items-center gap-1">
                    View Itinerary <ArrowRight className="w-3 h-3" />
                  </Link>
                  <button onClick={() => handleDelete(trip.id)} disabled={deleting === trip.id}
                    className="btn-icon w-7 h-7 text-coral-500/70 hover:text-red-500 hover:bg-coral-500/10">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
