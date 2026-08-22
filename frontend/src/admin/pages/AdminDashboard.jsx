import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import { Users, Map, Globe, Activity, TrendingUp, ArrowUp, ArrowDown, Star, PackageCheck, ArrowRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const fadeUp = { hidden:{opacity:0,y:16}, show:{opacity:1,y:0,transition:{duration:0.4}} };
const stagger = { show:{ transition:{ staggerChildren:0.07 } } };
const GLASS = { background:'rgba(255,255,255,0.55)', backdropFilter:'blur(18px)', WebkitBackdropFilter:'blur(18px)', border:'1px solid rgba(255,255,255,0.25)', boxShadow:'0 8px 32px rgba(31,41,55,0.08)' };

const MONTHLY = [{m:'Jan',trips:45,users:120},{m:'Feb',trips:52,users:135},{m:'Mar',trips:68,users:180},{m:'Apr',trips:75,users:210},{m:'May',trips:90,users:250},{m:'Jun',trips:110,users:290}];
const PIE_DATA = [{name:'Beach',value:35,color:'#2E7D6B'},{name:'Mountain',value:28,color:'#A7C4A0'},{name:'Culture',value:22,color:'#3D9B85'},{name:'Adventure',value:15,color:'#EFEDE7'}];
const CITIES = [{city:'Goa',v:4200},{city:'Bali',v:3800},{city:'Paris',v:3100},{city:'Dubai',v:2900},{city:'Tokyo',v:2600}];

function StatCard({ icon:Icon, label, value, trend, color }) {
  const up = trend > 0;
  return (
    <motion.div variants={fadeUp} whileHover={{ y:-4 }} className="rounded-3xl p-5" style={GLASS}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background:`${color}18` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${up ? 'text-emerald-600 bg-emerald-50' : 'text-red-500 bg-red-50'}`}>
          {up ? <ArrowUp className="w-3 h-3"/> : <ArrowDown className="w-3 h-3"/>}{Math.abs(trend)}%
        </span>
      </div>
      <p className="text-3xl font-bold font-display" style={{ color:'#1F2937' }}>{value}</p>
      <p className="text-sm mt-1" style={{ color:'#6B7280' }}>{label}</p>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ trips:128, users:1847, cities:42, activities:318 });
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    api.get('/trips').then(({ data }) => { setRecent(data.slice(0,5)); setCounts(c => ({...c, trips:data.length})); }).catch(()=>{});
  }, []);

  const cards = [
    { icon:Map,         label:'Total Trips',      value:counts.trips,      trend:12,  color:'#2E7D6B' },
    { icon:Users,       label:'Active Users',      value:counts.users,      trend:8,   color:'#0369A1' },
    { icon:Globe,       label:'Cities',            value:counts.cities,     trend:5,   color:'#7C3AED' },
    { icon:Activity,    label:'Activities',         value:counts.activities, trend:18,  color:'#D97706' },
    { icon:TrendingUp,  label:'Searches/Day',      value:'2.4k',            trend:22,  color:'#DB2777' },
    { icon:Star,        label:'Avg Rating',        value:'4.8',             trend:3,   color:'#059669' },
  ];

  return (
    <motion.div className="space-y-7" initial="hidden" animate="show" variants={stagger}>
      <motion.div variants={fadeUp}>
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Platform overview and real-time metrics</p>
      </motion.div>

      <motion.div variants={stagger} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {cards.map(c => <StatCard key={c.label} {...c} />)}
      </motion.div>

      <motion.div variants={stagger} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <motion.div variants={fadeUp} className="lg:col-span-2 rounded-3xl p-6" style={GLASS}>
          <h3 className="font-bold font-display mb-1" style={{ color:'#1F2937' }}>Growth Trend</h3>
          <p className="text-xs mb-4" style={{ color:'#9CA3AF' }}>Trips & Users per month</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={MONTHLY}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2E7D6B" stopOpacity={0.3}/><stop offset="95%" stopColor="#2E7D6B" stopOpacity={0}/></linearGradient>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0369A1" stopOpacity={0.2}/><stop offset="95%" stopColor="#0369A1" stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,154,126,0.1)"/>
              <XAxis dataKey="m" tick={{ fontSize:11, fill:'#9CA3AF' }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize:11, fill:'#9CA3AF' }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{ background:'#fff', border:'1px solid #EFEDE7', borderRadius:12, fontSize:12 }}/>
              <Area type="monotone" dataKey="trips" stroke="#2E7D6B" strokeWidth={2} fill="url(#g1)" name="Trips"/>
              <Area type="monotone" dataKey="users" stroke="#0369A1" strokeWidth={2} fill="url(#g2)" name="Users"/>
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={fadeUp} className="rounded-3xl p-6" style={GLASS}>
          <h3 className="font-bold font-display mb-1" style={{ color:'#1F2937' }}>Trip Categories</h3>
          <p className="text-xs mb-3" style={{ color:'#9CA3AF' }}>By type breakdown</p>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart><Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}>
              {PIE_DATA.map((e,i) => <Cell key={i} fill={e.color}/>)}
            </Pie><Tooltip contentStyle={{ background:'#fff', border:'1px solid #EFEDE7', borderRadius:12, fontSize:12 }}/></PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">{PIE_DATA.map(d => (
            <div key={d.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full" style={{ background:d.color }}/><span style={{ color:'#6B7280' }}>{d.name}</span></div>
              <span className="font-semibold" style={{ color:'#1F2937' }}>{d.value}%</span>
            </div>
          ))}</div>
        </motion.div>
      </motion.div>

      <motion.div variants={stagger} className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <motion.div variants={fadeUp} className="rounded-3xl p-6" style={GLASS}>
          <h3 className="font-bold font-display mb-1" style={{ color:'#1F2937' }}>Most Searched Cities</h3>
          <p className="text-xs mb-4" style={{ color:'#9CA3AF' }}>This month</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={CITIES} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,154,126,0.1)" horizontal={false}/>
              <XAxis type="number" tick={{ fontSize:10, fill:'#9CA3AF' }} axisLine={false} tickLine={false}/>
              <YAxis type="category" dataKey="city" tick={{ fontSize:11, fill:'#6B7280' }} axisLine={false} tickLine={false} width={50}/>
              <Tooltip contentStyle={{ background:'#fff', border:'1px solid #EFEDE7', borderRadius:12, fontSize:12 }}/>
              <Bar dataKey="v" fill="#2E7D6B" radius={[0,6,6,0]} name="Searches"/>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={fadeUp} className="rounded-3xl p-6" style={GLASS}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold font-display" style={{ color:'#1F2937' }}>Recent Trips</h3>
            <Link to="/admin/trips" className="text-xs font-semibold inline-flex items-center gap-1" style={{ color:'#2E7D6B' }}>View all <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="space-y-3">
            {(recent.length ? recent : [{id:1,title:'Goa Getaway',status:'PLANNING'},{id:2,title:'Swiss Alps',status:'CONFIRMED'},{id:3,title:'Bali Dreams',status:'COMPLETED'}]).map((t,i) => (
              <div key={t.id} className="flex items-center gap-3 p-3 rounded-2xl" style={{ background:'rgba(124,154,126,0.06)', border:'1px solid rgba(124,154,126,0.12)' }}>
                <div className={`w-9 h-9 rounded-xl shrink-0 trip-card-mesh-${(i%6)+1}`}/>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color:'#1F2937' }}>{t.title}</p>
                </div>
                <span className={`badge badge-${t.status==='COMPLETED'?'sage':t.status==='ONGOING'?'amber':'teal'}`}>{t.status}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <motion.div variants={fadeUp} className="rounded-3xl p-6" style={GLASS}>
        <h3 className="font-bold font-display mb-4" style={{ color:'#1F2937' }}>Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[{to:'/admin/trips',icon:Map,label:'Add Trip',color:'#2E7D6B',bg:'rgba(46,125,107,0.1)'},{to:'/admin/cities',icon:Globe,label:'Add City',color:'#0369A1',bg:'rgba(3,105,161,0.1)'},{to:'/admin/activities',icon:Activity,label:'Add Activity',color:'#D97706',bg:'rgba(217,119,6,0.1)'},{to:'/admin/checklists',icon:PackageCheck,label:'New Checklist',color:'#7C3AED',bg:'rgba(124,58,237,0.1)'}].map(({ to, icon:Icon, label, color, bg }) => (
            <Link key={to} to={to}>
              <motion.div whileHover={{ scale:1.04, y:-2 }} className="rounded-2xl p-4 text-center border" style={{ background:bg, borderColor:`${color}25` }}>
                <Icon className="w-6 h-6 mx-auto mb-2" style={{ color }}/>
                <p className="text-sm font-bold font-display" style={{ color }}>{label}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
