import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Edit2, Trash2, Clock, DollarSign } from "lucide-react";
const card = { background:"rgba(255,255,255,0.55)", backdropFilter:"blur(18px)", WebkitBackdropFilter:"blur(18px)", border:"1px solid rgba(255,255,255,0.25)", boxShadow:"0 8px 32px rgba(31,41,55,0.08)", borderRadius:24 };
const CATS = ["All","Adventure","Hiking","Beaches","Food Tours","Cultural","Snow","Monsoon","Wildlife"];
const ACTIVITIES = [
  {id:1,name:"Surf Lessons",cat:"Adventure",duration:"2 hrs",cost:"Rs.2,500",city:"Goa"},
  {id:2,name:"Himalayan Trek",cat:"Hiking",duration:"6 hrs",cost:"Rs.1,800",city:"Manali"},
  {id:3,name:"Backwater Cruise",cat:"Cultural",duration:"3 hrs",cost:"Rs.1,200",city:"Kerala"},
  {id:4,name:"Safari Drive",cat:"Wildlife",duration:"4 hrs",cost:"Rs.3,500",city:"Jim Corbett"},
  {id:5,name:"Cooking Class",cat:"Food Tours",duration:"2.5 hrs",cost:"Rs.1,500",city:"Jaipur"},
  {id:6,name:"Snow Skiing",cat:"Snow",duration:"Full Day",cost:"Rs.4,000",city:"Gulmarg"},
  {id:7,name:"Scuba Diving",cat:"Adventure",duration:"3 hrs",cost:"Rs.3,200",city:"Andaman"},
  {id:8,name:"Yoga Retreat",cat:"Cultural",duration:"2 hrs",cost:"Rs.800",city:"Rishikesh"},
];
export default function ManageActivities() {
  const [q,setQ]=useState("");const [cat,setCat]=useState("All");
  const filtered=ACTIVITIES.filter(a=>(cat==="All"||a.cat===cat)&&a.name.toLowerCase().includes(q.toLowerCase()));
  return(
    <div style={{display:"flex",flexDirection:"column",gap:"1.5rem"}}>
      <motion.div initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:"1rem"}}>
        <div><h1 className="page-title">Activities</h1><p className="page-subtitle">{ACTIVITIES.length} activities listed</p></div>
        <motion.button whileHover={{scale:1.02,y:-1}} className="btn btn-primary"><Plus size={16}/>Add Activity</motion.button>
      </motion.div>
      <div style={{display:"flex",gap:"0.5rem",flexWrap:"wrap"}}>
        {CATS.map(c=>(
          <button key={c} onClick={()=>setCat(c)} className="btn" style={{padding:"0.4rem 0.875rem",borderRadius:20,fontSize:"0.8125rem",background:cat===c?"linear-gradient(135deg,#2E7D6B,#3D9B85)":"rgba(255,255,255,0.7)",color:cat===c?"#fff":"#6B7280",border:"1px solid rgba(124,154,126,0.2)"}}>
            {c}
          </button>
        ))}
      </div>
      <div style={{position:"relative"}}>
        <Search size={15} style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"#9CA3AF"}}/>
        <input className="input" placeholder="Search activities..." style={{paddingLeft:40}} value={q} onChange={e=>setQ(e.target.value)}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:"1rem"}}>
        {filtered.map((a,i)=>(
          <motion.div key={a.id} style={card} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}} whileHover={{y:-3}}>
            <div style={{padding:"1.25rem"}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:"0.75rem"}}>
                <span className="badge badge-teal">{a.cat}</span>
                <div style={{display:"flex",gap:4}}>
                  <button className="btn-icon" style={{width:28,height:28,borderRadius:10}}><Edit2 size={12}/></button>
                  <button className="btn-icon" style={{width:28,height:28,borderRadius:10}}><Trash2 size={12} color="#EF4444"/></button>
                </div>
              </div>
              <h3 style={{fontWeight:700,color:"#1F2937",marginBottom:"0.375rem"}}>{a.name}</h3>
              <p style={{fontSize:"0.8rem",color:"#6B7280",marginBottom:"0.75rem"}}>{a.city}</p>
              <div style={{display:"flex",gap:"1rem"}}>
                <div style={{display:"flex",alignItems:"center",gap:4,fontSize:"0.8rem",color:"#6B7280"}}><Clock size={12} color="#9CA3AF"/>{a.duration}</div>
                <div style={{display:"flex",alignItems:"center",gap:4,fontSize:"0.875rem",fontWeight:700,color:"#2E7D6B"}}>{a.cost}</div>
              </div>
            </div>
          </motion.div>
        ))}
        {filtered.length===0&&<p style={{textAlign:"center",padding:"3rem",color:"#9CA3AF",gridColumn:"1/-1"}}>No activities found</p>}
      </div>
    </div>
  );
}