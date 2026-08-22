import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, CheckSquare, Trash2 } from 'lucide-react';
const GLASS = { background:'rgba(255,255,255,0.55)', backdropFilter:'blur(18px)', WebkitBackdropFilter:'blur(18px)', border:'1px solid rgba(255,255,255,0.25)', boxShadow:'0 8px 32px rgba(31,41,55,0.08)' };
const DEMO = [
  { id:1, season:'Summer', tripType:'Beach', items:['Sunscreen SPF50','Swimwear','Hat','Sunglasses','Sandals','Beach towel'] },
  { id:2, season:'Winter', tripType:'Mountain', items:['Thermal innerwear','Down jacket','Woolen socks','Hand warmers','Snow boots'] },
  { id:3, season:'Monsoon', tripType:'Domestic', items:['Raincoat','Waterproof bag','Mosquito repellent','Extra clothing','Dry bags'] },
];
export default function SeasonalChecklists() {
  const [lists] = useState(DEMO);
  const [sel, setSel] = useState(null);
  return (
    <motion.div className="space-y-6" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}>
      <div className="flex items-center justify-between"><div><h1 className="page-title">Seasonal Checklists</h1><p className="page-subtitle">Smart packing templates for every trip type</p></div><button className="btn-primary"><Plus className="w-4 h-4" />New Template</button></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="space-y-3">
          {lists.map(l => <motion.div key={l.id} whileHover={{ x:4 }} onClick={() => setSel(l)} className="rounded-2xl p-4 cursor-pointer" style={{ background: sel && sel.id === l.id ? 'rgba(46,125,107,0.1)' : 'rgba(255,255,255,0.6)', border: '1px solid ' + (sel && sel.id === l.id ? 'rgba(46,125,107,0.4)' : 'rgba(124,154,126,0.18)'), backdropFilter:'blur(12px)' }}><div className="flex items-center justify-between"><div><p className="font-bold text-sm" style={{ color:'#1F2937' }}>{l.season} - {l.tripType}</p><p className="text-xs mt-0.5" style={{ color:'#9CA3AF' }}>{l.items.length} items</p></div><span className="badge badge-teal">{l.season}</span></div></motion.div>)}
        </div>
        {sel ? (
          <div className="lg:col-span-2 rounded-3xl p-6" style={GLASS}>
            <div className="flex items-center justify-between mb-4"><h3 className="font-bold font-display" style={{ color:'#1F2937' }}>{sel.season} - {sel.tripType} Checklist</h3><button className="btn-primary py-2 px-4 text-xs"><Plus className="w-3.5 h-3.5" />Add Item</button></div>
            <div className="space-y-2">{sel.items.map((item, i) => <div key={i} className="flex items-center gap-3 p-3 rounded-2xl" style={{ background:'rgba(124,154,126,0.06)', border:'1px solid rgba(124,154,126,0.12)' }}><CheckSquare className="w-4 h-4 shrink-0" style={{ color:'#2E7D6B' }} /><span className="flex-1 text-sm" style={{ color:'#1F2937' }}>{item}</span><button className="btn-icon w-6 h-6 rounded-lg"><Trash2 className="w-3 h-3" style={{ color:'#EF4444' }} /></button></div>)}</div>
          </div>
        ) : (
          <div className="lg:col-span-2 rounded-3xl p-12 flex items-center justify-center" style={GLASS}>
            <p className="text-center" style={{ color:'#9CA3AF' }}>Select a checklist template to view and edit</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}