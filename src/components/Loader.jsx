import React from 'react';

export default function Loader() {
return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-globe-bg">
    <div className="text-center">
      <div className="relative w-24 h-24 mx-auto mb-6">
        <div className="absolute inset-0 border-2 border-accent/20 rounded-full" />
        <div className="absolute inset-0 border-2 border-transparent border-t-accent rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-4xl"> </div>
      </div>
      <h2 className="text-xl font-semibold text-white mb-2">Loading Flights</h2>
      <p className="text-gray-400 text-sm">Fetching live data from OpenSky Network...</p>
    </div>
  </div>
);
}
