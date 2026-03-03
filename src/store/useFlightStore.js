import { create } from 'zustand';

const useFlightStore = create((set, get) => ({
flights: [],
filteredFlights: [],
selectedFlight: null,
isLoading: true,
error: null,
lastUpdated: null,
searchQuery: '',
autoRefresh: true,

setFlights: (flights) => {
  const query = get().searchQuery.toLowerCase();
  set({
    flights,
    filteredFlights: query
      ? flights.filter(f =>
          f.callsign.toLowerCase().includes(query) ||
          f.icao24.toLowerCase().includes(query) ||
          f.originCountry.toLowerCase().includes(query)
        )
      : flights,
    isLoading: false,
    error: null,
    lastUpdated: new Date()
  });
},

setSelectedFlight: (flight) => set({ selectedFlight: flight }),
clearSelectedFlight: () => set({ selectedFlight: null }),

setSearchQuery: (query) => {
  const flights = get().flights;
  set({
    searchQuery: query,
    filteredFlights: query
      ? flights.filter(f =>
          f.callsign.toLowerCase().includes(query.toLowerCase()) ||
          f.icao24.toLowerCase().includes(query.toLowerCase()) ||
          f.originCountry.toLowerCase().includes(query.toLowerCase())
        )
      : flights
  });
},

setError: (error) => set({ error, isLoading: false }),
setLoading: (isLoading) => set({ isLoading }),
toggleAutoRefresh: () => set(s => ({ autoRefresh: !s.autoRefresh }))
}));

export default useFlightStore;
