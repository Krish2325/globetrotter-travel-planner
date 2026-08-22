import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Camera, Shield, Mail, User, Calendar, MapPin, Edit3 } from "lucide-react";
import useAuthStore from "../store/authStore";
const card = { background:"rgba(255,255,255,0.55)", backdropFilter:"blur(18px)", WebkitBackdropFilter:"blur(18px)", border:"1px solid rgba(255,255,255,0.25)", boxShadow:"0 8px 32px rgba(31,41,55,0.08)", borderRadius:24 };
export default function Profile() {
  const { admin } = useAuthStore();
  const [editing,setEditing]=useState(false);
  const [saved,setSaved]=useState(false);
  const [form,setForm]=useState({name:admin?.name||"Admin User",email:admin?.email||"admin@globetrotter.dev",city:"Mumbai, India",bio:"Platform administrator managing travel experiences for thousands of users worldwide.",phone:"+91 98765 43210"});
  const save=()=>{setSaved(true);setEditing(false);setTimeout(()=>setSaved(false),2500);};
  const STATS=[{label:"Total Logins",val:"148"},{label:"Trips Managed",val:"340"},{label:"Cities Added",val:"28"},{label:"Reports Generated",val:"52"}];
  return(
    <div style={{display:"flex",flexDirection:"column",gap:"1.5rem"}}>
      <motion.div initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}}>
        <h1 className="page-title">Admin Profile</h1>
        <p className="page-subtitle">Manage your administrator account</p>
      </motion.div>

      {saved&&<motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} style={{padding:"0.875rem 1.25rem",borderRadius:16,background:"rgba(34,197,94,0.1)",border:"1px solid rgba(34,197,94,0.3)",color:"#166534",fontWeight:600,fontSize:"0.875rem"}}>Profile updated successfully!</motion.div>}

      <div className="rg-checklist">
        {/* Left panel */}
        <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
          <motion.div style={card} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.1}}>
            <div style={{padding:"2rem",textAlign:"center"}}>
              <div style={{position:"relative",display:"inline-block",marginBottom:"1rem"}}>
                <div style={{width:96,height:96,borderRadius:"50%",background:"linear-gradient(135deg,#B33E1A,#F2683A,#FB8A4C)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"2.5rem",fontWeight:800,color:"#fff",margin:"0 auto",boxShadow:"0 8px 24px rgba(242,104,58,0.35)"}}>
                  {form.name[0].toUpperCase()}
                </div>
                <button style={{position:"absolute",bottom:0,right:0,width:30,height:30,borderRadius:"50%",background:"linear-gradient(135deg,#F2683A,#FB8A4C)",border:"3px solid #F7F6F2",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
                  <Camera size={13} color="#fff"/>
                </button>
              </div>
              <h2 style={{fontFamily:"Poppins,sans-serif",fontWeight:700,fontSize:"1.125rem",color:"#1F2937"}}>{form.name}</h2>
              <p style={{fontSize:"0.8rem",color:"#6B7280",marginTop:4}}>{form.email}</p>
              <div style={{display:"inline-flex",alignItems:"center",gap:6,marginTop:"0.75rem",padding:"0.3rem 0.875rem",borderRadius:20,background:"rgba(242,104,58,0.1)",border:"1px solid rgba(242,104,58,0.2)"}}>
                <Shield size={12} color="#F2683A"/>
                <span style={{fontSize:"0.7rem",fontWeight:700,color:"#F2683A",textTransform:"uppercase",letterSpacing:"0.06em"}}>Administrator</span>
              </div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginTop:"0.875rem",fontSize:"0.8rem",color:"#9CA3AF"}}>
                <MapPin size={13} color="#9CA3AF"/>{form.city}
              </div>
            </div>
          </motion.div>

          <motion.div style={card} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.15}}>
            <div style={{padding:"1.25rem"}}>
              <p className="section-title" style={{marginBottom:"1rem"}}>Activity Stats</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem"}}>
                {STATS.map(s=>(
                  <div key={s.label} style={{padding:"0.875rem",borderRadius:16,background:"rgba(214,122,74,0.07)",border:"1px solid rgba(214,122,74,0.15)",textAlign:"center"}}>
                    <p style={{fontSize:"1.375rem",fontWeight:800,fontFamily:"Poppins,sans-serif",color:"#F2683A"}}>{s.val}</p>
                    <p style={{fontSize:"0.65rem",color:"#9CA3AF",marginTop:2,lineHeight:1.3}}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right panel */}
        <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
          <motion.div style={card} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.2}}>
            <div style={{padding:"1.5rem"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1.5rem"}}>
                <p className="section-title">Personal Information</p>
                <button onClick={()=>setEditing(!editing)} className="btn btn-secondary" style={{padding:"0.45rem 0.875rem",fontSize:"0.8rem"}}>
                  <Edit3 size={13}/>{editing?"Cancel":"Edit"}
                </button>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:"1rem"}}>
                {[
                  {label:"Full Name",key:"name",icon:User},
                  {label:"Email Address",key:"email",icon:Mail},
                  {label:"Phone Number",key:"phone",icon:Calendar},
                  {label:"Location",key:"city",icon:MapPin},
                ].map(f=>(
                  <div key={f.key}>
                    <label className="input-label">{f.label}</label>
                    <div style={{position:"relative"}}>
                      <f.icon size={14} style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"#9CA3AF"}}/>
                      <input className="input" style={{paddingLeft:38,background:editing?"rgba(255,255,255,0.9)":"rgba(247,246,242,0.8)",cursor:editing?"text":"default"}}
                        value={form[f.key]} onChange={e=>setForm({...form,[f.key]:e.target.value})} readOnly={!editing}/>
                    </div>
                  </div>
                ))}
                <div style={{gridColumn:"1/-1"}}>
                  <label className="input-label">Bio</label>
                  <textarea className="input" rows={3} style={{resize:"none",background:editing?"rgba(255,255,255,0.9)":"rgba(247,246,242,0.8)",cursor:editing?"text":"default",lineHeight:1.5}}
                    value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})} readOnly={!editing}/>
                </div>
              </div>
              {editing&&(
                <motion.button initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} onClick={save}
                  whileHover={{scale:1.01,y:-1}} className="btn btn-primary" style={{marginTop:"1.25rem"}}>
                  <Save size={14}/>Save Changes
                </motion.button>
              )}
            </div>
          </motion.div>

          <motion.div style={card} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.25}}>
            <div style={{padding:"1.5rem"}}>
              <p className="section-title" style={{marginBottom:"1rem"}}>Change Password</p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:"1rem"}}>
                {["Current Password","New Password","Confirm New"].map(l=>(
                  <div key={l}><label className="input-label">{l}</label><input className="input" type="password" placeholder="••••••••"/></div>
                ))}
              </div>
              <motion.button whileHover={{scale:1.01,y:-1}} className="btn btn-primary" style={{marginTop:"1.25rem"}}><Save size={14}/>Update Password</motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}