import React, { useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom pin
const pinIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -26],
});

function MapClickCatcher({ onMapPick }) {
  useMapEvents({
    click(e) {
      if (onMapPick) onMapPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

function FitToReports({ reports }) {
  const map = useMap();
  useEffect(() => {
    if (!reports || reports.length === 0) return;
    const points = reports
      .filter(r => r?.location?.lat != null && r?.location?.lng != null)
      .map(r => [r.location.lat, r.location.lng]);

    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0], Math.max(map.getZoom(), 14));
    } else {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [reports, map]);
  return null;
}

function FlyAndOpen({ selectedReportId, reports, markerRefs }) {
  const map = useMap();
  useEffect(() => {
    if (!selectedReportId) return;
    const r = reports.find(x => x._id === selectedReportId);
    const lat = r?.location?.lat;
    const lng = r?.location?.lng;
    if (lat == null || lng == null) return;

    map.flyTo([lat, lng], 16, { duration: 0.7 });

    // open popup shortly after flying (ensure marker is mounted)
    const ref = markerRefs.current[selectedReportId];
    const t = setTimeout(() => {
      if (ref?.current) {
        ref.current.openPopup();
      }
    }, 750);
    return () => clearTimeout(t);
  }, [selectedReportId, reports, map, markerRefs]);

  return null;
}

export default function MapTemp({ reports = [], onMapPick, newPin, selectedReportId }) {
  const markerRefs = useRef({});

  const defaultCenter = useMemo(() => {
    const first = reports.find(r => r?.location?.lat != null && r?.location?.lng != null);
    return first ? [first.location.lat, first.location.lng] : [28.6139, 77.2090]; // Delhi fallback
  }, [reports]);

  return (
    <MapContainer
      center={defaultCenter}
      zoom={13}
      style={{ height: "100%", width: "100%", borderRadius: "0.5rem", overflow: "hidden" }}
      scrollWheelZoom
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      <MapClickCatcher onMapPick={onMapPick} />
      <FitToReports reports={reports} />
      <FlyAndOpen selectedReportId={selectedReportId} reports={reports} markerRefs={markerRefs} />

      {/* Existing report markers */}
      {reports.map((r) => {
        const lat = r?.location?.lat;
        const lng = r?.location?.lng;
        if (lat == null || lng == null) return null;

        if (!markerRefs.current[r._id]) {
          markerRefs.current[r._id] = React.createRef();
        }

        return (
          <Marker
            key={r._id}
            position={[lat, lng]}
            icon={pinIcon}
            ref={markerRefs.current[r._id]}
          >
            <Popup>
              <div style={{ minWidth: 220 }}>
                <div className="font-bold">{r.title || "Report"}</div>
                <div className="text-sm mb-1"><strong>Status:</strong> {r.status || "Pending"}</div>
                <div className="text-sm mb-2">{r.description}</div>
                {r.imageUrl && (
                  <img
                    src={`http://localhost:5000${r.imageUrl}`}
                    alt="Report"
                    style={{ width: "100%", maxHeight: 160, objectFit: "cover", borderRadius: 6 }}
                  />
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}

      {/* Temporary pin for new report (from map click / form lat-lng) */}
      {newPin && newPin.lat != null && newPin.lng != null && (
        <Marker position={[newPin.lat, newPin.lng]} icon={pinIcon}>
          <Popup>
            New report here: {newPin.lat.toFixed(6)}, {newPin.lng.toFixed(6)}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}