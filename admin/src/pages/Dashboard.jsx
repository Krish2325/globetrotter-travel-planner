import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Map, Users, Globe, Activity, ArrowUpRight, Compass, Star, TrendingUp } from "lucide-react";
import api from "../api/axios";

const AREA_DATA=[{m:"Jan",users:820,trips:340},{m:"Feb",users:950,trips:420},{m:"Mar",users:1100,trips:580},{m:"Apr",users:1350,trips:650},{m:"May",users:1620,trips:820},{m:"Jun",users:1980,trips:980}];
const PIE_DATA=[{name:"Beach",value:35,color:"#2E7D6B"},{name:"Mountain",value:28,color:"#3D9B85"},{name:"Cultural",value:20,color:"#A7C4A0"},{name:"Adventure",value:17,color:"#5EEAD4"}];
const BAR_DATA=[{s:"Summer",domestic:65,intl:35},{s:"Monsoon",domestic:80,intl:20},{s:"Winter",domestic:45,intl:55},{s:"Spring",domestic:70,intl:30}];
const card={background:"rgba(255,255,255,0.55)",backdropFilter:"blur(18px)",WebkitBackdropFilter:"blur(18px)",border:"1px solid rgba(255,255,255,0.25)",boxShadow:"0 8px 32px rgba(31,41,55,0.08)",borderRadius:24};
const STATUS_C={ACTIVE:"badge-sage",AVAILABLE:"badge-teal",PLANNING:"badge-cream",ONGOING:"badge-amber",COMPLETED:"badge-blue",CANCELLED:"badge-red"};

