import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { Users, Search, Copy, Eye, MapPin, User, Loader2, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

const MESHES = ['trip-card-mesh-1','trip-card-mesh-2','trip-card-mesh-3','trip-card-mesh-4','trip-card-mesh-5'];

export default function CommunityPage() {
  const [shares, setShares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [copying, setCopying] = useState(null);

  const load = (search = '') => {
    setLoading(true);
    api.get(`/community${search ? `?q=${search}` : ''}`).then(({ data }) => setShares(data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    load(q);
  };

  const copyTrip = async (slug, e) => {
    e.preventDefault();
    setCopying(slug);
    try {
      const { data } = await api.post(`/community/${slug}/copy`);
      alert(`Trip copied! Go to My Trips to view it.`);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to copy trip');
    } finally { setCopying(null); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Community Itineraries</h1>
        <p className="page-subtitle">Discover and copy trips shared by other travelers</p>
      </div>

      <form onSubmit={handleSearch} className="card p-5 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-100" />
          <input type="text" placeholder="Search itineraries…" className="input pl-10"
            value={q} onChange={e => setQ(e.target.value)} />
        </div>
        <button type="submit" className="btn-primary">Search</button>
      </form>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton h-56" />)}
        </div>
      ) : shares.length === 0 ? (
        <div className="card p-12 text-center">
          <Users className="w-12 h-12 text-ink-900/20 mx-auto mb-3" />
          <p className="text-ink-300 font-medium">No shared itineraries yet</p>
          <p className="text-ink-900/25 text-sm mt-1">Be the first to share your trip!</p>
          <Link to="/trips" className="btn-primary mt-4 inline-flex">View My Trips</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shares.map((share, idx) => (
            <div key={share.id} className="card-hover overflow-hidden">
              <div className={`h-28 ${MESHES[idx % MESHES.length]} relative`}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <span className="flex items-center gap-1 text-xs text-ink-700 bg-black/30 rounded-full px-2 py-0.5 backdrop-blur-sm">
                    <Eye className="w-3 h-3" />{share.viewsCount}
                  </span>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-ink-900">{share.title}</h3>
                  {share.description && <p className="text-ink-300 text-sm mt-1 line-clamp-2">{share.description}</p>}
                </div>

                {share.trip?.stops?.length > 0 && (
                  <div className="flex items-center gap-1 text-ink-100 text-xs">
                    <MapPin className="w-3 h-3 shrink-0" />
                    {share.trip.stops.map(s => s.city?.name).filter(Boolean).slice(0, 3).map((name, i, arr) => <span key={i} className="flex items-center">{name}{i < arr.length - 1 && <ArrowRight className="w-2.5 h-2.5 mx-1 inline" />}</span>)}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-600 to-ocean-500 flex items-center justify-center text-[10px] font-bold">
                      {share.user?.name?.[0]}
                    </div>
                    <span className="text-xs text-ink-300">{share.user?.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/community/${share.slug}`} className="btn-ghost py-1 px-2 text-xs">View</Link>
                    <button onClick={e => copyTrip(share.slug, e)} disabled={copying === share.slug}
                      className="btn-primary py-1 px-2 text-xs">
                      {copying === share.slug ? <Loader2 className="w-3 h-3 animate-spin" /> : <Copy className="w-3 h-3" />}
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
