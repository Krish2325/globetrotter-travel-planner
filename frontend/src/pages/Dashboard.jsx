import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Map, PlusCircle, Globe, Clock, ArrowRight, TrendingUp, Users, Star,
  MapPin, Search, SlidersHorizontal, Grid3X3, List, Heart, ChevronLeft,
  ChevronRight, MoreHorizontal, Eye, Bookmark
} from 'lucide-react';
import { format } from 'date-fns';

/* ── Constants ────────────────────────────────────────────────────────────── */
const MESHES = ['trip-card-mesh-1', 'trip-card-mesh-2', 'trip-card-mesh-3', 'trip-card-mesh-4', 'trip-card-mesh-5', 'trip-card-mesh-6'];
const STATUS_BADGE = { PLANNING: 'badge-teal', CONFIRMED: 'badge-sage', ONGOING: 'badge-amber', COMPLETED: 'badge-sage', CANCELLED: 'badge-red' };

const RECOMMENDED = [
  { id: 1, name: 'Bali Getaway', country: 'Indonesia', duration: '7 Days', budget: '₹65,000', category: 'Beach', tag: 'Trending', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80', color: 'from-orange-400 to-pink-500' },
  { id: 2, name: 'Swiss Alps Escape', country: 'Switzerland', duration: '10 Days', budget: '₹2,40,000', category: 'Mountains', tag: 'Top Rated', img: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&q=80', color: 'from-blue-400 to-cyan-500' },
  { id: 3, name: 'Greece Island Hopping', country: 'Greece', duration: '12 Days', budget: '₹1,80,000', category: 'Culture', tag: 'Popular', img: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400&q=80', color: 'from-sky-400 to-blue-600' },
  { id: 4, name: 'Vietnam Explorer', country: 'Vietnam', duration: '8 Days', budget: '₹55,000', category: 'Adventure', tag: 'Hidden Gem', img: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=400&q=80', color: 'from-green-400 to-emerald-600' },
  { id: 5, name: 'Rajasthan Heritage', country: 'India', duration: '6 Days', budget: '₹28,000', category: 'Culture', tag: 'Heritage', img: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400&q=80', color: 'from-amber-400 to-orange-500' },
];

const EXPLORE_ACTIONS = [
  { to: '/cities', icon: Globe, label: 'Search Cities', color: '#0369A1', bg: 'rgba(219,234,254,0.6)', border: 'rgba(147,197,253,0.4)' },
  { to: '/activities', icon: TrendingUp, label: 'Find Activities', color: '#059669', bg: 'rgba(209,250,229,0.6)', border: 'rgba(110,231,183,0.4)' },
  { to: '/community', icon: Users, label: 'Community', color: '#2E7D6B', bg: 'rgba(167,196,160,0.25)', border: 'rgba(124,154,126,0.35)' },
  { to: '/trips/new', icon: PlusCircle, label: 'Plan a Trip', color: '#D97706', bg: 'rgba(254,243,199,0.6)', border: 'rgba(253,230,138,0.4)' },
];

/* ── Animation variants ───────────────────────────────────────────────────── */
const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } } };
const stagger = { show: { transition: { staggerChildren: 0.08 } } };
const cardHover = { rest: { scale: 1, y: 0 }, hover: { scale: 1.02, y: -4, transition: { duration: 0.25, ease: 'easeOut' } } };

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function Dashboard() {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [wishlist, setWishlist] = useState({});
  const [viewMode, setViewMode] = useState('grid');
  const scrollRef = useRef(null);

  useEffect(() => {
    api.get('/trips').then(({ data }) => setTrips(data)).finally(() => setLoading(false));
  }, []);

  const upcoming = trips.filter(t => new Date(t.startDate) > new Date()).slice(0, 3);
  const recent = trips.slice(0, 5);
  const completed = trips.filter(t => t.status === 'COMPLETED');

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.name?.split(' ')[0] || 'Traveller';

  const scrollCards = (dir) => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };

  const toggleWish = (id) => setWishlist(w => ({ ...w, [id]: !w[id] }));

  const filteredTrips = recent.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));

  /* ── Stats ────────────────────────────────────────────────────────────────── */
  const stats = [
    { label: 'Total Trips', value: trips.length, icon: Map, grad: 'from-[#2E7D6B] to-[#5EEAD4]', light: 'rgba(46,125,107,0.1)' },
    { label: 'Upcoming', value: upcoming.length, icon: Clock, grad: 'from-[#0369A1] to-[#38BDF8]', light: 'rgba(3,105,161,0.1)' },
    { label: 'Completed', value: completed.length, icon: Star, grad: 'from-[#D97706] to-[#FCD34D]', light: 'rgba(217,119,6,0.1)' },
  ];

  return (
    <motion.div className="space-y-6 animate-fade-in" initial="hidden" animate="show" variants={stagger}>

      {/* ── HERO BANNER ──────────────────────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="relative overflow-hidden rounded-3xl min-h-[220px] md:min-h-[260px]">
        {/* Scenic background */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=85"
            alt="Travel scenic"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,rgba(30,94,82,0.78) 0%,rgba(46,125,107,0.55) 50%,rgba(0,0,0,0.15) 100%)' }} />
        </div>

        {/* Floating dots */}
        {[...Array(6)].map((_, i) => (
          <motion.div key={i} className="absolute w-1.5 h-1.5 rounded-full bg-white/30"
            style={{ top: `${15 + i * 12}%`, left: `${60 + i * 5}%` }}
            animate={{ y: [0, -8, 0], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4 }}
          />
        ))}

        {/* Content */}
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between p-7 md:p-10 gap-6 h-full">
          <div className="text-white">
            <motion.p className="text-sm font-medium text-white/70 mb-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              {greeting} 👋
            </motion.p>
            <motion.h1 className="text-3xl md:text-4xl font-bold font-display mb-2 leading-tight"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              {firstName}, ready<br />to explore? ✈️
            </motion.h1>
            <motion.p className="text-white/70 text-sm max-w-xs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              {trips.length === 0
                ? 'Start planning your first adventure today.'
                : `You have ${trips.length} trip${trips.length !== 1 ? 's' : ''} — keep discovering!`}
            </motion.p>
            <motion.div className="flex flex-wrap gap-3 mt-5" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Link to="/trips/new" className="btn-primary py-2.5 px-5 text-sm">
                <PlusCircle className="w-4 h-4" /> New Trip
              </Link>
              <Link to="/community" className="btn-secondary py-2.5 px-5 text-sm">
                <Globe className="w-4 h-4" /> Explore Community
              </Link>
            </motion.div>
          </div>

          {/* Floating quote card */}
          <motion.div
            className="hidden md:block shrink-0 rounded-2xl p-5 max-w-[220px]"
            style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.25)' }}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
            <p className="text-white text-sm font-medium leading-relaxed italic">
              "The world is a book, and those who do not travel read only one page."
            </p>
            <p className="text-white/60 text-xs mt-3">— Saint Augustine</p>
          </motion.div>
        </div>
      </motion.div>

      {/* ── STATS ────────────────────────────────────────────────────────────── */}
      <motion.div variants={stagger} className="grid grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon, grad, light }) => (
          <motion.div key={label} variants={fadeUp} whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="card p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center shrink-0`}
              style={{ boxShadow: `0 6px 20px ${light}` }}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold font-display text-[#1F2937]">{value}</p>
              <p className="text-xs text-[#9CA3AF] font-semibold uppercase tracking-wide">{label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── SEARCH + FILTER BAR ───────────────────────────────────────────────── */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <input
            placeholder="Search your trips…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-11 pr-4 py-3 rounded-2xl w-full"
          />
        </div>
        <div className="flex gap-2 shrink-0">
          <button className="btn-ghost flex items-center gap-2 border border-[rgba(124,154,126,0.2)] rounded-2xl px-4 py-2.5 text-sm"
            style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(8px)' }}>
            <SlidersHorizontal className="w-4 h-4" /> Filter
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className="btn-icon" title="Grid"
            style={viewMode === 'grid' ? { background: 'rgba(46,125,107,0.15)', borderColor: 'rgba(46,125,107,0.35)', color: '#2E7D6B' } : {}}>
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className="btn-icon" title="List"
            style={viewMode === 'list' ? { background: 'rgba(46,125,107,0.15)', borderColor: 'rgba(46,125,107,0.35)', color: '#2E7D6B' } : {}}>
            <List className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* ── RECOMMENDED TRIPS ────────────────────────────────────────────────── */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="section-title mb-0">Top Recommended For You</h2>
            <p className="text-xs text-[#9CA3AF] mt-0.5">Curated destinations just for you</p>
          </div>
          <div className="flex gap-2">
            <motion.button whileHover={{ scale: 1.05 }} onClick={() => scrollCards(-1)}
              className="btn-icon w-8 h-8 rounded-xl"><ChevronLeft className="w-4 h-4" /></motion.button>
            <motion.button whileHover={{ scale: 1.05 }} onClick={() => scrollCards(1)}
              className="btn-icon w-8 h-8 rounded-xl"><ChevronRight className="w-4 h-4" /></motion.button>
          </div>
        </div>

        <div ref={scrollRef} className="flex gap-4 overflow-x-auto scroll-hide pb-2">
          {RECOMMENDED.map((dest, i) => (
            <motion.div key={dest.id}
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
              whileHover="hover" variants={cardHover}
              className="shrink-0 w-60 overflow-hidden cursor-pointer group" style={{ borderRadius: 16 }}>
              <Link
                to={`/trips/new?title=${encodeURIComponent(dest.name + ' — ' + dest.country)}`}
                className="block card overflow-hidden h-full"
                style={{ textDecoration: 'none' }}
              >
                {/* Image */}
                <div className="relative h-40 overflow-hidden">
                  <img src={dest.img} alt={dest.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  {/* Tag */}
                  <span className="absolute top-3 left-3 text-white text-[10px] font-bold px-2 py-1 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)' }}>
                    {dest.tag}
                  </span>
                  {/* Wishlist */}
                  <motion.button whileTap={{ scale: 0.85 }}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWish(dest.id); }}
                    className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}>
                    <Heart className={`w-3.5 h-3.5 transition-colors ${wishlist[dest.id] ? 'text-red-400 fill-red-400' : 'text-white'}`} />
                  </motion.button>
                  {/* Category */}
                  <span className="absolute bottom-3 right-3 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/40">
                    {dest.category}
                  </span>
                </div>
                {/* Info */}
                <div className="p-4">
                  <h3 className="font-bold text-[#1F2937] text-sm group-hover:text-[#2E7D6B] transition-colors">{dest.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-[#9CA3AF]" />
                    <span className="text-xs text-[#6B7280]">{dest.country}</span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div>
                      <p className="text-xs text-[#9CA3AF]">Est. Budget</p>
                      <p className="text-sm font-bold text-[#2E7D6B]">{dest.budget}</p>
                    </div>
                    <span className="text-xs font-medium text-[#6B7280] bg-[#EFEDE7] px-2 py-1 rounded-lg">{dest.duration}</span>
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-xs text-[#2E7D6B] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Plan this trip <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── PREVIOUS TRIPS ────────────────────────────────────────────────────── */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="section-title mb-0">Your Trips</h2>
            <p className="text-xs text-[#9CA3AF] mt-0.5">{filteredTrips.length} trip{filteredTrips.length !== 1 ? 's' : ''} found</p>
          </div>
          <Link to="/trips" className="btn-ghost text-sm text-[#2E7D6B]">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="skeleton h-20" />)}
          </div>
        ) : filteredTrips.length === 0 ? (
          <motion.div variants={fadeUp} className="card p-12 text-center">
            <Map className="w-12 h-12 text-[#D1D5DB] mx-auto mb-3" />
            <p className="text-[#6B7280] font-semibold">
              {search ? 'No trips match your search' : 'No trips yet'}
            </p>
            <p className="text-[#9CA3AF] text-sm mt-1">Create your first trip to get started</p>
            <Link to="/trips/new" className="btn-primary mt-5 inline-flex">
              <PlusCircle className="w-4 h-4" /> Create Trip
            </Link>
          </motion.div>
        ) : viewMode === 'list' ? (
          <motion.div variants={stagger} className="space-y-3">
            {filteredTrips.map((trip, idx) => (
              <motion.div key={trip.id} variants={fadeUp} whileHover={{ x: 4, transition: { duration: 0.2 } }}>
                <Link to={`/trips/${trip.id}`}
                  className="card flex items-center gap-4 p-4 group transition-all duration-300 hover:border-[rgba(46,125,107,0.35)] hover:shadow-lg block">
                  <div className={`w-12 h-12 rounded-2xl ${MESHES[idx % MESHES.length]} shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#1F2937] text-sm group-hover:text-[#2E7D6B] transition-colors truncate">{trip.title}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Clock className="w-3 h-3 text-[#9CA3AF]" />
                      <p className="text-xs text-[#6B7280]">
                        {format(new Date(trip.startDate), 'MMM d')} – {format(new Date(trip.endDate), 'MMM d, yyyy')}
                      </p>
                    </div>
                    {trip.stops?.length > 0 && (
                      <p className="text-xs text-[#9CA3AF] mt-0.5 flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 shrink-0" />
                        {trip.stops.map(s => s.city?.name).filter(Boolean).map((name, i, arr) => <span key={i} className="flex items-center">{name}{i < arr.length - 1 && <ArrowRight className="w-3 h-3 mx-1 inline" />}</span>)}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={STATUS_BADGE[trip.status] + ' badge'}>{trip.status}</span>
                    <span className="btn-icon w-7 h-7 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <Eye className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTrips.map((trip, idx) => (
              <motion.div key={trip.id} variants={fadeUp} whileHover="hover" initial="rest" variants={cardHover}>
                <Link to={`/trips/${trip.id}`} className="card-hover overflow-hidden block group">
                  <div className={`h-32 ${MESHES[idx % MESHES.length]} relative flex items-end p-4`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
                    <div className="relative flex items-center justify-between w-full">
                      <span className={STATUS_BADGE[trip.status] + ' badge'}>{trip.status}</span>
                      <span className="text-white/70 text-[10px]">{format(new Date(trip.startDate), 'MMM d')} – {format(new Date(trip.endDate), 'MMM d')}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-[#1F2937] text-sm group-hover:text-[#2E7D6B] transition-colors">{trip.title}</h3>
                    {trip.stops?.length > 0 && (
                      <p className="text-xs text-[#9CA3AF] mt-1.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {trip.stops.map(s => s.city?.name).filter(Boolean).map((name, i, arr) => <span key={i} className="flex items-center">{name}{i < arr.length - 1 && <ArrowRight className="w-3 h-3 mx-1 inline" />}</span>)}
                      </p>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* ── EXPLORE ──────────────────────────────────────────────────────────── */}
      <motion.div variants={fadeUp}>
        <h2 className="section-title">Explore Globetrotter</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {EXPLORE_ACTIONS.map(({ to, icon: Icon, label, color, bg, border }) => (
            <motion.div key={to} whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.1)' }} transition={{ duration: 0.2 }}>
              <Link to={to}
                className="rounded-3xl p-5 text-center block group transition-all duration-300 border"
                style={{ background: bg, borderColor: border, backdropFilter: 'blur(8px)' }}>
                <motion.div whileHover={{ scale: 1.15 }} transition={{ duration: 0.2 }} className="w-10 h-10 rounded-2xl mx-auto mb-3 flex items-center justify-center" style={{ background: `${color}18` }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </motion.div>
                <p className="text-sm font-bold font-display" style={{ color }}>{label}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

    </motion.div>
  );
}