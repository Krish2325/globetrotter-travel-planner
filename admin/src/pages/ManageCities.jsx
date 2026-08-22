import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Edit2, MapPin, X, Loader, Trash2 } from "lucide-react";
import api from "../api/axios";

const card = { background:"rgba(255,255,255,0.55)", backdropFilter:"blur(18px)", WebkitBackdropFilter:"blur(18px)", border:"1px solid rgba(255,255,255,0.25)", boxShadow:"0 8px 32px rgba(31,41,55,0.08)", borderRadius:24 };

export default function ManageCities() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [type, setType] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCity, setEditingCity] = useState(null);
  
  const [form, setForm] = useState({
    name: "", country: "", countryCode: "", latitude: "", longitude: "", imageUrl: "", description: ""
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => { fetchCities(); }, []);

  const fetchCities = async () => {
    try {
      const { data } = await api.get("/cities");
      setCities(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (city = null) => {
    setFormError("");
    if (city) {
      setEditingCity(city);
      setForm({
        name: city.name, country: city.country, countryCode: city.countryCode,
        latitude: city.latitude, longitude: city.longitude, imageUrl: city.imageUrl || "", description: city.description || ""
      });
    } else {
      setEditingCity(null);
      setForm({ name: "", country: "", countryCode: "", latitude: "", longitude: "", imageUrl: "", description: "" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const submitForm = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");
    try {
      const payload = {
        ...form,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude)
      };
      if (editingCity) {
        await api.patch(`/cities/${editingCity.id}`, payload);
      } else {
        await api.post("/cities", payload);
      }
      await fetchCities();
      closeModal();
    } catch (err) {
      setFormError(err.response?.data?.error || err.message || "Operation failed");
    } finally {
      setFormLoading(false);
    }
  };

  const deleteCity = async (id) => {
    if(!window.confirm("Are you sure you want to delete this city?")) return;
    try {
      await api.delete(`/cities/${id}`);
      setCities(cities.filter(c => c.id !== id));
    } catch (err) {
      alert("Failed to delete city");
    }
  };

  // Simple local type inference since backend doesn't store 'Domestic/International' directly
  // We'll say if countryCode === 'IN' (assuming India base) it's Domestic, else International
  const getCityType = (code) => code.toUpperCase() === 'IN' ? "Domestic" : "International";

  const filtered = cities.filter(c => 
    (type === "All" || getCityType(c.countryCode) === type) && 
    (c.name.toLowerCase().includes(q.toLowerCase()) || c.country.toLowerCase().includes(q.toLowerCase()))
  );

  return(
    <div style={{display:"flex",flexDirection:"column",gap:"1.5rem"}}>
      <motion.div initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:"1rem"}}>
        <div><h1 className="page-title">Popular Cities</h1><p className="page-subtitle">{cities.length} cities listed</p></div>
        <motion.button onClick={()=>openModal()} whileHover={{scale:1.02,y:-1}} className="btn btn-primary"><Plus size={16}/>Add City</motion.button>
      </motion.div>
      <div style={{display:"flex",gap:"0.75rem",flexWrap:"wrap"}}>
        <div style={{position:"relative",flex:1,minWidth:200}}>
          <Search size={15} style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"#9CA3AF"}}/>
          <input className="input" placeholder="Search cities..." style={{paddingLeft:40}} value={q} onChange={e=>setQ(e.target.value)}/>
        </div>
        {["All","Domestic","International"].map(t=>(
          <button key={t} onClick={()=>setType(t)} className="btn" style={{background:type===t?"linear-gradient(135deg,#2E7D6B,#3D9B85)":"rgba(255,255,255,0.7)",color:type===t?"#fff":"#6B7280",border:"1px solid rgba(124,154,126,0.2)"}}>
            {t}
          </button>
        ))}
      </div>
      
      {loading ? (
        <div style={{textAlign:"center", padding:"3rem"}}><Loader className="spin" size={24} color="#2E7D6B" style={{margin:"0 auto"}}/></div>
      ) : (
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:"1rem"}}>
          {filtered.map((c,i)=>(
            <motion.div key={c.id} style={card} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}} whileHover={{y:-4,boxShadow:"0 16px 48px rgba(46,125,107,0.12)"}}>
              <div style={{height:140,overflow:"hidden",borderRadius:"24px 24px 0 0",position:"relative", background:"#e5e7eb"}}>
                {c.imageUrl && <img src={c.imageUrl} alt={c.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>}
                <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,0.4),transparent)"}}/>
                <div style={{position:"absolute",bottom:10,left:12,right:12,display:"flex",alignItems:"flex-end",justifyContent:"space-between"}}>
                  <div><p style={{color:"#fff",fontWeight:800,fontFamily:"Poppins,sans-serif",fontSize:"1.125rem"}}>{c.name}</p><p style={{color:"rgba(255,255,255,0.75)",fontSize:"0.75rem"}}>{c.country}</p></div>
                  <span style={{background:"rgba(255,255,255,0.2)",backdropFilter:"blur(8px)",color:"#fff",padding:"0.2rem 0.5rem",borderRadius:20,fontSize:"0.65rem",fontWeight:700,border:"1px solid rgba(255,255,255,0.3)"}}>{c.countryCode}</span>
                </div>
              </div>
              <div style={{padding:"1rem"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,fontSize:"0.8rem",color:"#6B7280"}}><MapPin size={13} color="#2E7D6B"/>{c.latitude.toFixed(2)}, {c.longitude.toFixed(2)}</div>
                  <span className={"badge "+(getCityType(c.countryCode)==="Domestic"?"badge-cream":"badge-teal")}>{getCityType(c.countryCode)}</span>
                </div>
                <div style={{display:"flex", gap:"0.5rem", marginTop:"0.75rem"}}>
                  <button onClick={()=>openModal(c)} className="btn btn-secondary" style={{flex:1,justifyContent:"center",padding:"0.5rem"}}><Edit2 size={13}/>Edit</button>
                  <button onClick={()=>deleteCity(c.id)} className="btn btn-secondary" style={{padding:"0.5rem", color:"#EF4444", borderColor:"#FECACA", background:"#FEF2F2"}}><Trash2 size={13}/></button>
                </div>
              </div>
            </motion.div>
          ))}
          {filtered.length===0 && <p style={{gridColumn:"1/-1",textAlign:"center",padding:"3rem",color:"#9CA3AF"}}>No cities found</p>}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{position:"fixed",inset:0,zIndex:50,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(4px)"}} onClick={closeModal}/>
            <motion.div initial={{opacity:0,scale:0.95,y:20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.95,y:20}} style={{background:"#fff",borderRadius:24,padding:"2rem",width:"100%",maxWidth:500,position:"relative",zIndex:51,maxHeight:"90vh",overflowY:"auto"}}>
              <button onClick={closeModal} style={{position:"absolute",top:20,right:20,background:"none",border:"none",cursor:"pointer"}}><X size={20} color="#9CA3AF"/></button>
              <h2 style={{fontFamily:"Poppins,sans-serif",fontSize:"1.25rem",fontWeight:700,marginBottom:"1.5rem"}}>{editingCity ? "Edit City" : "Add New City"}</h2>
              <form onSubmit={submitForm} style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
                {formError && <div style={{padding:"0.75rem",background:"#FEF2F2",color:"#991B1B",borderRadius:8,fontSize:"0.875rem"}}>{formError}</div>}
                
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"}}>
                  <div><label className="input-label">City Name *</label><input required className="input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
                  <div><label className="input-label">Country *</label><input required className="input" value={form.country} onChange={e=>setForm({...form,country:e.target.value})} /></div>
                </div>

                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"}}>
                  <div><label className="input-label">Country Code (e.g. IN) *</label><input required className="input" maxLength={2} value={form.countryCode} onChange={e=>setForm({...form,countryCode:e.target.value.toUpperCase()})} /></div>
                  <div><label className="input-label">Image URL</label><input className="input" value={form.imageUrl} onChange={e=>setForm({...form,imageUrl:e.target.value})} /></div>
                </div>

                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"}}>
                  <div><label className="input-label">Latitude *</label><input required type="number" step="any" className="input" value={form.latitude} onChange={e=>setForm({...form,latitude:e.target.value})} /></div>
                  <div><label className="input-label">Longitude *</label><input required type="number" step="any" className="input" value={form.longitude} onChange={e=>setForm({...form,longitude:e.target.value})} /></div>
                </div>

                <div>
                  <label className="input-label">Description</label>
                  <textarea className="input" rows={3} value={form.description} onChange={e=>setForm({...form,description:e.target.value})}></textarea>
                </div>

                <div style={{display:"flex",justifyContent:"flex-end",gap:"0.75rem",marginTop:"1rem"}}>
                  <button type="button" onClick={closeModal} className="btn btn-secondary">Cancel</button>
                  <button type="submit" disabled={formLoading} className="btn btn-primary">{formLoading ? "Saving..." : "Save City"}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}