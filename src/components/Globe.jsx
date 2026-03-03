import React, { useRef, useEffect, useMemo, useCallback, useState } from 'react';
import GlobeGL from 'react-globe.gl';
import useFlightStore from '../store/useFlightStore';
import { getAltitudeColor } from '../utils/helpers';

function makeLabel(d) {
var s = '<div style="background:rgba(13,27,42,0.95);';
s += 'backdrop-filter:blur(8px);';
s += 'border:1px solid rgba(0,212,255,0.3);';
s += 'border-radius:8px;';
s += 'padding:8px 12px;';
s += 'font-family:monospace;';
s += 'font-size:11px;color:white;">';
s += '<div style="font-weight:bold;';
s += 'font-size:13px;color:#00d4ff;';
s += 'margin-bottom:4px;">';
s += d.callsign + '</div>';
s += '<div style="color:#aaa;">';
s += d.originCountry;
if (d.type) s += ' · ' + d.type;
s += '</div>';
s += '<div style="margin-top:4px;">';
if (d.altitudeFt) {
  s += d.altitudeFt.toLocaleString() + ' ft';
} else {
  s += 'Ground';
}
if (d.speedKnots) {
  s += ' · ' + d.speedKnots + ' kts';
}
s += '</div></div>';
return s;
}

export default function GlobeView() {
var globeRef = useRef();
var store = useFlightStore();
var filteredFlights = store.filteredFlights;
var setSelectedFlight = store.setSelectedFlight;
var selectedFlight = store.selectedFlight;
var [dimensions, setDimensions] = useState({
  width: window.innerWidth,
  height: window.innerHeight
});

useEffect(function() {
  var handleResize = function() {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });
  };
  window.addEventListener('resize', handleResize);
  return function() {
    window.removeEventListener('resize', handleResize);
  };
}, []);

useEffect(function() {
  var globe = globeRef.current;
  if (!globe) return;
  var c = globe.controls();
  c.autoRotate = true;
  c.autoRotateSpeed = 0.3;
  c.enableDamping = true;
  c.dampingFactor = 0.1;
  c.minDistance = 120;
  c.maxDistance = 500;
  globe.pointOfView({
    lat: 30, lng: 10, altitude: 2.5
  });
}, []);

useEffect(function() {
  var globe = globeRef.current;
  if (!globe) return;
  var stop = function() {
    globe.controls().autoRotate = false;
  };
  var el = globe.renderer().domElement;
  el.addEventListener('mousedown', stop);
  el.addEventListener('touchstart', stop);
  return function() {
    el.removeEventListener('mousedown', stop);
    el.removeEventListener('touchstart', stop);
  };
}, []);

useEffect(function() {
  if (selectedFlight && globeRef.current) {
    globeRef.current.pointOfView({
      lat: selectedFlight.latitude,
      lng: selectedFlight.longitude,
      altitude: 1.0
    }, 1000);
  }
}, [selectedFlight]);

var handleClick = useCallback(function(point) {
  setSelectedFlight(point);
}, [setSelectedFlight]);

var pointsData = useMemo(function() {
  return filteredFlights;
}, [filteredFlights]);

var getAlt = function(d) {
  if (d.onGround) return 0.001;
  var alt = d.baroAltitude || 0;
  return Math.min(alt / 800000, 0.06);
};

var getColor = function(d) {
  if (selectedFlight) {
    if (d.icao24 === selectedFlight.icao24) {
      return '#ffffff';
    }
  }
  return getAltitudeColor(d.baroAltitude);
};

return (
  <GlobeGL
    ref={globeRef}
    width={dimensions.width}
    height={dimensions.height}
    globeImageUrl={'//unpkg.com/three-globe' +
      '/example/img/earth-blue-marble.jpg'}
    bumpImageUrl={'//unpkg.com/three-globe' +
      '/example/img/earth-topology.png'}
    backgroundImageUrl={'//unpkg.com/three-globe' +
      '/example/img/night-sky.png'}
    atmosphereColor="#00d4ff"
    atmosphereAltitude={0.15}
    pointsData={pointsData}
    pointLat="latitude"
    pointLng="longitude"
    pointAltitude={getAlt}
    pointRadius={0.18}
    pointColor={getColor}
    pointsMerge={true}
    onPointClick={handleClick}
    pointLabel={makeLabel}
    waitForGlobeReady={true}
    animateIn={true}
  />
);
}
