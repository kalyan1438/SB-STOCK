import { ClipboardList } from 'lucide-react';
import EmptyState from '../components/EmptyState';
import LoadingScreen from '../components/LoadingScreen';
import PageHeader from '../components/PageHeader';
import { useAsync } from '../hooks/useAsync';
import { userService } from '../services/userService';

const money = (value: number) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

export default function AdminTransactions() {
  const { data, loading } = useAsync(() => userService.allTransactions(), []);

  if (loading || !data) {
    return <LoadingScreen label="Loading transactions..." />;
  }

  return (
    <>
      <PageHeader eyebrow="Admin" title="All transactions" description="Audit every buy and sell order placed in the simulator." />

      {data.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No transactions yet" message="Platform trades will appear here after users place orders." />
      ) : (
        <div className="panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-3 text-left font-bold text-slate-600">Date</th>
                  <th className="px-5 py-3 text-left font-bold text-slate-600">User</th>
                  <th className="px-5 py-3 text-left font-bold text-slate-600">Stock</th>
                  <th className="px-5 py-3 text-left font-bold text-slate-600">Type</th>
                  <th className="px-5 py-3 text-right font-bold text-slate-600">Qty</th>
                  <th className="px-5 py-3 text-right font-bold text-slate-600">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {data.map((transaction) => (
                  <tr key={transaction._id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 text-slate-600">{new Date(transaction.createdAt).toLocaleString('en-IN')}</td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-950">{transaction.user?.name || 'Trader'}</p>
                      <p className="text-xs text-slate-500">{transaction.user?.email}</p>
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-950">{transaction.stock.symbol}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-md px-2 py-1 text-xs font-bold ${transaction.type === 'BUY' ? 'bg-emerald-50 text-emerald-700' : 'bg-sky-50 text-sky-700'}`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right text-slate-600">{transaction.quantity}</td>
                    <td className="px-5 py-4 text-right font-bold text-slate-950">{money(transaction.total)}</td>
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

