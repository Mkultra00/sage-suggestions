import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { TIERS, type Tier } from "@/lib/tiers";

export type MapPoint = {
  id: string;
  tier: Tier;
  category: string;
  location_type: string;
  occurred_hour: string;
  lat: number;
  lng: number;
  synthetic: boolean;
};

const TIER_HEX: Record<Tier, string> = {
  T1: "#e5484d",
  T2: "#f2911f",
  T3: "#f5c518",
  T4: "#5aa0e0",
};

export default function IncidentMap({ points }: { points: MapPoint[] }) {
  const container = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<maplibregl.Marker[]>([]);

  useEffect(() => {
    if (!container.current || map.current) return;
    const m = new maplibregl.Map({
      container: container.current,
      style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
      center: [-73.968, 40.785],
      zoom: 11.4,
      minZoom: 10.4,
      maxBounds: MANHATTAN_BOUNDS,
      attributionControl: { compact: true },
    });
    map.current = m;
    m.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    m.on("load", () => {
      m.addSource("manhattan", { type: "geojson", data: MANHATTAN_OUTLINE });
      m.addLayer({
        id: "manhattan-fill",
        type: "fill",
        source: "manhattan",
        paint: { "fill-color": "#f5c518", "fill-opacity": 0.06 },
      });
      m.addLayer({
        id: "manhattan-line",
        type: "line",
        source: "manhattan",
        paint: { "line-color": "#f5c518", "line-width": 1.6, "line-opacity": 0.75 },
      });
      m.fitBounds(
        [
          [-74.026, 40.698],
          [-73.906, 40.882],
        ],
        { padding: 24, duration: 0 },
      );
    });
    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    const m = map.current;
    if (!m) return;
    markers.current.forEach((mk) => mk.remove());
    markers.current = [];

    points.forEach((p) => {
      const el = document.createElement("div");
      const color = TIER_HEX[p.tier];
      el.style.cssText = `width:14px;height:14px;border-radius:9999px;background:${color};box-shadow:0 0 0 4px ${color}33, 0 0 12px ${color}88;cursor:pointer;`;
      const popup = new maplibregl.Popup({ offset: 14, closeButton: false }).setHTML(
        `<div style="font-family:system-ui;font-size:12px;color:#111">
           <strong>${TIERS[p.tier].label}</strong><br/>
           ${p.category.replace(/_/g, " ")} · ${p.location_type}<br/>
           <span style="opacity:.7">${new Date(p.occurred_hour).toLocaleString([], { hour: "numeric", weekday: "short" })} · location approximate</span>
         </div>`,
      );
      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([p.lng, p.lat])
        .setPopup(popup)
        .addTo(m);
      markers.current.push(marker);
    });
  }, [points]);

  return <div ref={container} className="h-full w-full" />;
}
