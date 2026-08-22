import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuthStore from '../store/authStore';
import { Shield, Mail, Lock, User, Eye, EyeOff, Loader, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export default function Signup() {
  const { signup } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', password:'', confirm:'' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const strength = (() => {
    const p = form.password; let s = 0;
    if (p.length >= 8) s++; if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++; if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();
  const strengthColor = ['','#EF4444','#F59E0B','#3B82F6','#22C55E'][strength];
  const strengthLabel = ['','Weak','Fair','Good','Strong'][strength];

  const submit = async (e) => {
    e.preventDefault(); setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setLoading(true);
    try { await signup(form.name, form.email, form.password); setSuccess(true); setTimeout(() => navigate('/dashboard'), 1600); }
    catch (err) { setError(err.response?.data?.error || err.message || 'Signup failed'); }
    finally { setLoading(false); }
  };

  const inp = (f) => (e) => setForm({ ...form, [f]:e.target.value });

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#F7F6F2', padding:'2rem 1.5rem' }}>
      <motion.div style={{ width:'100%', maxWidth:460 }}
        initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
        <div style={{ textAlign:'center', marginBottom:'2rem' }}>
          <div style={{ width:60, height:60, borderRadius:20, background:'linear-gradient(135deg,#B33E1A,#F2683A)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 0.75rem', boxShadow:'0 8px 24px rgba(242,104,58,0.3)' }}>
            <Shield size={30} color="#fff" />
          </div>
          <h1 style={{ fontFamily:'Poppins,sans-serif', fontWeight:800, fontSize:'1.875rem', color:'#1F2937' }}>Create Admin Account</h1>
          <p style={{ fontSize:'0.875rem', color:'#6B7280', marginTop:'0.25rem' }}>Register to manage Globetrotter platform</p>
        </div>

        {success ? (
          <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
            className="glass-sm" style={{ padding:'3rem', textAlign:'center' }}>
            <div style={{ width:64, height:64, borderRadius:'50%', background:'rgba(34,197,94,0.12)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1rem' }}>
              <CheckCircle2 size={32} color="#22C55E" />
            </div>
            <h3 style={{ fontFamily:'Poppins,sans-serif', fontWeight:700, fontSize:'1.25rem', color:'#1F2937', marginBottom:'0.5rem' }}>Account Created!</h3>
            <p style={{ fontSize:'0.875rem', color:'#6B7280' }}>Redirecting to dashboard...</p>
          </motion.div>
        ) : (
          <div className="glass-sm" style={{ padding:'2rem' }}>
            <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              {error && (
                <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
                  style={{ padding:'0.75rem 1rem', borderRadius:12, background:'#FEE2E2', border:'1px solid #FECACA', color:'#991B1B', fontSize:'0.875rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
                  <AlertTriangle size={16} /> {error}
                </motion.div>
              )}
              {/* Name */}
              <div>
                <label className="input-label">Full Name</label>
                <div style={{ position:'relative' }}>
                  <User size={15} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#9CA3AF' }} />
                  <input className="input" type="text" placeholder="Your full name" style={{ paddingLeft:40 }}
                    value={form.name} onChange={inp('name')} required />
                </div>
              </div>
              {/* Email */}
              <div>
                <label className="input-label">Admin Email</label>
                <div style={{ position:'relative' }}>
                  <Mail size={15} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#9CA3AF' }} />
                  <input className="input" type="email" placeholder="admin@globetrotter.dev" style={{ paddingLeft:40 }}
                    value={form.email} onChange={inp('email')} required />
                </div>
              </div>
              {/* Password */}
              <div>
                <label className="input-label">Password</label>
                <div style={{ position:'relative' }}>
                  <Lock size={15} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#9CA3AF' }} />
                  <input className="input" type={showPw ? 'text':'password'} placeholder="Min. 8 characters"
                    style={{ paddingLeft:40, paddingRight:44 }}
                    value={form.password} onChange={inp('password')} required />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'#9CA3AF' }}>
                    {showPw ? <EyeOff size={15}/> : <Eye size={15}/>}
                  </button>
                </div>
                {form.password && (
                  <div style={{ marginTop:'0.5rem' }}>
                    <div style={{ display:'flex', gap:4, marginBottom:4 }}>
                      {[1,2,3,4].map(n => <div key={n} style={{ flex:1, height:4, borderRadius:4, background: n<=strength ? strengthColor : '#EFEDE7', transition:'all 0.3s' }}/>)}
                    </div>
                    <p style={{ fontSize:'0.7rem', fontWeight:600, color:strengthColor }}>{strengthLabel}</p>
                  </div>
                )}
              </div>
              {/* Confirm */}
              <div>
                <label className="input-label">Confirm Password</label>
                <div style={{ position:'relative' }}>
                  <Lock size={15} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#9CA3AF' }} />
                  <input className="input" type="password" placeholder="Repeat password" style={{ paddingLeft:40 }}
                    value={form.confirm} onChange={inp('confirm')} required />
                </div>
                {form.confirm && (
                  <p style={{ fontSize:'0.7rem', fontWeight:600, marginTop:4, color: form.password===form.confirm ? '#22C55E':'#EF4444' }}>
                    {form.password===form.confirm ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </p>
                )}
              </div>

              <motion.button type="submit" whileHover={{ scale:1.01, y:-1 }} whileTap={{ scale:0.99 }}
                className="btn btn-primary" style={{ justifyContent:'center', marginTop:'0.5rem' }} disabled={loading}>
                {loading && <Loader size={15} style={{ animation:'spin 0.7s linear infinite' }}/>}
                {loading ? 'Creating Account...' : 'Create Admin Account'}
              </motion.button>
            </form>
            <div className="divider" />
            <p style={{ textAlign:'center', fontSize:'0.875rem', color:'#6B7280' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color:'#F2683A', fontWeight:600, textDecoration:'none', display:'inline-flex', alignItems:'center', gap:'0.25rem' }}>Sign in <ArrowRight size={14} /></Link>
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
