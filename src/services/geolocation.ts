import { Coords, LocStatus } from '../types';
export function getPosition(): Promise<Coords> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) return reject({ code: 0 });
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude, accuracy: p.coords.accuracy }),
      (e) => reject(e), { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 });
  });
}
export function errorStatus(e: { code?: number }): LocStatus {
  return e.code === 1 ? 'denied' : e.code === 2 ? 'unavailable' : e.code === 3 ? 'timeout' : 'unsupported';
}
export const statusMessage: Record<LocStatus, string> = {
  idle: 'Location not requested yet.', loading: 'Finding your location…', granted: 'Location access granted.',
  denied: 'Permission denied. Enable location for this site in your browser settings, then try again.',
  unavailable: 'Your position could not be determined. Check GPS/network and try again.',
  timeout: 'Timed out while finding your location. Try again, ideally with Wi-Fi or GPS on.',
  unsupported: 'This browser does not support geolocation.',
};
export const osmLink = (c: Coords) => `https://www.openstreetmap.org/?mlat=${c.lat}&mlon=${c.lng}#map=17/${c.lat}/${c.lng}`;
