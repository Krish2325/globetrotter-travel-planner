import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../lib/api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { ArrowLeft, MapPin, Copy, Loader2, Clock } from 'lucide-react';
import { format } from 'date-fns';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function PublicItinerary() {
  const { slug } = useParams();
  const [share, setShare] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copying, setCopying] = useState(false);

  useEffect(() => {
    api.get(`/community/${slug}`).then(({ data }) => setShare(data)).finally(() => setLoading(false));
  }, [slug]);

  const copyTrip = async () => {
    setCopying(true);
    try {
      await api.post(`/community/${slug}/copy`);
      alert('Trip copied to your account! Go to My Trips.');
    } catch (err) {
      alert(err.response?.data?.error || 'Please log in to copy this trip.');
    } finally { setCopying(false); }
  };

  const mapStops = share?.trip?.stops?.filter(s => s.city?.latitude && s.city?.longitude) || [];
  const center = mapStops[0] ? [Number(mapStops[0].city.latitude), Number(mapStops[0].city.longitude)] : [20, 78];

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="spinner w-10 h-10" /></div>;
  if (!share) return <div className="flex items-center justify-center min-h-screen text-ink-300">Itinerary not found</div>;

  return (
    <div className="min-h-screen px-4 py-8 max-w-4xl mx-auto space-y-6 animate-fade-in">
      <Link to="/community" className="btn-ghost text-sm -ml-2 inline-flex">
        <ArrowLeft className="w-4 h-4" /> Back to Community
      </Link>

      {/* Header */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row md:items-start gap-4 justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-display text-ink-900">{share.title}</h1>
            {share.description && <p className="text-ink-500 mt-2">{share.description}</p>}
            <div className="flex items-center gap-3 mt-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-600 to-ocean-500 flex items-center justify-center text-xs font-bold">
                {share.user?.name?.[0]}
              </div>
              <div>
                <p className="text-sm font-medium text-ink-900">{share.user?.name}</p>
                <p className="text-xs text-ink-300">{format(new Date(share.createdAt), 'MMM d, yyyy')}</p>
              </div>
            </div>
          </div>
          <button onClick={copyTrip} disabled={copying} className="btn-primary shrink-0">
            {copying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Copy className="w-4 h-4" />}
            {copying ? 'Copying…' : 'Copy This Trip'}
          </button>
        </div>
      </div>

      {/* Map */}
      {mapStops.length > 0 && (
        <div className="h-64 card overflow-hidden">
          <MapContainer center={center} zoom={4} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {mapStops.map((stop, i) => (
              <Marker key={stop.id} position={[Number(stop.city.latitude), Number(stop.city.longitude)]}>
                <Popup>Stop {i + 1}: {stop.city.name}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}

      {/* Itinerary */}
      <div className="space-y-4">
        <h2 className="section-title">Day-by-Day Itinerary</h2>
        {share.trip?.stops?.sort((a, b) => a.order - b.order).map((stop, idx) => (
          <div key={stop.id} className="card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-teal-700/30 border border-teal-500/50 flex items-center justify-center text-sm font-bold text-teal-500">
                {idx + 1}
              </div>
              <div>
                <h3 className="font-semibold text-ink-900">{stop.city?.name}</h3>
                <p className="text-xs text-ink-300">Day {stop.dayNumber} · {stop.city?.country}</p>
              </div>
            </div>
            {stop.notes && <p className="text-ink-500 text-sm mb-3">{stop.notes}</p>}
            {stop.stopActivities?.length > 0 && (
              <div className="space-y-2">
                {stop.stopActivities.sort((a, b) => a.order - b.order).map(sa => (
                  <div key={sa.id} className="flex items-center gap-2 bg-cream-100 rounded-lg px-3 py-2">
                    <Clock className="w-3 h-3 text-ink-100" />
                    <span className="text-sm text-ink-500">{sa.activity?.name}</span>
                    <span className="badge badge-teal ml-auto">{sa.activity?.category}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
