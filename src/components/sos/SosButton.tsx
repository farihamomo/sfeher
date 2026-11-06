import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Siren, Loader2 } from 'lucide-react';
import { useApp } from '../../hooks/useApp';
import { Button, Modal } from '../ui';
export default function SosButton() {
  const { active, profile, contacts, requestLocation, triggerEmergency } = useApp();
  const nav = useNavigate();
  const [open, setOpen] = useState(false); const [count, setCount] = useState(5); const [busy, setBusy] = useState(false);
  const close = () => { if (!busy) { setOpen(false); setCount(5); } };
  async function fire() {
    if (busy) return; setBusy(true);
    const loc = profile.includeLocation ? await requestLocation() : null;
    triggerEmergency(loc); setBusy(false); setOpen(false); setCount(5); nav('/sos');
  }
  useEffect(() => {
    if (!open || busy) return;
    if (count <= 0) { fire(); return; }
    const t = setTimeout(() => setCount((c) => c - 1), 1000); return () => clearTimeout(t);
  }, [open, count, busy]); // eslint-disable-line
  return (
    <>
      <div className="flex flex-col items-center">
        <button onClick={() => (active ? nav('/sos') : setOpen(true))} aria-label={active ? 'View active emergency' : 'Activate SOS emergency alert'}
          className="group relative flex h-44 w-44 items-center justify-center rounded-full bg-brand-700 text-white shadow-[0_0_0_10px_rgba(116,31,63,0.10),0_0_0_22px_rgba(116,31,63,0.05)] transition hover:bg-brand-800 active:scale-95 sm:h-52 sm:w-52">
          <span className="flex flex-col items-center gap-1"><Siren size={38} /><span className="font-serif text-4xl font-bold tracking-wide">SOS</span>
            <span className="text-xs text-brand-100">{active ? 'Emergency active' : 'Tap for help'}</span></span>
        </button>
      </div>
      <Modal open={open} onClose={close} title="Send emergency alert?">
        <p className="text-sm text-stone-600">A <b>demo</b> alert will be created in {count > 0 ? `${count} second${count === 1 ? '' : 's'}` : 'a moment'}. No real message, call, or police notification is sent.</p>
        <div className="my-5 text-center font-serif text-6xl text-brand-700" aria-live="polite">{busy ? <Loader2 className="mx-auto animate-spin" size={48} /> : count}</div>
        {contacts.length === 0 && <p className="mb-3 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">You have no emergency contacts yet. The alert will still be recorded.</p>}
        <div className="flex gap-3"><Button variant="outline" className="flex-1" onClick={close} disabled={busy}>Cancel</Button>
          <Button className="flex-1" onClick={fire} disabled={busy}>Send now</Button></div>
      </Modal>
    </>
  );
}
