import { Edit, Plus, Search, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import EmptyState from '../components/EmptyState';
import LoadingScreen from '../components/LoadingScreen';
import PageHeader from '../components/PageHeader';
import StockBadge from '../components/StockBadge';
import StockFormModal from '../components/StockFormModal';
import { useDebounce } from '../hooks/useDebounce';
import { stockService } from '../services/stockService';
import { Stock, StockFormPayload } from '../types';

const money = (value: number) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

export default function AdminStocks() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [editingStock, setEditingStock] = useState<Stock | null>(null);
  const [showForm, setShowForm] = useState(false);
  const debouncedQuery = useDebounce(query);

  const loadStocks = useCallback(async () => {
    try {
      setLoading(true);
      setStocks(await stockService.list({ q: debouncedQuery, sort: 'symbol' }));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to load stocks');
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    loadStocks();
  }, [loadStocks]);

  const sectors = useMemo(() => Array.from(new Set(stocks.map((stock) => stock.sector))).sort(), [stocks]);

  const openCreate = () => {
    setEditingStock(null);
    setShowForm(true);
  };

  const openEdit = (stock: Stock) => {
    setEditingStock(stock);
    setShowForm(true);
  };

  const saveStock = async (payload: StockFormPayload) => {
    try {
      if (editingStock) {
        const response = await stockService.update(editingStock._id, payload);
        toast.success(response.message);
      } else {
        const response = await stockService.create(payload);
        toast.success(response.message);
      }

      await loadStocks();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to save stock');
      throw error;
    }
  };

  const deleteStock = async (stock: Stock) => {
    const confirmed = window.confirm(`Delete ${stock.symbol}? This is blocked if users currently hold the stock.`);
    if (!confirmed) return;

    try {
      const response = await stockService.remove(stock._id);
      toast.success(response.message);
      await loadStocks();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to delete stock');
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Manage stocks"
        description="Create, update, or delete stock listings. New listings receive generated historical chart data on the API."
        action={
          <button type="button" className="btn-primary" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Add stock
          </button>
        }
      />

      <div className="panel mb-5 grid gap-3 p-4 md:grid-cols-[1fr_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="field pl-9"
            placeholder="Search stocks"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {sectors.slice(0, 5).map((sector) => (
            <span key={sector} className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
              {sector}
            </span>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingScreen label="Loading stock catalog..." />
      ) : stocks.length === 0 ? (
        <EmptyState icon={Search} title="No stocks found" message="Add a new stock or clear the search field." />
      ) : (
        <div className="panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-3 text-left font-bold text-slate-600">Stock</th>
                  <th className="px-5 py-3 text-left font-bold text-slate-600">Sector</th>
                  <th className="px-5 py-3 text-right font-bold text-slate-600">Price</th>
                  <th className="px-5 py-3 text-right font-bold text-slate-600">Change</th>
                  <th className="px-5 py-3 text-right font-bold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {stocks.map((stock) => (
                  <tr key={stock._id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <StockBadge stock={stock} />
                    </td>
                    <td className="px-5 py-4 text-slate-600">{stock.sector}</td>
                    <td className="px-5 py-4 text-right font-bold text-slate-950">{money(stock.currentPrice)}</td>
                    <td className="px-5 py-4 text-right">
                      <span className={`rounded-md px-2 py-1 text-xs font-bold ${stock.changePercent >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                        {stock.changePercent.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button type="button" className="btn-secondary px-3" onClick={() => openEdit(stock)} title="Edit stock">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button type="button" className="btn-danger px-3" onClick={() => deleteStock(stock)} title="Delete stock">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showForm ? (
        <StockFormModal
          stock={editingStock}
          onClose={() => {
            setShowForm(false);
            setEditingStock(null);
          }}
          onSubmit={saveStock}
        />
      ) : null}
    </>
  );
}
