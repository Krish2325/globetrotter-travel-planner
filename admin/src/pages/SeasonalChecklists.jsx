import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, CheckSquare, Trash2, ChevronDown } from "lucide-react";
const card = { background:"rgba(255,255,255,0.55)", backdropFilter:"blur(18px)", WebkitBackdropFilter:"blur(18px)", border:"1px solid rgba(255,255,255,0.25)", boxShadow:"0 8px 32px rgba(31,41,55,0.08)", borderRadius:24 };
const INIT_TEMPLATES = [
  {id:1,season:"Summer",type:"Beach",categories:{Documents:["Passport","Travel Insurance","Hotel Bookings"],Clothing:["Swimwear","Shorts","Sunhat","Sunglasses"],Electronics:["Camera","Power Bank","Waterproof case"],Essentials:["Sunscreen SPF50","After-sun lotion","Beach towel","Sandals"]}},
  {id:2,season:"Winter",type:"Mountain",categories:{Documents:["ID Proof","Permits","Emergency Contacts"],Clothing:["Thermal innerwear","Down jacket","Woolen socks","Gloves","Snow boots"],Electronics:["Headlamp","Hand warmers","Satellite phone"],Essentials:["Water bottles","Energy bars","First aid kit","Altitude sickness meds"]}},
  {id:3,season:"Monsoon",type:"Domestic",categories:{Documents:["Passport/ID","Travel Insurance","Hotel Bookings"],Clothing:["Raincoat","Quick-dry clothes","Extra socks"],Electronics:["Waterproof bag","Power bank"],Essentials:["Mosquito repellent","ORS packets","Dry bags","Umbrella"]}},
  {id:4,season:"Spring",type:"Cultural",categories:{Documents:["Passport","Visa","Travel Insurance"],Clothing:["Light layers","Comfortable walking shoes","Scarf"],Electronics:["Camera","Travel adapter","Earphones"],Essentials:["Water bottle","Sunscreen","Guide book","Local currency"]}},
];
export default function SeasonalChecklists() {
  const [templates, setTemplates] = useState(INIT_TEMPLATES);
  const [selId, setSelId] = useState(1);
  const [newItems, setNewItems] = useState({});   // { [cat]: string }
  const [openCat, setOpenCat] = useState(null);

  const sel = templates.find(t => t.id === selId) || templates[0];

  const addItem = (cat) => {
    const val = (newItems[cat] || "").trim();
    if (!val) return;
    setTemplates(templates.map(t =>
      t.id === sel.id
        ? { ...t, categories: { ...t.categories, [cat]: [...t.categories[cat], val] } }
        : t
    ));
    setNewItems({ ...newItems, [cat]: "" });
  };

  const deleteItem = (cat, idx) => {
    setTemplates(templates.map(t =>
      t.id === sel.id
        ? { ...t, categories: { ...t.categories, [cat]: t.categories[cat].filter((_, i) => i !== idx) } }
        : t
    ));
  };

  return(
    <div style={{display:"flex",flexDirection:"column",gap:"1.5rem"}}>
      <motion.div initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:"1rem"}}>
        <div><h1 className="page-title">Seasonal Checklists</h1><p className="page-subtitle">Smart packing templates for every trip type</p></div>
        <motion.button whileHover={{scale:1.02,y:-1}} className="btn btn-primary"><Plus size={16}/>New Template</motion.button>
      </motion.div>
      <div className="rg-checklist">
        <div style={{display:"flex",flexDirection:"column",gap:"0.625rem"}}>
          {templates.map(t=>(
            <motion.div key={t.id} onClick={()=>{ setSelId(t.id); setOpenCat(null); }} whileHover={{x:4}} style={{...card,padding:"1rem",cursor:"pointer",borderRadius:16,background:selId===t.id?"rgba(46,125,107,0.1)":"rgba(255,255,255,0.65)",border:"1px solid "+(selId===t.id?"rgba(46,125,107,0.4)":"rgba(124,154,126,0.18)")}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div><p style={{fontWeight:700,fontSize:"0.9rem",color:"#1F2937"}}>{t.season} — {t.type}</p><p style={{fontSize:"0.75rem",color:"#9CA3AF",marginTop:2}}>{Object.values(t.categories).flat().length} items</p></div>
                <span className="badge badge-sage">{t.season}</span>
              </div>
            </motion.div>
          ))}
        </div>
        <div style={card}>
          <div style={{padding:"1.5rem"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1.25rem"}}>
              <div><h2 className="section-title">{sel.season} - {sel.type}</h2><p style={{fontSize:"0.8rem",color:"#9CA3AF",marginTop:2}}>Click a category to expand & add items</p></div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:"0.75rem"}}>
              {Object.entries(sel.categories).map(([cat,items])=>(
                <div key={cat} style={{borderRadius:16,border:"1px solid rgba(124,154,126,0.15)",overflow:"hidden"}}>
                  <button onClick={()=>setOpenCat(openCat===cat?null:cat)}
                    style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0.875rem 1rem",background:"rgba(124,154,126,0.06)",border:"none",cursor:"pointer",textAlign:"left"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <CheckSquare size={15} color="#2E7D6B"/>
                      <span style={{fontWeight:700,color:"#1F2937",fontSize:"0.875rem"}}>{cat}</span>
                      <span style={{fontSize:"0.7rem",color:"#9CA3AF"}}>({items.length} items)</span>
                    </div>
                    <ChevronDown size={15} color="#9CA3AF" style={{transform:openCat===cat?"rotate(180deg)":"none",transition:"transform 0.2s"}}/>
                  </button>
                  <AnimatePresence>
                    {openCat===cat&&(
                      <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} style={{overflow:"hidden"}}>
                        <div style={{padding:"0.75rem 1rem",display:"flex",flexDirection:"column",gap:"0.5rem"}}>
                          {items.map((item,i)=>(
                            <div key={i} style={{display:"flex",alignItems:"center",gap:"0.75rem",padding:"0.5rem 0.75rem",borderRadius:12,background:i%2===0?"rgba(124,154,126,0.04)":"transparent"}}>
                              <CheckSquare size={13} color="#A7C4A0"/>
                              <span style={{flex:1,fontSize:"0.875rem",color:"#1F2937"}}>{item}</span>
                              <button onClick={()=>deleteItem(cat,i)} className="btn-icon" style={{width:24,height:24,borderRadius:8}}><Trash2 size={11} color="#EF4444"/></button>
                            </div>
                          ))}
                          <div style={{display:"flex",gap:"0.5rem",marginTop:"0.5rem"}}>
                            <input
                              className="input"
                              placeholder={"Add "+cat.toLowerCase()+" item..."}
                              style={{flex:1,padding:"0.5rem 0.75rem",fontSize:"0.8rem"}}
                              value={newItems[cat]||""}
                              onChange={e=>setNewItems({...newItems,[cat]:e.target.value})}
                              onKeyDown={e=>{ if(e.key==="Enter"){ e.preventDefault(); addItem(cat); } }}
                            />
                            <button onClick={()=>addItem(cat)} className="btn btn-primary" style={{padding:"0.5rem 0.875rem",fontSize:"0.8rem"}}><Plus size={13}/>Add</button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}