import { Save, X } from 'lucide-react';
import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { Stock, StockFormPayload } from '../types';

interface StockFormModalProps {
  stock?: Stock | null;
  onClose: () => void;
  onSubmit: (payload: StockFormPayload) => Promise<void>;
}

const emptyForm: StockFormPayload = {
  symbol: '',
  name: '',
  exchange: 'NSE',
  sector: '',
  description: '',
  currentPrice: 0,
  change: 0,
  changePercent: 0,
  marketCap: 0,
  volume: 0,
  dayHigh: 0,
  dayLow: 0,
  logoUrl: '',
};

export default function StockFormModal({ stock, onClose, onSubmit }: StockFormModalProps) {
  const [form, setForm] = useState<StockFormPayload>(() =>
    stock
      ? {
          symbol: stock.symbol,
          name: stock.name,
          exchange: stock.exchange,
          sector: stock.sector,
          description: stock.description || '',
          currentPrice: stock.currentPrice,
          change: stock.change,
          changePercent: stock.changePercent,
          marketCap: stock.marketCap,
          volume: stock.volume,
          dayHigh: stock.dayHigh,
          dayLow: stock.dayLow,
          logoUrl: stock.logoUrl || '',
        }
      : emptyForm,
  );
  const [saving, setSaving] = useState(false);

  const update = (field: keyof StockFormPayload, value: string) => {
    const numericFields: (keyof StockFormPayload)[] = [
      'currentPrice',
      'change',
      'changePercent',
      'marketCap',
      'volume',
      'dayHigh',
      'dayLow',
    ];

    setForm((current) => ({
      ...current,
      [field]: numericFields.includes(field) ? Number(value) : value,
    }));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();

    if (!form.symbol.trim() || !form.name.trim() || !form.sector.trim()) {
      toast.error('Symbol, company name, and sector are required');
      return;
    }

    if (form.currentPrice <= 0) {
      toast.error('Current price must be greater than zero');
      return;
    }

    try {
      setSaving(true);
      await onSubmit({
        ...form,
        symbol: form.symbol.trim().toUpperCase(),
        name: form.name.trim(),
        sector: form.sector.trim(),
        exchange: form.exchange.trim().toUpperCase(),
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/50 p-4">
      <form onSubmit={submit} className="panel my-8 w-full max-w-3xl p-5">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="label">{stock ? 'Edit stock' : 'Add stock'}</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">{stock ? stock.symbol : 'New listing'}</h2>
          </div>
          <button type="button" className="rounded-md p-2 text-slate-500 hover:bg-slate-100" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-1.5">
            <label className="label" htmlFor="symbol">
              Symbol
            </label>
            <input id="symbol" className="field" value={form.symbol} onChange={(e) => update('symbol', e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <label className="label" htmlFor="name">
              Company name
            </label>
            <input id="name" className="field" value={form.name} onChange={(e) => update('name', e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <label className="label" htmlFor="exchange">
              Exchange
            </label>
            <input id="exchange" className="field" value={form.exchange} onChange={(e) => update('exchange', e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <label className="label" htmlFor="sector">
              Sector
            </label>
            <input id="sector" className="field" value={form.sector} onChange={(e) => update('sector', e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <label className="label" htmlFor="price">
              Current price
            </label>
            <input id="price" type="number" min="0" step="0.01" className="field" value={form.currentPrice} onChange={(e) => update('currentPrice', e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <label className="label" htmlFor="change">
              Change
            </label>
            <input id="change" type="number" step="0.01" className="field" value={form.change} onChange={(e) => update('change', e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <label className="label" htmlFor="changePercent">
              Change percent
            </label>
            <input id="changePercent" type="number" step="0.01" className="field" value={form.changePercent} onChange={(e) => update('changePercent', e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <label className="label" htmlFor="volume">
              Volume
            </label>
            <input id="volume" type="number" min="0" className="field" value={form.volume} onChange={(e) => update('volume', e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <label className="label" htmlFor="marketCap">
              Market cap
            </label>
            <input id="marketCap" type="number" min="0" className="field" value={form.marketCap} onChange={(e) => update('marketCap', e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <label className="label" htmlFor="dayHigh">
              Day high
            </label>
            <input id="dayHigh" type="number" min="0" step="0.01" className="field" value={form.dayHigh} onChange={(e) => update('dayHigh', e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <label className="label" htmlFor="dayLow">
              Day low
            </label>
            <input id="dayLow" type="number" min="0" step="0.01" className="field" value={form.dayLow} onChange={(e) => update('dayLow', e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <label className="label" htmlFor="logoUrl">
              Logo URL
            </label>
            <input id="logoUrl" className="field" value={form.logoUrl} onChange={(e) => update('logoUrl', e.target.value)} />
          </div>
          <div className="grid gap-1.5 md:col-span-2">
            <label className="label" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              className="field min-h-24 resize-y"
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
            />
          </div>
        </div>

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={saving}>
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save stock'}
          </button>
        </div>
      </form>
    </div>
  );
}

