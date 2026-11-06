import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import { storage } from '../services/storage';
import { getPosition, errorStatus } from '../services/geolocation';
import { Contact, Coords, EmergencyEvent, LocStatus, Profile, ToastMsg } from '../types';
import { normalizePhone, uid } from '../utils';

const SAMPLE_PROFILE: Profile = { name: 'Ayesha Rahman', phone: '01700000000', email: 'ayesha@example.com', notifyPrimaryOnly: false, includeLocation: true };
const SAMPLE_CONTACTS: Contact[] = [
  { id: 'c1', name: 'Fatema Rahman', relationship: 'Mother', phone: '01700000001', primary: true, sample: true },
  { id: 'c2', name: 'Tanvir Ahmed', relationship: 'Brother', phone: '01700000002', primary: false, sample: true },
];
type Perm = 'granted' | 'denied' | 'prompt' | 'unknown';
interface Ctx {
  profile: Profile; saveProfile: (p: Profile) => void;
  contacts: Contact[]; addContact: (c: Omit<Contact, 'id' | 'primary'>) => string | null;
  updateContact: (id: string, c: Omit<Contact, 'id' | 'primary'>) => string | null;
  deleteContact: (id: string) => void; setPrimary: (id: string) => void;
  events: EmergencyEvent[]; active?: EmergencyEvent;
  triggerEmergency: (loc: Coords | null) => EmergencyEvent; endEmergency: (id: string, s: 'resolved' | 'cancelled') => void; clearHistory: () => void;
  location: { coords: Coords | null; status: LocStatus; updatedAt?: string; permission: Perm }; requestLocation: () => Promise<Coords | null>;
  toasts: ToastMsg[]; toast: (text: string, tone?: ToastMsg['tone']) => void;
}
const AppCtx = createContext<Ctx | null>(null);
export const useApp = () => { const c = useContext(AppCtx); if (!c) throw new Error('useApp outside provider'); return c; };

export function AppProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(() => storage.get('profile', SAMPLE_PROFILE));
  const [contacts, setContacts] = useState<Contact[]>(() => storage.get('contacts', SAMPLE_CONTACTS));
  const [events, setEvents] = useState<EmergencyEvent[]>(() => storage.get('events', []));
  const [coords, setCoords] = useState<Coords | null>(null);
  const [status, setStatus] = useState<LocStatus>('idle');
  const [updatedAt, setUpdatedAt] = useState<string>();
  const [permission, setPermission] = useState<Perm>('unknown');
  const [toasts, setToasts] = useState<ToastMsg[]>([]);

  useEffect(() => storage.set('profile', profile), [profile]);
  useEffect(() => storage.set('contacts', contacts), [contacts]);
  useEffect(() => storage.set('events', events), [events]);
  useEffect(() => { // read permission state only; never triggers a prompt
    let res: PermissionStatus | undefined;
    navigator.permissions?.query({ name: 'geolocation' }).then((r) => { res = r; setPermission(r.state as Perm); r.onchange = () => setPermission(r.state as Perm); }).catch(() => {});
    return () => { if (res) res.onchange = null; };
  }, []);

  const toast = useCallback((text: string, tone: ToastMsg['tone'] = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  const requestLocation = useCallback(async () => {
    setStatus('loading');
    try { const c = await getPosition(); setCoords(c); setStatus('granted'); setUpdatedAt(new Date().toISOString()); return c; }
    catch (e) { setStatus(errorStatus(e as { code?: number })); return null; }
  }, []);

  const dup = (phone: string, ignoreId?: string) => contacts.some((c) => c.id !== ignoreId && normalizePhone(c.phone) === normalizePhone(phone));
  const addContact: Ctx['addContact'] = (c) => {
    if (dup(c.phone)) return 'A contact with this phone number already exists.';
    setContacts((l) => [...l, { ...c, phone: normalizePhone(c.phone), id: uid(), primary: l.length === 0, sample: false }]); return null;
  };
  const updateContact: Ctx['updateContact'] = (id, c) => {
    if (dup(c.phone, id)) return 'Another contact already uses this phone number.';
    setContacts((l) => l.map((x) => (x.id === id ? { ...x, ...c, phone: normalizePhone(c.phone), sample: false } : x))); return null;
  };
  const deleteContact = (id: string) => setContacts((l) => {
    const rest = l.filter((c) => c.id !== id);
    return rest.length && !rest.some((c) => c.primary) ? rest.map((c, i) => ({ ...c, primary: i === 0 })) : rest;
  });
  const setPrimary = (id: string) => setContacts((l) => l.map((c) => ({ ...c, primary: c.id === id })));

  const triggerEmergency: Ctx['triggerEmergency'] = (loc) => {
    const list = profile.notifyPrimaryOnly ? contacts.filter((c) => c.primary) : contacts;
    const ev: EmergencyEvent = {
      id: `SOS-${Date.now().toString(36).toUpperCase()}`, createdAt: new Date().toISOString(), status: 'active',
      user: { name: profile.name, phone: profile.phone }, location: loc, contacts: list,
      locationNote: loc ? undefined : profile.includeLocation ? 'Location unavailable or permission denied.' : 'Location sharing disabled in profile.',
    };
    setEvents((e) => [ev, ...e]); return ev;
  };
  const endEmergency: Ctx['endEmergency'] = (id, s) => setEvents((l) => l.map((e) => (e.id === id ? { ...e, status: s, endedAt: new Date().toISOString() } : e)));
  const active = events.find((e) => e.status === 'active');

  return <AppCtx.Provider value={{ profile, saveProfile: setProfile, contacts, addContact, updateContact, deleteContact, setPrimary,
    events, active, triggerEmergency, endEmergency, clearHistory: () => setEvents([]),
    location: { coords, status, updatedAt, permission }, requestLocation, toasts, toast }}>{children}</AppCtx.Provider>;
}
