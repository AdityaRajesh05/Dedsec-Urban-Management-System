// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [form, setForm] = useState({
    issueType: "",
    description: "",
    location: "",
    latitude: "",
    longitude: "",
    image: null,
  });

  // Custom marker icon
  const markerIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/252/252025.png",
    iconSize: [30, 30],
  });

  // Fetch reports
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/reports");
        setReports(res.data);
      } catch (err) {
        console.error("Error fetching reports:", err);
      }
    };
    fetchReports();
    const interval = setInterval(fetchReports, 10000);
    return () => clearInterval(interval);
  }, []);

  // Handle form change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      await axios.post("http://localhost:5000/api/reports", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setForm({
        issueType: "",
        description: "",
        location: "",
        latitude: "",
        longitude: "",
        image: null,
      });
    } catch (err) {
      console.error("Error submitting report:", err);
    }
  };

  // Component for selecting map location
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setForm({
          ...form,
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
        });
      },
    });
    return null;
  };

  return (
    <div className="h-screen w-screen flex flex-col">
      {/* Top Title Bar */}
      <div className="bg-black text-white text-center py-3 border-b-2 border-gray-700">
        <h1 className="text-2xl font-bold mb-4 text-left">Dedsec Dashboard</h1>
      </div>

      {/* Main Content (Map + Sidebar) */}
      <div className="flex flex-1">
        {/* Map */}
        <div className="flex-1">
          <MapContainer
            center={[28.6139, 77.209]}
            zoom={12}
            className="h-full w-full"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {reports.map((report) => (
              <Marker
                key={report._id}
                position={[
                  report.coordinates.latitude,
                  report.coordinates.longitude,
                ]}
                icon={markerIcon}
              >
                <Popup>
                  <b>{report.issueType}</b>
                  <br />
                  {report.description}
                  <br />
                  <i>Status: {report.status}</i>
                </Popup>
              </Marker>
            ))}
            <LocationMarker />
          </MapContainer>
        </div>

        {/* Right Sidebar */}
        <div className="w-96 bg-black text-white flex flex-col">
          {/* New Report Form */}
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-lg font-bold mb-3">New Report</h2>
            <form onSubmit={handleSubmit} className="space-y-2">
              <input
                type="text"
                name="issueType"
                placeholder="Issue Type"
                value={form.issueType}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-800"
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-800"
                required
              />
              <input
                type="text"
                name="location"
                placeholder="Street/Area Name (optional)"
                value={form.location}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-800"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  name="latitude"
                  placeholder="Latitude"
                  value={form.latitude}
                  onChange={handleChange}
                  className="w-1/2 p-2 rounded bg-gray-800"
                  readOnly
                />
                <input
                  type="text"
                  name="longitude"
                  placeholder="Longitude"
                  value={form.longitude}
                  onChange={handleChange}
                  className="w-1/2 p-2 rounded bg-gray-800"
                  readOnly
                />
              </div>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="w-full p-2 bg-gray-800"
              />
              <button
                type="submit"
                className="w-full bg-green-600 p-2 rounded font-bold hover:bg-green-700"
              >
                Submit Report
              </button>
            </form>
            <p className="text-xs text-gray-400 mt-2">
              📍 Click on the map to select location.
            </p>
          </div>

          {/* Live Reports */}
          <div className="flex-1 p-4 overflow-y-auto">
            <h2 className="text-lg font-bold mb-3">Live Reports</h2>
            {reports.length === 0 ? (
              <p>No reports yet.</p>
            ) : (
              reports.map((report) => (
                <div
                  key={report._id}
                  className="mb-3 p-3 bg-gray-800 rounded-lg shadow"
                >
                  <p>
                    <b>Type:</b> {report.issueType}
                  </p>
                  <p>
                    <b>Description:</b> {report.description}
                  </p>
                  <p>
                    <b>Status:</b> {report.status}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(report.timestamp).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;