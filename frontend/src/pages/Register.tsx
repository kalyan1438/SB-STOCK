import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import AuthShell from '../components/AuthShell';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      setSubmitting(true);
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell title="Create trader account" subtitle="Every new account starts with ₹100,000 in virtual buying power.">
      <form onSubmit={submit} className="grid gap-4">
        <div className="grid gap-1.5">
          <label className="label" htmlFor="name">
            Full name
          </label>
          <input id="name" className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="grid gap-1.5">
          <label className="label" htmlFor="email">
            Email
          </label>
          <input id="email" type="email" className="field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="grid gap-1.5">
          <label className="label" htmlFor="password">
            Password
          </label>
          <input id="password" type="password" className="field" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <button type="submit" className="btn-primary w-full" disabled={submitting}>
          {submitting ? 'Creating account...' : 'Register'}
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-500">
        Already registered?{' '}
        <Link to="/login" className="font-semibold text-sky-700 hover:text-sky-900">
          Login
        </Link>
      </p>
    </AuthShell>
  );
}

