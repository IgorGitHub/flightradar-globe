import React from 'react';
import GlobeView from './components/Globe';
import FlightCard from './components/FlightCard';
import SearchBar from './components/SearchBar';
import Loader from './components/Loader';
import Legend from './components/Legend';
import { useFlights } from './hooks/useFlights';
import useFlightStore from './store/useFlightStore';

export default function App() {
var { refetch } = useFlights();
var isLoading = useFlightStore(
  function(s) { return s.isLoading; }
);
var error = useFlightStore(
  function(s) { return s.error; }
);
var count = useFlightStore(
  function(s) { return s.flights.length; }
);

return (
  <div className={
    'w-screen h-screen overflow-hidden bg-globe-bg'
  }>
    {isLoading && count === 0 && <Loader />}

    {error && (
      <div className={
        'fixed bottom-4 left-1/2 ' +
        '-translate-x-1/2 z-50 glass ' +
        'rounded-xl px-4 py-2 ' +
        'text-red-400 text-sm'
      }>
        {error}
      </div>
    )}

    <GlobeView />
    <SearchBar onRefresh={refetch} />
    <FlightCard />
    <Legend />

    <div className={
      'fixed bottom-4 left-4 z-40 glass ' +
      'rounded-lg px-3 py-1.5'
    }>
      <p className="text-[10px] text-gray-500">
        Data: adsb.lol | Updates every 15s
      </p>
    </div>
  </div>
);
}
