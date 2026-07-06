import { CandlestickChart, ShieldCheck, WalletCards } from 'lucide-react';
import { ReactNode } from 'react';

export default function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="grid min-h-screen bg-slate-50 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="hidden bg-slate-950 px-10 py-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-md bg-white text-sm font-black text-slate-950">
            SB
          </span>
          <div>
            <p className="text-xl font-black">SB Stocks</p>
            <p className="text-sm text-slate-300">MERN stock trading simulator</p>
          </div>
        </div>

        <div className="max-w-xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-sky-300">Practice before you place</p>
          <h1 className="text-5xl font-black leading-tight">Trade Indian market names with virtual capital.</h1>
          <p className="mt-5 text-base leading-7 text-slate-300">
            Build a portfolio, study price history, track every order, and let admins manage the stock universe from one clean console.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: WalletCards, label: 'Virtual money' },
            { icon: CandlestickChart, label: 'Live-style charts' },
            { icon: ShieldCheck, label: 'JWT secured' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="rounded-md border border-white/10 bg-white/5 p-4">
              <Icon className="mb-3 h-5 w-5 text-sky-300" />
              <p className="text-sm font-semibold">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <div className="mb-3 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-md bg-slate-950 text-sm font-black text-white">
                SB
              </span>
              <span className="text-xl font-black text-slate-950">SB Stocks</span>
            </div>
          </div>
          <div className="panel p-6 sm:p-8">
            <p className="label mb-2">Secure access</p>
            <h2 className="text-2xl font-black text-slate-950">{title}</h2>
            <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
            <div className="mt-6">{children}</div>
          </div>
        </div>
      </section>
    </div>
  );
}

