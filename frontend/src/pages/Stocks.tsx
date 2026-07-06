import { Search } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import EmptyState from '../components/EmptyState';
import LoadingScreen from '../components/LoadingScreen';
import PageHeader from '../components/PageHeader';
import StockTable from '../components/StockTable';
import TradeModal from '../components/TradeModal';
import { useAuth } from '../context/AuthContext';
import { useDebounce } from '../hooks/useDebounce';
import { authService } from '../services/authService';
import { stockService } from '../services/stockService';
import { Stock, TradeType } from '../types';

export default function Stocks() {
  const { updateUser } = useAuth();
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [sector, setSector] = useState('All');
  const [sort, setSort] = useState('symbol');
  const [trade, setTrade] = useState<{ stock: Stock; type: TradeType } | null>(null);
  const debouncedQuery = useDebounce(query);

  const sectors = useMemo(() => ['All', ...Array.from(new Set(stocks.map((stock) => stock.sector))).sort()], [stocks]);

  const loadStocks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await stockService.list({ q: debouncedQuery, sector, sort });
      setStocks(response);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to load stocks');
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, sector, sort]);

  useEffect(() => {
    loadStocks();
  }, [loadStocks]);

  const refreshUser = async () => {
    const freshUser = await authService.me();
    updateUser(freshUser);
  };

  return (
    <>
      <PageHeader
        eyebrow="Market"
        title="Stock list"
        description="Search, sort, and place instant simulated market orders."
      />

      <div className="panel mb-5 grid gap-3 p-4 md:grid-cols-[1fr_180px_180px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="field pl-9"
            placeholder="Search by symbol, company, or sector"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <select className="field" value={sector} onChange={(event) => setSector(event.target.value)}>
          {sectors.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <select className="field" value={sort} onChange={(event) => setSort(event.target.value)}>
          <option value="symbol">Symbol</option>
          <option value="name">Company name</option>
          <option value="price-asc">Price low to high</option>
          <option value="price-desc">Price high to low</option>
          <option value="change-desc">Best performers</option>
          <option value="change-asc">Weakest performers</option>
        </select>
      </div>

      {loading ? (
        <LoadingScreen label="Loading stocks..." />
      ) : stocks.length === 0 ? (
        <EmptyState icon={Search} title="No stocks found" message="Try a different search term or sector filter." />
      ) : (
        <StockTable stocks={stocks} onBuy={(stock) => setTrade({ stock, type: 'BUY' })} onSell={(stock) => setTrade({ stock, type: 'SELL' })} />
      )}

      {trade ? (
        <TradeModal
          stock={trade.stock}
          type={trade.type}
          onClose={() => setTrade(null)}
          onSuccess={() => {
            loadStocks();
            refreshUser();
          }}
        />
      ) : null}
    </>
  );
}

