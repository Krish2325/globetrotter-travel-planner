import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCheck, Trash2, User, Map, Flag, TrendingUp, Shield, X } from "lucide-react";
const card = { background:"rgba(255,255,255,0.55)", backdropFilter:"blur(18px)", WebkitBackdropFilter:"blur(18px)", border:"1px solid rgba(255,255,255,0.25)", boxShadow:"0 8px 32px rgba(31,41,55,0.08)", borderRadius:24 };
const NOTIFS = [
  {id:1,type:"user",icon:User,color:"#F2683A",title:"New Admin Registered",desc:"Areen Sharma just created an admin account.",time:"2 min ago",read:false},
  {id:2,type:"trip",icon:Map,color:"#0369A1",title:"New Trip Created",desc:"Priya Mehta created a new trip: Goa Beach Weekend.",time:"15 min ago",read:false},
  {id:3,type:"flag",icon:Flag,color:"#EF4444",title:"Content Flagged",desc:"Post by user123 has been flagged for review.",time:"1 hr ago",read:false},
  {id:4,type:"trend",icon:TrendingUp,color:"#D97706",title:"Trending Destination Alert",desc:"Bali searches up 24% this week.",time:"3 hrs ago",read:true},
  {id:5,type:"user",icon:User,color:"#F2683A",title:"New User Milestone",desc:"Globetrotter reached 1,000 registered users!",time:"5 hrs ago",read:true},
  {id:6,type:"security",icon:Shield,color:"#7C3AED",title:"Login Attempt Blocked",desc:"5 failed login attempts from IP 192.168.1.45.",time:"Yesterday",read:true},
  {id:7,type:"trip",icon:Map,color:"#0369A1",title:"Trip Completed",desc:"Rahul Kumar completed Rajasthan Heritage Tour.",time:"Yesterday",read:true},
];
export default function Notifications() {
  const [notifs,setNotifs]=useState(NOTIFS);
  const [filter,setFilter]=useState("All");
  const unread=notifs.filter(n=>!n.read).length;
  const filtered=filter==="All"?notifs:filter==="Unread"?notifs.filter(n=>!n.read):notifs.filter(n=>n.read);
  const markAll=()=>setNotifs(notifs.map(n=>({...n,read:true})));
  const remove=(id)=>setNotifs(notifs.filter(n=>n.id!==id));
  const markRead=(id)=>setNotifs(notifs.map(n=>n.id===id?{...n,read:true}:n));
  return(
    <div style={{display:"flex",flexDirection:"column",gap:"1.5rem"}}>
      <motion.div initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:"1rem"}}>
        <div style={{display:"flex",alignItems:"center",gap:"0.75rem"}}>
          <h1 className="page-title">Notifications</h1>
          {unread>0&&<span style={{background:"linear-gradient(135deg,#F2683A,#FB8A4C)",color:"#fff",borderRadius:20,padding:"0.2rem 0.6rem",fontSize:"0.75rem",fontWeight:700}}>{unread} new</span>}
        </div>
        <motion.button whileHover={{scale:1.02}} onClick={markAll} className="btn btn-secondary" style={{fontSize:"0.8125rem"}}><CheckCheck size={15}/>Mark all read</motion.button>
      </motion.div>

      <div style={{display:"flex",gap:"0.5rem"}}>
        {["All","Unread","Read"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} className="btn" style={{padding:"0.45rem 1rem",borderRadius:20,fontSize:"0.8125rem",background:filter===f?"linear-gradient(135deg,#F2683A,#FB8A4C)":"rgba(255,255,255,0.7)",color:filter===f?"#fff":"#6B7280",border:"1px solid rgba(214,122,74,0.2)"}}>
            {f}
          </button>
        ))}
      </div>

      <div style={card}>
        <div style={{padding:"0.75rem"}}>
          <AnimatePresence>
            {filtered.length===0&&(
              <motion.div initial={{opacity:0}} animate={{opacity:1}} style={{padding:"4rem",textAlign:"center"}}>
                <Bell size={40} color="#D1D5DB" style={{margin:"0 auto 1rem",display:"block"}}/>
                <p style={{color:"#9CA3AF",fontWeight:500}}>No notifications</p>
              </motion.div>
            )}
            {filtered.map(n=>(
              <motion.div key={n.id} layout initial={{opacity:0,x:-16}} animate={{opacity:1,x:0}} exit={{opacity:0,x:16}}
                onClick={()=>markRead(n.id)}
                style={{display:"flex",alignItems:"flex-start",gap:"1rem",padding:"1rem",borderRadius:16,marginBottom:"0.375rem",cursor:"pointer",background:n.read?"transparent":"rgba(242,104,58,0.04)",border:"1px solid "+(n.read?"transparent":"rgba(242,104,58,0.1)"),transition:"all 0.2s"}}>
                <div style={{width:42,height:42,borderRadius:14,background:n.color+"18",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <n.icon size={18} color={n.color}/>
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:"0.5rem"}}>
                    <p style={{fontWeight:n.read?500:700,color:"#1F2937",fontSize:"0.9rem"}}>{n.title}</p>
                    {!n.read&&<div style={{width:8,height:8,borderRadius:"50%",background:"#F2683A",flexShrink:0,marginTop:4}}/>}
                  </div>
                  <p style={{fontSize:"0.8rem",color:"#6B7280",marginTop:2,lineHeight:1.4}}>{n.desc}</p>
                  <p style={{fontSize:"0.7rem",color:"#9CA3AF",marginTop:4}}>{n.time}</p>
                </div>
                <button onClick={e=>{e.stopPropagation();remove(n.id);}} className="btn-icon" style={{width:28,height:28,borderRadius:10,flexShrink:0}}>
                  <X size={12}/>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}