var airlines = {
AAL: { name: 'American Airlines', iata: 'AA' },
AAR: { name: 'Asiana Airlines', iata: 'OZ' },
ACA: { name: 'Air Canada', iata: 'AC' },
AFR: { name: 'Air France', iata: 'AF' },
AIC: { name: 'Air India', iata: 'AI' },
AMX: { name: 'Aeromexico', iata: 'AM' },
ANA: { name: 'All Nippon Airways', iata: 'NH' },
ASA: { name: 'Alaska Airlines', iata: 'AS' },
AUA: { name: 'Austrian Airlines', iata: 'OS' },
AZA: { name: 'ITA Airways', iata: 'AZ' },
BAW: { name: 'British Airways', iata: 'BA' },
BEL: { name: 'Brussels Airlines', iata: 'SN' },
CAL: { name: 'China Airlines', iata: 'CI' },
CCA: { name: 'Air China', iata: 'CA' },
CES: { name: 'China Eastern', iata: 'MU' },
CLH: { name: 'Lufthansa CityLine', iata: 'CL' },
CPA: { name: 'Cathay Pacific', iata: 'CX' },
CSN: { name: 'China Southern', iata: 'CZ' },
DAL: { name: 'Delta Air Lines', iata: 'DL' },
DLH: { name: 'Lufthansa', iata: 'LH' },
EIN: { name: 'Aer Lingus', iata: 'EI' },
EJU: { name: 'easyJet Europe', iata: 'EC' },
ELY: { name: 'El Al', iata: 'LY' },
ETD: { name: 'Etihad Airways', iata: 'EY' },
ETH: { name: 'Ethiopian', iata: 'ET' },
EVA: { name: 'EVA Air', iata: 'BR' },
EWG: { name: 'Eurowings', iata: 'EW' },
EZS: { name: 'easyJet Swiss', iata: 'DS' },
EZY: { name: 'easyJet', iata: 'U2' },
FIN: { name: 'Finnair', iata: 'AY' },
GIA: { name: 'Garuda Indonesia', iata: 'GA' },
IBE: { name: 'Iberia', iata: 'IB' },
ICE: { name: 'Icelandair', iata: 'FI' },
JAL: { name: 'Japan Airlines', iata: 'JL' },
JBU: { name: 'JetBlue', iata: 'B6' },
KAL: { name: 'Korean Air', iata: 'KE' },
KLM: { name: 'KLM', iata: 'KL' },
KQA: { name: 'Kenya Airways', iata: 'KQ' },
LAN: { name: 'LATAM', iata: 'LA' },
LOT: { name: 'LOT Polish', iata: 'LO' },
MAS: { name: 'Malaysia Airlines', iata: 'MH' },
MSR: { name: 'EgyptAir', iata: 'MS' },
NAX: { name: 'Norwegian', iata: 'DY' },
NKS: { name: 'Spirit Airlines', iata: 'NK' },
PAL: { name: 'Philippine Airlines', iata: 'PR' },
QFA: { name: 'Qantas', iata: 'QF' },
QTR: { name: 'Qatar Airways', iata: 'QR' },
RAM: { name: 'Royal Air Maroc', iata: 'AT' },
RJA: { name: 'Royal Jordanian', iata: 'RJ' },
RYR: { name: 'Ryanair', iata: 'FR' },
SAA: { name: 'South African', iata: 'SA' },
SAS: { name: 'SAS', iata: 'SK' },
SIA: { name: 'Singapore Airlines', iata: 'SQ' },
SKW: { name: 'SkyWest', iata: 'OO' },
SWA: { name: 'Southwest', iata: 'WN' },
SWR: { name: 'Swiss', iata: 'LX' },
TAP: { name: 'TAP Portugal', iata: 'TP' },
THA: { name: 'Thai Airways', iata: 'TG' },
THY: { name: 'Turkish Airlines', iata: 'TK' },
TOM: { name: 'TUI Airways', iata: 'BY' },
TVF: { name: 'Transavia France', iata: 'TO' },
UAE: { name: 'Emirates', iata: 'EK' },
UAL: { name: 'United Airlines', iata: 'UA' },
VIR: { name: 'Virgin Atlantic', iata: 'VS' },
VLG: { name: 'Vueling', iata: 'VY' },
VOZ: { name: 'Virgin Australia', iata: 'VA' },
WJA: { name: 'WestJet', iata: 'WS' },
WZZ: { name: 'Wizz Air', iata: 'W6' }
};

export function getAirline(callsign) {
if (!callsign || callsign === 'N/A') {
  return null;
}
var prefix = callsign
  .substring(0, 3)
  .toUpperCase();
return airlines[prefix] || null;
}

export function getAirlineLogo(callsign) {
var info = getAirline(callsign);
if (!info || !info.iata) return null;
return 'https://pics.avs.io/70/70/' +
  info.iata + '.png';
}

export default airlines;
