import { History } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import LoadingScreen from '../components/LoadingScreen';
import PageHeader from '../components/PageHeader';
import { useAsync } from '../hooks/useAsync';
import { tradeService } from '../services/tradeService';

const money = (value: number) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

export default function Transactions() {
  const { data, loading } = useAsync(() => tradeService.transactions(), []);

  if (loading || !data) {
    return <LoadingScreen label="Loading transactions..." />;
  }

  return (
    <>
      <PageHeader eyebrow="Ledger" title="Transaction history" description="Every completed buy and sell order is logged here." />

      {data.length === 0 ? (
        <EmptyState icon={History} title="No transactions yet" message="Place a buy or sell order to populate your ledger." />
      ) : (
        <div className="panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-3 text-left font-bold text-slate-600">Date</th>
                  <th className="px-5 py-3 text-left font-bold text-slate-600">Stock</th>
                  <th className="px-5 py-3 text-left font-bold text-slate-600">Type</th>
                  <th className="px-5 py-3 text-right font-bold text-slate-600">Qty</th>
                  <th className="px-5 py-3 text-right font-bold text-slate-600">Price</th>
                  <th className="px-5 py-3 text-right font-bold text-slate-600">Total</th>
                  <th className="px-5 py-3 text-right font-bold text-slate-600">Balance after</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {data.map((transaction) => (
                  <tr key={transaction._id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 text-slate-600">{new Date(transaction.createdAt).toLocaleString('en-IN')}</td>
                    <td className="px-5 py-4 font-bold text-slate-950">{transaction.stock.symbol}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-md px-2 py-1 text-xs font-bold ${transaction.type === 'BUY' ? 'bg-emerald-50 text-emerald-700' : 'bg-sky-50 text-sky-700'}`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right text-slate-600">{transaction.quantity}</td>
                    <td className="px-5 py-4 text-right text-slate-600">{money(transaction.price)}</td>
                    <td className="px-5 py-4 text-right font-bold text-slate-950">{money(transaction.total)}</td>
                    <td className="px-5 py-4 text-right text-slate-600">{money(transaction.balanceAfter)}</td>
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

