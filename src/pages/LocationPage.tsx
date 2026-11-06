import { Copy, ExternalLink, Loader2, RefreshCw, MapPin } from 'lucide-react';
import { useApp } from '../hooks/useApp';
import { Badge, Button, Card, PageTitle } from '../components/ui';
import MapView from '../components/location/MapView';
import { osmLink, statusMessage } from '../services/geolocation';
import { fmtDate } from '../utils';
export default function LocationPage() {
  const { location: { coords, status, permission, updatedAt }, requestLocation, toast } = useApp();
  const loading = status === 'loading'; const failed = ['denied', 'unavailable', 'timeout', 'unsupported'].includes(status);
  const get = async () => { const c = await requestLocation(); toast(c ? 'Location updated' : 'Could not get location', c ? 'success' : 'error'); };
  const copy = async () => { if (!coords) return; try { await navigator.clipboard.writeText(osmLink(coords)); toast('Location link copied'); } catch { toast('Copy failed — use "Open link" instead', 'error'); } };
  return (
    <div>
      <PageTitle title="Location" sub="Your location is only read when you ask. It is never tracked in the background." />
      <Card className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm">Browser permission: <Badge tone={permission === 'granted' ? 'green' : permission === 'denied' ? 'red' : 'stone'}>{permission === 'prompt' ? 'not asked yet' : permission}</Badge></div>
          <Button onClick={get} disabled={loading}>{loading ? <Loader2 size={16} className="animate-spin" /> : coords ? <RefreshCw size={16} /> : <MapPin size={16} />}{coords ? 'Refresh location' : 'Enable location'}</Button>
        </div>
        {(failed || status === 'idle' || loading) && <p role="status" className={`mt-4 rounded-lg p-3 text-sm ${failed ? 'bg-red-50 text-red-800' : 'bg-stone-100 text-stone-700'}`}>{statusMessage[status]}</p>}
      </Card>
      {coords && (
        <Card className="space-y-4">
          <dl className="grid grid-cols-3 gap-3 text-sm">
            <div><dt className="text-stone-500">Latitude</dt><dd className="font-medium">{coords.lat.toFixed(6)}</dd></div>
            <div><dt className="text-stone-500">Longitude</dt><dd className="font-medium">{coords.lng.toFixed(6)}</dd></div>
            <div><dt className="text-stone-500">Accuracy</dt><dd className="font-medium">{coords.accuracy ? `±${Math.round(coords.accuracy)} m` : 'n/a'}</dd></div>
          </dl>
          <MapView coords={coords} />
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={copy}><Copy size={16} />Copy link</Button>
            <a href={osmLink(coords)} target="_blank" rel="noreferrer"><Button variant="outline"><ExternalLink size={16} />Open link</Button></a>
            {updatedAt && <span className="text-xs text-stone-500">Updated {fmtDate(updatedAt)}</span>}</div>
        </Card>
      )}
    </div>
  );
}
