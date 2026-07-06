import { ArrowLeft, ArrowUpRight, ShoppingCart } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import LoadingScreen from '../components/LoadingScreen';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import TradeModal from '../components/TradeModal';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { stockService } from '../services/stockService';
import { Stock, TradeType } from '../types';

const money = (value: number) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

export default function StockDetails() {
  const { id } = useParams();
  const { updateUser } = useAuth();
  const [stock, setStock] = useState<Stock | null>(null);
  const [loading, setLoading] = useState(true);
  const [tradeType, setTradeType] = useState<TradeType | null>(null);

  const loadStock = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setStock(await stockService.get(id));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to load stock');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadStock();
  }, [loadStock]);

  const chartData = useMemo(
    () =>
      stock?.history.map((point) => ({
        date: new Date(point.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        price: point.price,
      })) || [],
    [stock],
  );

  const refreshUser = async () => {
    updateUser(await authService.me());
  };

  if (loading) {
    return <LoadingScreen label="Loading stock details..." />;
  }

  if (!stock) {
    return (
      <div className="panel p-8 text-center">
        <p className="text-sm text-slate-500">Stock not found.</p>
        <Link to="/stocks" className="btn-primary mt-4">
          <ArrowLeft className="h-4 w-4" />
          Back to stocks
        </Link>
      </div>
    );
  }

  const positive = stock.changePercent >= 0;

  return (
    <>
      <PageHeader
        eyebrow={`${stock.exchange} • ${stock.sector}`}
        title={`${stock.symbol} - ${stock.name}`}
        description={stock.description}
        action={
          <>
            <button type="button" className="btn-success" onClick={() => setTradeType('BUY')}>
              <ShoppingCart className="h-4 w-4" />
              Buy
            </button>
            <button type="button" className="btn-secondary" onClick={() => setTradeType('SELL')}>
              Sell
            </button>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Current price" value={money(stock.currentPrice)} icon={ArrowUpRight} tone="sky" />
        <StatCard title="Day high" value={money(stock.dayHigh)} icon={ArrowUpRight} tone="emerald" />
        <StatCard title="Day low" value={money(stock.dayLow)} icon={ArrowLeft} tone="rose" />
        <StatCard
          title="Change"
          value={`${positive ? '+' : ''}${stock.changePercent.toFixed(2)}%`}
          icon={ArrowUpRight}
          tone={positive ? 'emerald' : 'rose'}
          helper={`${positive ? '+' : ''}${money(stock.change)}`}
        />
      </div>

      <section className="panel mt-6 p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="label">Historical data</p>
            <h2 className="mt-1 text-lg font-black text-slate-950">75-day dummy price chart</h2>
          </div>
          <span className="rounded-md bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
            Volume {stock.volume.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={12} minTickGap={28} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} domain={['dataMin - 50', 'dataMax + 50']} />
              <Tooltip formatter={(value: number) => [money(value), 'Price']} />
              <Area type="monotone" dataKey="price" stroke="#0284c7" strokeWidth={3} fill="url(#priceGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {tradeType ? (
        <TradeModal
          stock={stock}
          type={tradeType}
          onClose={() => setTradeType(null)}
          onSuccess={() => {
            loadStock();
            refreshUser();
          }}
        />
      ) : null}
    </>
  );
}

