import fetch from 'node-fetch';

const API_URL = 'https://api.adsb.lol/v2/ladd/lat/45.0/lon/0.0/dist/5000';

let cache = { data: null, timestamp: 0 };
const CACHE_TTL = 10000;

export default async function handler(req, res) {
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET');

if (req.method === 'OPTIONS') {
  return res.status(200).end();
}

try {
  const now = Date.now();
  if (cache.data && now - cache.timestamp < CACHE_TTL) {
    return res.status(200).json(cache.data);
  }

  const response = await fetch(API_URL, {
    headers: { 'Accept': 'application/json' }
  });

  if (!response.ok) {
    throw new Error('API responded ' + response.status);
  }

  const raw = await response.json();
  const result = transformFlights(raw);

  cache = { data: result, timestamp: now };

  return res.status(200).json(result);

} catch (error) {
  console.error('Flight API error:', error.message);

  if (cache.data) {
    return res.status(200).json(cache.data);
  }

  return res.status(502).json({
    error: 'Failed to fetch flight data',
    message: error.message
  });
}
}

function transformFlights(data) {
if (!data || !data.ac) {
  return { time: null, count: 0, flights: [] };
}

var flights = data.ac
  .filter(function(a) { return a.lat && a.lon; })
  .map(function(a) {
    return {
      icao24: a.hex || 'unknown',
      callsign: a.flight ? a.flight.trim() : 'N/A',
      originCountry: a.r || 'Unknown',
      latitude: a.lat,
      longitude: a.lon,
      baroAltitude: a.alt_baro === 'ground' ? 0 : (a.alt_baro || 0) * 0.3048,
      onGround: a.alt_baro === 'ground',
      velocity: a.gs ? a.gs * 0.514444 : null,
      trueTrack: a.track || null,
      verticalRate: a.baro_rate ? a.baro_rate * 0.00508 : null,
      geoAltitude: a.alt_geom ? a.alt_geom * 0.3048 : null,
      squawk: a.squawk || null,
      altitudeFt: a.alt_baro === 'ground' ? 0 : (a.alt_baro || null),
      speedKnots: a.gs ? Math.round(a.gs) : null,
      speedKmh: a.gs ? Math.round(a.gs * 1.852) : null,
      type: a.t || null,
      registration: a.r || null,
      lastContact: Math.floor(Date.now() / 1000)
    };
  });

return {
  time: Math.floor(Date.now() / 1000),
  count: flights.length,
  flights: flights
};
}
