import { Link } from 'react-router-dom';
import { MapPin, ShieldCheck, TriangleAlert, ChevronRight, Phone } from 'lucide-react';
import { useApp } from '../hooks/useApp';
import { Badge, Button, Card } from '../components/ui';
import SosButton from '../components/sos/SosButton';
import { statusMessage } from '../services/geolocation';
import { fmtDate } from '../utils';
export default function Dashboard() {
  const { profile, contacts, events, active, location, requestLocation, toast } = useApp();
  const hr = new Date().getHours(); const greet = hr < 12 ? 'Good morning' : hr < 18 ? 'Good afternoon' : 'Good evening';
  const recent = events.slice(0, 3);
  const tone = { resolved: 'green', cancelled: 'stone', active: 'red' } as const;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold sm:text-3xl">{greet}, {profile.name.split(' ')[0] || 'there'}</h1>
        <div className="mt-2">{active
          ? <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-800"><TriangleAlert size={15} />Emergency active (demo)</span>
          : <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800"><ShieldCheck size={15} />You're safe — no active alerts</span>}</div>
      </div>
      <Card className="flex flex-col items-center py-10">
        <SosButton />
        <p className="mt-8 max-w-sm text-center text-sm text-stone-600">Press SOS to start a 5-second cancellable countdown. In this demo, the alert is simulated and saved on this device only.</p>
      </Card>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold"><MapPin size={18} className="text-brand-700" />Location</h2>
          <p className="text-sm text-stone-600">{location.coords ? `Lat ${location.coords.lat.toFixed(5)}, Lng ${location.coords.lng.toFixed(5)}` : statusMessage[location.status]}</p>
          <div className="mt-4 flex gap-2">
            <Button variant="outline" disabled={location.status === 'loading'} onClick={async () => { const c = await requestLocation(); toast(c ? 'Location updated' : 'Could not get location', c ? 'success' : 'error'); }}>
              {location.coords ? 'Refresh' : 'Enable location'}</Button>
            <Link to="/location"><Button variant="ghost">Open map</Button></Link></div>
        </Card>
        <Card>
          <div className="mb-3 flex items-center justify-between"><h2 className="flex items-center gap-2 text-lg font-semibold"><Phone size={18} className="text-brand-700" />Emergency contacts</h2>
            <Link to="/contacts" className="text-sm font-medium text-brand-700">Manage</Link></div>
          {contacts.length === 0 ? <p className="text-sm text-stone-600">No contacts yet. <Link to="/contacts" className="text-brand-700 underline">Add one</Link> so your alert has someone to reach.</p> :
            <ul className="divide-y divide-stone-100">{contacts.slice(0, 3).map((c) => <li key={c.id} className="flex items-center justify-between py-2 text-sm">
              <span><span className="font-medium">{c.name}</span> <span className="text-stone-500">· {c.relationship}</span></span>{c.primary && <Badge tone="green">Primary</Badge>}</li>)}</ul>}
        </Card>
      </div>
      <Card>
        <div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-semibold">Recent activity</h2><Link to="/history" className="text-sm font-medium text-brand-700">View all</Link></div>
        {recent.length === 0 ? <p className="text-sm text-stone-600">No emergency activity yet.</p> :
          <ul className="divide-y divide-stone-100">{recent.map((e) => <li key={e.id}><Link to="/history" className="flex items-center justify-between py-3 text-sm">
            <span><span className="font-medium">{e.id}</span><span className="block text-xs text-stone-500">{fmtDate(e.createdAt)}</span></span>
            <span className="flex items-center gap-2"><Badge tone={tone[e.status]}>{e.status}</Badge><ChevronRight size={16} className="text-stone-400" /></span></Link></li>)}</ul>}
      </Card>
    </div>
  );
}
