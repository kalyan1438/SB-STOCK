import { BriefcaseBusiness, Coins, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import LoadingScreen from '../components/LoadingScreen';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import StockBadge from '../components/StockBadge';
import TradeModal from '../components/TradeModal';
import { useAuth } from '../context/AuthContext';
import { useAsync } from '../hooks/useAsync';
import { authService } from '../services/authService';
import { tradeService } from '../services/tradeService';
import { PortfolioItem } from '../types';
import { useState } from 'react';

const money = (value: number) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

export default function Portfolio() {
  const { updateUser } = useAuth();
  const { data, loading, refetch } = useAsync(() => tradeService.portfolio(), []);
  const [selling, setSelling] = useState<PortfolioItem | null>(null);

  const refreshUser = async () => {
    updateUser(await authService.me());
  };

  if (loading || !data) {
    return <LoadingScreen label="Loading portfolio..." />;
  }

  return (
    <>
      <PageHeader
        eyebrow="Portfolio"
        title="Your holdings"
        description="Monitor invested capital, current value, and simulated gains or losses."
        action={
          <Link to="/stocks" className="btn-primary">
            <TrendingUp className="h-4 w-4" />
            Add position
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Invested amount" value={money(data.summary.investedAmount)} icon={Coins} tone="amber" />
        <StatCard title="Current value" value={money(data.summary.currentValue)} icon={BriefcaseBusiness} tone="sky" />
        <StatCard
          title="Total P/L"
          value={money(data.summary.gainLoss)}
          icon={TrendingUp}
          tone={data.summary.gainLoss >= 0 ? 'emerald' : 'rose'}
          helper={`${data.summary.gainLossPercent.toFixed(2)}%`}
        />
      </div>

      <div className="mt-6">
        {data.holdings.length === 0 ? (
          <EmptyState icon={BriefcaseBusiness} title="No holdings yet" message="Buy a stock to start building your simulated portfolio." />
        ) : (
          <div className="panel overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-5 py-3 text-left font-bold text-slate-600">Stock</th>
                    <th className="px-5 py-3 text-right font-bold text-slate-600">Qty</th>
                    <th className="px-5 py-3 text-right font-bold text-slate-600">Avg price</th>
                    <th className="px-5 py-3 text-right font-bold text-slate-600">Current value</th>
                    <th className="px-5 py-3 text-right font-bold text-slate-600">P/L</th>
                    <th className="px-5 py-3 text-right font-bold text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {data.holdings.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <StockBadge stock={item.stock} />
                      </td>
                      <td className="px-5 py-4 text-right text-slate-600">{item.quantity}</td>
                      <td className="px-5 py-4 text-right text-slate-600">{money(item.averagePrice)}</td>
                      <td className="px-5 py-4 text-right font-bold text-slate-950">{money(item.currentValue)}</td>
                      <td className="px-5 py-4 text-right">
                        <span className={`rounded-md px-2 py-1 text-xs font-bold ${item.gainLoss >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                          {money(item.gainLoss)} ({item.gainLossPercent.toFixed(2)}%)
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button type="button" className="btn-secondary px-3" onClick={() => setSelling(item)}>
                          Sell
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {selling ? (
        <TradeModal
          stock={selling.stock}
          type="SELL"
          maxQuantity={selling.quantity}
          onClose={() => setSelling(null)}
          onSuccess={() => {
            refetch();
            refreshUser();
          }}
        />
      ) : null}
    </>
  );
}

