// src/pages/ReportForm.jsx
import React, { useState } from "react";

export default function ReportForm() {
  const [formData, setFormData] = useState({
    status: "",
    description: "",
    city: "",
    street: "",
    latitude: "",
    longitude: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:5000/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    setFormData({
      status: "",
      description: "",
      city: "",
      street: "",
      latitude: "",
      longitude: "",
    });

    alert("Report submitted successfully!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Status */}
      <div>
        <label className="block text-sm mb-1">Status</label>
        <input
          type="text"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:border-gray-500"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:border-gray-500"
        />
      </div>

      {/* City & Street */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm mb-1">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:border-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Street</label>
          <input
            type="text"
            name="street"
            value={formData.street}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:border-gray-500"
          />
        </div>
      </div>

      {/* Latitude & Longitude */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm mb-1">Latitude (optional)</label>
          <input
            type="number"
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
            step="any"
            className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:border-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Longitude (optional)</label>
          <input
            type="number"
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
            step="any"
            className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:border-gray-500"
          />
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-gray-700 hover:bg-gray-600 py-2 rounded-lg"
      >
        Submit Report
      </button>
    </form>
  );
}