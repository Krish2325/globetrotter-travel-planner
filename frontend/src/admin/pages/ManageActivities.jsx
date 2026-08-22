import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../lib/api';
import { Plus, Search, Edit2 } from 'lucide-react';
const GLASS = { background:'rgba(255,255,255,0.55)', backdropFilter:'blur(18px)', WebkitBackdropFilter:'blur(18px)', border:'1px solid rgba(255,255,255,0.25)', boxShadow:'0 8px 32px rgba(31,41,55,0.08)' };
const CATS = ['All','Adventure','Hiking','Beaches','Food Tours','Cultural','Snow','Monsoon','Wildlife','Shopping','Religious'];
export default function ManageActivities() {
  const [acts, setActs] = useState([]);
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  useEffect(() => { api.get('/activities').then(({ data }) => setActs(data)).catch(() => {}); }, []);
  const filtered = acts.filter(a => (cat === 'All' || a.category === cat.toUpperCase()) && a.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <motion.div className="space-y-6" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}>
      <div className="flex items-center justify-between"><div><h1 className="page-title">Activities</h1><p className="page-subtitle">{acts.length} listed</p></div><button className="btn-primary"><Plus className="w-4 h-4" />Add Activity</button></div>
      <div className="flex gap-2 flex-wrap">{CATS.map(c => <button key={c} onClick={() => setCat(c)} className="px-4 py-2 rounded-2xl text-sm font-semibold transition-all" style={{ background: cat === c ? 'linear-gradient(135deg,#2E7D6B,#3D9B85)' : 'rgba(255,255,255,0.6)', color: cat === c ? '#fff' : '#6B7280', border:'1px solid rgba(124,154,126,0.2)' }}>{c}</button>)}</div>
      <div className="rounded-3xl p-6" style={GLASS}>
        <div className="relative mb-4"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color:'#9CA3AF' }} /><input placeholder="Search activities..." className="input pl-11" value={q} onChange={e => setQ(e.target.value)} /></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(a => <motion.div key={a.id} whileHover={{ y:-2 }} className="rounded-2xl p-4" style={{ background:'rgba(124,154,126,0.06)', border:'1px solid rgba(124,154,126,0.15)' }}><div className="flex items-start justify-between mb-2"><span className="badge badge-teal">{a.category}</span><button className="btn-icon w-7 h-7 rounded-xl"><Edit2 className="w-3 h-3" /></button></div><h3 className="font-bold text-sm" style={{ color:'#1F2937' }}>{a.name}</h3>{a.durationMin && <p className="text-xs mt-1" style={{ color:'#6B7280' }}>{a.durationMin} min</p>}{a.costEstimate && <p className="text-sm font-bold mt-1" style={{ color:'#2E7D6B' }}>Rs. {a.costEstimate}</p>}</motion.div>)}
          {filtered.length === 0 && <p className="text-center py-12 col-span-3" style={{ color:'#9CA3AF' }}>No activities found</p>}
        </div>
      </div>
    </motion.div>
  );
}