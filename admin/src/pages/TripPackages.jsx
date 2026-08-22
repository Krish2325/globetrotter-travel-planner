import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Star, Edit2, Trash2, X, Loader } from "lucide-react";
import api from "../api/axios";

const card = { background:"rgba(255,255,255,0.55)", backdropFilter:"blur(18px)", WebkitBackdropFilter:"blur(18px)", border:"1px solid rgba(255,255,255,0.25)", boxShadow:"0 8px 32px rgba(31,41,55,0.08)", borderRadius:24 };
const TAG_C = {"Best Seller":"badge-teal","Premium":"badge-amber","Popular":"badge-sage","Cultural":"badge-cream","Luxury":"badge-amber","Nature":"badge-cream"};

export default function TripPackages() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("rating");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [form, setForm] = useState({
    title: "", destination: "", basePrice: "", bestSeason: "", status: "AVAILABLE", 
    startDate: "", endDate: "", coverImage: "", packageType: "LUXURY", durationDays: ""
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => { fetchTrips(); }, []);

  const fetchTrips = async () => {
    try {
      const { data } = await api.get("/trips");
      setTrips(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sorted = [...trips].sort((a,b) => sort === "rating" ? (b.rating || 0) - (a.rating || 0) : a.title.localeCompare(b.title));

  const openModal = (trip = null) => {
    setFormError("");
    if (trip) {
      setEditingTrip(trip);
      setForm({
        title: trip.title, destination: trip.destination || "", basePrice: trip.basePrice || "",
        bestSeason: trip.bestSeason || "", status: trip.status || "AVAILABLE",
        startDate: new Date(trip.startDate).toISOString().split('T')[0],
        endDate: new Date(trip.endDate).toISOString().split('T')[0],
        coverImage: trip.coverImage || "", packageType: trip.packageType || "LUXURY",
        durationDays: trip.durationDays || ""
      });
    } else {
      setEditingTrip(null);
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
      setForm({
        title: "", destination: "", basePrice: "", bestSeason: "Summer", status: "AVAILABLE",
        startDate: today, endDate: tomorrow, coverImage: "", packageType: "LUXURY", durationDays: "5"
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const submitForm = async (e) => {
    e.preventDefault();
    setFormLoading(true); setFormError("");
    try {
      const payload = { ...form };
      if (editingTrip) {
        await api.patch(`/trips/${editingTrip.id}`, payload);
      } else {
        await api.post("/trips", payload);
      }
      await fetchTrips();
      closeModal();
    } catch (err) {
      setFormError(err.response?.data?.error || err.message || "Operation failed");
    } finally {
      setFormLoading(false);
    }
  };

  const deleteTrip = async (id) => {
    if(!window.confirm("Are you sure you want to delete this package?")) return;
    try {
      await api.delete(`/trips/${id}`);
      setTrips(trips.filter(t => t.id !== id));
    } catch (err) {
      alert("Failed to delete trip");
    }
  };

  return(
    <div style={{display:"flex",flexDirection:"column",gap:"1.5rem"}}>
      <motion.div initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:"1rem"}}>
        <div><h1 className="page-title">Trip Packages</h1><p className="page-subtitle">Curated packages with seasonal pricing</p></div>
        <div style={{display:"flex",gap:"0.75rem",alignItems:"center",flexWrap:"wrap"}}>
          <select className="input" style={{width:"auto"}} value={sort} onChange={e=>setSort(e.target.value)}>
            <option value="rating">Sort by Rating</option><option value="name">Sort by Name</option>
          </select>
          <motion.button onClick={()=>openModal()} whileHover={{scale:1.02,y:-1}} className="btn btn-primary"><Plus size={16}/>New Package</motion.button>
        </div>
      </motion.div>
      
      {loading ? (
        <div style={{textAlign:"center", padding:"3rem"}}><Loader className="spin" size={24} color="#2E7D6B" style={{margin:"0 auto"}}/></div>
      ) : (
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:"1.25rem"}}>
          {sorted.map((p,i)=>(
            <motion.div key={p.id} style={card} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}} whileHover={{y:-5,boxShadow:"0 20px 50px rgba(46,125,107,0.14)"}}>
              <div style={{position:"relative",height:200,overflow:"hidden",borderRadius:"24px 24px 0 0", background:"#e5e7eb"}}>
                {p.coverImage && <img src={p.coverImage} alt={p.title} style={{width:"100%",height:"100%",objectFit:"cover"}}/>}
                <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,0.55),transparent)"}}/>
                <div style={{position:"absolute",top:12,left:12,right:12,display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  {p.packageType && <span className={"badge badge-sage"}>{p.packageType}</span>}
                  <div style={{display:"flex",alignItems:"center",gap:4,background:"rgba(0,0,0,0.35)",backdropFilter:"blur(8px)",padding:"0.2rem 0.6rem",borderRadius:20,color:"#FBBF24",fontSize:"0.8rem",fontWeight:700}}>
                    <Star size={12} style={{fill:"#FBBF24",color:"#FBBF24"}}/>{p.rating || 0}
                  </div>
                </div>
                <div style={{position:"absolute",bottom:12,left:12,right:12}}>
                  <p style={{color:"#fff",fontWeight:800,fontFamily:"Poppins,sans-serif",fontSize:"1.125rem"}}>{p.title}</p>
                  <p style={{color:"rgba(255,255,255,0.7)",fontSize:"0.8rem"}}>{p.durationDays ? `${p.durationDays} Days` : "Custom Duration"} · {p.bestSeason || "All Year"}</p>
                </div>
              </div>
              <div style={{padding:"1.25rem"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <p style={{fontSize:"1.375rem",fontWeight:800,fontFamily:"Poppins,sans-serif",color:"#2E7D6B"}}>{p.basePrice ? `Rs. ${p.basePrice}` : "Contact for price"}</p>
                  <div style={{display:"flex",gap:4}}>
                    <button onClick={()=>openModal(p)} className="btn-icon"><Edit2 size={13}/></button>
                    <button onClick={()=>deleteTrip(p.id)} className="btn-icon"><Trash2 size={13} color="#EF4444"/></button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {sorted.length===0 && <p style={{gridColumn:"1/-1",textAlign:"center",padding:"3rem",color:"#9CA3AF"}}>No packages found</p>}
        </div>
      )}

      {/* Modal - Reused from ManageTrips */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{position:"fixed",inset:0,zIndex:50,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(4px)"}} onClick={closeModal}/>
            <motion.div initial={{opacity:0,scale:0.95,y:20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.95,y:20}} style={{background:"#fff",borderRadius:24,padding:"2rem",width:"100%",maxWidth:600,position:"relative",zIndex:51,maxHeight:"90vh",overflowY:"auto"}}>
              <button onClick={closeModal} style={{position:"absolute",top:20,right:20,background:"none",border:"none",cursor:"pointer"}}><X size={20} color="#9CA3AF"/></button>
              <h2 style={{fontFamily:"Poppins,sans-serif",fontSize:"1.25rem",fontWeight:700,marginBottom:"1.5rem"}}>{editingTrip ? "Edit Package" : "Add New Package"}</h2>
              
              <form onSubmit={submitForm} style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
                {formError && <div style={{padding:"0.75rem",background:"#FEF2F2",color:"#991B1B",borderRadius:8,fontSize:"0.875rem"}}>{formError}</div>}
                
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"}}>
                  <div style={{gridColumn:"1/-1"}}><label className="input-label">Package Title *</label><input required className="input" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} /></div>
                  
                  <div><label className="input-label">Destination</label><input className="input" value={form.destination} onChange={e=>setForm({...form,destination:e.target.value})} /></div>
                  <div><label className="input-label">Base Price (Rs)</label><input type="number" className="input" value={form.basePrice} onChange={e=>setForm({...form,basePrice:e.target.value})} /></div>

                  <div><label className="input-label">Package Type</label>
                    <select className="input" value={form.packageType} onChange={e=>setForm({...form,packageType:e.target.value})}>
                      {["LUXURY","BUDGET","ADVENTURE","FAMILY","HONEYMOON","CULTURAL"].map(t=><option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div><label className="input-label">Best Season</label>
                    <select className="input" value={form.bestSeason} onChange={e=>setForm({...form,bestSeason:e.target.value})}>
                      {["Summer","Winter","Monsoon","Spring","All Year"].map(s=><option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div><label className="input-label">Start Date *</label><input required type="date" className="input" value={form.startDate} onChange={e=>setForm({...form,startDate:e.target.value})} /></div>
                  <div><label className="input-label">End Date *</label><input required type="date" className="input" value={form.endDate} onChange={e=>setForm({...form,endDate:e.target.value})} /></div>
                  
                  <div><label className="input-label">Duration (Days)</label><input type="number" className="input" value={form.durationDays} onChange={e=>setForm({...form,durationDays:e.target.value})} /></div>
                  <div><label className="input-label">Status</label>
                    <select className="input" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
                      {["PLANNING","AVAILABLE","CONFIRMED","ONGOING","COMPLETED","CANCELLED"].map(s=><option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  
                  <div style={{gridColumn:"1/-1"}}><label className="input-label">Cover Image URL</label><input className="input" value={form.coverImage} onChange={e=>setForm({...form,coverImage:e.target.value})} /></div>
                </div>

                <div style={{display:"flex",justifyContent:"flex-end",gap:"0.75rem",marginTop:"1rem"}}>
                  <button type="button" onClick={closeModal} className="btn btn-secondary">Cancel</button>
                  <button type="submit" disabled={formLoading} className="btn btn-primary">{formLoading ? "Saving..." : "Save Package"}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}