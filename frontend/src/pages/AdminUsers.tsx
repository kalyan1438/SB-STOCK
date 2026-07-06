import { Users } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import LoadingScreen from '../components/LoadingScreen';
import PageHeader from '../components/PageHeader';
import { useAsync } from '../hooks/useAsync';
import { userService } from '../services/userService';

const money = (value: number) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

export default function AdminUsers() {
  const { data, loading } = useAsync(() => userService.allUsers(), []);

  if (loading || !data) {
    return <LoadingScreen label="Loading users..." />;
  }

  return (
    <>
      <PageHeader eyebrow="Admin" title="All users" description="Review registered trader accounts and their current virtual balances." />

      {data.length === 0 ? (
        <EmptyState icon={Users} title="No users yet" message="Registered traders will appear here." />
      ) : (
        <div className="panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-3 text-left font-bold text-slate-600">Name</th>
                  <th className="px-5 py-3 text-left font-bold text-slate-600">Email</th>
                  <th className="px-5 py-3 text-left font-bold text-slate-600">Joined</th>
                  <th className="px-5 py-3 text-right font-bold text-slate-600">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {data.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-bold text-slate-950">{user.name}</td>
                    <td className="px-5 py-4 text-slate-600">{user.email}</td>
                    <td className="px-5 py-4 text-slate-600">{user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN') : '-'}</td>
                    <td className="px-5 py-4 text-right font-bold text-slate-950">{money(user.virtualBalance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

