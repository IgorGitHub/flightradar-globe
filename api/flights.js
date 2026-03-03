import fetch from 'node-fetch';

var REGIONS = [
'51.5/0.0/250',
'48.8/2.3/250',
'40.7/-74.0/250',
'33.9/-118.2/250',
'35.7/139.7/250',
'25.3/55.3/250',
'1.3/103.8/250',
'-33.9/151.2/250',
'55.7/37.6/250',
'41.9/12.5/250',
'19.4/-99.1/250',
'-23.5/-46.6/250',
'25.0/121.5/250',
'37.5/127.0/250',
'28.6/77.2/250'
];

var BASE = 'https://api.adsb.lol/v2/point/';

let cache = { data: null, timestamp: 0 };

export default async function handler(req, res) {
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET');

if (req.method === 'OPTIONS') {
  return res.status(200).end();
}

try {
  var now = Date.now();
  if (cache.data && now - cache.timestamp < 15000) {
    return res.status(200).json(cache.data);
  }

  var promises = REGIONS.map(function(r) {
    return fetch(BASE + r, {
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
      var id = a.hex || (a.lat + ',' + a.lon);
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
