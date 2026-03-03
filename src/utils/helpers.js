export function formatAltitude(meters) {
if (meters === null || meters === undefined) return 'N/A';
const feet = Math.round(meters * 3.28084);
return `${feet.toLocaleString()} ft`;
}

export function formatSpeed(ms) {
if (ms === null || ms === undefined) return 'N/A';
return `${Math.round(ms * 1.94384)} kts`;
}

export function formatVerticalRate(ms) {
if (ms === null || ms === undefined) return 'N/A';
const fpm = Math.round(ms * 196.85);
const arrow = fpm > 100 ? '↑' : fpm < -100 ? '↓' : '→';
return `${arrow} ${Math.abs(fpm).toLocaleString()} fpm`;
}

export function getAltitudeColor(meters) {
if (meters === null || meters === undefined) return '#666666';
const maxAlt = 13000;
const ratio = Math.min(Math.max(meters / maxAlt, 0), 1);

const r = Math.round(ratio * 255);
const g = Math.round((1 - Math.abs(ratio - 0.5) * 2) * 255);
const b = Math.round((1 - ratio) * 255);
return `rgb(${r},${g},${b})`;
}

export function timeSince(unixTimestamp) {
if (!unixTimestamp) return 'N/A';
const seconds = Math.floor(Date.now() / 1000 - unixTimestamp);
if (seconds < 5) return 'just now';
if (seconds < 60) return `${seconds}s ago`;
if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
return `${Math.floor(seconds / 3600)}h ago`;
}
