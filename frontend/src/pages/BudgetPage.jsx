import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../lib/api';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, PlusCircle, Trash2, ArrowLeft, TrendingDown, Loader2 } from 'lucide-react';

const COLORS = ['#6366f1','#0ea5e9','#22c55e','#f59e0b','#f43f5e','#a855f7'];
const EXPENSE_CATS = ['ACCOMMODATION','FOOD','TRANSPORT','ACTIVITIES','SHOPPING','MISCELLANEOUS'];
const BUDGET_FIELDS = ['accommodation','food','transport','activities','shopping','miscellaneous'];

export default function BudgetPage() {
  const { id: tripId } = useParams();
  const [budget, setBudget] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [budgetForm, setBudgetForm] = useState({ totalBudget: '', currency: 'INR', accommodation: '', food: '', transport: '', activities: '', shopping: '', miscellaneous: '' });
  const [expForm, setExpForm] = useState({ title: '', amount: '', category: 'FOOD', date: new Date().toISOString().split('T')[0], notes: '' });
  const [savingBudget, setSavingBudget] = useState(false);
  const [addingExp, setAddingExp] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get(`/budgets/${tripId}`).catch(() => null),
      api.get(`/expenses?tripId=${tripId}`),
    ]).then(([b, e]) => {
      if (b) { setBudget(b.data); setBudgetForm({ ...b.data, totalBudget: b.data.totalBudget?.toString() }); }
      setExpenses(e.data);
    }).finally(() => setLoading(false));
  }, [tripId]);

  const saveBudget = async () => {
    setSavingBudget(true);
    try {
      if (budget) {
        const { data } = await api.patch(`/budgets/${tripId}`, budgetForm);
        setBudget(data);
      } else {
        const { data } = await api.post('/budgets', { tripId, ...budgetForm });
        setBudget(data);
      }
    } finally { setSavingBudget(false); }
  };

  const addExpense = async (e) => {
    e.preventDefault();
    setAddingExp(true);
    const { data } = await api.post('/expenses', { tripId, ...expForm });
    setExpenses([data, ...expenses]);
    setExpForm({ title: '', amount: '', category: 'FOOD', date: new Date().toISOString().split('T')[0], notes: '' });
    setAddingExp(false);
  };

  const deleteExpense = async (expId) => {
    await api.delete(`/expenses/${expId}`);
    setExpenses(expenses.filter(e => e.id !== expId));
  };

  const totalSpent = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const remaining = budget ? Number(budget.totalBudget) - totalSpent : 0;
  const pieData = EXPENSE_CATS.map(cat => ({
    name: cat, value: expenses.filter(e => e.category === cat).reduce((s, e) => s + Number(e.amount), 0),
  })).filter(d => d.value > 0);

  if (loading) return <div className="skeleton h-96" />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link to={`/trips/${tripId}`} className="btn-icon"><ArrowLeft className="w-4 h-4" /></Link>
        <div>
          <h1 className="page-title">Budget & Expenses</h1>
          <p className="page-subtitle">Track your travel spending</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget setup */}
        <div className="card p-6 space-y-4">
          <h2 className="section-title">Budget Allocation</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="input-label">Total Budget *</label>
              <input type="number" className="input" placeholder="50000" value={budgetForm.totalBudget} onChange={e => setBudgetForm({ ...budgetForm, totalBudget: e.target.value })} />
            </div>
            <div>
              <label className="input-label">Currency</label>
              <select className="input" value={budgetForm.currency} onChange={e => setBudgetForm({ ...budgetForm, currency: e.target.value })}>
                <option value="INR">INR ₹</option>
                <option value="USD">USD $</option>
                <option value="EUR">EUR €</option>
                <option value="GBP">GBP £</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {BUDGET_FIELDS.map(f => (
              <div key={f}>
                <label className="input-label capitalize">{f}</label>
                <input type="number" className="input text-sm" placeholder="0"
                  value={budgetForm[f] || ''} onChange={e => setBudgetForm({ ...budgetForm, [f]: e.target.value })} />
              </div>
            ))}
          </div>
          <button onClick={saveBudget} disabled={savingBudget} className="btn-primary w-full justify-center">
            {savingBudget && <Loader2 className="w-4 h-4 animate-spin" />}
            {budget ? 'Update Budget' : 'Set Budget'}
          </button>

          {/* Overview */}
          {budget && (
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { label: 'Total', val: Number(budget.totalBudget), color: 'text-ink-900' },
                { label: 'Spent', val: totalSpent, color: 'text-red-500' },
                { label: 'Left', val: remaining, color: remaining >= 0 ? 'text-sage-400' : 'text-red-500' },
              ].map(({ label, val, color }) => (
                <div key={label} className="text-center card p-3">
                  <p className={`text-lg font-bold ${color}`}>{budget.currency} {val.toLocaleString()}</p>
                  <p className="text-xs text-ink-300">{label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Charts */}
        {pieData.length > 0 && (
          <div className="card p-6">
            <h2 className="section-title">Spending Breakdown</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(val) => [`${budget?.currency || ''} ${val.toLocaleString()}`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Add expense */}
      <div className="card p-6">
        <h2 className="section-title">Add Expense</h2>
        <form onSubmit={addExpense} className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <input type="text" placeholder="Expense title" className="input" required value={expForm.title} onChange={e => setExpForm({ ...expForm, title: e.target.value })} />
          <input type="number" placeholder="Amount" className="input" required value={expForm.amount} onChange={e => setExpForm({ ...expForm, amount: e.target.value })} />
          <select className="input" value={expForm.category} onChange={e => setExpForm({ ...expForm, category: e.target.value })}>
            {EXPENSE_CATS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="date" className="input" value={expForm.date} onChange={e => setExpForm({ ...expForm, date: e.target.value })} />
          <input type="text" placeholder="Notes (optional)" className="input" value={expForm.notes} onChange={e => setExpForm({ ...expForm, notes: e.target.value })} />
          <button type="submit" className="btn-primary justify-center" disabled={addingExp}>
            {addingExp ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
            Add
          </button>
        </form>
      </div>

      {/* Expense list */}
      {expenses.length > 0 && (
        <div className="card p-6">
          <h2 className="section-title">Expenses ({expenses.length})</h2>
          <div className="space-y-2">
            {expenses.map(exp => (
              <div key={exp.id} className="flex items-center justify-between px-4 py-3 bg-cream-100 rounded-xl hover:bg-white/8 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="badge badge-teal">{exp.category}</span>
                  <div>
                    <p className="text-sm font-medium text-ink-900">{exp.title}</p>
                    <p className="text-xs text-ink-300">{exp.date?.slice(0,10)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-coral-300">{budget?.currency || 'INR'} {Number(exp.amount).toLocaleString()}</span>
                  <button onClick={() => deleteExpense(exp.id)} className="btn-icon w-7 h-7 text-ink-100 hover:text-red-500">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
