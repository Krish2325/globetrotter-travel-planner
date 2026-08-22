import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../lib/api';
import { Plus, Search, Edit2, Globe } from 'lucide-react';
const GLASS = { background:'rgba(255,255,255,0.55)', backdropFilter:'blur(18px)', WebkitBackdropFilter:'blur(18px)', border:'1px solid rgba(255,255,255,0.25)', boxShadow:'0 8px 32px rgba(31,41,55,0.08)' };
export default function ManageCities() {
  const [cities, setCities] = useState([]);
  const [q, setQ] = useState('');
  useEffect(() => { api.get('/cities').then(({ data }) => setCities(data)).catch(() => {}); }, []);
  const filtered = cities.filter(c => c.name.toLowerCase().includes(q.toLowerCase()) || c.country.toLowerCase().includes(q.toLowerCase()));
  return (
    <motion.div className="space-y-6" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}>
      <div className="flex items-center justify-between"><div><h1 className="page-title">Popular Cities</h1><p className="page-subtitle">{cities.length} cities listed</p></div><button className="btn-primary"><Plus className="w-4 h-4" />Add City</button></div>
      <div className="rounded-3xl p-6" style={GLASS}>
        <div className="relative mb-5"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color:'#9CA3AF' }} /><input placeholder="Search cities..." className="input pl-11" value={q} onChange={e => setQ(e.target.value)} /></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((city, i) => <motion.div key={city.id} whileHover={{ y:-3, boxShadow:'0 12px 32px rgba(46,125,107,0.12)' }} className="rounded-2xl p-4" style={{ background:'rgba(124,154,126,0.06)', border:'1px solid rgba(124,154,126,0.15)' }}><div className="flex items-start justify-between mb-3"><div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background:'rgba(46,125,107,0.1)' }}><Globe className="w-6 h-6" style={{ color:'#2E7D6B' }} /></div><button className="btn-icon w-7 h-7 rounded-xl"><Edit2 className="w-3 h-3" /></button></div><h3 className="font-bold" style={{ color:'#1F2937' }}>{city.name}</h3><p className="text-sm" style={{ color:'#6B7280' }}>{city.country}</p>{city.description && <p className="text-xs mt-2 line-clamp-2" style={{ color:'#9CA3AF' }}>{city.description}</p>}<div className="flex gap-2 mt-3"><span className="badge badge-teal">{city.countryCode}</span></div></motion.div>)}
          {filtered.length === 0 && <p className="text-center py-12 col-span-3" style={{ color:'#9CA3AF' }}>No cities found</p>}
        </div>
      </div>
    </motion.div>
  );
}