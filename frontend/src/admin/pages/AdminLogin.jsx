import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdminAuth } from '../useAdminAuth';
import { motion } from 'framer-motion';
import { Compass, Mail, Lock, Eye, EyeOff, Loader2, Shield, BarChart3, Users, Map } from 'lucide-react';

const features = [
  { icon: BarChart3, text: 'Real-time analytics dashboard' },
  { icon: Map,       text: 'Manage trips & destinations' },
  { icon: Users,     text: 'Full user management suite' },
];

export default function AdminLogin() {
  const { adminLogin } = useAdminAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await adminLogin(form.email, form.password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || err.response?.data?.error || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#F5F5FC' }}>
      {/* Left — hero */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col items-center justify-center p-16"
        style={{ background: 'linear-gradient(135deg, #3730A3 0%, #4F46E5 50%, #6366F1 100%)' }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage:"url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/svg%3E\")" }} />
        {[...Array(5)].map((_,i) => (
          <motion.div key={i} className="absolute w-2 h-2 rounded-full bg-white/20"
            style={{ top:`${15+i*15}%`, right:`${5+i*8}%` }}
            animate={{ y:[0,-10,0], opacity:[0.2,0.5,0.2] }}
            transition={{ duration:3+i*0.6, repeat:Infinity, delay:i*0.5 }} />
        ))}
        <motion.div className="relative text-center text-white"
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}>
          <div className="w-20 h-20 rounded-3xl bg-white/15 flex items-center justify-center mx-auto mb-6 border border-white/25 backdrop-blur-sm">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold font-display mb-2">Globetrotter</h2>
          <p className="text-2xl font-semibold font-display mb-6 text-white/80">Admin Console</p>
          <p className="text-white/60 max-w-xs mx-auto text-sm leading-relaxed">
            Manage destinations, analytics, users, and platform content from one powerful hub.
          </p>
          <div className="space-y-3 mt-10 text-left">
            {features.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 bg-white/10 rounded-2xl px-4 py-3 border border-white/15 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-white text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div className="w-full max-w-md"
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:0.1 }}>
          {/* Mobile header */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center"
              style={{ background:'linear-gradient(135deg,#3730A3,#4F46E5)' }}>
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-xl font-bold font-display" style={{ color:'#3730A3' }}>Globetrotter Admin</h1>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold font-display" style={{ color:'#1F2937' }}>Admin Sign In</h1>
            <p className="mt-1 text-sm" style={{ color:'#6B7280' }}>Restricted to authorized administrators only</p>
          </div>

          <div className="rounded-3xl p-8" style={{
            background:'rgba(255,255,255,0.7)', backdropFilter:'blur(18px)',
            border:'1px solid rgba(99, 102, 241,0.2)', boxShadow:'0 8px 32px rgba(31,41,55,0.08)'
          }}>
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
                  className="rounded-2xl px-4 py-3 text-sm"
                  style={{ background:'#FEE2E2', border:'1px solid #FECACA', color:'#991B1B' }}>
                  ⚠️ {error}
                </motion.div>
              )}

              <div>
                <label className="input-label">Admin Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color:'#9CA3AF' }} />
                  <input id="admin-email" type="email" placeholder="admin@globetrotter.com"
                    className="input pl-11" value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>
              </div>

              <div>
                <label className="input-label">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color:'#9CA3AF' }} />
                  <input id="admin-password" type={showPass ? 'text' : 'password'}
                    placeholder="••••••••" className="input pl-11 pr-11"
                    value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color:'#9CA3AF' }}>
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <motion.button id="admin-login-btn" type="submit"
                whileHover={{ scale:1.01, y:-1 }} whileTap={{ scale:0.99 }}
                className="btn-primary w-full justify-center" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Authenticating…' : 'Sign In to Admin'}
              </motion.button>
            </form>

            <div className="mt-6 pt-6" style={{ borderTop:'1px solid rgba(99, 102, 241,0.15)' }}>
              <p className="text-center text-xs" style={{ color:'#9CA3AF' }}>
                Not an admin?{' '}
                <Link to="/login" className="font-semibold hover:underline" style={{ color:'#4F46E5' }}>
                  Go to user login →
                </Link>
              </p>
            </div>
          </div>

          <p className="text-center text-xs mt-6" style={{ color:'#9CA3AF' }}>
            Protected by role-based access control
          </p>
          <p className="text-center text-xs mt-3" style={{ color:'#9CA3AF' }}>
            New administrator?{' '}
            <Link to="/admin/signup" className="font-semibold hover:underline" style={{ color:'#4F46E5' }}>
              Create admin account →
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
