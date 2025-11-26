import React from "react";

const ReportList = ({ reports }) => {
  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow h-96 overflow-y-auto">
      <h2 className="text-xl font-bold mb-2">Live Reports</h2>
      <ul className="space-y-2">
        {reports.map((report, index) => (
          <li
            key={index}
            className="p-2 bg-gray-800 rounded hover:bg-gray-700 transition"
          >
            <p><strong>Type:</strong> {report.type}</p>
            <p><strong>Status:</strong> {report.status}</p>
            <p><strong>Location:</strong> {report.location}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReportList;