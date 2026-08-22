import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuthStore from '../store/authStore';
import { Shield, Mail, Lock, Eye, EyeOff, Loader, BarChart3, Map, Users, AlertTriangle, ArrowRight } from 'lucide-react';

const FEATURES = [
  { icon:BarChart3, text:'Real-time analytics dashboard' },
  { icon:Map,       text:'Manage trips & destinations' },
  { icon:Users,     text:'Full user management suite' },
];

export default function Login() {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email:'', password:'' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try { await login(form.email, form.password); navigate('/dashboard'); }
    catch (err) { setError(err.response?.data?.error || err.message || 'Login failed'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', background:'#F7F6F2' }}>
      {/* Left hero */}
      <div className="hidden lg:flex" style={{
        width:'45%', position:'relative', flexDirection:'column',
        alignItems:'center', justifyContent:'center', padding:'4rem',
        background:'linear-gradient(145deg,#B33E1A 0%,#F2683A 55%,#FB8A4C 100%)', overflow:'hidden'
      }}>
        <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80"
          alt="Travel" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', opacity:0.15 }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(145deg,rgba(30,94,82,0.88),rgba(61,155,133,0.8))' }} />
        {[...Array(4)].map((_,i) => (
          <motion.div key={i} style={{
            position:'absolute', borderRadius:'50%', background:'rgba(255,255,255,0.1)',
            width:60+i*25, height:60+i*25, top:(10+i*18)+'%', right:(4+i*5)+'%'
          }} animate={{ y:[0,-14,0], opacity:[0.15,0.3,0.15] }}
          transition={{ duration:4+i*0.8, repeat:Infinity, delay:i*0.6 }} />
        ))}
        <motion.div style={{ position:'relative', textAlign:'center', color:'#fff' }}
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}>
          <div style={{
            width:80, height:80, borderRadius:24, margin:'0 auto 1.5rem',
            background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.25)',
            display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(8px)'
          }}>
            <Shield size={40} color="#fff" />
          </div>
          <h1 style={{ fontFamily:'Poppins,sans-serif', fontSize:'2.5rem', fontWeight:800, marginBottom:'0.5rem' }}>Globetrotter</h1>
          <p style={{ fontSize:'1.25rem', color:'rgba(255,255,255,0.7)', marginBottom:'2.5rem' }}>Admin Console</p>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem', textAlign:'left' }}>
            {FEATURES.map(({ icon:Icon, text }) => (
              <div key={text} style={{
                display:'flex', alignItems:'center', gap:'0.75rem',
                padding:'0.75rem 1rem', borderRadius:16,
                background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.15)', backdropFilter:'blur(8px)'
              }}>
                <div style={{ width:32, height:32, borderRadius:10, background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Icon size={16} color="#fff" />
                </div>
                <span style={{ fontSize:'0.875rem', fontWeight:500 }}>{text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right form */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'3rem 1.5rem' }}>
        <motion.div style={{ width:'100%', maxWidth:420 }}
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:0.1 }}>
          <div className="lg:hidden" style={{ textAlign:'center', marginBottom:'2rem' }}>
            <div style={{ width:56, height:56, borderRadius:18, background:'linear-gradient(135deg,#B33E1A,#F2683A)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 0.75rem' }}>
              <Shield size={28} color="#fff" />
            </div>
            <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:'1.25rem', color:'#B33E1A' }}>Globetrotter Admin</h1>
          </div>

          <h2 style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:'1.875rem', color:'#1F2937', marginBottom:'0.25rem' }}>Admin Sign In</h2>
          <p style={{ fontSize:'0.875rem', color:'#6B7280', marginBottom:'2rem' }}>Restricted to authorized administrators only</p>

          <div className="glass-sm" style={{ padding:'2rem' }}>
            <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              {error && (
                <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
                  style={{ padding:'0.75rem 1rem', borderRadius:12, background:'#FEE2E2', border:'1px solid #FECACA', color:'#991B1B', fontSize:'0.875rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
                  <AlertTriangle size={16} /> {error}
                </motion.div>
              )}
              <div>
                <label className="input-label">Admin Email</label>
                <div style={{ position:'relative' }}>
                  <Mail size={15} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#9CA3AF' }} />
                  <input className="input" type="email" placeholder="admin@globetrotter.dev" style={{ paddingLeft:40 }}
                    value={form.email} onChange={e => setForm({...form, email:e.target.value})} required />
                </div>
              </div>
              <div>
                <label className="input-label">Password</label>
                <div style={{ position:'relative' }}>
                  <Lock size={15} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#9CA3AF' }} />
                  <input className="input" type={showPw ? 'text' : 'password'} placeholder="••••••••"
                    style={{ paddingLeft:40, paddingRight:44 }}
                    value={form.password} onChange={e => setForm({...form, password:e.target.value})} required />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#9CA3AF' }}>
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <motion.button type="submit" whileHover={{ scale:1.01, y:-1 }} whileTap={{ scale:0.99 }}
                className="btn btn-primary" style={{ justifyContent:'center', marginTop:'0.5rem' }} disabled={loading}>
                {loading && <Loader size={15} style={{ animation:'spin 0.7s linear infinite' }} />}
                {loading ? 'Signing in...' : 'Sign In to Admin Console'}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
