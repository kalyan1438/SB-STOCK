import { ArrowDownRight, ArrowUpRight, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Stock } from '../types';
import StockBadge from './StockBadge';

export default function StockTable({
  stocks,
  onBuy,
  onSell,
}: {
  stocks: Stock[];
  onBuy?: (stock: Stock) => void;
  onSell?: (stock: Stock) => void;
}) {
  return (
    <div className="panel overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-5 py-3 text-left font-bold text-slate-600">Stock</th>
              <th className="px-5 py-3 text-left font-bold text-slate-600">Sector</th>
              <th className="px-5 py-3 text-right font-bold text-slate-600">Price</th>
              <th className="px-5 py-3 text-right font-bold text-slate-600">Change</th>
              <th className="px-5 py-3 text-right font-bold text-slate-600">Volume</th>
              <th className="px-5 py-3 text-right font-bold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {stocks.map((stock) => {
              const isPositive = stock.changePercent >= 0;
              return (
                <tr key={stock._id} className="hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <StockBadge stock={stock} />
                  </td>
                  <td className="px-5 py-4 text-slate-600">{stock.sector}</td>
                  <td className="px-5 py-4 text-right font-bold text-slate-950">
                    ₹{stock.currentPrice.toLocaleString('en-IN')}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-bold ${
                        isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {isPositive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                      {stock.changePercent.toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right text-slate-600">
                    {stock.volume.toLocaleString('en-IN')}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Link to={`/stocks/${stock._id}`} className="btn-secondary px-3" title="View stock">
                        <Eye className="h-4 w-4" />
                      </Link>
                      {onBuy ? (
                        <button type="button" className="btn-success px-3" onClick={() => onBuy(stock)}>
                          Buy
                        </button>
                      ) : null}
                      {onSell ? (
                        <button type="button" className="btn-secondary px-3" onClick={() => onSell(stock)}>
                          Sell
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

