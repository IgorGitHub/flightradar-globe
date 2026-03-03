import React, { useState } from 'react';
import {
X, Plane, ArrowUp, ArrowDown,
Gauge, Compass, Radio,
MapPin, Navigation, Info
} from 'lucide-react';
import useFlightStore from '../store/useFlightStore';
import {
formatAltitude, formatSpeed,
formatVerticalRate, timeSince
} from '../utils/helpers';
import {
getAirline, getAirlineLogo
} from '../utils/airlines';

export default function FlightCard() {
var store = useFlightStore();
var f = store.selectedFlight;
var clear = store.clearSelectedFlight;
var [imgErr, setImgErr] = useState(false);

if (!f) return null;

var airline = getAirline(f.callsign);
var logoUrl = getAirlineLogo(f.callsign);
var isUp = f.verticalRate > 1;
var isDown = f.verticalRate < -1;
var hdg = f.trueTrack
  ? Math.round(f.trueTrack)
  : null;

return (
  <div className={
    'fixed top-4 right-4 w-[340px] z-40 ' +
    'rounded-2xl overflow-hidden ' +
    'animate-slide-in ' +
    'max-h-[92vh] overflow-y-auto ' +
    'bg-[#0c1829] border border-[#1a2d4a]'
  }>

    <div className={
      'relative p-5 pb-4 ' +
      'bg-gradient-to-b from-[#122040] to-[#0c1829]'
    }>
      <button
        onClick={clear}
        className={
          'absolute top-4 right-4 w-8 h-8 ' +
          'rounded-full bg-white/10 ' +
          'hover:bg-white/20 flex items-center ' +
          'justify-center transition-colors'
        }
      >
        <X className="w-4 h-4 text-white/60" />
      </button>

      <div className="flex items-center gap-4">
        {logoUrl && !imgErr ? (
          <img
            src={logoUrl}
            alt={airline ? airline.name : ''}
            className={
              'w-14 h-14 rounded-xl ' +
              'object-contain bg-white/10 p-1'
            }
            onError={function() {
              setImgErr(true);
            }}
          />
        ) : (
          <div className={
            'w-14 h-14 rounded-xl ' +
            'bg-accent/20 flex items-center ' +
            'justify-center'
          }>
            <Plane className={
              'w-7 h-7 text-accent'
            } />
          </div>
        )}
        <div>
          {airline && (
            <p className={
              'text-white/50 text-xs mb-0.5'
            }>
              {airline.name}
            </p>
          )}
          <h2 className={
            'text-white font-bold text-2xl ' +
            'tracking-wide leading-tight'
          }>
            {f.callsign || 'N/A'}
          </h2>
          <p className={
            'text-white/30 text-[11px] ' +
            'font-mono mt-0.5'
          }>
            {f.icao24.toUpperCase()}
            {airline ? ' \u00B7 IATA: ' +
              airline.iata : ''}
          </p>
        </div>
      </div>
    </div>

    <div className="px-5 pt-3 pb-2">
      <div className={
        'flex items-center justify-between ' +
        'mb-4'
      }>
        <div className="flex items-center gap-2">
          <div className={
            'w-2 h-2 rounded-full ' +
            (f.onGround
              ? 'bg-yellow-400'
              : 'bg-green-400') +
            ' animate-pulse-dot'
          } />
          <span className={
            'text-sm font-medium ' +
            (f.onGround
              ? 'text-yellow-400'
              : 'text-green-400')
          }>
            {f.onGround
              ? 'On Ground'
              : 'In Flight'}
          </span>
        </div>
        <span className={
          'text-white/30 text-xs'
        }>
          {timeSince(f.lastContact)}
        </span>
      </div>

      {(f.type || f.registration) && (
        <div className={
          'flex items-center gap-3 ' +
          'bg-white/5 rounded-xl p-3 mb-4'
        }>
          <div className={
            'w-10 h-10 rounded-lg ' +
            'bg-accent/10 flex items-center ' +
            'justify-center'
          }>
            <Info className={
              'w-5 h-5 text-accent'
            } />
          </div>
          <div>
            {f.type && (
              <p className={
                'text-white font-bold text-sm'
              }>
                {f.type}
              </p>
            )}
            {f.registration && (
              <p className={
                'text-white/40 text-xs font-mono'
              }>
                {f.registration}
              </p>
            )}
          </div>
          <div className="ml-auto text-right">
            <p className={
              'text-white/40 text-[10px] ' +
              'uppercase'
            }>
              Country
            </p>
            <p className={
              'text-white text-sm font-medium'
            }>
              {f.originCountry}
            </p>
          </div>
        </div>
      )}

      <div className={
        'grid grid-cols-3 gap-2 mb-4'
      }>
        <div className={
          'bg-white/5 rounded-xl p-3 ' +
          'text-center'
        }>
          <p className={
            'text-white/30 text-[10px] ' +
            'uppercase mb-1'
          }>
            Altitude
          </p>
          <p className={
            'text-white font-bold text-base'
          }>
            {f.altitudeFt
              ? f.altitudeFt.toLocaleString()
              : '0'}
          </p>
          <p className={
            'text-white/30 text-[10px]'
          }>ft</p>
        </div>
        <div className={
          'bg-white/5 rounded-xl p-3 ' +
          'text-center'
        }>
          <p className={
            'text-white/30 text-[10px] ' +
            'uppercase mb-1'
          }>
            Speed
          </p>
          <p className={
            'text-white font-bold text-base'
          }>
            {f.speedKnots || 'N/A'}
          </p>
          <p className={
            'text-white/30 text-[10px]'
          }>kts</p>
        </div>
        <div className={
          'bg-white/5 rounded-xl p-3 ' +
          'text-center'
        }>
          <p className={
            'text-white/30 text-[10px] ' +
            'uppercase mb-1'
          }>
            Heading
          </p>
          <p className={
            'text-white font-bold text-base'
          }>
            {hdg !== null
              ? hdg + '\u00B0'
              : 'N/A'}
          </p>
          <p className={
            'text-white/30 text-[10px]'
          }>
            {hdg !== null ? (
              hdg >= 337 || hdg < 23 ? 'N' :
              hdg < 68 ? 'NE' :
              hdg < 113 ? 'E' :
              hdg < 158 ? 'SE' :
              hdg < 203 ? 'S' :
              hdg < 248 ? 'SW' :
              hdg < 293 ? 'W' : 'NW'
            ) : ''}
          </p>
        </div>
      </div>

      <div className={
        'grid grid-cols-2 gap-2 mb-4'
      }>
        <div className={
          'bg-white/5 rounded-xl p-3'
        }>
          <div className={
            'flex items-center gap-1.5 mb-1'
          }>
            {isUp
              ? <ArrowUp className={
                  'w-3.5 h-3.5 text-green-400'
                } />
              : isDown
                ? <ArrowDown className={
                    'w-3.5 h-3.5 text-orange-400'
                  } />
                : <Navigation className={
                    'w-3.5 h-3.5 text-white/30'
                  } />
            }
            <span className={
              'text-white/30 text-[10px] ' +
              'uppercase'
            }>
              Vertical Speed
            </span>
          </div>
          <p className={
            'text-white font-semibold text-sm'
          }>
            {formatVerticalRate(f.verticalRate)}
          </p>
        </div>
        <div className={
          'bg-white/5 rounded-xl p-3'
        }>
          <div className={
            'flex items-center gap-1.5 mb-1'
          }>
            <Radio className={
              'w-3.5 h-3.5 text-white/30'
            } />
            <span className={
              'text-white/30 text-[10px] ' +
              'uppercase'
            }>
              Squawk
            </span>
          </div>
          <p className={
            'text-white font-semibold text-sm'
          }>
            {f.squawk || 'N/A'}
          </p>
        </div>
      </div>

      <div className={
        'border-t border-white/5 pt-3 pb-2'
      }>
        <div className={
          'flex items-center ' +
          'justify-center gap-1.5'
        }>
          <MapPin className={
            'w-3 h-3 text-white/20'
          } />
          <p className={
            'text-[11px] text-white/20 ' +
            'font-mono'
          }>
            {f.latitude
              ? f.latitude.toFixed(4)
              : '?'}
            {'\u00B0N  '}
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
