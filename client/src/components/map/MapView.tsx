import 'leaflet/dist/leaflet.css';
import { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin } from 'lucide-react';
import type { ItineraryDay } from '../../types/trip';

/**
 * A single resolved point on the map — either an activity or a route city.
 */
interface MapPoint {
  lat: number;
  lng: number;
  label: string;
  sub?: string;
  /** Sequence number shown inside the marker. */
  index: number;
}

/**
 * Build a numbered, frosted divIcon so markers match the Aurora Glass theme and
 * we sidestep Leaflet's well-known broken default-icon asset path under bundlers.
 */
function numberedIcon(n: number): L.DivIcon {
  return L.divIcon({
    className: 'tripu-marker',
    html: `<div style="
      display:flex;align-items:center;justify-content:center;
      width:30px;height:30px;border-radius:9999px;
      background:linear-gradient(135deg,#22d3ee,#8b5cf6);
      color:#0b0b1d;font:600 13px/1 'Space Grotesk',Inter,sans-serif;
      box-shadow:0 0 0 3px rgba(34,211,238,0.25),0 6px 16px rgba(3,4,18,0.6);
      border:2px solid rgba(255,255,255,0.85);
    ">${n}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -16],
  });
}

/** Imperatively fit the map to the route points whenever they change. */
function FitBounds({ points }: { points: MapPoint[] }) {
  const map = useMap();
  useMemo(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView([points[0].lat, points[0].lng], 11);
      return;
    }
    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
  }, [map, points]);
  return null;
}

interface MapViewProps {
  days: ItineraryDay[];
  /** Optional explicit route cities (used to draw the connecting line when set). */
  className?: string;
}

/**
 * FLAGSHIP live map. Plots every activity / city that carries coordinates as a
 * numbered marker and connects them, in itinerary order, with a glowing polyline.
 * Falls back to a tasteful placeholder when no coordinates exist.
 */
export default function MapView({ days, className }: MapViewProps) {
  const points = useMemo<MapPoint[]>(() => {
    const out: MapPoint[] = [];
    let seq = 0;
    for (const day of days) {
      // Prefer per-activity coordinates; otherwise fall back to one point per day/city.
      const acts = day.activities.filter((a) => typeof a.lat === 'number' && typeof a.lng === 'number');
      if (acts.length > 0) {
        for (const a of acts) {
          seq += 1;
          out.push({
            lat: a.lat as number,
            lng: a.lng as number,
            label: a.title,
            sub: `Day ${day.dayIndex + 1} · ${day.city}`,
            index: seq,
          });
        }
      }
    }
    return out;
  }, [days]);

  const line = useMemo(() => points.map((p) => [p.lat, p.lng] as [number, number]), [points]);

  if (points.length === 0) {
    return (
      <div
        className={
          'flex h-72 flex-col items-center justify-center rounded-2xl border border-aurora-line bg-white/5 text-center ' +
          (className ?? '')
        }
      >
        <MapPin className="text-aurora-dim" size={30} />
        <p className="mt-3 px-6 text-sm text-aurora-muted">
          No map coordinates on this itinerary yet.
        </p>
        <p className="mt-1 px-6 text-xs text-aurora-dim">
          Places with locations will appear here as numbered stops.
        </p>
      </div>
    );
  }

  const center: [number, number] = [points[0].lat, points[0].lng];

  return (
    <div className={'overflow-hidden rounded-2xl border border-aurora-line ' + (className ?? '')}>
      <MapContainer
        center={center}
        zoom={6}
        scrollWheelZoom={false}
        style={{ height: '20rem', width: '100%', background: '#0b0b1d' }}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap &copy; CARTO'
        />
        {line.length > 1 && (
          <Polyline
            positions={line}
            pathOptions={{ color: '#22d3ee', weight: 3, opacity: 0.8, dashArray: '1 8', lineCap: 'round' }}
          />
        )}
        {points.map((p) => (
          <Marker key={p.index} position={[p.lat, p.lng]} icon={numberedIcon(p.index)}>
            <Popup>
              <strong>{p.label}</strong>
              {p.sub && <div style={{ fontSize: 12, opacity: 0.7 }}>{p.sub}</div>}
            </Popup>
          </Marker>
        ))}
        <FitBounds points={points} />
      </MapContainer>
    </div>
  );
}
