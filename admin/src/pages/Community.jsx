import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, Trash2, Flag, CheckCircle, Search } from "lucide-react";
const card = { background:"rgba(255,255,255,0.55)", backdropFilter:"blur(18px)", WebkitBackdropFilter:"blur(18px)", border:"1px solid rgba(255,255,255,0.25)", boxShadow:"0 8px 32px rgba(31,41,55,0.08)", borderRadius:24 };
const POSTS=[
  {id:1,user:"Areen S.",title:"My Bali Trip 2024",likes:42,views:380,status:"active",date:"May 8"},
  {id:2,user:"Priya M.",title:"Switzerland in 10 Days",likes:128,views:1240,status:"active",date:"May 7"},
  {id:3,user:"Unknown User",title:"Spam/Misleading content",likes:0,views:2,status:"flagged",date:"May 6"},
  {id:4,user:"Sneha J.",title:"Rajasthan Heritage Walk",likes:67,views:543,status:"active",date:"May 5"},
  {id:5,user:"Test123",title:"Inappropriate content test",likes:1,views:8,status:"flagged",date:"May 4"},
];
export default function Community() {
  const [q,setQ]=useState("");const [filter,setFilter]=useState("All");
  const filtered=POSTS.filter(p=>(filter==="All"||p.status===filter)&&p.title.toLowerCase().includes(q.toLowerCase()));
  return(
    <div style={{display:"flex",flexDirection:"column",gap:"1.5rem"}}>
      <motion.div initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}}><h1 className="page-title">Community Moderation</h1><p className="page-subtitle">Review and moderate public itineraries</p></motion.div>
      <motion.div style={card} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.1}}>
        <div style={{padding:"1.5rem"}}>
          <div style={{display:"flex",gap:"0.75rem",marginBottom:"1.25rem",flexWrap:"wrap"}}>
            <div style={{position:"relative",flex:1,minWidth:200}}><Search size={15} style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"#9CA3AF"}}/><input className="input" placeholder="Search posts..." style={{paddingLeft:40}} value={q} onChange={e=>setQ(e.target.value)}/></div>
            <div style={{display:"flex",gap:"0.5rem"}}>
              {["All","active","flagged"].map(f=>(
                <button key={f} onClick={()=>setFilter(f)} className="btn" style={{padding:"0.5rem 0.875rem",background:filter===f?"linear-gradient(135deg,#2E7D6B,#3D9B85)":"rgba(255,255,255,0.7)",color:filter===f?"#fff":"#6B7280",border:"1px solid rgba(124,154,126,0.2)",fontSize:"0.8125rem",borderRadius:12}}>
                  {f.charAt(0).toUpperCase()+f.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:"0.75rem"}}>
            {filtered.map(p=>(
              <motion.div key={p.id} whileHover={{x:3}} style={{display:"flex",alignItems:"center",gap:"1rem",padding:"1rem 1.25rem",borderRadius:16,background:p.status==="flagged"?"rgba(239,68,68,0.05)":"rgba(124,154,126,0.04)",border:"1px solid "+(p.status==="flagged"?"rgba(239,68,68,0.2)":"rgba(124,154,126,0.12)")}}>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{fontWeight:600,color:"#1F2937",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.title}</p>
                  <p style={{fontSize:"0.75rem",color:"#9CA3AF",marginTop:2}}>by {p.user} &middot; {p.date} &middot; {p.likes} likes &middot; {p.views} views</p>
                </div>
                <span className={"badge "+(p.status==="flagged"?"badge-red":"badge-sage")}>{p.status}</span>
                <div style={{display:"flex",gap:4}}>
                  <button className="btn-icon" title="View"><Eye size={13}/></button>
                  <button className="btn-icon" title="Approve"><CheckCircle size={13} color="#22C55E"/></button>
                  <button className="btn-icon" title="Flag"><Flag size={13} color="#F59E0B"/></button>
                  <button className="btn-icon" title="Delete"><Trash2 size={13} color="#EF4444"/></button>
                </div>
              </motion.div>
            ))}
            {filtered.length===0&&<p style={{textAlign:"center",padding:"3rem",color:"#9CA3AF"}}>No posts found</p>}
          </div>
        </div>
      </motion.div>
    </div>
  );
}