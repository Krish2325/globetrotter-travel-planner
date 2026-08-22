import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../lib/api';
import { PlusCircle, Calendar, FileText, Globe, Loader2 } from 'lucide-react';

export default function CreateTrip() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({
    title: searchParams.get('title') || '', description: '', startDate: '', endDate: '', isPublic: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Update title if query param changes
  useEffect(() => {
    const t = searchParams.get('title');
    if (t) setForm(f => ({ ...f, title: t }));
  }, [searchParams]);

  const update = (field) => (e) => setForm({ ...form, [field]: e.type === 'checkbox' ? e.target.checked : e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title || !form.startDate || !form.endDate) { setError('Title, start date, and end date are required'); return; }
    if (new Date(form.endDate) < new Date(form.startDate)) { setError('End date must be after start date'); return; }
    setLoading(true);
    try {
      const { data } = await api.post('/trips', form);
      navigate(`/trips/${data.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Plan a New Trip</h1>
        <p className="page-subtitle">Fill in the details to create your travel plan</p>
      </div>

      <div className="card p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-coral-500/10 border border-coral-500/30 rounded-xl px-4 py-3 text-coral-300 text-sm">{error}</div>
          )}

          <div>
            <label className="input-label">Trip Title *</label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-100" />
              <input
                id="trip-title" type="text" placeholder="e.g. Golden Triangle India, Backpacking Europe…"
                className="input pl-10" value={form.title} onChange={update('title')} required
              />
            </div>
          </div>

          <div>
            <label className="input-label">Description</label>
            <textarea
              id="trip-description" rows={3}
              placeholder="What's the vibe of this trip? Any special notes…"
              className="input resize-none" value={form.description} onChange={update('description')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="input-label">Start Date *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-100" />
                <input
                  id="trip-start" type="date" className="input pl-10"
                  value={form.startDate} onChange={update('startDate')} required
                />
              </div>
            </div>
            <div>
              <label className="input-label">End Date *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-100" />
                <input
                  id="trip-end" type="date" className="input pl-10"
                  value={form.endDate} onChange={update('endDate')} required
                />
              </div>
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input id="trip-public" type="checkbox" className="peer sr-only" checked={form.isPublic} onChange={update('isPublic')} />
              <div className="w-10 h-5 bg-cream-200 rounded-full peer-checked:bg-teal-700 transition-colors border border-cream-300" />
              <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
            </div>
            <div>
              <span className="text-sm font-medium text-ink-700">Share with Community</span>
              <p className="text-xs text-ink-300">Let other travelers discover and copy your itinerary</p>
            </div>
          </label>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button id="create-trip-submit" type="submit" className="btn-primary flex-1 justify-center" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
              {loading ? 'Creating…' : 'Create Trip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
