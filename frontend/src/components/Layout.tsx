import {
  BarChart3,
  BriefcaseBusiness,
  ClipboardList,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Shield,
  User,
  Users,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const userLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/stocks', label: 'Stocks', icon: Search },
  { to: '/portfolio', label: 'Portfolio', icon: BriefcaseBusiness },
  { to: '/transactions', label: 'Transactions', icon: History },
  { to: '/profile', label: 'Profile', icon: User },
];

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/stocks', label: 'Manage Stocks', icon: BarChart3 },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/transactions', label: 'Transactions', icon: ClipboardList },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const links = user?.role === 'admin' ? adminLinks : userLinks;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const sidebar = (
    <aside className="flex h-full w-72 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-16 items-center justify-between border-b border-slate-200 px-5">
        <NavLink to={user?.role === 'admin' ? '/admin' : '/dashboard'} className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-slate-950 text-sm font-black text-white">
            SB
          </span>
          <span>
            <span className="block text-base font-black text-slate-950">SB Stocks</span>
            <span className="block text-xs font-medium text-slate-500">Trading Simulator</span>
          </span>
        </NavLink>
        <button
          type="button"
          className="rounded-md p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          onClick={() => setOpen(false)}
          aria-label="Close navigation"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard' || to === '/admin'}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition ${
                isActive
                  ? 'bg-slate-950 text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-200 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-md bg-slate-50 p-3">
          <div className="grid h-9 w-9 place-items-center rounded-md bg-white text-sm font-bold text-slate-700">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-900">{user?.name}</p>
            <p className="flex items-center gap-1 truncate text-xs text-slate-500">
              {user?.role === 'admin' ? <Shield className="h-3 w-3" /> : null}
              {user?.email}
            </p>
          </div>
        </div>
        <button type="button" onClick={handleLogout} className="btn-secondary w-full">
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex">{sidebar}</div>

      {open ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-950/40" onClick={() => setOpen(false)} />
          <div className="relative h-full">{sidebar}</div>
        </div>
      ) : null}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <button
            type="button"
            className="rounded-md p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden lg:block">
            <p className="text-sm font-semibold text-slate-900">
              {user?.role === 'admin' ? 'Admin Console' : 'Trader Workspace'}
            </p>
            <p className="text-xs text-slate-500">Virtual money. Real portfolio discipline.</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            {user?.role === 'user' ? (
              <div className="rounded-md bg-emerald-50 px-3 py-1.5 text-sm font-bold text-emerald-700">
                Balance ₹{Number(user?.virtualBalance || 0).toLocaleString('en-IN')}
              </div>
            ) : (
              <div className="rounded-md bg-sky-50 px-3 py-1.5 text-sm font-bold text-sky-700">
                Admin
              </div>
            )}
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

