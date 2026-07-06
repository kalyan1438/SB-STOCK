import { ArrowDownRight, ArrowUpRight, BriefcaseBusiness, IndianRupee, Landmark, LineChart, WalletCards } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import LoadingScreen from '../components/LoadingScreen';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import StockBadge from '../components/StockBadge';
import { useAsync } from '../hooks/useAsync';
import { userService } from '../services/userService';

const money = (value: number) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

export default function Dashboard() {
  const { data, loading } = useAsync(() => userService.dashboard(), []);

  if (loading || !data) {
    return <LoadingScreen label="Loading dashboard..." />;
  }

  const watchlistChart = data.watchlist.map((stock) => ({
    symbol: stock.symbol,
    change: stock.changePercent,
  }));
  const isProfit = data.gainLoss >= 0;

  return (
    <>
      <PageHeader
        eyebrow="Trader dashboard"
        title="Portfolio command center"
        description="Track buying power, holdings, recent trades, and top movers in one place."
        action={
          <Link to="/stocks" className="btn-primary">
            <LineChart className="h-4 w-4" />
            Explore stocks
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Virtual balance" value={money(data.balance)} icon={WalletCards} tone="emerald" />
        <StatCard title="Portfolio value" value={money(data.portfolioValue)} icon={BriefcaseBusiness} tone="sky" />
        <StatCard title="Total equity" value={money(data.totalEquity)} icon={IndianRupee} tone="amber" />
        <StatCard
          title="Unrealized P/L"
          value={money(data.gainLoss)}
          icon={isProfit ? ArrowUpRight : ArrowDownRight}
          tone={isProfit ? 'emerald' : 'rose'}
          helper={`${data.holdingsCount} active holdings`}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="panel p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="label">Market movers</p>
              <h2 className="mt-1 text-lg font-black text-slate-950">Top watchlist changes</h2>
            </div>
            <Landmark className="h-5 w-5 text-slate-400" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={watchlistChart}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="symbol" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip formatter={(value: number) => [`${value.toFixed(2)}%`, 'Change']} />
                <Bar dataKey="change" fill="#0284c7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="panel overflow-hidden">
          <div className="border-b border-slate-200 p-5">
            <p className="label">Watchlist</p>
            <h2 className="mt-1 text-lg font-black text-slate-950">Best current movers</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {data.watchlist.map((stock) => {
              const positive = stock.changePercent >= 0;
              return (
                <Link key={stock._id} to={`/stocks/${stock._id}`} className="flex items-center justify-between gap-4 p-4 hover:bg-slate-50">
                  <StockBadge stock={stock} />
                  <span className={`rounded-md px-2 py-1 text-xs font-bold ${positive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                    {positive ? '+' : ''}
                    {stock.changePercent.toFixed(2)}%
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      </div>

      <section className="panel mt-6 overflow-hidden">
        <div className="border-b border-slate-200 p-5">
          <p className="label">Recent activity</p>
          <h2 className="mt-1 text-lg font-black text-slate-950">Latest transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-3 text-left font-bold text-slate-600">Stock</th>
                <th className="px-5 py-3 text-left font-bold text-slate-600">Type</th>
                <th className="px-5 py-3 text-right font-bold text-slate-600">Qty</th>
                <th className="px-5 py-3 text-right font-bold text-slate-600">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {data.recentTransactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-slate-500">
                    No trades yet.
                  </td>
                </tr>
              ) : (
                data.recentTransactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td className="px-5 py-4 font-bold text-slate-950">{transaction.stock.symbol}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-md px-2 py-1 text-xs font-bold ${transaction.type === 'BUY' ? 'bg-emerald-50 text-emerald-700' : 'bg-sky-50 text-sky-700'}`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right text-slate-600">{transaction.quantity}</td>
                    <td className="px-5 py-4 text-right font-bold text-slate-950">{money(transaction.total)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

