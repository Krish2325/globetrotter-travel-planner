import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../lib/api';
import { Plus, Search, Edit2, Trash2, Eye, Filter } from 'lucide-react';
const GLASS = { background:'rgba(255,255,255,0.55)', backdropFilter:'blur(18px)', WebkitBackdropFilter:'blur(18px)', border:'1px solid rgba(255,255,255,0.25)', boxShadow:'0 8px 32px rgba(31,41,55,0.08)' };
export default function ManageTrips() {
  const [trips, setTrips] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/trips').then(({ data }) => setTrips(data)).catch(() => {}).finally(() => setLoading(false)); }, []);
  const filtered = trips.filter(t => t.title.toLowerCase().includes(q.toLowerCase()));
  return (
    <motion.div className="space-y-6" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}>
      <div className="flex items-center justify-between">
        <div><h1 className="page-title">Manage Trips</h1><p className="page-subtitle">{trips.length} trips on platform</p></div>
        <button className="btn-primary"><Plus className="w-4 h-4" />Add Trip</button>
      </div>
      <div className="rounded-3xl p-6" style={GLASS}>
        <div className="flex gap-3 mb-5">
          <div className="relative flex-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color:'#9CA3AF' }} /><input placeholder="Search trips..." className="input pl-11" value={q} onChange={e => setQ(e.target.value)} /></div>
          <button className="btn-ghost border rounded-2xl px-4 flex items-center gap-2 text-sm" style={{ borderColor:'rgba(124,154,126,0.2)', background:'rgba(255,255,255,0.6)' }}><Filter className="w-4 h-4" />Filter</button>
        </div>
        {loading ? <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-16" />)}</div> : (
          <div className="space-y-2">
            {filtered.length === 0 && <p className="text-center py-12" style={{ color:'#9CA3AF' }}>No trips found</p>}
            {filtered.map((t, i) => (
              <div key={t.id} className="flex items-center gap-4 p-4 rounded-2xl" style={{ background:'rgba(124,154,126,0.05)', border:'1px solid rgba(124,154,126,0.1)' }}>
                <div className={'w-12 h-12 rounded-2xl shrink-0 trip-card-mesh-' + ((i % 6) + 1)} />
                <div className="flex-1 min-w-0"><p className="font-semibold truncate" style={{ color:'#1F2937' }}>{t.title}</p><p className="text-xs" style={{ color:'#9CA3AF' }}>{new Date(t.startDate).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</p></div>
                <span className={'badge badge-' + (t.status === 'COMPLETED' ? 'sage' : t.status === 'ONGOING' ? 'amber' : 'teal')}>{t.status}</span>
                <div className="flex gap-2"><button className="btn-icon w-8 h-8 rounded-xl"><Eye className="w-3.5 h-3.5" /></button><button className="btn-icon w-8 h-8 rounded-xl"><Edit2 className="w-3.5 h-3.5" /></button><button className="btn-icon w-8 h-8 rounded-xl" style={{ color:'#EF4444' }}><Trash2 className="w-3.5 h-3.5" /></button></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}