
import { FormEvent, useEffect, useState } from 'react';
import { useApp } from '../hooks/useApp';
import { Button, Card, Field, PageTitle, inputCls } from '../components/ui';
import { initials, isEmail, isValidBdPhone, normalizePhone } from '../utils';
import { CalendarDays, Plus, Pencil, Trash2, ShieldCheck } from 'lucide-react';

interface Routine {
  id: string;
  name: string;
  days: string[];
  departure: string;
  returnTime: string;
  from: string;
  destination: string;
  route: string;
  transport: string;
  notes: string;
}

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const emptyRoutine: Omit<Routine, 'id'> = {
  name: '',
  days: [],
  departure: '',
  returnTime: '',
  from: '',
  destination: '',
  route: '',
  transport: 'Bus',
  notes: '',
};

export default function ProfilePage() {
  const { profile, saveProfile, toast } = useApp();

  const [f, setF] = useState(profile);
  const [er, setEr] = useState<Record<string, string>>({});

  const [routines, setRoutines] = useState<Routine[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('safeher:routines') || '[]');
    } catch {
      return [];
    }
  });

  const [routineForm, setRoutineForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [r, setR] = useState(emptyRoutine);
  const [routineError, setRoutineError] = useState('');

  useEffect(() => {
    localStorage.setItem('safeher:routines', JSON.stringify(routines));
  }, [routines]);

  function submit(e: FormEvent) {
    e.preventDefault();
    const x: Record<string, string> = {};

    if (f.name.trim().length < 2) x.name = 'Enter your name.';
    if (!isValidBdPhone(f.phone)) x.phone = 'Enter a valid Bangladeshi mobile number.';
    if (!isEmail(f.email)) x.email = 'Enter a valid email address.';

    setEr(x);
    if (Object.keys(x).length) return;

    saveProfile({
      ...f,
      name: f.name.trim(),
      phone: normalizePhone(f.phone),
      email: f.email.trim(),
    });

    toast('Profile saved');
  }

  const check = (
    k: 'notifyPrimaryOnly' | 'includeLocation',
    label: string,
    hint: string
  ) => (
    <label className="flex cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        className="mt-1 h-4 w-4 accent-brand-700"
        checked={f[k]}
        onChange={(e) => setF({ ...f, [k]: e.target.checked })}
      />
      <span>
        <span className="block text-sm font-medium">{label}</span>
        <span className="text-xs text-stone-500">{hint}</span>
      </span>
    </label>
  );

  function openAddRoutine() {
    setEditingId(null);
    setR({ ...emptyRoutine, days: [] });
    setRoutineError('');
    setRoutineForm(true);
  }

  function openEditRoutine(routine: Routine) {
    setEditingId(routine.id);
    setR({ ...routine });
    setRoutineError('');
    setRoutineForm(true);
  }

  function saveRoutine(e: FormEvent) {
    e.preventDefault();

    if (!r.name.trim() || !r.departure || !r.from.trim() || !r.destination.trim() || !r.days.length) {
      setRoutineError('Please complete the name, days, time, starting point and destination.');
      return;
    }

    if (editingId) {
      setRoutines((old) =>
        old.map((item) =>
          item.id === editingId ? { ...r, id: editingId } : item
        )
      );
      toast('Routine updated');
    } else {
      setRoutines((old) => [
        ...old,
        { ...r, id: crypto.randomUUID() },
      ]);
      toast('Routine added');
    }

    setRoutineForm(false);
    setEditingId(null);
    setR({ ...emptyRoutine, days: [] });
    setRoutineError('');
  }

  function deleteRoutine(id: string) {
    if (!window.confirm('Delete this safety routine?')) return;

    setRoutines((old) => old.filter((item) => item.id !== id));
    toast('Routine deleted');
  }

  function toggleDay(day: string) {
    setR((old) => ({
      ...old,
      days: old.days.includes(day)
        ? old.days.filter((d) => d !== day)
        : [...old.days, day],
    }));
  }

  return (
    <div className="space-y-6">
      <PageTitle title="Profile" sub="Manage your personal information and safety preferences." />

      {/* PROFILE */}
      <form onSubmit={submit} noValidate className="space-y-6">
        <Card className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 font-serif text-2xl font-bold text-brand-700">
            {initials(f.name)}
          </div>
          <div>
            <p className="font-semibold">{f.name || 'Your name'}</p>
            <p className="text-sm text-stone-600">{f.email}</p>
          </div>
        </Card>

        <Card className="space-y-4">
          <h2 className="text-lg font-semibold">Personal information</h2>

          <Field label="Full name" error={er.name}>
            <input className={inputCls} value={f.name}
              onChange={(e) => setF({ ...f, name: e.target.value })} />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Phone" error={er.phone}>
              <input className={inputCls} inputMode="tel" value={f.phone}
                onChange={(e) => setF({ ...f, phone: e.target.value })} />
            </Field>

            <Field label="Email" error={er.email}>
              <input className={inputCls} type="email" value={f.email}
                onChange={(e) => setF({ ...f, email: e.target.value })} />
            </Field>
          </div>
        </Card>

        <Card className="space-y-4">
          <h2 className="text-lg font-semibold">Emergency preferences</h2>
          {check('notifyPrimaryOnly', 'Notify primary contact only', 'Otherwise all contacts are included in the alert.')}
          {check('includeLocation', 'Include location in SOS alerts', 'You will be asked for browser permission when you trigger SOS.')}
        </Card>

        <div className="flex gap-3">
          <Button type="submit">Save changes</Button>
          <Button type="button" variant="outline"
            onClick={() => { setF(profile); setEr({}); }}>
            Reset
          </Button>
        </div>
      </form>

      {/* SAFETY ROUTINE */}
      <Card className="space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <CalendarDays className="text-brand-700" size={22} />
              <h2 className="text-lg font-semibold">My Safety Routine</h2>
            </div>
            <p className="mt-1 text-sm text-stone-500">
              Save your regular schedules and routes.
            </p>
          </div>

          {!routineForm && (
            <Button type="button" onClick={openAddRoutine}>
              <Plus size={16} /> Add
            </Button>
          )}
        </div>

        <div className="flex items-start gap-2 rounded-lg bg-brand-50 p-3 text-sm text-brand-800">
          <ShieldCheck size={18} className="mt-0.5 shrink-0" />
          <p>
            Your routines are private and stored in this browser.
            They are not automatically shared with anyone.
          </p>
        </div>

        {/* ROUTINE FORM */}
        {routineForm && (
          <form onSubmit={saveRoutine} className="space-y-4 rounded-xl border border-stone-200 p-4">
            <h3 className="font-semibold">
              {editingId ? 'Edit routine' : 'Add a routine'}
            </h3>

            <Field label="Routine name">
              <input className={inputCls} placeholder="University, Work, Coaching..."
                value={r.name}
                onChange={(e) => setR({ ...r, name: e.target.value })} />
            </Field>

            <div>
              <label className="mb-2 block text-sm font-medium">Days</label>
              <div className="flex flex-wrap gap-2">
                {weekdays.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`rounded-full border px-3 py-2 text-sm ${
                      r.days.includes(day)
                        ? 'border-brand-700 bg-brand-700 text-white'
                        : 'border-stone-300 text-stone-600'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Departure time">
                <input className={inputCls} type="time" value={r.departure}
                  onChange={(e) => setR({ ...r, departure: e.target.value })} />
              </Field>
              <Field label="Return time (optional)">
                <input className={inputCls} type="time" value={r.returnTime}
                  onChange={(e) => setR({ ...r, returnTime: e.target.value })} />
              </Field>
            </div>

            <Field label="Starting location">
              <input className={inputCls} placeholder="Home / area"
                value={r.from}
                onChange={(e) => setR({ ...r, from: e.target.value })} />
            </Field>

            <Field label="Destination">
              <input className={inputCls} placeholder="University / workplace"
                value={r.destination}
                onChange={(e) => setR({ ...r, destination: e.target.value })} />
            </Field>

            <Field label="Regular route (optional)">
              <textarea className={inputCls} rows={2}
                placeholder="Describe your usual route..."
                value={r.route}
                onChange={(e) => setR({ ...r, route: e.target.value })} />
            </Field>

            <Field label="Transportation">
              <select className={inputCls} value={r.transport}
                onChange={(e) => setR({ ...r, transport: e.target.value })}>
                <option>Bus</option>
                <option>Rickshaw</option>
                <option>Walking</option>
                <option>Car</option>
                <option>Other</option>
              </select>
            </Field>

            <Field label="Notes (optional)">
              <textarea className={inputCls} rows={2}
                placeholder="Any additional details..."
                value={r.notes}
                onChange={(e) => setR({ ...r, notes: e.target.value })} />
            </Field>

            {routineError && (
              <p className="text-sm text-red-600">{routineError}</p>
            )}

            <div className="flex flex-wrap gap-2">
              <Button type="submit">{editingId ? 'Update routine' : 'Save routine'}</Button>
              <Button type="button" variant="outline"
                onClick={() => setRoutineForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        {/* ROUTINE LIST */}
        {routines.length === 0 && !routineForm && (
          <div className="rounded-xl border border-dashed border-stone-300 py-8 text-center">
            <CalendarDays size={30} className="mx-auto mb-2 text-stone-400" />
            <p className="font-medium">No routines added yet</p>
            <p className="mt-1 text-sm text-stone-500">
              Add your regular schedule and route.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {routines.map((routine) => (
            <div key={routine.id} className="rounded-xl border border-stone-200 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{routine.name}</h3>
                  <p className="mt-1 text-sm text-stone-500">
                    {routine.days.join(', ')}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button type="button" onClick={() => openEditRoutine(routine)}
                    className="rounded-lg p-2 text-stone-600 hover:bg-stone-100"
                    aria-label="Edit routine">
                    <Pencil size={17} />
                  </button>
                  <button type="button" onClick={() => deleteRoutine(routine.id)}
                    className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                    aria-label="Delete routine">
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>

              <div className="mt-3 space-y-1 text-sm text-stone-600">
                <p>🕒 {routine.departure}{routine.returnTime ? ` – ${routine.returnTime}` : ''}</p>
                <p>📍 {routine.from} → {routine.destination}</p>
                <p>🚍 {routine.transport}</p>
                {routine.route && <p>Route: {routine.route}</p>}
                {routine.notes && <p>Notes: {routine.notes}</p>}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
