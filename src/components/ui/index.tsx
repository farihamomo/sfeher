import { ReactNode, ButtonHTMLAttributes, useEffect } from 'react';
import { X } from 'lucide-react';
export const cx = (...a: (string | false | undefined)[]) => a.filter(Boolean).join(' ');
export const inputCls = 'w-full rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm placeholder:text-stone-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-100';
const variants = {
  primary: 'bg-brand-700 text-white hover:bg-brand-800',
  outline: 'border border-stone-300 bg-white text-stone-800 hover:bg-stone-50',
  ghost: 'text-stone-700 hover:bg-stone-100',
  danger: 'bg-red-700 text-white hover:bg-red-800',
};
export function Button({ variant = 'primary', className, ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof variants }) {
  return <button {...p} className={cx('inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none', variants[variant], className)} />;
}
export const Card = ({ className, children }: { className?: string; children: ReactNode }) =>
  <section className={cx('rounded-2xl border border-stone-200 bg-white p-5 shadow-sm', className)}>{children}</section>;
const tones = { green: 'bg-emerald-50 text-emerald-800', red: 'bg-red-50 text-red-800', amber: 'bg-amber-50 text-amber-800', stone: 'bg-stone-100 text-stone-700' };
export const Badge = ({ tone = 'stone', children }: { tone?: keyof typeof tones; children: ReactNode }) =>
  <span className={cx('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', tones[tone])}>{children}</span>;
export function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return <label className="block"><span className="mb-1 block text-sm font-medium text-stone-700">{label}</span>{children}
    {error && <span role="alert" className="mt-1 block text-xs text-red-700">{error}</span>}</label>;
}
export function Modal({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-stone-900/50 p-4 sm:items-center" onMouseDown={onClose}>
      <div role="dialog" aria-modal="true" aria-label={title} onMouseDown={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-4"><h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="rounded p-1 text-stone-500 hover:bg-stone-100"><X size={18} /></button></div>
        {children}
      </div>
    </div>
  );
}
export const PageTitle = ({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) =>
  <div className="mb-6 flex items-end justify-between gap-4"><div><h1 className="text-2xl font-semibold sm:text-3xl">{title}</h1>
    {sub && <p className="mt-1 text-sm text-stone-600">{sub}</p>}</div>{action}</div>;
