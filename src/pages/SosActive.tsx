import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Siren, CheckCircle2 } from 'lucide-react';
import { useApp } from '../hooks/useApp';
import { Badge, Button, Card, Modal } from '../components/ui';
import MapView from '../components/location/MapView';
import { fmtDate } from '../utils';
export default function SosActive() {
  const { active, endEmergency, toast } = useApp(); const nav = useNavigate();
  const [now, setNow] = useState(Date.now()); const [confirm, setConfirm] = useState<'resolved' | 'cancelled' | null>(null);
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  if (!active) return <Card className="text-center"><CheckCircle2 className="mx-auto text-emerald-700" size={32} /><p className="mt-3 font-medium">No active emergency.</p>
    <Link to="/" className="mt-4 inline-block text-sm text-brand-700 underline">Back to home</Link></Card>;
  const s = Math.max(0, Math.floor((now - new Date(active.createdAt).getTime()) / 1000));
  const finish = () => { if (!confirm) return; endEmergency(active.id, confirm); toast(confirm === 'resolved' ? 'Emergency marked as resolved' : 'Alert cancelled'); setConfirm(null); nav('/history'); };
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-brand-700 p-6 text-white">
        <div className="flex items-center gap-3"><Siren className="animate-pulse" /><h1 className="text-2xl font-semibold">Emergency active</h1><Badge tone="amber">DEMO</Badge></div>
        <p className="mt-2 text-sm text-brand-100">Event {active.id} · started {fmtDate(active.createdAt)} · {Math.floor(s / 60)}m {s % 60}s ago</p>
      </div>
      <Card>
        <h2 className="mb-3 text-lg font-semibold">Alert location</h2>
        {active.location ? <><MapView coords={active.location} label="Alert location" />
          <p className="mt-2 text-xs text-stone-500">{active.location.lat.toFixed(5)}, {active.location.lng.toFixed(5)}{active.location.accuracy ? ` · ±${Math.round(active.location.accuracy)} m` : ''}</p></>
          : <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">{active.locationNote}</p>}
      </Card>
      <Card>
        <div className="mb-3 flex items-center gap-2"><h2 className="text-lg font-semibold">Notifications</h2><Badge tone="amber">SIMULATED</Badge></div>
        <p className="mb-3 text-sm text-stone-600">Nothing was actually sent. This list shows who <i>would</i> be notified by a real service.</p>
        {active.contacts.length === 0 ? <p className="text-sm text-stone-600">No contacts to notify. <Link to="/contacts" className="text-brand-700 underline">Add contacts</Link>.</p> :
          <ul className="divide-y divide-stone-100">{active.contacts.map((c) => <li key={c.id} className="flex items-center justify-between py-2.5 text-sm">
            <span><span className="font-medium">{c.name}</span> <span className="text-stone-500">· {c.phone}</span></span><span className="text-xs text-stone-500">Simulated SMS</span></li>)}</ul>}
      </Card>
      <div className="flex flex-col gap-3 sm:flex-row"><Button className="flex-1" onClick={() => setConfirm('resolved')}>I'm safe — resolve</Button>
        <Button variant="outline" className="flex-1" onClick={() => setConfirm('cancelled')}>Cancel alert</Button></div>
      <Modal open={!!confirm} onClose={() => setConfirm(null)} title={confirm === 'resolved' ? 'Resolve this emergency?' : 'Cancel this alert?'}>
        <p className="mb-5 text-sm text-stone-600">The event will be saved in your history as <b>{confirm}</b>.</p>
        <div className="flex gap-3"><Button variant="outline" className="flex-1" onClick={() => setConfirm(null)}>Keep active</Button><Button className="flex-1" onClick={finish}>Confirm</Button></div>
      </Modal>
    </div>
  );
}
