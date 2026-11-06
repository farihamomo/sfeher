import { NavLink, Outlet, Link } from 'react-router-dom';
import { Home, MapPin, Users, History, User, ShieldCheck, TriangleAlert } from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { cx } from '../ui';
const items = [{ to: '/', label: 'Home', Icon: Home }, { to: '/location', label: 'Location', Icon: MapPin }, { to: '/contacts', label: 'Contacts', Icon: Users },
  { to: '/history', label: 'History', Icon: History }, { to: '/profile', label: 'Profile', Icon: User }];
export default function Layout() {
  const { active, toasts } = useApp();
  return (
    <div className="min-h-screen md:flex">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-stone-200 bg-white p-5 md:flex">
        <Link to="/" className="mb-8 flex items-center gap-2 text-brand-700"><ShieldCheck size={26} /><span className="font-serif text-2xl font-bold">SafeHer</span></Link>
        <nav className="space-y-1" aria-label="Main">
          {items.map(({ to, label, Icon }) => (
            <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => cx('flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium', isActive ? 'bg-brand-50 text-brand-700' : 'text-stone-600 hover:bg-stone-100')}>
              <Icon size={18} />{label}</NavLink>))}
        </nav>
      </aside>
      <div className="min-w-0 flex-1 pb-24 md:pb-0">
        <header className="flex items-center justify-between border-b border-stone-200 bg-white px-4 py-3 md:justify-end">
          <span className="flex items-center gap-2 font-serif text-lg font-bold text-brand-700 md:hidden"><ShieldCheck size={20} />SafeHer</span>
        </header>
        {active && <Link to="/sos" className="flex items-center justify-center gap-2 bg-red-700 px-4 py-2 text-sm font-medium text-white"><TriangleAlert size={16} />Demo emergency active — tap to view</Link>}
        <main className="mx-auto max-w-4xl px-4 py-6 md:px-8 md:py-10"><Outlet /></main>
      </div>
      <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-stone-200 bg-white pb-[env(safe-area-inset-bottom)] md:hidden">
        {items.map(({ to, label, Icon }) => (
          <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => cx('flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium', isActive ? 'text-brand-700' : 'text-stone-500')}><Icon size={20} />{label}</NavLink>))}
      </nav>
      <div className="pointer-events-none fixed inset-x-0 bottom-20 z-[60] flex flex-col items-center gap-2 px-4 md:bottom-6" aria-live="polite">
        {toasts.map((t) => <div key={t.id} className={cx('pointer-events-auto rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-lg', t.tone === 'error' ? 'bg-red-700' : t.tone === 'info' ? 'bg-stone-800' : 'bg-emerald-700')}>{t.text}</div>)}
      </div>
    </div>
  );
}
