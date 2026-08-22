import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, UserX, Eye, Download } from 'lucide-react';
const GLASS = { background:'rgba(255,255,255,0.55)', backdropFilter:'blur(18px)', WebkitBackdropFilter:'blur(18px)', border:'1px solid rgba(255,255,255,0.25)', boxShadow:'0 8px 32px rgba(31,41,55,0.08)' };
const MOCK = [
  { id:1, name:'Areen Sharma', email:'areen@gmail.com', role:'USER', trips:5, joined:'Jan 15, 2024', status:'active' },
  { id:2, name:'Jeel Patel', email:'jeel@globetrotter.dev', role:'ADMIN', trips:12, joined:'Jan 1, 2024', status:'active' },
  { id:3, name:'Priya Mehta', email:'priya@example.com', role:'USER', trips:3, joined:'Feb 20, 2024', status:'active' },
  { id:4, name:'Rahul Kumar', email:'rahul@example.com', role:'USER', trips:0, joined:'Mar 5, 2024', status:'banned' },
];
export default function ManageUsers() {
  const [q, setQ] = useState('');
  const filtered = MOCK.filter(u => u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase()));
  return (
    <motion.div className="space-y-6" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}>
      <div className="flex items-center justify-between"><div><h1 className="page-title">User Management</h1><p className="page-subtitle">{MOCK.length} registered users</p></div><button className="btn-secondary flex items-center gap-2 text-sm"><Download className="w-4 h-4" />Export CSV</button></div>
      <div className="rounded-3xl p-6" style={GLASS}>
        <div className="relative mb-5"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color:'#9CA3AF' }} /><input placeholder="Search users..." className="input pl-11" value={q} onChange={e => setQ(e.target.value)} /></div>
        <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr style={{ borderBottom:'1px solid rgba(99, 102, 241,0.15)' }}>{['User','Email','Role','Trips','Joined','Status','Actions'].map(h => <th key={h} className="text-left py-3 px-3 font-semibold" style={{ color:'#6B7280', fontSize:'11px', textTransform:'uppercase', letterSpacing:'0.05em' }}>{h}</th>)}</tr></thead><tbody>{filtered.map(u => <tr key={u.id} style={{ borderBottom:'1px solid rgba(99, 102, 241,0.08)' }}><td className="py-3 px-3"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background:'linear-gradient(135deg,#4F46E5,#6366F1)' }}>{u.name[0]}</div><span className="font-semibold" style={{ color:'#1F2937' }}>{u.name}</span></div></td><td className="py-3 px-3" style={{ color:'#6B7280' }}>{u.email}</td><td className="py-3 px-3"><span className={'badge ' + (u.role === 'ADMIN' ? 'badge-teal' : 'badge-cream')}>{u.role}</span></td><td className="py-3 px-3 font-semibold" style={{ color:'#1F2937' }}>{u.trips}</td><td className="py-3 px-3" style={{ color:'#9CA3AF' }}>{u.joined}</td><td className="py-3 px-3"><span className={'badge ' + (u.status === 'banned' ? 'badge-red' : 'badge-sage')}>{u.status}</span></td><td className="py-3 px-3"><div className="flex gap-2"><button className="btn-icon w-7 h-7 rounded-xl"><Eye className="w-3 h-3" /></button><button className="btn-icon w-7 h-7 rounded-xl"><UserX className="w-3 h-3" style={{ color:'#EF4444' }} /></button></div></td></tr>)}</tbody></table></div>
      </div>
    </motion.div>
  );
}