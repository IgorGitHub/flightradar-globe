import React from 'react';
import { Search, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import useFlightStore from '../store/useFlightStore';

export default function SearchBar({ onRefresh }) {
const {
  searchQuery, setSearchQuery,
  filteredFlights, flights,
  autoRefresh, toggleAutoRefresh
} = useFlightStore();

return (
  <div className="fixed top-4 left-4 z-40 flex flex-col gap-3">
    <div className="glass rounded-2xl p-3 w-72">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl"> </span>
        <div>
          <h1 className="text-white font-bold text-sm">FlightRadar Globe</h1>
          <p className="text-gray-400 text-[10px]">Real-time global flight tracker</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search callsign, ICAO, country..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-white/5 border border-card-border rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-accent/50 transition-colors"
        />
      </div>
    </div>

    <div className="glass rounded-xl px-3 py-2 w-72 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse-dot" />
        <span className="text-gray-300 text-xs">
          <strong className="text-white">{filteredFlights.length.toLocaleString()}</strong>
          {searchQuery ? ` / ${flights.length.toLocaleString()}` : ''} flights
        </span>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={toggleAutoRefresh}
          className={`p-1.5 rounded-lg transition-colors ${autoRefresh ? 'text-accent hover:bg-accent/10' : 'text-gray-500 hover:bg-white/5'}`}
          title={autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
        >
          {autoRefresh ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
        </button>
        <button
          onClick={onRefresh}
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  </div>
);
}
