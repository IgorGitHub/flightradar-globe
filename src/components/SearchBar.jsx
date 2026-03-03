import React, { useState } from 'react';
import { Search, RefreshCw, Wifi, WifiOff, Filter, X } from 'lucide-react';
import useFlightStore from '../store/useFlightStore';

export default function SearchBar({ onRefresh }) {
var {
  searchQuery, setSearchQuery,
  filteredFlights, flights,
  autoRefresh, toggleAutoRefresh
} = useFlightStore();

var [showFilters, setShowFilters] = useState(false);
var [altMin, setAltMin] = useState('');
var [altMax, setAltMax] = useState('');
var [countryFilter, setCountryFilter] = useState('');

var displayed = filteredFlights.filter(function(f) {
  if (altMin && f.altitudeFt && f.altitudeFt < parseInt(altMin)) return false;
  if (altMax && f.altitudeFt && f.altitudeFt > parseInt(altMax)) return false;
  if (countryFilter && f.originCountry && f.originCountry.toLowerCase().indexOf(countryFilter.toLowerCase()) === -1) return false;
  return true;
});

var onGround = flights.filter(function(f) { return f.onGround; }).length;
var inAir = flights.length - onGround;

var countries = {};
flights.forEach(function(f) {
  if (f.originCountry) {
    countries[f.originCountry] = (countries[f.originCountry] || 0) + 1;
  }
});
var topCountries = Object.entries(countries)
  .sort(function(a, b) { return b[1] - a[1]; })
  .slice(0, 5);

return (
  <div className="fixed top-4 left-4 z-40 flex flex-col gap-3">
    <div className="glass rounded-2xl p-3 w-72">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">✈️</span>
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
          onChange={function(e) { setSearchQuery(e.target.value); }}
          className="w-full pl-9 pr-4 py-2 bg-white/5 border border-card-border rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-accent/50 transition-colors"
        />
      </div>
    </div>

    <div className="glass rounded-xl px-3 py-2 w-72 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse-dot" />
        <span className="text-gray-300 text-xs">
          <strong className="text-white">{flights.length.toLocaleString()}</strong> flights
        </span>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={function() { setShowFilters(!showFilters); }}
          className={'p-1.5 rounded-lg transition-colors ' + (showFilters ? 'text-accent bg-accent/10' : 'text-gray-400 hover:bg-white/5')}
        >
          <Filter className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={toggleAutoRefresh}
          className={'p-1.5 rounded-lg transition-colors ' + (autoRefresh ? 'text-accent hover:bg-accent/10' : 'text-gray-500 hover:bg-white/5')}
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

    {showFilters && (
      <div className="glass rounded-xl p-3 w-72">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white text-xs font-bold">Filters</span>
          <button onClick={function() { setAltMin(''); setAltMax(''); setCountryFilter(''); }} className="text-accent text-[10px]">Reset</button>
        </div>
        <div className="space-y-2">
          <div className="flex gap-2">
            <input type="number" placeholder="Min Alt (ft)" value={altMin} onChange={function(e) { setAltMin(e.target.value); }} className="w-1/2 px-2 py-1 bg-white/5 border border-card-border 
rounded-lg text-white text-xs placeholder-gray-500 focus:outline-none" />
            <input type="number" placeholder="Max Alt (ft)" value={altMax} onChange={function(e) { setAltMax(e.target.value); }} className="w-1/2 px-2 py-1 bg-white/5 border border-card-border 
rounded-lg text-white text-xs placeholder-gray-500 focus:outline-none" />
          </div>
          <input type="text" placeholder="Filter by country..." value={countryFilter} onChange={function(e) { setCountryFilter(e.target.value); }} className="w-full px-2 py-1 bg-white/5 border 
border-card-border rounded-lg text-white text-xs placeholder-gray-500 focus:outline-none" />
        </div>
      </div>
    )}

    <div className="glass rounded-xl p-3 w-72">
      <span className="text-white text-xs font-bold">Live Stats</span>
      <div className="grid grid-cols-2 gap-2 mt-2">
        <div className="bg-white/5 rounded-lg p-2 text-center">
          <p className="text-accent text-sm font-bold">{inAir.toLocaleString()}</p>
          <p className="text-gray-500 text-[10px]">In Air</p>
        </div>
        <div className="bg-white/5 rounded-lg p-2 text-center">
          <p className="text-yellow-400 text-sm font-bold">{onGround.toLocaleString()}</p>
          <p className="text-gray-500 text-[10px]">On Ground</p>
        </div>
      </div>
      <div className="mt-2">
        <p className="text-gray-500 text-[10px] mb-1">Top Countries</p>
        {topCountries.map(function(item) {
          return (
            <div key={item[0]} className="flex items-center justify-between py-0.5">
              <span className="text-gray-300 text-[10px]">{item[0]}</span>
              <span className="text-white text-[10px] font-bold">{item[1]}</span>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);
}
