
import { FormEvent, useEffect, useState } from 'react';
import { MapPin, Clock, Navigation, ShieldCheck, CheckCircle, XCircle, Route } from 'lucide-react';
import { Button, Card, Field, PageTitle, Badge, inputCls } from '../components/ui';
import { Journey } from '../types';

const KEY = 'safeher:journeys';

function readJourneys(): Journey[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

export default function JourneyPage() {
  const [journeys, setJourneys] = useState<Journey[]>(readJourneys);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [transport, setTransport] = useState('Bus');
  const [arrival, setArrival] = useState('');
  const [note, setNote] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [checkIn, setCheckIn] = useState('');

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(journeys));
  }, [journeys]);

  const active = journeys.find((j) => j.status === 'active');
  const completed = journeys.filter((j) => j.status !== 'active');

  function startJourney(e: FormEvent) {
    e.preventDefault();
    if (!origin.trim() || !destination.trim() || !arrival) {
      setError('Please enter your starting point, destination, and expected arrival.');
      return;
    }
    if (active) {
      setError('Please complete or cancel your active journey first.');
      return;
    }

    const journey: Journey = {
      id: `JNY-${Date.now().toString(36).toUpperCase()}`,
      origin: origin.trim(),
      destination: destination.trim(),
      transport,
      expectedArrival: arrival,
      startedAt: new Date().toISOString(),
      status: 'active',
    };

    setJourneys((old) => [journey, ...old]);
    setShowForm(false);
    setError('');
    setOrigin('');
    setDestination('');
    setArrival('');
    setNote('');
  }

  function finishJourney(status: 'completed' | 'cancelled') {
    if (!active) return;
    setJourneys((old) =>
      old.map((j) =>
        j.id === active.id
          ? {
              ...j,
              status,
              completedAt: new Date().toISOString(),
              checkInNote: status === 'completed' ? checkIn : undefined,
            }
          : j
      )
    );
    setCheckIn('');
  }

  const overdue = active
    ? new Date(active.expectedArrival).getTime() < Date.now()
    : false;

  return (
    <div className="space-y-6">
      <PageTitle
        title="Journey Safety"
        sub="Plan a journey and check in when you arrive."
        action={!active ? <Button onClick={() => setShowForm(true)}>＋ New journey</Button> : undefined}
      />

      <Card className="flex items-start gap-3 bg-brand-50">
        <ShieldCheck className="mt-0.5 shrink-0 text-brand-700" />
        <p className="text-sm text-brand-800">
          Journey details are stored privately in this browser.
          This demo does not automatically notify contacts or track you in the background.
        </p>
      </Card>

      {showForm && !active && (
        <Card>
          <form onSubmit={startJourney} className="space-y-4">
            <h2 className="text-lg font-semibold">Plan a journey</h2>
            <Field label="Starting point">
              <input className={inputCls} value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="Home / current location" />
            </Field>
            <Field label="Destination">
              <input className={inputCls} value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="University / workplace" />
            </Field>
            <Field label="Expected arrival">
              <input className={inputCls} type="datetime-local" value={arrival} onChange={(e) => setArrival(e.target.value)} />
            </Field>
            <Field label="Transportation">
              <select className={inputCls} value={transport} onChange={(e) => setTransport(e.target.value)}>
                <option>Bus</option>
                <option>Rickshaw</option>
                <option>Walking</option>
                <option>Car</option>
                <option>Other</option>
              </select>
            </Field>
            {error && <p className="text-sm text-red-700">{error}</p>}
            <div className="flex gap-2">
              <Button type="submit">Start journey</Button>
              <Button type="button" variant="outline" onClick={() => { setShowForm(false); setError(''); }}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {active && (
        <Card className="space-y-4 border-brand-200">
          <div className="flex items-center justify-between">
            <Badge tone={overdue ? 'amber' : 'green'}>{overdue ? 'Arrival time passed' : 'Journey active'}</Badge>
            <span className="text-xs text-stone-500">{active.id}</span>
          </div>
          <div className="flex items-center gap-3 text-lg font-semibold">
            <MapPin className="text-brand-700" />{active.origin}
          </div>
          <div className="ml-2 border-l-2 border-dashed border-brand-200 py-3 pl-6">
            <Navigation className="text-brand-700" size={20} />
          </div>
          <div className="flex items-center gap-3 text-lg font-semibold">
            <MapPin className="text-brand-700" />{active.destination}
          </div>
          <div className="grid gap-2 text-sm text-stone-600 sm:grid-cols-2">
            <p className="flex items-center gap-2"><Clock size={16} />Expected: {new Date(active.expectedArrival).toLocaleString()}</p>
            <p className="flex items-center gap-2"><Route size={16} />{active.transport}</p>
          </div>
          <Field label="Check-in note (optional)">
            <input className={inputCls} value={checkIn} onChange={(e) => setCheckIn(e.target.value)} placeholder="I arrived safely..." />
          </Field>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => finishJourney('completed')}><CheckCircle size={16} /> I'm Safe — End Journey</Button>
            <Button variant="outline" onClick={() => finishJourney('cancelled')}><XCircle size={16} /> Cancel journey</Button>
          </div>
        </Card>
      )}

      {!active && !showForm && (
        <Card className="py-10 text-center">
          <Navigation size={36} className="mx-auto text-stone-400" />
          <h2 className="mt-3 font-semibold">No active journey</h2>
          <p className="mt-1 text-sm text-stone-600">Plan your next trip before you leave.</p>
          <Button className="mt-4" onClick={() => setShowForm(true)}>Start a journey</Button>
        </Card>
      )}

      <Card>
        <h2 className="mb-4 text-lg font-semibold">Journey history</h2>
        {completed.length === 0 ? (
          <p className="text-sm text-stone-500">Completed journeys will appear here.</p>
        ) : (
          <div className="space-y-3">
            {completed.map((j) => (
              <div key={j.id} className="rounded-xl border border-stone-200 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium">{j.origin} → {j.destination}</p>
                  <Badge tone={j.status === 'completed' ? 'green' : 'stone'}>{j.status}</Badge>
                </div>
                <p className="mt-1 text-xs text-stone-500">{new Date(j.startedAt).toLocaleString()}</p>
                {j.checkInNote && <p className="mt-2 text-sm">Check-in: {j.checkInNote}</p>}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
