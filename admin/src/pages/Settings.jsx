import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Shield, Mail, Globe, Bell } from "lucide-react";
const card = { background:"rgba(255,255,255,0.55)", backdropFilter:"blur(18px)", WebkitBackdropFilter:"blur(18px)", border:"1px solid rgba(255,255,255,0.25)", boxShadow:"0 8px 32px rgba(31,41,55,0.08)", borderRadius:24 };
const SECTIONS=[
  {id:"platform",icon:Globe,title:"Platform Settings",fields:[{label:"Site Name",val:"Globetrotter",type:"text"},{label:"Support Email",val:"support@globetrotter.dev",type:"email"},{label:"Default Currency",val:"INR",type:"text"},{label:"Default Language",val:"English",type:"text"}]},
  {id:"email",icon:Mail,title:"Email Configuration",fields:[{label:"SMTP Host",val:"smtp.gmail.com",type:"text"},{label:"SMTP Port",val:"587",type:"text"},{label:"From Email",val:"noreply@globetrotter.dev",type:"email"},{label:"From Name",val:"Globetrotter Team",type:"text"}]},
  {id:"security",icon:Shield,title:"Security Settings",fields:[{label:"Session Timeout (hrs)",val:"24",type:"number"},{label:"Max Login Attempts",val:"5",type:"number"},{label:"JWT Secret (last 4)",val:"...2024",type:"text"},{label:"Admin Invite Key",val:"globetrotter-admin-2024",type:"text"}]},
  {id:"notif",icon:Bell,title:"Notification Settings",fields:[{label:"New User Alert Email",val:"admin@globetrotter.dev",type:"email"},{label:"Flagged Content Alert",val:"admin@globetrotter.dev",type:"email"},{label:"Daily Report Time",val:"09:00",type:"time"},{label:"Weekly Report Day",val:"Monday",type:"text"}]},
];
export default function Settings() {
  const [saved,setSaved]=useState(null);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:"1.5rem"}}>
      <motion.div initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}}><h1 className="page-title">Settings</h1><p className="page-subtitle">Platform configuration and admin preferences</p></motion.div>
      {saved&&<motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} style={{padding:"0.875rem 1.25rem",borderRadius:16,background:"rgba(34,197,94,0.1)",border:"1px solid rgba(34,197,94,0.3)",color:"#166534",fontWeight:600,fontSize:"0.875rem"}}>Settings saved successfully!</motion.div>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:"1.25rem"}}>
        {SECTIONS.map((sec,si)=>(
          <motion.div key={sec.id} style={card} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:si*0.08}}>
            <div style={{padding:"1.5rem"}}>
              <div style={{display:"flex",alignItems:"center",gap:"0.625rem",marginBottom:"1.25rem"}}>
                <div style={{width:36,height:36,borderRadius:12,background:"rgba(242,104,58,0.1)",display:"flex",alignItems:"center",justifyContent:"center"}}><sec.icon size={17} color="#F2683A"/></div>
                <p className="section-title">{sec.title}</p>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
                {sec.fields.map(f=>(
                  <div key={f.label}><label className="input-label">{f.label}</label><input className="input" type={f.type} defaultValue={f.val}/></div>
                ))}
              </div>
              <motion.button whileHover={{scale:1.01,y:-1}} whileTap={{scale:0.99}} onClick={()=>{setSaved(sec.id);setTimeout(()=>setSaved(null),2500)}} className="btn btn-primary" style={{marginTop:"1.25rem"}}>
                <Save size={14}/>Save {sec.title.split(" ")[0]}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}