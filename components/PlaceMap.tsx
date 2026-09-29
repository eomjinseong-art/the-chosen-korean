"use client";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import type { Place } from "@/content/archive/locations";

export function PlaceMap({ places }: { places: Place[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let map: import("leaflet").Map | undefined;
    let dead = false;
    (async () => {
      const L = await import("leaflet");
      if (dead || !ref.current) return;
      map = L.map(ref.current, { scrollWheelZoom: false });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 18,
      }).addTo(map);
      const pts: [number, number][] = [];
      for (const p of places) {
        const color = p.kind === "set" ? "#b5462f" : "#b8892b";
        L.circleMarker([p.lat, p.lng], { radius: 8, color, weight: 2, fillColor: color, fillOpacity: 0.75 })
          .addTo(map)
          .bindPopup(`<strong>${p.name}</strong><br/><small>${p.en}</small><br/>${p.text}<br/><a href="#${p.slug}">자세히 보기</a>`);
        pts.push([p.lat, p.lng]);
      }
      map.fitBounds(L.latLngBounds(pts).pad(0.2), { maxZoom: 9 });
    })();
    return () => {
      dead = true;
      map?.remove();
    };
  }, [places]);
  return <div ref={ref} className="place-map" role="region" aria-label="지도" />;
}
