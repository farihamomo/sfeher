export interface Profile { name: string; phone: string; email: string; notifyPrimaryOnly: boolean; includeLocation: boolean }
export interface Contact { id: string; name: string; relationship: string; phone: string; primary: boolean; sample?: boolean }
export interface Coords { lat: number; lng: number; accuracy?: number }
export type EventStatus = 'active' | 'resolved' | 'cancelled';
export interface EmergencyEvent {
  id: string; createdAt: string; endedAt?: string; status: EventStatus;
  user: { name: string; phone: string }; location: Coords | null; locationNote?: string; contacts: Contact[];
}
export type LocStatus = 'idle' | 'loading' | 'granted' | 'denied' | 'unavailable' | 'timeout' | 'unsupported';
export interface ToastMsg { id: number; text: string; tone: 'success' | 'error' | 'info' }

export type JourneyStatus = 'active' | 'completed' | 'cancelled';

export interface Journey {
  id: string;
  origin: string;
  destination: string;
  transport: string;
  expectedArrival: string;
  startedAt: string;
  completedAt?: string;
  status: JourneyStatus;
  checkInNote?: string;
}
