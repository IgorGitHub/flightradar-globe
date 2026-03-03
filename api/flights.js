import fetch from 'node-fetch';

var REGIONS = [
'51.5/-0.1/250',
'48.8/2.3/250',
'50.0/8.5/250',
'41.9/12.5/250',
'40.5/-3.6/250',
'59.6/17.9/250',
'55.7/12.6/250',
'52.3/4.8/250',
'47.4/8.5/250',
'38.0/23.7/250',
'41.3/28.9/250',
'55.7/37.6/250',
'50.4/30.5/250',
'40.7/-74.0/250',
'42.4/-71.0/250',
'33.9/-84.4/250',
'41.9/-87.6/250',
'29.8/-95.3/250',
'33.4/-112.0/250',
'33.9/-118.2/250',
'37.6/-122.4/250',
'47.4/-122.3/250',
'25.8/-80.2/250',
'45.5/-73.6/250',
'43.7/-79.4/250',
'49.2/-123.2/250',
'19.4/-99.1/250',
'-23.5/-46.6/250',
'-34.6/-58.4/250',
'4.7/-74.1/250',
'25.3/55.3/250',
'25.1/51.1/250',
'24.4/54.6/250',
'21.3/39.8/250',
'28.6/77.2/250',
'19.1/72.9/250',
'13.1/80.2/250',
'35.7/139.7/250',
'34.4/135.2/250',
'37.5/127.0/250',
'25.0/121.5/250',
'22.3/114.2/250',
'31.2/121.5/250',
'39.9/116.4/250',
'1.3/103.8/250',
'13.7/100.5/250',
'3.1/101.7/250',
'-6.2/106.8/250',
'-33.9/151.2/250',
'-37.8/144.9/250',
'-36.8/174.8/250',
'-26.1/28.2/250',
'30.0/31.2/250',
'33.9/35.5/250',
'32.0/34.8/250',
'6.5/3.4/250',
'-1.3/36.8/250',
'64.1/-21.9/250',
'60.3/25.0/250'
];

var regCountry = {
'A': 'United States',
'B': 'China',
'C': 'Canada',
'D': 'Germany',
'E': 'Spain',
'F': 'France',
'G': 'United Kingdom',
'H': 'Hungary',
'I': 'Italy',
'J': 'Japan',
'L': 'Luxembourg',
'M': 'Isle of Man',
'N': 'United States',
'O': 'Austria',
'P': 'Brazil',
'R': 'Russia',
'S': 'Sweden',
'T': 'Turkey',
'U': 'Australia',
'V': 'India',
'Z': 'New Zealand',
'AP': 'Pakistan',
'A4O': 'Oman',
'A5': 'Bhutan',
'A6': 'UAE',
'A7': 'Qatar',
'A9C': 'Bahrain',
'B': 'China',
'CC': 'Chile',
'CN': 'Morocco',
'CS': 'Portugal',
'CU': 'Cuba',
'D2': 'Angola',
'EC': 'Spain',
'EI': 'Ireland',
'EP': 'Iran',
'ET': 'Ethiopia',
'EW': 'Belarus',
'EX': 'Kyrgyzstan',
'HA': 'Hungary',
'HB': 'Switzerland',
'HC': 'Somalia',
'HI': 'Dominican Rep',
'HK': 'Colombia',
'HL': 'South Korea',
'HP': 'Panama',
'HR': 'Rwanda',
'HS': 'Thailand',
'HZ': 'Saudi Arabia',
'JA': 'Japan',
'JY': 'Jordan',
'LN': 'Norway',
'LV': 'Argentina',
'LX': 'Luxembourg',
'LY': 'Lithuania',
'LZ': 'Bulgaria',
'OB': 'Peru',
'OD': 'Lebanon',
'OE': 'Austria',
'OH': 'Finland',
'OK': 'Czech Rep',
'OM': 'Slovakia',
'OO': 'Belgium',
'OY': 'Denmark',
'PH': 'Netherlands',
'PK': 'Indonesia',
'PP': 'Brazil',
'PR': 'Brazil',
'PT': 'Brazil',
'RA': 'Russia',
'RP': 'Philippines',
'SE': 'Sweden',
'SP': 'Poland',
'SU': 'Egypt',
'SX': 'Greece',
'TC': 'Turkey',
'TF': 'Iceland',
'TG': 'Guatemala',
'TI': 'Costa Rica',
'TR': 'Gabon',
'TS': 'Tunisia',
'UK': 'Uzbekistan',
'UR': 'Ukraine',
'VH': 'Australia',
'VN': 'Vietnam',
'VP': 'UK Overseas',
'VT': 'India',
'XA': 'Mexico',
'XB': 'Mexico',
'XC': 'Mexico',
'YI': 'Iraq',
'YR': 'Romania',
'YU': 'Serbia',
'ZK': 'New Zealand',
'ZS': 'South Africa',
'2': 'UK Overseas',
'3B': 'Mauritius',
'4K': 'Azerbaijan',
'4L': 'Georgia',
'4O': 'Montenegro',
'4R': 'Sri Lanka',
'4X': 'Israel',
'5A': 'Libya',
'5B': 'Cyprus',
'5H': 'Tanzania',
'5N': 'Nigeria',
'5R': 'Madagascar',
'5Y': 'Kenya',
'6V': 'Senegal',
'7O': 'Yemen',
'7T': 'Algeria',
'8P': 'Barbados',
'9A': 'Croatia',
'9G': 'Ghana',
'9H': 'Malta',
'9K': 'Kuwait',
'9M': 'Malaysia',
'9N': 'Nepal',
'9V': 'Singapore',
'9XR': 'Rwanda',
'9Y': 'Trinidad'
};

function getCountryFromReg(reg) {
if (!reg) return 'Unknown';
for (var i = 3; i >= 1; i--) {
  var prefix = reg.substring(0, i).toUpperCase();
  if (regCountry[prefix]) {
    return regCountry[prefix];
  }
}
return 'Unknown';
}

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

      var reg = a.r || '';
      var country = getCountryFromReg(reg);

      allFlights.push({
        icao24: a.hex || 'unknown',
        callsign: a.flight
          ? a.flight.trim()
          : 'N/A',
        originCountry: country,
        registration: reg,
        latitude: a.lat,
        longitude: a.lon,
        baroAltitude: a.alt_baro === 'ground'
          ? 0
          : (a.alt_baro || 0) * 0.3048,
        onGround: a.alt_baro === 'ground',
        velocity: a.gs
          ? a.gs * 0.514444
          : null,
        trueTrack: a.track || null,
        verticalRate: a.baro_rate
          ? a.baro_rate * 0.00508
          : null,
        geoAltitude: a.alt_geom
          ? a.alt_geom * 0.3048
          : null,
        squawk: a.squawk || null,
        altitudeFt: a.alt_baro === 'ground'
          ? 0
          : (a.alt_baro || null),
        speedKnots: a.gs
          ? Math.round(a.gs)
          : null,
        speedKmh: a.gs
          ? Math.round(a.gs * 1.852)
          : null,
        type: a.t || null,
        lastContact: Math.floor(
          Date.now() / 1000
        )
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
