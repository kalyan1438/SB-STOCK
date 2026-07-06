import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  message: string;
}

export default function EmptyState({ icon: Icon, title, message }: EmptyStateProps) {
  return (
    <div className="panel flex flex-col items-center justify-center px-6 py-12 text-center">
      <Icon className="mb-3 h-9 w-9 text-slate-400" aria-hidden="true" />
      <h3 className="text-base font-semibold text-slate-950">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-slate-500">{message}</p>
    </div>
  );
}

