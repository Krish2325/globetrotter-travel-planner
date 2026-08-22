import { motion } from "framer-motion";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";
const card = { background:"rgba(255,255,255,0.55)", backdropFilter:"blur(18px)", WebkitBackdropFilter:"blur(18px)", border:"1px solid rgba(255,255,255,0.25)", boxShadow:"0 8px 32px rgba(31,41,55,0.08)", borderRadius:24 };
const MONTHLY=[{m:"Jan",searches:1200,bookings:340,users:820},{m:"Feb",searches:1500,bookings:420,users:950},{m:"Mar",searches:1900,bookings:580,users:1100},{m:"Apr",searches:2100,bookings:650,users:1350},{m:"May",searches:2600,bookings:820,users:1620},{m:"Jun",searches:3100,bookings:980,users:1980}];
const SEASONAL=[{s:"Summer",beach:65,mountain:25,cultural:10},{s:"Monsoon",beach:20,mountain:45,cultural:35},{s:"Winter",beach:40,mountain:35,cultural:25},{s:"Spring",beach:30,mountain:30,cultural:40}];
const SEARCHED=[{dest:"Bali",count:12400},{dest:"Goa",count:9800},{dest:"Paris",count:8600},{dest:"Dubai",count:7200},{dest:"Tokyo",count:6900},{dest:"Maldives",count:6200}];
const PIE=[{name:"Mobile",value:58,color:"#2E7D6B"},{name:"Desktop",value:32,color:"#3D9B85"},{name:"Tablet",value:10,color:"#A7C4A0"}];
export default function Analytics() {
  return(
    <div style={{display:"flex",flexDirection:"column",gap:"1.5rem"}}>
      <motion.div initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}}><h1 className="page-title">Analytics & Trends</h1><p className="page-subtitle">Platform performance and travel behavior insights</p></motion.div>
      <div className="rg-2">
        <motion.div style={card} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.1}}>
          <div style={{padding:"1.5rem"}}>
            <p className="section-title" style={{marginBottom:4}}>Search vs Bookings vs Users</p>
            <p style={{fontSize:"0.8rem",color:"#9CA3AF",marginBottom:"1.25rem"}}>Monthly platform activity</p>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={MONTHLY}>
                <defs>
                  <linearGradient id="s1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2E7D6B" stopOpacity={0.3}/><stop offset="95%" stopColor="#2E7D6B" stopOpacity={0}/></linearGradient>
                  <linearGradient id="s2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0369A1" stopOpacity={0.2}/><stop offset="95%" stopColor="#0369A1" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,154,126,0.1)"/>
                <XAxis dataKey="m" tick={{fontSize:11,fill:"#9CA3AF"}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:11,fill:"#9CA3AF"}} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{background:"#fff",border:"1px solid #EFEDE7",borderRadius:12,fontSize:12}}/>
                <Legend iconSize={8} wrapperStyle={{fontSize:12}}/>
                <Area type="monotone" dataKey="searches" stroke="#2E7D6B" strokeWidth={2} fill="url(#s1)" name="Searches"/>
                <Area type="monotone" dataKey="bookings" stroke="#0369A1" strokeWidth={2} fill="url(#s2)" name="Bookings"/>
                <Line type="monotone" dataKey="users" stroke="#D97706" strokeWidth={2} dot={false} name="New Users"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        <motion.div style={card} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.15}}>
          <div style={{padding:"1.5rem"}}>
            <p className="section-title" style={{marginBottom:4}}>Device Split</p>
            <p style={{fontSize:"0.8rem",color:"#9CA3AF",marginBottom:"1rem"}}>User access platform</p>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart><Pie data={PIE} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                {PIE.map((e,i)=><Cell key={i} fill={e.color}/>)}
              </Pie><Tooltip contentStyle={{background:"#fff",border:"1px solid #EFEDE7",borderRadius:12,fontSize:12}}/></PieChart>
            </ResponsiveContainer>
            <div style={{display:"flex",flexDirection:"column",gap:"0.375rem",marginTop:"0.5rem"}}>
              {PIE.map(d=><div key={d.name} style={{display:"flex",alignItems:"center",justifyContent:"space-between",fontSize:"0.8rem"}}><div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:8,height:8,borderRadius:"50%",background:d.color}}/><span style={{color:"#6B7280"}}>{d.name}</span></div><span style={{fontWeight:700,color:"#1F2937"}}>{d.value}%</span></div>)}
            </div>
          </div>
        </motion.div>
      </div>
      <div className="rg-2-equal">
        <motion.div style={card} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.2}}>
          <div style={{padding:"1.5rem"}}>
            <p className="section-title" style={{marginBottom:4}}>Seasonal Activity Mix</p>
            <p style={{fontSize:"0.8rem",color:"#9CA3AF",marginBottom:"1.25rem"}}>Trip type preference by season</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={SEASONAL}><CartesianGrid strokeDasharray="3 3" stroke="rgba(124,154,126,0.1)"/>
                <XAxis dataKey="s" tick={{fontSize:11,fill:"#9CA3AF"}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:11,fill:"#9CA3AF"}} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{background:"#fff",border:"1px solid #EFEDE7",borderRadius:12,fontSize:12}}/>
                <Legend iconSize={8} wrapperStyle={{fontSize:12}}/>
                <Bar dataKey="beach" fill="#2E7D6B" radius={[4,4,0,0]} name="Beach"/>
                <Bar dataKey="mountain" fill="#A7C4A0" radius={[4,4,0,0]} name="Mountain"/>
                <Bar dataKey="cultural" fill="#5EEAD4" radius={[4,4,0,0]} name="Cultural"/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        <motion.div style={card} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.25}}>
          <div style={{padding:"1.5rem"}}>
            <p className="section-title" style={{marginBottom:"1.25rem"}}>Most Searched Destinations</p>
            <div style={{display:"flex",flexDirection:"column",gap:"0.75rem"}}>
              {SEARCHED.map((d,i)=>(
                <div key={d.dest} style={{display:"flex",alignItems:"center",gap:"0.75rem"}}>
                  <span style={{fontSize:"0.75rem",fontWeight:700,color:"#9CA3AF",width:16,textAlign:"center"}}>{i+1}</span>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:"0.875rem",fontWeight:600,color:"#1F2937"}}>{d.dest}</span><span style={{fontSize:"0.75rem",color:"#9CA3AF"}}>{d.count.toLocaleString()}</span></div>
                    <div style={{height:5,borderRadius:10,background:"#EFEDE7",overflow:"hidden"}}><div style={{height:"100%",borderRadius:10,background:"linear-gradient(135deg,#2E7D6B,#3D9B85)",width:((d.count/SEARCHED[0].count)*100)+"%",transition:"width 0.6s ease"}}/></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}