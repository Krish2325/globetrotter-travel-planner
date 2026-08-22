import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Compass, Mail, Lock, User, Eye, EyeOff, Loader2, MapPin, Luggage, Calendar, Globe, ArrowRight } from 'lucide-react';

const GLASS = { background:'rgba(255,255,255,0.7)', backdropFilter:'blur(18px)', WebkitBackdropFilter:'blur(18px)', border:'1px solid rgba(214,122,74,0.2)', boxShadow:'0 8px 32px rgba(31,41,55,0.08)' };
const FEATURES = [
  { icon:MapPin,   text:'Build city-by-city itineraries' },
  { icon:Luggage,  text:'Smart packing checklists for every season' },
  { icon:Calendar, text:'Budget tracking & trip planning tools' },
];

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', password:'', confirmPassword:'' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setLoading(true);
    try { await signup(form.name, form.email, form.password); navigate('/dashboard'); }
    catch (err) { setError(err.response?.data?.error || 'Signup failed. Please try again.'); }
    finally { setLoading(false); }
  };

  const update = (f) => (e) => setForm({ ...form, [f]:e.target.value });

  return (
    <div className="min-h-screen flex" style={{ background:'#F7F6F2' }}>
      {/* Left form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div className="w-full max-w-md"
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}>
          <div className="lg:hidden text-center mb-8">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center"
              style={{ background:'linear-gradient(135deg,#B33E1A,#F2683A)' }}>
              <Compass className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-xl font-bold font-display" style={{ color:'#F2683A' }}>Globetrotter</h1>
          </div>

          <h1 className="text-3xl font-bold font-display mb-1 flex items-center gap-2" style={{ color:'#1F2937' }}>Start exploring <Globe className="w-8 h-8 text-teal-600" /></h1>
          <p className="text-sm mb-8" style={{ color:'#6B7280' }}>Create your free account — no credit card needed</p>

          <div className="rounded-3xl p-8" style={GLASS}>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
                  className="rounded-2xl px-4 py-3 text-sm"
                  style={{ background:'#FEE2E2', border:'1px solid #FECACA', color:'#991B1B' }}>
                  {error}
                </motion.div>
              )}
              <div>
                <label className="input-label">Full name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color:'#9CA3AF' }} />
                  <input id="signup-name" type="text" placeholder="Your name"
                    className="input pl-11" value={form.name} onChange={update('name')} required />
                </div>
              </div>
              <div>
                <label className="input-label">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color:'#9CA3AF' }} />
                  <input id="signup-email" type="email" placeholder="you@example.com"
                    className="input pl-11" value={form.email} onChange={update('email')} required />
                </div>
              </div>
              <div>
                <label className="input-label">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color:'#9CA3AF' }} />
                  <input id="signup-password" type={showPass ? 'text' : 'password'}
                    placeholder="Min. 8 characters" className="input pl-11 pr-11"
                    value={form.password} onChange={update('password')} required />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color:'#9CA3AF' }}>
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="input-label">Confirm password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color:'#9CA3AF' }} />
                  <input id="signup-confirm" type="password" placeholder="Repeat password"
                    className="input pl-11" value={form.confirmPassword} onChange={update('confirmPassword')} required />
                </div>
              </div>
              <motion.button id="signup-submit" type="submit"
                whileHover={{ scale:1.01, y:-1 }} whileTap={{ scale:0.99 }}
                className="btn-primary w-full justify-center mt-2" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Creating account…' : 'Create Free Account'}
              </motion.button>
            </form>
            <div className="divider" />
            <p className="text-center text-sm" style={{ color:'#6B7280' }}>
              Already have an account?{' '}
              <Link to="/login" className="font-semibold hover:underline inline-flex items-center gap-1" style={{ color:'#F2683A' }}>
                Sign in <ArrowRight className="w-4 h-4" />
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right hero */}
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden flex-col items-center justify-center p-16"
        style={{ background:'linear-gradient(135deg,#B33E1A 0%,#F2683A 60%,#FB8A4C 100%)' }}>
        <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80"
          alt="Mountains" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0" style={{ background:'linear-gradient(135deg,rgba(30,94,82,0.85),rgba(61,155,133,0.75))' }} />
        <motion.div className="relative text-center text-white"
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}>
          <div className="w-20 h-20 rounded-3xl bg-white/15 flex items-center justify-center mx-auto mb-6 border border-white/25 backdrop-blur-sm">
            <Compass className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold font-display mb-3">Everything you need<br />to travel smarter</h2>
          <div className="space-y-3 mt-8 text-left">
            {FEATURES.map(({ icon:Icon, text }) => (
              <div key={text} className="flex items-center gap-3 rounded-2xl px-4 py-3 border border-white/15 backdrop-blur-sm"
                style={{ background:'rgba(255,255,255,0.1)' }}>
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-white text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>
          <p className="text-white/50 text-xs mt-8">100% free. No credit card required.</p>
        </motion.div>
      </div>
    </div>
  );
}
