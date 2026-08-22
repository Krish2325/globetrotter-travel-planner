import { motion } from "framer-motion";
import { Download, BarChart3, FileText, Users, TrendingUp } from "lucide-react";
const card = { background:"rgba(255,255,255,0.55)", backdropFilter:"blur(18px)", WebkitBackdropFilter:"blur(18px)", border:"1px solid rgba(255,255,255,0.25)", boxShadow:"0 8px 32px rgba(31,41,55,0.08)", borderRadius:24 };
const REPORTS=[
  {id:1,title:"Monthly Travel Trends",desc:"Trips created, cities searched, activity bookings breakdown",icon:BarChart3,color:"#2E7D6B",period:"May 2024",size:"2.4 MB"},
  {id:2,title:"User Growth Report",desc:"New signups, active users, retention rates, churn analysis",icon:Users,color:"#0369A1",period:"May 2024",size:"1.8 MB"},
  {id:3,title:"Revenue Analysis",desc:"Package revenue, seasonal performance, pricing optimization",icon:TrendingUp,color:"#D97706",period:"Q1 2024",size:"3.1 MB"},
  {id:4,title:"Community Engagement",desc:"Shares, likes, public itineraries, community growth",icon:FileText,color:"#7C3AED",period:"May 2024",size:"1.2 MB"},
  {id:5,title:"Destination Performance",desc:"Top destinations, search trends, booking conversions",icon:BarChart3,color:"#059669",period:"May 2024",size:"2.7 MB"},
  {id:6,title:"Activity Analytics",desc:"Popular activities, seasonal demand, price sensitivity",icon:FileText,color:"#DB2777",period:"May 2024",size:"1.5 MB"},
];
export default function Reports() {
  return(
    <div style={{display:"flex",flexDirection:"column",gap:"1.5rem"}}>
      <motion.div initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}}><h1 className="page-title">Reports & Insights</h1><p className="page-subtitle">Download comprehensive platform analytics reports</p></motion.div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:"1.25rem"}}>
        {REPORTS.map((r,i)=>(
          <motion.div key={r.id} style={card} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}} whileHover={{y:-4,boxShadow:"0 16px 48px rgba(46,125,107,0.1)"}}>
            <div style={{padding:"1.5rem"}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:"1rem"}}>
                <div style={{width:48,height:48,borderRadius:16,background:r.color+"18",display:"flex",alignItems:"center",justifyContent:"center"}}><r.icon size={22} color={r.color}/></div>
                <div style={{textAlign:"right"}}><p style={{fontSize:"0.7rem",color:"#9CA3AF"}}>{r.period}</p><p style={{fontSize:"0.7rem",color:"#9CA3AF"}}>{r.size}</p></div>
              </div>
              <h3 style={{fontWeight:700,fontFamily:"Poppins,sans-serif",color:"#1F2937",marginBottom:"0.375rem"}}>{r.title}</h3>
              <p style={{fontSize:"0.8rem",color:"#6B7280",marginBottom:"1.25rem",lineHeight:1.5}}>{r.desc}</p>
              <div style={{display:"flex",gap:"0.625rem"}}>
                <motion.button whileHover={{scale:1.02}} className="btn btn-secondary" style={{flex:1,justifyContent:"center",padding:"0.5rem",fontSize:"0.8rem"}}><Download size={13}/>PDF</motion.button>
                <motion.button whileHover={{scale:1.02}} className="btn btn-secondary" style={{flex:1,justifyContent:"center",padding:"0.5rem",fontSize:"0.8rem"}}><Download size={13}/>CSV</motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}