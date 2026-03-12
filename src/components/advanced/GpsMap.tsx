import L from "leaflet";
import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

export function GpsMap({ lat, lon }: { lat: number; lon: number }) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);

    useEffect(() => {
        if (!mapRef.current) return;

        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
        }

        const map = L.map(mapRef.current, { zoomControl: true }).setView([lat, lon], 14);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
            maxZoom: 19,
        }).addTo(map);

        const icon = L.divIcon({
            className: "",
            html: `<div style="
                width: 28px; height: 28px;
                background: #f59e0b;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                border: 3px solid white;
                box-shadow: 0 2px 8px rgba(0,0,0,0.4);
            "></div>`,
            iconSize: [28, 28],
            iconAnchor: [14, 28],
            popupAnchor: [0, -28],
        });

        L.marker([lat, lon], { icon })
            .addTo(map)
            .bindPopup(`<b>${lat.toFixed(6)}°, ${lon.toFixed(6)}°</b>`)
            .openPopup();

        mapInstanceRef.current = map;

        setTimeout(() => map.invalidateSize(), 100);

        return () => {
            map.remove();
        };
    }, [lat, lon]);

    return (
        <div
            ref={mapRef}
            style={{ height: "256px", width: "100%" }}
            className="rounded-md overflow-hidden border border-(--border-default) z-0"
        />
    );
}