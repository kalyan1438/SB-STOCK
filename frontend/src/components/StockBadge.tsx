import { Stock } from '../types';

export default function StockBadge({ stock }: { stock: Pick<Stock, 'symbol' | 'name' | 'logoUrl'> }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      {stock.logoUrl ? (
        <img
          src={stock.logoUrl}
          alt={`${stock.symbol} logo`}
          className="h-10 w-10 rounded-md border border-slate-200 object-cover"
        />
      ) : (
        <div className="grid h-10 w-10 place-items-center rounded-md bg-slate-100 text-xs font-black text-slate-700">
          {stock.symbol.slice(0, 2)}
        </div>
      )}
      <div className="min-w-0">
        <p className="truncate font-bold text-slate-950">{stock.symbol}</p>
        <p className="truncate text-xs text-slate-500">{stock.name}</p>
      </div>
    </div>
  );
}

