import React from 'react';
import { getAltitudeColor } from '../utils/helpers';

export default function Legend() {
var bands = [
  { label: '40,000+', alt: 12200 },
  { label: '30,000', alt: 9100 },
  { label: '20,000', alt: 6100 },
  { label: '10,000', alt: 3050 },
  { label: '5,000', alt: 1500 },
  { label: 'Ground', alt: 0 }
];

return (
  <div className={
    'fixed bottom-16 right-4 z-40 glass ' +
    'rounded-xl p-3'
  }>
    <p className={
      'text-[10px] text-gray-400 ' +
      'uppercase tracking-wider mb-2'
    }>
      Altitude (ft)
    </p>
    <div className="space-y-1">
      {bands.map(function(b) {
        return (
          <div
            key={b.label}
            className="flex items-center gap-2"
          >
            <div
              className="w-3 h-3 rounded-sm"
              style={{
                backgroundColor:
                  getAltitudeColor(b.alt)
              }}
            />
            <span className={
              'text-[10px] text-gray-300'
            }>
              {b.label}
            </span>
          </div>
        );
      })}
    </div>
  </div>
);
}
