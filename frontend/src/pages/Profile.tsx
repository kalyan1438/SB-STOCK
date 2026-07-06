import { Save, UserRound, WalletCards } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';

const money = (value: number) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(user?.name || '');
  }, [user]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      setSaving(true);
      const response = await userService.updateProfile({ name, password: password || undefined });
      updateUser(response.user);
      setPassword('');
      toast.success(response.message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Profile update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader eyebrow="Account" title="Profile" description="Update your display name or reset your password." />

      <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
        <div className="grid gap-4">
          <StatCard title="Account type" value={user?.role === 'admin' ? 'Admin' : 'Trader'} icon={UserRound} tone="sky" />
          <StatCard title="Virtual balance" value={money(user?.virtualBalance || 0)} icon={WalletCards} tone="emerald" />
        </div>

        <form onSubmit={submit} className="panel p-5">
          <div className="grid gap-4">
            <div className="grid gap-1.5">
              <label className="label" htmlFor="name">
                Name
              </label>
              <input id="name" className="field" value={name} onChange={(event) => setName(event.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <label className="label" htmlFor="email">
                Email
              </label>
              <input id="email" className="field bg-slate-50" value={user?.email || ''} disabled />
            </div>
            <div className="grid gap-1.5">
              <label className="label" htmlFor="password">
                New password
              </label>
              <input
                id="password"
                type="password"
                className="field"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Leave empty to keep current password"
              />
            </div>
            <button type="submit" className="btn-primary justify-self-start" disabled={saving}>
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
