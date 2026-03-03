import React from 'react';
import {
X, Plane, ArrowUp, ArrowDown,
Gauge, Navigation, Radio,
Globe2, Info, MapPin
} from 'lucide-react';
import useFlightStore from '../store/useFlightStore';
import {
formatAltitude, formatSpeed,
formatVerticalRate, timeSince
} from '../utils/helpers';

function DataItem(props) {
return (
  <div className="bg-white/5 rounded-lg p-2.5">
    <div className="flex items-center gap-1.5 mb-1">
      <span className="text-accent">{props.icon}</span>
      <span className="text-[10px] text-gray-500 uppercase tracking-wider">
        {props.label}
      </span>
    </div>
    <p className="text-white text-sm font-semibold">
      {props.value}
    </p>
  </div>
);
}

export default function FlightCard() {
var store = useFlightStore();
var f = store.selectedFlight;
var clearSelectedFlight = store.clearSelectedFlight;

if (!f) return null;

var isClimbing = f.verticalRate > 1;
var isDescending = f.verticalRate < -1;
var headingDeg = f.trueTrack
  ? Math.round(f.trueTrack) + '\u00B0'
  : 'N/A';
var headingStyle = {
  transform: 'rotate(' + (f.trueTrack || 0) + 'deg)'
};

return (
  <div className={
    'fixed top-4 right-4 w-80 z-40 glass ' +
    'rounded-2xl shadow-2xl shadow-black/50 ' +
    'overflow-hidden animate-slide-in ' +
    'max-h-[90vh] overflow-y-auto'
  }>
    <div className={
      'bg-gradient-to-r from-accent/20 ' +
      'to-transparent p-4 border-b border-card-border'
    }>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={
            'w-10 h-10 rounded-xl bg-accent/20 ' +
            'flex items-center justify-center'
          }>
            <Plane className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className={
              'text-white font-bold text-lg tracking-wide'
            }>
              {f.callsign || 'N/A'}
            </h3>
            <p className={
              'text-gray-400 text-xs font-mono'
            }>
              {f.icao24.toUpperCase()}
            </p>
          </div>
        </div>
        <button
          onClick={clearSelectedFlight}
          className={
            'w-8 h-8 rounded-lg bg-white/5 ' +
            'hover:bg-white/10 flex items-center ' +
            'justify-center transition-colors'
          }
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </div>

    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <div className={
          'w-2 h-2 rounded-full animate-pulse-dot ' +
          (f.onGround ? 'bg-yellow-400' : 'bg-green-400')
        } />
        <span className="text-xs text-gray-300">
          {f.onGround ? 'On Ground' : 'In Flight'}
        </span>
        <span className="text-xs text-gray-500 ml-auto">
          Updated {timeSince(f.lastContact)}
        </span>
      </div>

      {(f.type || f.registration) && (
        <div className={
          'flex items-center gap-2 ' +
          'bg-accent/10 rounded-lg px-3 py-2'
        }>
          <Info className="w-3.5 h-3.5 text-accent" />
          <div className="flex-1">
            {f.type && (
              <span className={
                'text-accent text-xs font-medium'
              }>
                {f.type}
              </span>
            )}
            {f.registration && (
              <span className={
                'text-gray-400 text-xs ml-2'
              }>
                {f.registration}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <DataItem
          icon={<Globe2 className="w-3.5 h-3.5" />}
          label="Country"
          value={f.originCountry}
        />
        <DataItem
          icon={
            isClimbing
              ? <ArrowUp className="w-3.5 h-3.5" />
              : isDescending
                ? <ArrowDown className="w-3.5 h-3.5" />
                : <Navigation className="w-3.5 h-3.5" />
          }
          label="Altitude"
          value={formatAltitude(f.baroAltitude)}
        />
        <DataItem
          icon={<Gauge className="w-3.5 h-3.5" />}
          label="Speed"
          value={formatSpeed(f.velocity)}
        />
        <DataItem
          icon={
            <ArrowUp
              className="w-3.5 h-3.5"
              style={headingStyle}
            />
          }
          label="Heading"
          value={headingDeg}
        />
        <DataItem
          icon={<ArrowUp className="w-3.5 h-3.5" />}
          label="V/S"
          value={formatVerticalRate(f.verticalRate)}
        />
        <DataItem
          icon={<Radio className="w-3.5 h-3.5" />}
          label="Squawk"
          value={f.squawk || 'N/A'}
        />
      </div>

      <div className={
        'mt-3 pt-3 border-t border-card-border'
      }>
        <div className={
          'flex items-center justify-center gap-1'
        }>
          <MapPin className={
            'w-3 h-3 text-gray-500'
          } />
          <p className={
            'text-[10px] text-gray-500 font-mono'
          }>
            {f.latitude
              ? f.latitude.toFixed(4)
              : '?'}
            {'\u00B0N, '}
            {f.longitude
              ? f.longitude.toFixed(4)
              : '?'}
            {'\u00B0E'}
          </p>
        </div>
      </div>
    </div>
  </div>
);
}
