import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../lib/api';
import { FileText, PlusCircle, Trash2, Edit3, ArrowLeft, Save, X, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export default function NotesPage() {
  const { id: tripId } = useParams();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', content: '' });
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    api.get(`/notes?tripId=${tripId}`).then(({ data }) => setNotes(data)).finally(() => setLoading(false));
  }, [tripId]);

  const startEdit = (note) => {
    setEditing(note.id);
    setForm({ title: note.title, content: note.content });
    setShowForm(true);
  };

  const saveNote = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        const { data } = await api.patch(`/notes/${editing}`, form);
        setNotes(notes.map(n => n.id === editing ? data : n));
        setEditing(null);
      } else {
        const { data } = await api.post('/notes', { tripId, ...form });
        setNotes([data, ...notes]);
      }
      setForm({ title: '', content: '' });
      setShowForm(false);
    } finally { setSaving(false); }
  };

  const deleteNote = async (id) => {
    await api.delete(`/notes/${id}`);
    setNotes(notes.filter(n => n.id !== id));
  };

  if (loading) return <div className="skeleton h-96" />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link to={`/trips/${tripId}`} className="btn-icon"><ArrowLeft className="w-4 h-4" /></Link>
        <div className="flex-1">
          <h1 className="page-title">Trip Journal</h1>
          <p className="page-subtitle">Your notes and memories</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ title: '', content: '' }); }} className="btn-primary">
          {showForm ? <X className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'New Note'}
        </button>
      </div>

      {/* Note form */}
      {showForm && (
        <div className="card p-6 animate-slide-up">
          <h2 className="section-title">{editing ? 'Edit Note' : 'New Note'}</h2>
          <form onSubmit={saveNote} className="space-y-4">
            <input type="text" placeholder="Note title…" className="input" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            <textarea rows={8} placeholder="Write your thoughts, memories, plans…" className="input resize-none" required value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
            <div className="flex gap-3">
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {editing ? 'Update Note' : 'Save Note'}
              </button>
            </div>
          </form>
        </div>
      )}

      {notes.length === 0 ? (
        <div className="card p-12 text-center">
          <FileText className="w-12 h-12 text-ink-900/20 mx-auto mb-3" />
          <p className="text-ink-300">No notes yet. Start writing your travel journal!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notes.map(note => (
            <div key={note.id} className="card-hover p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-ink-900">{note.title}</h3>
                  <p className="text-xs text-ink-300 mt-0.5">{format(new Date(note.updatedAt), 'MMM d, yyyy · h:mm a')}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => startEdit(note)} className="btn-icon w-7 h-7"><Edit3 className="w-3 h-3" /></button>
                  <button onClick={() => deleteNote(note.id)} className="btn-icon w-7 h-7 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                </div>
              </div>
              <p className="text-ink-500 text-sm leading-relaxed line-clamp-4">{note.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
