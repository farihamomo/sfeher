export const normalizePhone = (s: string) => s.replace(/[\s-]/g, '').replace(/^\+?880/, '0');
export const isValidBdPhone = (s: string) => /^01[3-9]\d{8}$/.test(normalizePhone(s));
export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
export const fmtDate = (iso: string) => new Date(iso).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });
export const initials = (n: string) => n.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('') || '?';
export const uid = () => Math.random().toString(36).slice(2, 9);
