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
    map.current = new maplibregl.Map({
      container: container.current,
      style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
      center: [-73.968, 40.785],
      zoom: 11.1,
      attributionControl: { compact: true },
    });
    map.current.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
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
