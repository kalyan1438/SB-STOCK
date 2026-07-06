import { X } from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { tradeService } from '../services/tradeService';
import { Stock, TradeType } from '../types';

interface TradeModalProps {
  stock: Stock;
  type: TradeType;
  maxQuantity?: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function TradeModal({ stock, type, maxQuantity, onClose, onSuccess }: TradeModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const total = useMemo(() => quantity * stock.currentPrice, [quantity, stock.currentPrice]);
  const isBuy = type === 'BUY';

  const submit = async (event: FormEvent) => {
    event.preventDefault();

    if (quantity < 1) {
      toast.error('Quantity must be at least 1');
      return;
    }

    if (!isBuy && maxQuantity !== undefined && quantity > maxQuantity) {
      toast.error(`You can sell up to ${maxQuantity} shares`);
      return;
    }

    try {
      setSubmitting(true);
      if (isBuy) {
        await tradeService.buy({ stockId: stock._id, quantity });
      } else {
        await tradeService.sell({ stockId: stock._id, quantity });
      }

      toast.success(`${isBuy ? 'Bought' : 'Sold'} ${quantity} ${stock.symbol} shares`);
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Trade failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4">
      <form onSubmit={submit} className="panel w-full max-w-md p-5">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="label">{isBuy ? 'Buy order' : 'Sell order'}</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">{stock.symbol}</h2>
            <p className="text-sm text-slate-500">{stock.name}</p>
          </div>
          <button type="button" className="rounded-md p-2 text-slate-500 hover:bg-slate-100" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-1.5">
            <label className="label" htmlFor="quantity">
              Quantity
            </label>
            <input
              id="quantity"
              className="field"
              type="number"
              min={1}
              max={isBuy ? undefined : maxQuantity}
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
            />
            {!isBuy && maxQuantity !== undefined ? (
              <p className="text-xs text-slate-500">Available shares: {maxQuantity}</p>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-md bg-slate-50 p-3">
              <p className="text-xs font-semibold text-slate-500">Market price</p>
              <p className="mt-1 font-black text-slate-950">₹{stock.currentPrice.toLocaleString('en-IN')}</p>
            </div>
            <div className="rounded-md bg-slate-50 p-3">
              <p className="text-xs font-semibold text-slate-500">Order value</p>
              <p className="mt-1 font-black text-slate-950">₹{total.toLocaleString('en-IN')}</p>
            </div>
          </div>

          <button type="submit" disabled={submitting} className={isBuy ? 'btn-success w-full' : 'btn-primary w-full'}>
            {submitting ? 'Placing order...' : isBuy ? 'Buy shares' : 'Sell shares'}
          </button>
        </div>
      </form>
    </div>
  );
}

