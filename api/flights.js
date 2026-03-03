const OPENSKY_URL = 'https://opensky-network.org/api/states/all';

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

  let url = OPENSKY_URL;
  const { lamin, lomin, lamax, lomax } = req.query;
  if (lamin && lomin && lamax && lomax) {
    url += `?lamin=${lamin}&lomin=${lomin}&lamax=${lamax}&lomax=${lomax}`;
  }

  const headers = { 'Accept': 'application/json' };
  if (process.env.OPENSKY_USERNAME && process.env.OPENSKY_PASSWORD) {
    const creds = Buffer.from(
      `${process.env.OPENSKY_USERNAME}:${process.env.OPENSKY_PASSWORD}`
    ).toString('base64');
    headers['Authorization'] = `Basic ${creds}`;
  }

  const response = await fetch(url, {
    headers,
    signal: AbortSignal.timeout(15000)
  });

  if (!response.ok) {
    throw new Error(`OpenSky responded ${response.status}`);
  }

  const raw = await response.json();
  const result = transformFlights(raw);

  cache = { data: result, timestamp: now };

  res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=30');
  return res.status(200).json(result);

} catch (error) {
  console.error('Flight API error:', error.message);

  if (cache.data) {
    return res.status(200).json({
      ...cache.data,
      stale: true,
      error: 'Using cached data'
    });
  }

  return res.status(502).json({
    error: 'Failed to fetch flight data',
    message: error.message
  });
}
}

function transformFlights(data) {
if (!data || !data.states) {
  return { time: data?.time || null, count: 0, flights: [] };
}

const flights = data.states
  .filter(s => s[5] !== null && s[6] !== null)
  .map(s => ({
    icao24:        s[0],
    callsign:      (s[1] || '').trim() || 'N/A',
    originCountry: s[2],
    timePosition:  s[3],
    lastContact:   s[4],
    longitude:     s[5],
    latitude:      s[6],
    baroAltitude:  s[7],
    onGround:      s[8],
    velocity:      s[9],
    trueTrack:     s[10],
    verticalRate:  s[11],
    geoAltitude:   s[13],
    squawk:        s[14],
    spi:           s[15],
    positionSource: s[16],
    altitudeFt:    s[7] ? Math.round(s[7] * 3.28084) : null,
    speedKnots:    s[9] ? Math.round(s[9] * 1.94384) : null,
    speedKmh:      s[9] ? Math.round(s[9] * 3.6) : null,
  }));

return {
  time: data.time,
  count: flights.length,
  flights
};
}
