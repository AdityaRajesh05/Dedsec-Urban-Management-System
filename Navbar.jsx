import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 shadow flex justify-between items-center">
      <h1 className="text-xl font-bold">Dedsec Dashboard</h1>
      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/";
        }}
        className="bg-white text-black px-4 py-2 rounded hover:bg-gray-300 transition"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;