import { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthShell from '../components/AuthShell';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('demo@sbstocks.com');
  const [password, setPassword] = useState('Demo@123');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    }
  }, [navigate, user]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      setSubmitting(true);
      const loggedUser = await login(email, password);
      const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
      navigate(from || (loggedUser.role === 'admin' ? '/admin' : '/dashboard'), { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell title="Trader login" subtitle="Use the demo account or sign in with your own trader profile.">
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
          {submitting ? 'Signing in...' : 'Login'}
        </button>
      </form>
      <div className="mt-5 flex items-center justify-between text-sm">
        <Link to="/register" className="font-semibold text-sky-700 hover:text-sky-900">
          Create account
        </Link>
        <Link to="/admin/login" className="font-semibold text-slate-600 hover:text-slate-950">
          Admin login
        </Link>
      </div>
    </AuthShell>
  );
}

