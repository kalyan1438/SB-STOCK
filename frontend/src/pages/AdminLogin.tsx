import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import AuthShell from '../components/AuthShell';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@sbstocks.com');
  const [password, setPassword] = useState('Admin@123');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      setSubmitting(true);
      await adminLogin(email, password);
      navigate('/admin');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Admin login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell title="Admin login" subtitle="Manage users, transactions, and the available stock catalog.">
      <form onSubmit={submit} className="grid gap-4">
        <div className="grid gap-1.5">
          <label className="label" htmlFor="email">
            Email
          </label>
          <input id="email" type="email" className="field" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="grid gap-1.5">
          <label className="label" htmlFor="password">
            Password
          </label>
          <input id="password" type="password" className="field" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="btn-primary w-full" disabled={submitting}>
          {submitting ? 'Signing in...' : 'Open admin console'}
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-500">
        Trader account?{' '}
        <Link to="/login" className="font-semibold text-sky-700 hover:text-sky-900">
          Login here
        </Link>
      </p>
    </AuthShell>
  );
}

