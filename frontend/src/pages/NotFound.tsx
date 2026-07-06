import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 px-4">
      <div className="panel max-w-md p-8 text-center">
        <p className="label mb-2">404</p>
        <h1 className="text-3xl font-black text-slate-950">Page not found</h1>
        <p className="mt-3 text-sm text-slate-500">The route you opened is not available in SB Stocks.</p>
        <Link to="/dashboard" className="btn-primary mt-6">
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
