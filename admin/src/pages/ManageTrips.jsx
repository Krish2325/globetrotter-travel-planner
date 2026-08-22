import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Edit2, Trash2, Eye, Filter, Star, X, Save } from "lucide-react";
import api from "../api/axios";
const card={background:"rgba(255,255,255,0.55)",backdropFilter:"blur(18px)",WebkitBackdropFilter:"blur(18px)",border:"1px solid rgba(255,255,255,0.25)",boxShadow:"0 8px 32px rgba(31,41,55,0.08)",borderRadius:24};
const STATUS_C={ACTIVE:"badge-sage",AVAILABLE:"badge-teal",PLANNING:"badge-cream",ONGOING:"badge-amber",COMPLETED:"badge-blue",CANCELLED:"badge-red"};
const BLANK={title:"",description:"",destination:"",startDate:"",endDate:"",basePrice:"",status:"AVAILABLE",packageType:"",bestSeason:"",isPublic:true,isTrending:false,coverImage:"",durationDays:""};

export default function ManageTrips(){
  const [trips,setTrips]=useState([]);const [loading,setLoading]=useState(true);
  const [q,setQ]=useState("");const [filterStatus,setFilterStatus]=useState("All");
  const [modal,setModal]=useState(false);const [editing,setEditing]=useState(null);const [form,setForm]=useState(BLANK);
  const [saving,setSaving]=useState(false);const [error,setError]=useState("");

  const load=()=>{
    setLoading(true);
    api.get("/trips/admin/all").then(({data})=>setTrips(data.trips||[])).catch(()=>{}).finally(()=>setLoading(false));
  };
  useEffect(()=>{ load(); },[]);

  const filtered=trips.filter(t=>
    (filterStatus==="All"||t.status===filterStatus)&&
    (t.title.toLowerCase().includes(q.toLowerCase())||( t.destination||"").toLowerCase().includes(q.toLowerCase()))
  );

  const openAdd=()=>{ setEditing(null);setForm(BLANK);setError("");setModal(true); };
  const openEdit=(t)=>{ setEditing(t); setForm({...t,startDate:t.startDate?.slice(0,10)||"",endDate:t.endDate?.slice(0,10)||"",basePrice:t.basePrice||"",durationDays:t.durationDays||""}); setError(""); setModal(true); };

  const save=async()=>{
    setSaving(true);setError("");
    try{
      if(editing){ await api.patch("/trips/admin/"+editing.id, form); }
      else { await api.post("/trips/admin", form); }
      setModal(false); load();
    }catch(err){ setError(err.response?.data?.error||"Save failed"); }
    finally{ setSaving(false); }
  };

  const del=async(id)=>{
    if(!window.confirm("Delete this trip?")) return;
    try{ await api.delete("/trips/admin/"+id); load(); }catch(err){ alert(err.response?.data?.error||"Delete failed"); }
  };

  return(
    <div style={{display:"flex",flexDirection:"column",gap:"1.5rem"}}>
      <motion.div initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:"1rem"}}>
        <div><h1 className="page-title">Manage Trips</h1><p className="page-subtitle">{trips.length} trips on platform</p></div>
        <motion.button whileHover={{scale:1.02,y:-1}} onClick={openAdd} className="btn btn-primary"><Plus size={16}/>Add New Trip</motion.button>
      </motion.div>

      <motion.div style={card} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.1}}>
        <div style={{padding:"1.5rem"}}>
          <div style={{display:"flex",gap:"0.75rem",marginBottom:"1.25rem",flexWrap:"wrap"}}>
            <div style={{position:"relative",flex:1,minWidth:200}}>
              <Search size={15} style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"#9CA3AF"}}/>
              <input className="input" placeholder="Search trips or destinations..." style={{paddingLeft:40}} value={q} onChange={e=>setQ(e.target.value)}/>
            </div>
            <select className="input" style={{width:"auto"}} value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
              {["All","AVAILABLE","ACTIVE","PLANNING","ONGOING","COMPLETED","CANCELLED"].map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
          {loading?<div className="space-y-3">{[1,2,3].map(i=><div key={i} className="skeleton" style={{height:56}}/>)}</div>:(
            <div style={{overflowX:"auto"}}>
              <table className="admin-table">
                <thead><tr><th>Trip</th><th>Destination</th><th>Price</th><th>Season</th><th>Status</th><th>Rating</th><th>Views</th><th>Actions</th></tr></thead>
                <tbody>
                  {filtered.map((t,i)=>(
                    <tr key={t.id}>
                      <td><div style={{display:"flex",alignItems:"center",gap:"0.75rem"}}><div style={{width:36,height:36,borderRadius:12,flexShrink:0}} className={"mesh-"+((i%6)+1)}/><span style={{fontWeight:600}}>{t.title}</span></div></td>
                      <td style={{color:"#6B7280"}}>{t.destination||"-"}</td>
                      <td style={{fontWeight:700,color:"#2E7D6B"}}>{t.basePrice?"Rs. "+t.basePrice.toLocaleString():"-"}</td>
                      <td><span className="badge badge-cream">{t.bestSeason||"-"}</span></td>
                      <td><span className={"badge "+(STATUS_C[t.status]||"badge-cream")}>{t.status}</span></td>
                      <td><div style={{display:"flex",alignItems:"center",gap:3,fontWeight:700,fontSize:"0.875rem",color:"#F59E0B"}}><Star size={13} style={{fill:"#F59E0B",color:"#F59E0B"}}/>{t.rating||0}</div></td>
                      <td style={{color:"#6B7280"}}>{(t.views||0).toLocaleString()}</td>
                      <td><div style={{display:"flex",gap:4}}>
                        <button className="btn-icon" onClick={()=>openEdit(t)}><Edit2 size={13}/></button>
                        <button className="btn-icon" onClick={()=>del(t.id)}><Trash2 size={13} color="#EF4444"/></button>
                      </div></td>
                    </tr>
                  ))}
                  {filtered.length===0&&<tr><td colSpan={8} style={{textAlign:"center",padding:"3rem",color:"#9CA3AF"}}>No trips found</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {modal&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",backdropFilter:"blur(4px)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem"}}
            onClick={e=>{ if(e.target===e.currentTarget) setModal(false); }}>
            <motion.div initial={{scale:0.95,y:16}} animate={{scale:1,y:0}} exit={{scale:0.95,y:16}}
              style={{...card,width:"100%",maxWidth:560,maxHeight:"90vh",overflowY:"auto",padding:0}}>
              <div style={{padding:"1.5rem",borderBottom:"1px solid rgba(124,154,126,0.15)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <h2 style={{fontFamily:"Poppins,sans-serif",fontWeight:700,color:"#1F2937"}}>{editing?"Edit Trip":"Add New Trip"}</h2>
                <button className="btn-icon" onClick={()=>setModal(false)}><X size={15}/></button>
              </div>
              <div style={{padding:"1.5rem",display:"flex",flexDirection:"column",gap:"1rem"}}>
                {error&&<div style={{padding:"0.75rem",borderRadius:12,background:"#FEE2E2",color:"#991B1B",fontSize:"0.875rem"}}>{error}</div>}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"}}>
                  {[{l:"Title",k:"title",s:2},{l:"Destination",k:"destination"},{l:"Start Date",k:"startDate",t:"date"},{l:"End Date",k:"endDate",t:"date"},{l:"Base Price (Rs.)",k:"basePrice",t:"number"},{l:"Duration (days)",k:"durationDays",t:"number"}].map(f=>(
                    <div key={f.k} style={{gridColumn:f.s?"1/-1":"auto"}}>
                      <label className="input-label">{f.l}</label>
                      <input className="input" type={f.t||"text"} value={form[f.k]||""} onChange={e=>setForm({...form,[f.k]:e.target.value})}/>
                    </div>
                  ))}
                  <div><label className="input-label">Status</label><select className="input" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
                    {["AVAILABLE","PLANNING","ACTIVE","ONGOING","COMPLETED","CANCELLED"].map(s=><option key={s}>{s}</option>)}
                  </select></div>
                  <div><label className="input-label">Package Type</label><select className="input" value={form.packageType||""} onChange={e=>setForm({...form,packageType:e.target.value})}>
                    <option value="">-</option>{["LUXURY","BUDGET","ADVENTURE","FAMILY","HONEYMOON","CULTURAL"].map(s=><option key={s}>{s}</option>)}
                  </select></div>
                  <div><label className="input-label">Best Season</label><input className="input" value={form.bestSeason||""} onChange={e=>setForm({...form,bestSeason:e.target.value})} placeholder="e.g. Winter, All Year"/></div>
                  <div><label className="input-label">Cover Image URL</label><input className="input" value={form.coverImage||""} onChange={e=>setForm({...form,coverImage:e.target.value})}/></div>
                  <div style={{gridColumn:"1/-1"}}><label className="input-label">Description</label><textarea className="input" rows={3} style={{resize:"none"}} value={form.description||""} onChange={e=>setForm({...form,description:e.target.value})}/></div>
                  <div style={{display:"flex",gap:"1.5rem"}}>
                    <label style={{display:"flex",alignItems:"center",gap:8,fontSize:"0.875rem",cursor:"pointer"}}><input type="checkbox" checked={!!form.isPublic} onChange={e=>setForm({...form,isPublic:e.target.checked})}/>Public</label>
                    <label style={{display:"flex",alignItems:"center",gap:8,fontSize:"0.875rem",cursor:"pointer"}}><input type="checkbox" checked={!!form.isTrending} onChange={e=>setForm({...form,isTrending:e.target.checked})}/>Trending</label>
                  </div>
                </div>
              </div>
              <div style={{padding:"1rem 1.5rem",borderTop:"1px solid rgba(124,154,126,0.15)",display:"flex",justifyContent:"flex-end",gap:"0.75rem"}}>
                <button className="btn btn-ghost" onClick={()=>setModal(false)}>Cancel</button>
                <motion.button whileHover={{scale:1.01}} className="btn btn-primary" onClick={save} disabled={saving}>
                  <Save size={14}/>{saving?"Saving...":editing?"Save Changes":"Create Trip"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}