import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../lib/api';
import { format } from 'date-fns';
import {
  Map, Calendar, DollarSign, CheckSquare, FileText, Share2,
  Globe, ArrowLeft, MapPin, Clock
} from 'lucide-react';

const STATUS_BADGE = {
  PLANNING: 'badge-teal', CONFIRMED: 'badge-blue', ONGOING: 'badge-amber',
  COMPLETED: 'badge-sage', CANCELLED: 'badge-red',
};

const quickLinks = (id) => [
  { to: `/trips/${id}/itinerary`, icon: Map, label: 'Itinerary Builder', desc: 'Add stops & activities', color: 'from-teal-600/20 to-primary-600/10' },
  { to: `/trips/${id}/budget`, icon: DollarSign, label: 'Budget', desc: 'Track spending', color: 'from-sage-500/20 to-sage-600/10' },
  { to: `/trips/${id}/checklist`, icon: CheckSquare, label: 'Packing List', desc: 'Don\'t forget anything', color: 'from-amber-500/20 to-amber-600/10' },
  { to: `/trips/${id}/notes`, icon: FileText, label: 'Journal', desc: 'Trip notes & memories', color: 'from-coral-500/20 to-coral-600/10' },
];

export default function TripDetail() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    api.get(`/trips/${id}`).then(({ data }) => setTrip(data)).finally(() => setLoading(false));
  }, [id]);

  const handleShare = async () => {
    setSharing(true);
    try {
      const { data } = await api.post('/community', { tripId: id, title: trip.title, description: trip.description });
      alert(`Trip shared! Slug: ${data.slug}`);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to share trip');
    } finally {
      setSharing(false);
    }
  };

  if (loading) return (
    <div className="space-y-4">
      <div className="skeleton h-48" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="skeleton h-32" />)}
      </div>
    </div>
  );
  if (!trip) return <div className="card p-12 text-center text-ink-300">Trip not found</div>;

  const days = Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / 86400000) + 1;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <Link to="/trips" className="btn-ghost text-sm -ml-2 inline-flex">
        <ArrowLeft className="w-4 h-4" /> Back to trips
      </Link>

      <div className="card p-6 bg-gradient-to-r from-primary-600/10 to-ocean-500/5">
        <div className="flex flex-col md:flex-row md:items-start gap-4 justify-between">
          <div>
            <span className={`badge ${STATUS_BADGE[trip.status]} mb-3`}>{trip.status}</span>
            <h1 className="text-2xl md:text-3xl font-bold font-display text-ink-900">{trip.title}</h1>
            {trip.description && <p className="text-ink-300 mt-2 max-w-2xl">{trip.description}</p>}
            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-ink-300">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />
                {format(new Date(trip.startDate), 'MMM d')} – {format(new Date(trip.endDate), 'MMM d, yyyy')}
              </span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{days} day{days !== 1 ? 's' : ''}</span>
              {trip.stops?.length > 0 && (
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />
                  {trip.stops.length} stop{trip.stops.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
          <button onClick={handleShare} disabled={sharing} className="btn-secondary shrink-0 gap-2">
            <Share2 className="w-4 h-4" />{sharing ? 'Sharing…' : 'Share'}
          </button>
        </div>
      </div>

      {/* Cities route */}
      {trip.stops?.length > 0 && (
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-ink-300 uppercase tracking-wider mb-3">Route</h2>
          <div className="flex flex-wrap items-center gap-2">
            {trip.stops
              .sort((a, b) => a.order - b.order)
              .map((stop, i) => (
                <span key={stop.id} className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 card px-3 py-1.5 text-sm text-ink-700">
                    <MapPin className="w-3 h-3 text-teal-600" />
                    {stop.city?.name}, {stop.city?.country}
                  </span>
                  {i < trip.stops.length - 1 && <span className="text-ink-900/20"><ArrowRight className="w-4 h-4 inline" /></span>}
                </span>
              ))}
          </div>
        </div>
      )}

      {/* Quick nav cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickLinks(id).map(({ to, icon: Icon, label, desc, color }) => (
          <Link key={to} to={to}
            className={`card bg-gradient-to-br ${color} p-5 group hover:-translate-y-1 transition-all duration-300 hover:shadow-xl block`}>
            <Icon className="w-6 h-6 text-ink-500 group-hover:text-ink-900 mb-3 transition-colors" />
            <p className="font-semibold text-ink-900 text-sm">{label}</p>
            <p className="text-ink-300 text-xs mt-0.5">{desc}</p>
          </Link>
        ))}
      </div>

      {/* Budget summary */}
      {trip.budget && (
        <div className="card p-5">
          <h2 className="section-title">Budget Overview</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-ink-900">{trip.budget.currency} {Number(trip.budget.totalBudget).toLocaleString()}</p>
              <p className="text-ink-300 text-sm mt-1">Total budget</p>
            </div>
            <Link to={`/trips/${id}/budget`} className="btn-secondary text-sm inline-flex items-center gap-1">Manage Budget <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      )}

      {/* Checklist preview */}
      {trip.checklists?.length > 0 && (
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="section-title mb-0">Packing Progress</h2>
            <Link to={`/trips/${id}/checklist`} className="text-xs text-teal-600 hover:text-teal-500 inline-flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
          </div>
          {trip.checklists.slice(0, 1).map(list => {
            const total = list.items?.length || 0;
            const done = list.items?.filter(i => i.isChecked).length || 0;
            const pct = total ? Math.round((done / total) * 100) : 0;
            return (
              <div key={list.id}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-ink-500">{list.title}</span>
                  <span className="text-ink-300">{done}/{total}</span>
                </div>
                <div className="h-2 bg-cream-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-teal-600 to-ocean-400 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
