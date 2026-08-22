import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import { User, Mail, Shield, Calendar, Save, Lock, Eye, EyeOff, Loader2, Camera, CheckCircle2, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

export default function ProfilePage() {
  const { user: authUser, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nameForm, setNameForm] = useState({ name: '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmNew: '' });
  const [savingName, setSavingName] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [nameMsg, setNameMsg] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    api.get('/users/profile').then(({ data }) => {
      setProfile(data);
      setNameForm({ name: data.name });
    }).finally(() => setLoading(false));
  }, []);

  const saveName = async (e) => {
    e.preventDefault();
    setSavingName(true);
    try {
      const { data } = await api.patch('/users/profile', { name: nameForm.name });
      setProfile(data);
      setNameMsg('Profile updated!');
      setTimeout(() => setNameMsg(''), 3000);
    } catch (err) {
      setNameMsg(err.response?.data?.error || 'Update failed');
    } finally { setSavingName(false); }
  };

  const savePw = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmNew) { setPwMsg('Passwords do not match'); return; }
    setSavingPw(true);
    try {
      await api.patch('/users/change-password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      setPwMsg('Password changed successfully!');
      setPwForm({ currentPassword: '', newPassword: '', confirmNew: '' });
      setTimeout(() => setPwMsg(''), 3000);
    } catch (err) {
      setPwMsg(err.response?.data?.error || 'Failed to change password');
    } finally { setSavingPw(false); }
  };

  if (loading) return <div className="skeleton h-96" />;

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Profile & Settings</h1>
        <p className="page-subtitle">Manage your account</p>
      </div>

      {/* Avatar card */}
      <div className="card p-6 flex items-center gap-5">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-600 to-ocean-500 flex items-center justify-center text-3xl font-bold shadow-xl shadow-primary-500/30">
            {profile?.name?.[0]?.toUpperCase()}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-ink-900">{profile?.name}</h2>
          <p className="text-ink-300 text-sm">{profile?.email}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`badge ${profile?.isEmailVerified ? 'badge-sage' : 'badge-amber'} flex items-center gap-1`}>
              {profile?.isEmailVerified ? <><CheckCircle2 className="w-3 h-3" /> Verified</> : <><AlertTriangle className="w-3 h-3" /> Unverified</>}
            </span>
            <span className="badge badge-teal">{profile?.role}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 card p-1">
        {[
          { key: 'profile', icon: User, label: 'Profile' },
          { key: 'security', icon: Shield, label: 'Security' }
        ].map(({ key, icon: Icon, label }) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium capitalize transition-all duration-200 flex items-center justify-center gap-2 ${
              activeTab === key ? 'bg-teal-700 text-ink-900 shadow-lg' : 'text-ink-300 hover:text-ink-900'
            }`}>
            <Icon className="w-4 h-4" />{label}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <div className="card p-6 space-y-5 animate-fade-in">
          <h2 className="section-title">Edit Profile</h2>
          <form onSubmit={saveName} className="space-y-4">
            <div>
              <label className="input-label">Display Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-100" />
                <input type="text" className="input pl-10" value={nameForm.name} onChange={e => setNameForm({ name: e.target.value })} required />
              </div>
            </div>
            <div>
              <label className="input-label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-100" />
                <input type="email" className="input pl-10 opacity-50 cursor-not-allowed" value={profile?.email || ''} disabled />
              </div>
              <p className="text-xs text-ink-100 mt-1">Email cannot be changed</p>
            </div>
            <div>
              <label className="input-label">Member Since</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-100" />
                <input type="text" className="input pl-10 opacity-50 cursor-not-allowed"
                  value={profile?.createdAt ? format(new Date(profile.createdAt), 'MMMM d, yyyy') : ''} disabled />
              </div>
            </div>
            {nameMsg && (
              <p className={`text-sm ${nameMsg.includes('!') ? 'text-sage-400' : 'text-red-500'}`}>{nameMsg}</p>
            )}
            <button type="submit" className="btn-primary" disabled={savingName}>
              {savingName ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {savingName ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="card p-6 space-y-5 animate-fade-in">
          <h2 className="section-title">Change Password</h2>
          <form onSubmit={savePw} className="space-y-4">
            {['currentPassword', 'newPassword', 'confirmNew'].map((field, i) => (
              <div key={field}>
                <label className="input-label">{['Current Password', 'New Password', 'Confirm New Password'][i]}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-100" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="input pl-10 pr-10"
                    value={pwForm[field]}
                    onChange={e => setPwForm({ ...pwForm, [field]: e.target.value })}
                    required
                  />
                  {i === 0 && (
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-100 hover:text-ink-500 transition-colors">
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {pwMsg && (
              <p className={`text-sm ${pwMsg.includes('!') ? 'text-sage-400' : 'text-red-500'}`}>{pwMsg}</p>
            )}
            <button type="submit" className="btn-primary" disabled={savingPw}>
              {savingPw ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
              {savingPw ? 'Updating…' : 'Update Password'}
            </button>
          </form>

          <div className="divider" />
          <button onClick={logout} className="btn-danger w-full justify-center">
            Sign Out of All Devices
          </button>
        </div>
      )}
    </div>
  );
}
