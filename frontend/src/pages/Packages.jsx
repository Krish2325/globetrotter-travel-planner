import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { motion } from 'framer-motion';
import { Search, MapPin, Clock, Star, TrendingUp, ArrowRight, Package } from 'lucide-react';

const INDIAN_STATES = [
  'Rajasthan', 'Kerala', 'Himachal Pradesh', 'Uttarakhand', 'Uttar Pradesh',
  'Ladakh', 'West Bengal', 'Andaman', 'Goa',
];

function regionOf(destination = '') {
  if (destination.includes('Gujarat')) return 'Gujarat';
  if (destination.includes('India') || INDIAN_STATES.some((s) => destination.includes(s))) return 'India';
  return 'International';
}

const TABS = ['All', 'Gujarat', 'India', 'International'];

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } } };
const stagger = { show: { transition: { staggerChildren: 0.05 } } };

export default function Packages() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/trips/public', { params: { sort: 'popular' } })
      .then(({ data }) => setTrips(Array.isArray(data) ? data : data.trips || []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return trips.filter((t) => {
      const region = regionOf(t.destination);
      const matchesTab = tab === 'All' || region === tab;
      const matchesSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || (t.destination || '').toLowerCase().includes(search.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [trips, tab, search]);

  const counts = useMemo(() => {
    const c = { All: trips.length, Gujarat: 0, India: 0, International: 0 };
    trips.forEach((t) => { c[regionOf(t.destination)]++; });
    return c;
  }, [trips]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Trip Packages</h1>
        <p className="page-subtitle">Curated packages across Gujarat, India and the world</p>
      </div>

      {/* Search + Tabs */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <input
            placeholder="Search packages or destinations…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-11 pr-4 py-3 rounded-2xl w-full"
          />
        </div>
        <div className="flex gap-2 shrink-0 overflow-x-auto scroll-hide">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-4 py-2.5 rounded-2xl text-sm font-semibold whitespace-nowrap transition-colors"
              style={tab === t
                ? { background: '#4F46E5', color: '#fff' }
                : { background: 'rgba(255,255,255,0.65)', color: '#6B7280', border: '1px solid rgba(99,102,241,0.15)' }}>
              {t} <span className="opacity-70">({counts[t] ?? 0})</span>
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-64 rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <Package className="w-12 h-12 text-[#D1D5DB] mx-auto mb-3" />
          <p className="text-[#6B7280] font-semibold">No packages found</p>
          <p className="text-[#9CA3AF] text-sm mt-1">Try a different search or category</p>
        </div>
      ) : (
        <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((t) => (
            <motion.div key={t.id} variants={fadeUp} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
              <div className="card overflow-hidden h-full flex flex-col group">
                <div className="relative h-40 overflow-hidden">
                  <img src={t.coverImage} alt={t.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                  <span className="absolute top-3 left-3 text-white text-[10px] font-bold px-2 py-1 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)' }}>
                    {regionOf(t.destination)}
                  </span>
                  {t.isTrending && (
                    <span className="absolute top-3 right-3 flex items-center gap-1 text-white text-[10px] font-bold px-2 py-1 rounded-full bg-[#D97706]/80">
                      <TrendingUp className="w-3 h-3" /> Trending
                    </span>
                  )}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="text-white text-xs font-semibold flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {t.destination}
                    </span>
                    {t.rating > 0 && (
                      <span className="text-white text-xs font-semibold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {t.rating}
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-bold text-[#1F2937] text-sm">{t.title}</h3>
                  <p className="text-xs text-[#6B7280] mt-1 line-clamp-2 flex-1">{t.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div>
                      <p className="text-[10px] text-[#9CA3AF]">Starting from</p>
                      <p className="text-sm font-bold text-[#4F46E5]">Rs. {t.basePrice?.toLocaleString()}</p>
                    </div>
                    <span className="text-xs font-medium text-[#6B7280] bg-[#ECECF7] px-2 py-1 rounded-lg flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {t.durationDays}d
                    </span>
                  </div>
                  <Link
                    to={`/trips/new?title=${encodeURIComponent(t.title)}&description=${encodeURIComponent(t.description || '')}`}
                    className="btn-primary mt-3 justify-center text-sm py-2.5">
                    Plan this trip <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
