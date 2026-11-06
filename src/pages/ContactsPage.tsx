import { FormEvent, useState } from 'react';
import { Pencil, Plus, Star, Trash2, Users } from 'lucide-react';
import { useApp } from '../hooks/useApp';
import { Badge, Button, Card, Field, Modal, PageTitle, inputCls } from '../components/ui';
import { Contact } from '../types';
import { isValidBdPhone } from '../utils';
const blank = { name: '', relationship: '', phone: '' };
export default function ContactsPage() {
  const { contacts, addContact, updateContact, deleteContact, setPrimary, toast } = useApp();
  const [form, setForm] = useState(blank); const [editing, setEditing] = useState<Contact | 'new' | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({}); const [del, setDel] = useState<Contact | null>(null);
  const open = (c: Contact | 'new') => { setForm(c === 'new' ? blank : { name: c.name, relationship: c.relationship, phone: c.phone }); setErrors({}); setEditing(c); };
  function submit(e: FormEvent) {
    e.preventDefault(); const er: Record<string, string> = {};
    if (form.name.trim().length < 2) er.name = 'Enter a name (at least 2 characters).';
    if (!form.relationship.trim()) er.relationship = 'Enter a relationship, e.g. Sister.';
    if (!isValidBdPhone(form.phone)) er.phone = 'Enter a valid Bangladeshi mobile number, e.g. 01712345678.';
    if (Object.keys(er).length) return setErrors(er);
    const data = { name: form.name.trim(), relationship: form.relationship.trim(), phone: form.phone };
    const err = editing === 'new' ? addContact(data) : updateContact((editing as Contact).id, data);
    if (err) return setErrors({ phone: err });
    toast(editing === 'new' ? 'Contact added' : 'Contact updated'); setEditing(null);
  }
  return (
    <div>
      <PageTitle title="Emergency contacts" sub="People who would be notified when you trigger SOS." action={<Button onClick={() => open('new')}><Plus size={16} />Add</Button>} />
      {contacts.length === 0 ? (
        <Card className="py-12 text-center"><Users className="mx-auto text-stone-400" size={36} /><p className="mt-3 font-medium">No emergency contacts yet</p>
          <p className="mt-1 text-sm text-stone-600">Add someone you trust to get started.</p><Button className="mt-5" onClick={() => open('new')}>Add first contact</Button></Card>
      ) : (
        <ul className="space-y-3">{contacts.map((c) => (
          <li key={c.id}><Card className="flex flex-wrap items-center justify-between gap-3 !p-4">
            <div><p className="font-medium">{c.name} {c.primary && <Badge tone="green">Primary</Badge>} {c.sample && <Badge tone="amber">Sample data</Badge>}</p>
              <p className="text-sm text-stone-600">{c.relationship} · {c.phone}</p></div>
            <div className="flex gap-1">
              {!c.primary && <Button variant="ghost" onClick={() => { setPrimary(c.id); toast(`${c.name} is now primary`); }} aria-label={`Make ${c.name} primary`}><Star size={16} />Primary</Button>}
              <Button variant="ghost" onClick={() => open(c)} aria-label={`Edit ${c.name}`}><Pencil size={16} /></Button>
              <Button variant="ghost" onClick={() => setDel(c)} aria-label={`Delete ${c.name}`}><Trash2 size={16} className="text-red-700" /></Button></div>
          </Card></li>))}</ul>
      )}
      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing === 'new' ? 'Add contact' : 'Edit contact'}>
        <form onSubmit={submit} className="space-y-4" noValidate>
          <Field label="Name" error={errors.name}><input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Relationship" error={errors.relationship}><input className={inputCls} value={form.relationship} onChange={(e) => setForm({ ...form, relationship: e.target.value })} /></Field>
          <Field label="Phone number" error={errors.phone}><input className={inputCls} inputMode="tel" placeholder="01XXXXXXXXX" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
          <div className="flex gap-3 pt-2"><Button type="button" variant="outline" className="flex-1" onClick={() => setEditing(null)}>Cancel</Button><Button type="submit" className="flex-1">Save</Button></div>
        </form>
      </Modal>
      <Modal open={!!del} onClose={() => setDel(null)} title="Delete contact?">
        <p className="mb-5 text-sm text-stone-600">{del?.name} will be removed from your emergency contacts.</p>
        <div className="flex gap-3"><Button variant="outline" className="flex-1" onClick={() => setDel(null)}>Keep</Button>
          <Button variant="danger" className="flex-1" onClick={() => { deleteContact(del!.id); toast('Contact deleted'); setDel(null); }}>Delete</Button></div>
      </Modal>
    </div>
  );
}
