import fetch from 'node-fetch';

var REGIONS = [
{ lat: 50, lon: 10, dist: 250 },
{ lat: 40, lon: -100, dist: 250 },
{ lat: 35, lon: 140, dist: 250 },
{ lat: 25, lon: 80, dist: 250 },
{ lat: 0, lon: 30, dist: 250 },
{ lat: -25, lon: 135, dist: 250 },
{ lat: 55, lon: -5, dist: 250 },
{ lat: 30, lon: -90, dist: 250 },
{ lat: 45, lon: -75, dist: 250 },
{ lat: 60, lon: 25, dist: 250 },
{ lat: 25, lon: 55, dist: 250 },
{ lat: 1, lon: 104, dist: 250 },
{ lat: 35, lon: -5, dist: 250 },
{ lat: -35, lon: -60, dist: 250 },
{ lat: 15, lon: -90, dist: 250 }
];

var BASE_URL = 'https://api.adsb.lol/v2/point';

let cache = { data: null, timestamp: 0 };
var CACHE_TTL = 15000;

export default async function handler(req, res) {
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET');

if (req.method === 'OPTIONS') {
  return res.status(200).end();
}

try {
  var now = Date.now();
  if (cache.data && now - cache.timestamp < CACHE_TTL) {
    return res.status(200).json(cache.data);
  }

  var promises = REGIONS.map(function(r) {
    var url = BASE_URL + '/' + r.lat + '/' + r.lon + '/' + r.dist;
    return fetch(url, {
      headers: { 'Accept': 'application/json' }
    })
    .then(function(resp) {
      if (!resp.ok) return { ac: [] };
      return resp.json();
    })
    .catch(function() {
      return { ac: [] };
    });
  });

  var results = await Promise.all(promises);

  var seen = {};
  var allFlights = [];

  results.forEach(function(data) {
    if (!data || !data.ac) return;
    data.ac.forEach(function(a) {
      if (!a.lat || !a.lon) return;
      var id = a.hex || a.flight || (a.lat + ',' + a.lon);
      if (seen[id]) return;
      seen[id] = true;

      allFlights.push({
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
      });
    });
  });

  var result = {
    time: Math.floor(Date.now() / 1000),
    count: allFlights.length,
    flights: allFlights,
    source: 'adsb.lol'
  };

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
