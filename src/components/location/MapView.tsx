import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Coords } from '../../types';
export default function MapView({ coords, label, className = 'h-72' }: { coords: Coords; label?: string; className?: string }) {
  const el = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!el.current) return;
    const map = L.map(el.current).setView([coords.lat, coords.lng], 16);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap contributors' }).addTo(map);
    if (coords.accuracy) L.circle([coords.lat, coords.lng], { radius: coords.accuracy, color: '#741f3f', weight: 1, fillOpacity: 0.08 }).addTo(map);
    L.circleMarker([coords.lat, coords.lng], { radius: 9, color: '#fff', weight: 3, fillColor: '#741f3f', fillOpacity: 1 })
      .bindTooltip(label ?? 'Your location').addTo(map);
    return () => { map.remove(); };
  }, [coords.lat, coords.lng, coords.accuracy, label]);
  return <div ref={el} role="img" aria-label="Map showing the location" className={`${className} w-full overflow-hidden rounded-xl border border-stone-200`} />;
}