export default function Dashboard() {
  const [stats,setStats]=useState({totalUsers:0,activeTrips:0,citiesListed:0,activitiesCount:0});
  const [recentTrips,setRecentTrips]=useState([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    api.get("/analytics/dashboard").then(({data})=>{
      setStats(data.stats);
      setRecentTrips(data.recentTrips||[]);
    }).catch(()=>{}).finally(()=>setLoading(false));
  },[]);

  const STATS=[
    {label:"Total Users",value:stats.totalUsers,icon:Users,color:"#2E7D6B"},
    {label:"Active Trips",value:stats.activeTrips,icon:Map,color:"#0369A1"},
    {label:"Cities Listed",value:stats.citiesListed,icon:Globe,color:"#7C3AED"},
    {label:"Activities",value:stats.activitiesCount,icon:Activity,color:"#D97706"},
  ];

  return(
    <div style={{display:"flex",flexDirection:"column",gap:"1.5rem"}}>
      <motion.div initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}}>
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Welcome back — here is what is happening on Globetrotter.</p>
      </motion.div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:"1rem"}}>
        {STATS.map(({label,value,icon:Icon,color},i)=>(
          <motion.div key={label} style={card} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}} whileHover={{y:-3,boxShadow:"0 16px 40px rgba(31,41,55,0.12)"}}>
            <div style={{padding:"1.5rem"}}>
              <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:"1rem"}}>
                <div style={{width:44,height:44,borderRadius:14,background:color+"18",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon size={20} color={color}/></div>
                <span style={{display:"flex",alignItems:"center",gap:3,fontSize:"0.75rem",fontWeight:700,color:"#22C55E",background:"rgba(34,197,94,0.1)",padding:"0.2rem 0.5rem",borderRadius:20}}><ArrowUpRight size={12}/>Live</span>
              </div>
              <p style={{fontSize:"2rem",fontWeight:800,fontFamily:"Poppins,sans-serif",color:"#1F2937"}}>{loading?"...":value}</p>
              <p style={{fontSize:"0.8125rem",color:"#6B7280",marginTop:"0.15rem"}}>{label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:"1rem"}}>
        <motion.div style={card} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.2}}>
          <div style={{padding:"1.5rem"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1.25rem"}}>
              <div><p className="section-title">Platform Growth</p><p style={{fontSize:"0.8rem",color:"#9CA3AF",marginTop:2}}>Users and trips over time</p></div>
              <span className="badge badge-sage"><TrendingUp size={10} style={{marginRight:3}}/>Growing</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={AREA_DATA}>
                <defs>
                  <linearGradient id="gu" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2E7D6B" stopOpacity={0.25}/><stop offset="95%" stopColor="#2E7D6B" stopOpacity={0}/></linearGradient>
                  <linearGradient id="gt" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0369A1" stopOpacity={0.2}/><stop offset="95%" stopColor="#0369A1" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,154,126,0.1)"/>
                <XAxis dataKey="m" tick={{fontSize:11,fill:"#9CA3AF"}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:11,fill:"#9CA3AF"}} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{background:"#fff",border:"1px solid #EFEDE7",borderRadius:12,fontSize:12}}/>
                <Legend iconSize={8} wrapperStyle={{fontSize:12}}/>
                <Area type="monotone" dataKey="users" stroke="#2E7D6B" strokeWidth={2} fill="url(#gu)" name="Users"/>
                <Area type="monotone" dataKey="trips" stroke="#0369A1" strokeWidth={2} fill="url(#gt)" name="Trips"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        <motion.div style={card} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.25}}>
          <div style={{padding:"1.5rem"}}>
            <p className="section-title" style={{marginBottom:4}}>Trip Categories</p>
            <p style={{fontSize:"0.8rem",color:"#9CA3AF",marginBottom:"1.25rem"}}>Distribution by type</p>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart><Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                {PIE_DATA.map((e,i)=><Cell key={i} fill={e.color}/>)}
              </Pie><Tooltip contentStyle={{background:"#fff",border:"1px solid #EFEDE7",borderRadius:12,fontSize:12}}/></PieChart>
            </ResponsiveContainer>
            <div style={{display:"flex",flexDirection:"column",gap:"0.375rem",marginTop:"0.5rem"}}>
              {PIE_DATA.map(d=><div key={d.name} style={{display:"flex",alignItems:"center",justifyContent:"space-between",fontSize:"0.8rem"}}><div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:8,height:8,borderRadius:"50%",background:d.color}}/><span style={{color:"#6B7280"}}>{d.name}</span></div><span style={{fontWeight:700,color:"#1F2937"}}>{d.value}%</span></div>)}
            </div>
          </div>
        </motion.div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"}}>
        <motion.div style={card} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.3}}>
          <div style={{padding:"1.5rem"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:"1.25rem"}}><Star size={16} color="#2E7D6B"/><p className="section-title">Recent Trips (Live)</p></div>
            <div style={{display:"flex",flexDirection:"column",gap:"0.625rem"}}>
              {loading&&[1,2,3].map(i=><div key={i} className="skeleton" style={{height:56}}/>)}
              {!loading&&recentTrips.length===0&&<p style={{color:"#9CA3AF",textAlign:"center",padding:"2rem"}}>No trips yet</p>}
              {recentTrips.map((t,i)=>(
                <div key={t.id||i} style={{display:"flex",alignItems:"center",gap:"0.75rem",padding:"0.625rem 0.75rem",borderRadius:14,background:i%2===0?"rgba(124,154,126,0.05)":"transparent"}}>
                  <div style={{width:36,height:36,borderRadius:12,flexShrink:0}} className={"mesh-"+((i%6)+1)}/>
                  <div style={{flex:1,minWidth:0}}>
                    <p style={{fontSize:"0.875rem",fontWeight:600,color:"#1F2937",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.title}</p>
                    <p style={{fontSize:"0.75rem",color:"#9CA3AF"}}>by {t.user} - {t.date}</p>
                  </div>
                  <span className={"badge "+(STATUS_C[t.status]||"badge-cream")}>{t.status}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
        <motion.div style={card} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.35}}>
          <div style={{padding:"1.5rem"}}>
            <p className="section-title" style={{marginBottom:"1.25rem"}}>Seasonal Patterns</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={BAR_DATA}><CartesianGrid strokeDasharray="3 3" stroke="rgba(124,154,126,0.1)"/>
                <XAxis dataKey="s" tick={{fontSize:11,fill:"#9CA3AF"}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:11,fill:"#9CA3AF"}} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{background:"#fff",border:"1px solid #EFEDE7",borderRadius:12,fontSize:12}}/>
                <Legend iconSize={8} wrapperStyle={{fontSize:12}}/>
                <Bar dataKey="domestic" fill="#2E7D6B" radius={[6,6,0,0]} name="Domestic"/>
                <Bar dataKey="intl" fill="#A7C4A0" radius={[6,6,0,0]} name="International"/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}