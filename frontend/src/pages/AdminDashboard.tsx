import { BarChart3, ClipboardList, IndianRupee, TrendingUp, Users } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import LoadingScreen from '../components/LoadingScreen';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import { useAsync } from '../hooks/useAsync';
import { userService } from '../services/userService';

const money = (value: number) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

export default function AdminDashboard() {
  const { data, loading } = useAsync(() => userService.adminDashboard(), []);

  if (loading || !data) {
    return <LoadingScreen label="Loading admin dashboard..." />;
  }

  const chartData = [
    { name: 'Users', value: data.usersCount },
    { name: 'Stocks', value: data.stocksCount },
    { name: 'Orders', value: data.ordersCount },
    { name: 'Transactions', value: data.transactionsCount },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Admin dashboard"
        title="SB Stocks control room"
        description="Monitor simulator adoption, trade volume, and recent activity."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Users" value={data.usersCount.toLocaleString('en-IN')} icon={Users} tone="sky" />
        <StatCard title="Stocks" value={data.stocksCount.toLocaleString('en-IN')} icon={BarChart3} tone="emerald" />
        <StatCard title="Orders" value={data.ordersCount.toLocaleString('en-IN')} icon={ClipboardList} tone="amber" />
        <StatCard title="Trade volume" value={money(data.tradeVolume)} icon={IndianRupee} tone="slate" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
        <section className="panel p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="label">Platform totals</p>
              <h2 className="mt-1 text-lg font-black text-slate-950">Simulator activity</h2>
            </div>
            <TrendingUp className="h-5 w-5 text-slate-400" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" fill="#0f172a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="panel overflow-hidden">
          <div className="border-b border-slate-200 p-5">
            <p className="label">Recent orders</p>
            <h2 className="mt-1 text-lg font-black text-slate-950">Latest transactions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-3 text-left font-bold text-slate-600">User</th>
                  <th className="px-5 py-3 text-left font-bold text-slate-600">Stock</th>
                  <th className="px-5 py-3 text-left font-bold text-slate-600">Type</th>
                  <th className="px-5 py-3 text-right font-bold text-slate-600">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {data.recentTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-slate-500">
                      No platform trades yet.
                    </td>
                  </tr>
                ) : (
                  data.recentTransactions.map((transaction) => (
                    <tr key={transaction._id}>
                      <td className="px-5 py-4 text-slate-600">{transaction.user?.name || 'Trader'}</td>
                      <td className="px-5 py-4 font-bold text-slate-950">{transaction.stock.symbol}</td>
                      <td className="px-5 py-4">
                        <span className={`rounded-md px-2 py-1 text-xs font-bold ${transaction.type === 'BUY' ? 'bg-emerald-50 text-emerald-700' : 'bg-sky-50 text-sky-700'}`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right font-bold text-slate-950">{money(transaction.total)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}

