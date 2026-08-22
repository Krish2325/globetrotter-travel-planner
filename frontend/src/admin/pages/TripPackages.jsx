import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Star, Edit2 } from 'lucide-react';
const GLASS = { background:'rgba(255,255,255,0.55)', backdropFilter:'blur(18px)', WebkitBackdropFilter:'blur(18px)', border:'1px solid rgba(255,255,255,0.25)', boxShadow:'0 8px 32px rgba(31,41,55,0.08)' };
const PKGS = [
  { id:1, name:'Bali Premium Package', price:'Rs.75,000', duration:'8 Days', rating:4.8, season:'Summer', img:'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=300&q=80' },
  { id:2, name:'Swiss Alps Luxury', price:'Rs.2,50,000', duration:'10 Days', rating:4.9, season:'Winter', img:'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=300&q=80' },
  { id:3, name:'Goa Beach Escape', price:'Rs.45,000', duration:'5 Days', rating:4.6, season:'Winter', img:'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=300&q=80' },
  { id:4, name:'Rajasthan Heritage Tour', price:'Rs.35,000', duration:'7 Days', rating:4.7, season:'Winter', img:'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=300&q=80' },
];
export default function TripPackages() {
  return (
    <motion.div className="space-y-6" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}>
      <div className="flex items-center justify-between"><div><h1 className="page-title">Trip Packages</h1><p className="page-subtitle">Curated packages with pricing and seasonal info</p></div><button className="btn-primary"><Plus className="w-4 h-4" />New Package</button></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {PKGS.map(p => <motion.div key={p.id} whileHover={{ y:-4, boxShadow:'0 16px 48px rgba(46,125,107,0.12)' }} className="rounded-3xl overflow-hidden" style={GLASS}><div className="relative h-44 overflow-hidden"><img src={p.img} alt={p.name} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" /><div className="absolute bottom-3 left-3 right-3 flex items-center justify-between"><span className="badge badge-teal">{p.season}</span><div className="flex items-center gap-1 text-white text-xs font-bold"><Star className="w-3 h-3" style={{ fill:'#FBBF24', color:'#FBBF24' }} />{p.rating}</div></div></div><div className="p-4"><h3 className="font-bold font-display text-sm" style={{ color:'#1F2937' }}>{p.name}</h3><div className="flex items-center justify-between mt-2"><span className="text-base font-bold font-display" style={{ color:'#2E7D6B' }}>{p.price}</span><span className="text-xs" style={{ color:'#6B7280' }}>{p.duration}</span></div><button className="btn-secondary w-full mt-3 justify-center py-2 text-xs flex items-center gap-1.5"><Edit2 className="w-3 h-3" />Edit Package</button></div></motion.div>)}
      </div>
    </motion.div>
  );
}