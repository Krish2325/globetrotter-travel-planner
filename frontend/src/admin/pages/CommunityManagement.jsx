import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Trash2, Flag } from 'lucide-react';
const GLASS = { background:'rgba(255,255,255,0.55)', backdropFilter:'blur(18px)', WebkitBackdropFilter:'blur(18px)', border:'1px solid rgba(255,255,255,0.25)', boxShadow:'0 8px 32px rgba(31,41,55,0.08)' };
const POSTS = [
  { id:1, user:'Areen S.', title:'My Goa Trip 2024', likes:42, views:380, status:'active' },
  { id:2, user:'Jeel P.', title:'Switzerland in 10 Days', likes:128, views:1240, status:'active' },
  { id:3, user:'Test User', title:'Spam content removed', likes:0, views:2, status:'flagged' },
];
export default function CommunityManagement() {
  return (
    <motion.div className="space-y-6" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}>
      <div><h1 className="page-title">Community Management</h1><p className="page-subtitle">Moderate public itineraries and shared content</p></div>
      <div className="rounded-3xl p-6" style={GLASS}>
        <div className="space-y-3">
          {POSTS.map(p => <div key={p.id} className="flex items-center gap-4 p-4 rounded-2xl" style={{ background: p.status === 'flagged' ? 'rgba(239,68,68,0.05)' : 'rgba(124,154,126,0.05)', border: '1px solid ' + (p.status === 'flagged' ? 'rgba(239,68,68,0.2)' : 'rgba(124,154,126,0.12)') }}><div className="flex-1"><p className="font-semibold" style={{ color:'#1F2937' }}>{p.title}</p><p className="text-xs" style={{ color:'#9CA3AF' }}>by {p.user} - {p.likes} likes - {p.views} views</p></div><span className={'badge ' + (p.status === 'flagged' ? 'badge-red' : 'badge-sage')}>{p.status}</span><div className="flex gap-2"><button className="btn-icon w-7 h-7 rounded-xl"><Eye className="w-3 h-3" /></button><button className="btn-icon w-7 h-7 rounded-xl"><Flag className="w-3 h-3" style={{ color:'#D97706' }} /></button><button className="btn-icon w-7 h-7 rounded-xl"><Trash2 className="w-3 h-3" style={{ color:'#EF4444' }} /></button></div></div>)}
        </div>
      </div>
    </motion.div>
  );
}