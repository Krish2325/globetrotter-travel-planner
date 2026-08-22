import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Compass, Mail, Lock, Eye, EyeOff, Loader2, MapPin, Calendar, Globe, AlertTriangle, ArrowRight, Hand } from 'lucide-react';

const GLASS = { background:'rgba(255,255,255,0.7)', backdropFilter:'blur(18px)', WebkitBackdropFilter:'blur(18px)', border:'1px solid rgba(214,122,74,0.2)', boxShadow:'0 8px 32px rgba(31,41,55,0.08)' };

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email:'', password:'' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try { await login(form.email, form.password); navigate('/dashboard'); }
    catch (err) { setError(err.response?.data?.error || 'Login failed. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex" style={{ background:'#F7F6F2' }}>
      {/* Left hero */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col items-center justify-center p-16"
        style={{ background:'linear-gradient(135deg,#B33E1A 0%,#F2683A 50%,#FB8A4C 100%)' }}>
        <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80"
          alt="Travel" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0" style={{ background:'linear-gradient(135deg,rgba(30,94,82,0.85),rgba(242,104,58,0.75))' }} />
        {[...Array(4)].map((_,i) => (
          <motion.div key={i} className="absolute w-2 h-2 rounded-full bg-white/20"
            style={{ top:`${20+i*18}%`, right:`${8+i*6}%` }}
            animate={{ y:[0,-10,0], opacity:[0.2,0.6,0.2] }}
            transition={{ duration:3+i*0.6, repeat:Infinity, delay:i*0.5 }} />
        ))}
        <motion.div className="relative text-center text-white"
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}>
          <div className="w-20 h-20 rounded-3xl bg-white/15 flex items-center justify-center mx-auto mb-6 border border-white/25 backdrop-blur-sm">
            <Compass className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold font-display mb-3">Globetrotter</h2>
          <p className="text-white/70 text-lg mb-10">Your smart travel planning companion</p>
          <div className="grid grid-cols-3 gap-4">
            {[['10+','Destinations'],['50+','Activities'],['Free','Forever']].map(([v,l]) => (
              <div key={l} className="rounded-2xl p-4 border border-white/20 backdrop-blur-sm" style={{ background:'rgba(255,255,255,0.1)' }}>
                <p className="text-2xl font-bold font-display">{v}</p>
                <p className="text-white/60 text-sm">{l}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div className="w-full max-w-md"
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:0.1 }}>
          <div className="lg:hidden text-center mb-8">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center"
              style={{ background:'linear-gradient(135deg,#B33E1A,#F2683A)' }}>
              <Compass className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-xl font-bold font-display" style={{ color:'#F2683A' }}>Globetrotter</h1>
          </div>

          <h1 className="text-3xl font-bold font-display mb-1 flex items-center gap-2" style={{ color:'#1F2937' }}>Welcome back <Hand className="w-8 h-8 text-amber-500" /></h1>
          <p className="text-sm mb-8" style={{ color:'#6B7280' }}>Sign in to continue your journey</p>

          <div className="rounded-3xl p-8" style={GLASS}>
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
                  className="rounded-2xl px-4 py-3 text-sm flex items-center gap-2"
                  style={{ background:'#FEE2E2', border:'1px solid #FECACA', color:'#991B1B' }}>
                  <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
                </motion.div>
              )}
              <div>
                <label className="input-label">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color:'#9CA3AF' }} />
                  <input id="login-email" type="email" placeholder="you@example.com"
                    className="input pl-11" value={form.email}
                    onChange={e => setForm({ ...form, email:e.target.value })} required />
                </div>
              </div>
              <div>
                <label className="input-label">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color:'#9CA3AF' }} />
                  <input id="login-password" type={showPass ? 'text' : 'password'}
                    placeholder="••••••••" className="input pl-11 pr-11"
                    value={form.password} onChange={e => setForm({ ...form, password:e.target.value })} required />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors" style={{ color:'#9CA3AF' }}>
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <motion.button id="login-submit" type="submit"
                whileHover={{ scale:1.01, y:-1 }} whileTap={{ scale:0.99 }}
                className="btn-primary w-full justify-center" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Signing in…' : 'Sign In'}
              </motion.button>
            </form>
            <div className="divider" />
            <p className="text-center text-sm" style={{ color:'#6B7280' }}>
              Don't have an account?{' '}
              <Link to="/signup" className="font-semibold hover:underline inline-flex items-center gap-1" style={{ color:'#F2683A' }}>
                Create one free <ArrowRight className="w-4 h-4" />
              </Link>
            </p>
          </div>

          <p className="text-center text-xs mt-4" style={{ color:'#9CA3AF' }}>
            Admin?{' '}
            <Link to="/admin/login" className="font-semibold hover:underline inline-flex items-center gap-1" style={{ color:'#F2683A' }}>
              Go to Admin Console <ArrowRight className="w-3 h-3" />
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
