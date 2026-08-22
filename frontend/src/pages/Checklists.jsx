import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import { CheckSquare, PlusCircle, Trash2, Check, Loader2, Map } from 'lucide-react';

export default function Checklists() {
  const [checklists, setChecklists] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newListTitle, setNewListTitle] = useState('');
  const [newListTripId, setNewListTripId] = useState('');
  const [newItems, setNewItems] = useState({});
  const [creating, setCreating] = useState(false);

  const load = () => api.get('/checklists').then(({ data }) => setChecklists(data));

  useEffect(() => {
    Promise.all([load(), api.get('/trips').then(({ data }) => setTrips(data))]).finally(() => setLoading(false));
  }, []);

  const createList = async (e) => {
    e.preventDefault();
    if (!newListTitle.trim() || !newListTripId) return;
    setCreating(true);
    try {
      const { data } = await api.post('/checklists', { tripId: newListTripId, title: newListTitle });
      const trip = trips.find(t => t.id === newListTripId);
      setChecklists([{ ...data, trip: { id: trip.id, title: trip.title } }, ...checklists]);
      setNewListTitle('');
      setNewListTripId('');
    } finally {
      setCreating(false);
    }
  };

  const addItem = async (checklistId, e) => {
    e.preventDefault();
    const label = newItems[checklistId]?.trim();
    if (!label) return;
    const { data } = await api.post(`/checklists/${checklistId}/items`, { label });
    setChecklists(checklists.map(cl =>
      cl.id === checklistId ? { ...cl, items: [...(cl.items || []), data] } : cl
    ));
    setNewItems({ ...newItems, [checklistId]: '' });
  };

  const toggleItem = async (checklistId, item) => {
    const { data } = await api.patch(`/checklists/items/${item.id}`, { isChecked: !item.isChecked });
    setChecklists(checklists.map(cl =>
      cl.id === checklistId
        ? { ...cl, items: cl.items.map(i => i.id === item.id ? data : i) }
        : cl
    ));
  };

  const deleteItem = async (checklistId, itemId) => {
    await api.delete(`/checklists/items/${itemId}`);
    setChecklists(checklists.map(cl =>
      cl.id === checklistId ? { ...cl, items: cl.items.filter(i => i.id !== itemId) } : cl
    ));
  };

  const deleteChecklist = async (id) => {
    await api.delete(`/checklists/${id}`);
    setChecklists(checklists.filter(cl => cl.id !== id));
  };

  if (loading) return <div className="skeleton h-96" />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Checklists</h1>
        <p className="page-subtitle">Packing lists and to-dos across all your trips</p>
      </div>

      {trips.length === 0 ? (
        <div className="card p-12 text-center">
          <CheckSquare className="w-12 h-12 text-ink-900/20 mx-auto mb-3" />
          <p className="text-ink-300">Create a trip first to start a checklist</p>
          <Link to="/trips/new" className="btn-primary mt-5 inline-flex">
            <PlusCircle className="w-4 h-4" /> Plan a Trip
          </Link>
        </div>
      ) : (
        <>
          {/* New list */}
          <form onSubmit={createList} className="card p-5 flex flex-col sm:flex-row gap-3">
            <select className="input sm:w-56" value={newListTripId} onChange={e => setNewListTripId(e.target.value)} required>
              <option value="">Select a trip…</option>
              {trips.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
            </select>
            <input type="text" placeholder="New list name (e.g. Clothes, Documents, Toiletries)…"
              className="input flex-1" value={newListTitle} onChange={e => setNewListTitle(e.target.value)} />
            <button type="submit" className="btn-primary" disabled={creating}>
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
              Create List
            </button>
          </form>

          {checklists.length === 0 ? (
            <div className="card p-12 text-center">
              <CheckSquare className="w-12 h-12 text-ink-900/20 mx-auto mb-3" />
              <p className="text-ink-300">No checklists yet. Create one above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {checklists.map(cl => {
                const total = cl.items?.length || 0;
                const done = cl.items?.filter(i => i.isChecked).length || 0;
                const pct = total ? Math.round((done / total) * 100) : 0;
                return (
                  <div key={cl.id} className="card p-5">
                    <div className="flex items-center justify-between mb-1">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-ink-900 truncate">{cl.title}</h3>
                        {cl.trip && (
                          <Link to={`/trips/${cl.trip.id}`} className="text-xs text-[#4F46E5] font-medium flex items-center gap-1 mt-0.5 hover:underline">
                            <Map className="w-3 h-3" /> {cl.trip.title}
                          </Link>
                        )}
                      </div>
                      <button onClick={() => deleteChecklist(cl.id)} className="btn-icon w-7 h-7 text-ink-100 hover:text-red-500 shrink-0">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-xs text-ink-300 mb-2">{done}/{total} done</p>

                    {total > 0 && (
                      <div className="h-1.5 bg-cream-200 rounded-full mb-3 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-teal-600 to-sage-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                      </div>
                    )}

                    <div className="space-y-1.5 mb-3 max-h-48 overflow-y-auto">
                      {cl.items?.sort((a, b) => a.order - b.order).map(item => (
                        <div key={item.id} className="flex items-center gap-2 group">
                          <button onClick={() => toggleItem(cl.id, item)}
                            className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all duration-200 ${item.isChecked ? 'bg-sage-500 border-sage-500' : 'border-cream-300 hover:border-teal-500'}`}>
                            {item.isChecked && <Check className="w-3 h-3 text-ink-900" />}
                          </button>
                          <span className={`text-sm flex-1 transition-colors ${item.isChecked ? 'text-ink-100 line-through' : 'text-ink-700'}`}>
                            {item.label}
                          </span>
                          <button onClick={() => deleteItem(cl.id, item.id)}
                            className="opacity-0 group-hover:opacity-100 text-ink-900/20 hover:text-red-500 transition-all">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <form onSubmit={e => addItem(cl.id, e)} className="flex gap-2">
                      <input type="text" placeholder="Add item…" className="input text-sm py-2 flex-1"
                        value={newItems[cl.id] || ''} onChange={e => setNewItems({ ...newItems, [cl.id]: e.target.value })} />
                      <button type="submit" className="btn-icon"><PlusCircle className="w-4 h-4" /></button>
                    </form>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
