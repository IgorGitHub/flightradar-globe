var airlines = {
AAL: { name: 'American Airlines', iata: 'AA', domain: 'aa.com' },
AAR: { name: 'Asiana Airlines', iata: 'OZ', domain: 'flyasiana.com' },
ACA: { name: 'Air Canada', iata: 'AC', domain: 'aircanada.com' },
AFR: { name: 'Air France', iata: 'AF', domain: 'airfrance.com' },
AIC: { name: 'Air India', iata: 'AI', domain: 'airindia.com' },
AMX: { name: 'Aeromexico', iata: 'AM', domain: 'aeromexico.com' },
ANA: { name: 'All Nippon Airways', iata: 'NH', domain: 'ana.co.jp' },
ASA: { name: 'Alaska Airlines', iata: 'AS', domain: 'alaskaair.com' },
AUA: { name: 'Austrian Airlines', iata: 'OS', domain: 'austrian.com' },
AZA: { name: 'ITA Airways', iata: 'AZ', domain: 'ita-airways.com' },
BAW: { name: 'British Airways', iata: 'BA', domain: 'britishairways.com' },
BEL: { name: 'Brussels Airlines', iata: 'SN', domain: 'brusselsairlines.com' },
CAL: { name: 'China Airlines', iata: 'CI', domain: 'china-airlines.com' },
CCA: { name: 'Air China', iata: 'CA', domain: 'airchina.com' },
CES: { name: 'China Eastern', iata: 'MU', domain: 'ceair.com' },
CPA: { name: 'Cathay Pacific', iata: 'CX', domain: 'cathaypacific.com' },
CSN: { name: 'China Southern', iata: 'CZ', domain: 'csair.com' },
DAL: { name: 'Delta Air Lines', iata: 'DL', domain: 'delta.com' },
DLH: { name: 'Lufthansa', iata: 'LH', domain: 'lufthansa.com' },
EIN: { name: 'Aer Lingus', iata: 'EI', domain: 'aerlingus.com' },
EJU: { name: 'easyJet Europe', iata: 'EC', domain: 'easyjet.com' },
ELY: { name: 'El Al', iata: 'LY', domain: 'elal.com' },
ETD: { name: 'Etihad Airways', iata: 'EY', domain: 'etihad.com' },
ETH: { name: 'Ethiopian Airlines', iata: 'ET', domain: 'ethiopianairlines.com' },
EVA: { name: 'EVA Air', iata: 'BR', domain: 'evaair.com' },
EWG: { name: 'Eurowings', iata: 'EW', domain: 'eurowings.com' },
EZY: { name: 'easyJet', iata: 'U2', domain: 'easyjet.com' },
FIN: { name: 'Finnair', iata: 'AY', domain: 'finnair.com' },
GIA: { name: 'Garuda Indonesia', iata: 'GA', domain: 'garuda-indonesia.com' },
IBE: { name: 'Iberia', iata: 'IB', domain: 'iberia.com' },
ICE: { name: 'Icelandair', iata: 'FI', domain: 'icelandair.com' },
JAL: { name: 'Japan Airlines', iata: 'JL', domain: 'jal.com' },
JBU: { name: 'JetBlue', iata: 'B6', domain: 'jetblue.com' },
KAL: { name: 'Korean Air', iata: 'KE', domain: 'koreanair.com' },
KLM: { name: 'KLM', iata: 'KL', domain: 'klm.com' },
KQA: { name: 'Kenya Airways', iata: 'KQ', domain: 'kenya-airways.com' },
LAN: { name: 'LATAM', iata: 'LA', domain: 'latamairlines.com' },
LOT: { name: 'LOT Polish', iata: 'LO', domain: 'lot.com' },
MAS: { name: 'Malaysia Airlines', iata: 'MH', domain: 'malaysiaairlines.com' },
MSR: { name: 'EgyptAir', iata: 'MS', domain: 'egyptair.com' },
NAX: { name: 'Norwegian', iata: 'DY', domain: 'norwegian.com' },
NKS: { name: 'Spirit Airlines', iata: 'NK', domain: 'spirit.com' },
PAL: { name: 'Philippine Airlines', iata: 'PR', domain: 'philippineairlines.com' },
QFA: { name: 'Qantas', iata: 'QF', domain: 'qantas.com' },
QTR: { name: 'Qatar Airways', iata: 'QR', domain: 'qatarairways.com' },
RAM: { name: 'Royal Air Maroc', iata: 'AT', domain: 'royalairmaroc.com' },
RJA: { name: 'Royal Jordanian', iata: 'RJ', domain: 'rj.com' },
RYR: { name: 'Ryanair', iata: 'FR', domain: 'ryanair.com' },
SAA: { name: 'South African Airways', iata: 'SA', domain: 'flysaa.com' },
SAS: { name: 'SAS', iata: 'SK', domain: 'flysas.com' },
SIA: { name: 'Singapore Airlines', iata: 'SQ', domain: 'singaporeair.com' },
SKW: { name: 'SkyWest', iata: 'OO', domain: 'skywest.com' },
SWA: { name: 'Southwest', iata: 'WN', domain: 'southwest.com' },
SWR: { name: 'Swiss', iata: 'LX', domain: 'swiss.com' },
TAP: { name: 'TAP Portugal', iata: 'TP', domain: 'flytap.com' },
THA: { name: 'Thai Airways', iata: 'TG', domain: 'thaiairways.com' },
THY: { name: 'Turkish Airlines', iata: 'TK', domain: 'turkishairlines.com' },
TOM: { name: 'TUI Airways', iata: 'BY', domain: 'tui.co.uk' },
UAE: { name: 'Emirates', iata: 'EK', domain: 'emirates.com' },
UAL: { name: 'United Airlines', iata: 'UA', domain: 'united.com' },
VIR: { name: 'Virgin Atlantic', iata: 'VS', domain: 'virginatlantic.com' },
VLG: { name: 'Vueling', iata: 'VY', domain: 'vueling.com' },
VOZ: { name: 'Virgin Australia', iata: 'VA', domain: 'virginaustralia.com' },
WJA: { name: 'WestJet', iata: 'WS', domain: 'westjet.com' },
WZZ: { name: 'Wizz Air', iata: 'W6', domain: 'wizzair.com' }
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
if (!info || !info.domain) return null;
return 'https://logo.clearbit.com/' +
  info.domain;
}

export default airlines;
