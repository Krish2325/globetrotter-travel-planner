import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, BarChart3 } from 'lucide-react';
const GLASS = { background:'rgba(255,255,255,0.55)', backdropFilter:'blur(18px)', WebkitBackdropFilter:'blur(18px)', border:'1px solid rgba(255,255,255,0.25)', boxShadow:'0 8px 32px rgba(31,41,55,0.08)' };
const REPORTS = [
  { label:'Monthly Travel Trends', desc:'Trips created, cities searched, activity bookings', icon:BarChart3, color:'#2E7D6B' },
  { label:'User Growth Report', desc:'New signups, active users, retention rate', icon:FileText, color:'#0369A1' },
  { label:'Revenue Analysis', desc:'Package revenue, seasonal performance', icon:BarChart3, color:'#D97706' },
  { label:'Community Engagement', desc:'Shares, likes, public itineraries', icon:FileText, color:'#7C3AED' },
];
export default function Reports() {
  return (
    <motion.div className="space-y-6" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}>
      <div><h1 className="page-title">Reports and Insights</h1><p className="page-subtitle">Download platform analytics reports</p></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {REPORTS.map(r => <motion.div key={r.label} whileHover={{ y:-3, boxShadow:'0 12px 32px rgba(46,125,107,0.1)' }} className="rounded-3xl p-6" style={GLASS}><div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: r.color + '18' }}><r.icon className="w-6 h-6" style={{ color:r.color }} /></div><h3 className="font-bold font-display" style={{ color:'#1F2937' }}>{r.label}</h3><p className="text-sm mt-1 mb-4" style={{ color:'#6B7280' }}>{r.desc}</p><div className="flex gap-2"><button className="btn-secondary py-2 px-4 text-xs flex items-center gap-1.5"><Download className="w-3.5 h-3.5" />PDF</button><button className="btn-secondary py-2 px-4 text-xs flex items-center gap-1.5"><Download className="w-3.5 h-3.5" />CSV</button></div></motion.div>)}
      </div>
    </motion.div>
  );
}