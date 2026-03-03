import React, {
useRef,
useEffect,
useMemo,
useCallback,
useState
} from 'react';
import GlobeGL from 'react-globe.gl';
import useFlightStore from '../store/useFlightStore';
import { getAltitudeColor } from '../utils/helpers';

function makeLabel(d) {
var s = '<div style="';
s += 'background:rgba(13,27,42,0.95);';
s += 'backdrop-filter:blur(8px);';
s += 'border:1px solid rgba(0,212,255,0.3);';
s += 'border-radius:8px;';
s += 'padding:8px 12px;';
s += 'font-family:monospace;';
s += 'font-size:11px;';
s += 'color:white;">';
s += '<div style="font-weight:bold;';
s += 'font-size:13px;color:#00d4ff;';
s += 'margin-bottom:4px;">';
s += d.callsign + '</div>';
s += '<div style="color:#aaa;">';
s += d.originCountry;
if (d.type) s += ' \u00B7 ' + d.type;
s += '</div>';
s += '<div style="margin-top:4px;">';
if (d.altitudeFt) {
  s += d.altitudeFt.toLocaleString() + ' ft';
} else {
  s += 'Ground';
}
if (d.speedKnots) {
  s += ' \u00B7 ' + d.speedKnots + ' kts';
}
s += '</div></div>';
return s;
}

function estimateTrail(flight) {
if (!flight || !flight.latitude) return [];
var heading = flight.trueTrack || 0;
var speed = flight.velocity || 250;
var rad = heading * Math.PI / 180;
var trails = [];
var kmPerDeg = 111;
for (var i = 1; i <= 8; i++) {
  var dist = speed * i * 60 / 1000;
  var dlat = -Math.cos(rad) * dist / kmPerDeg;
  var dlon = -Math.sin(rad) * dist;
  var latR = flight.latitude * Math.PI / 180;
  dlon = dlon / (kmPerDeg * Math.cos(latR));
  trails.push({
    lat: flight.latitude + dlat,
    lng: flight.longitude + dlon
  });
}
return trails;
}

export default function GlobeView() {
var globeRef = useRef();
var store = useFlightStore();
var filteredFlights = store.filteredFlights;
var setSelectedFlight = store.setSelectedFlight;
var selectedFlight = store.selectedFlight;
var [dims, setDims] = useState({
  w: window.innerWidth,
  h: window.innerHeight
});

useEffect(function() {
  var onResize = function() {
    setDims({
      w: window.innerWidth,
      h: window.innerHeight
    });
  };
  window.addEventListener('resize', onResize);
  return function() {
    window.removeEventListener('resize', onResize);
  };
}, []);

useEffect(function() {
  var g = globeRef.current;
  if (!g) return;
  var c = g.controls();
  c.autoRotate = true;
  c.autoRotateSpeed = 0.3;
  c.enableDamping = true;
  c.dampingFactor = 0.1;
  c.minDistance = 120;
  c.maxDistance = 500;
  g.pointOfView({
    lat: 30, lng: 10, altitude: 2.5
  });
}, []);

useEffect(function() {
  var g = globeRef.current;
  if (!g) return;
  var stop = function() {
    g.controls().autoRotate = false;
  };
  var el = g.renderer().domElement;
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

var handleClick = useCallback(function(p) {
  setSelectedFlight(p);
}, [setSelectedFlight]);

var points = useMemo(function() {
  return filteredFlights;
}, [filteredFlights]);

var arcsData = useMemo(function() {
  if (!selectedFlight) return [];
  var trail = estimateTrail(selectedFlight);
  if (trail.length < 2) return [];
  var arcs = [];
  var last = trail[trail.length - 1];
  arcs.push({
    startLat: last.lat,
    startLng: last.lng,
    endLat: selectedFlight.latitude,
    endLng: selectedFlight.longitude,
    color: ['rgba(0,212,255,0.1)', 'rgba(0,212,255,0.8)']
  });
  arcs.push({
    startLat: selectedFlight.latitude,
    startLng: selectedFlight.longitude,
    endLat: selectedFlight.latitude +
      Math.cos((selectedFlight.trueTrack || 0) *
      Math.PI / 180) * 3,
    endLng: selectedFlight.longitude +
      Math.sin((selectedFlight.trueTrack || 0) *
      Math.PI / 180) * 3 /
      Math.cos(selectedFlight.latitude *
      Math.PI / 180),
    color: ['rgba(0,212,255,0.8)', 'rgba(0,212,255,0.1)']
  });
  return arcs;
}, [selectedFlight]);

var getAlt = function(d) {
  if (d.onGround) return 0.001;
  var a = d.baroAltitude || 0;
  return Math.min(a / 800000, 0.06);
};

var getColor = function(d) {
  if (selectedFlight) {
    if (d.icao24 === selectedFlight.icao24) {
      return '#ffffff';
    }
  }
  return getAltitudeColor(d.baroAltitude);
};

var getRadius = function(d) {
  if (selectedFlight) {
    if (d.icao24 === selectedFlight.icao24) {
      return 0.4;
    }
  }
  return 0.18;
};

return (
  <GlobeGL
    ref={globeRef}
    width={dims.w}
    height={dims.h}
    globeImageUrl={
      '//unpkg.com/three-globe' +
      '/example/img/earth-blue-marble.jpg'
    }
    bumpImageUrl={
      '//unpkg.com/three-globe' +
      '/example/img/earth-topology.png'
    }
    backgroundImageUrl={
      '//unpkg.com/three-globe' +
      '/example/img/night-sky.png'
    }
    atmosphereColor="#00d4ff"
    atmosphereAltitude={0.15}
    pointsData={points}
    pointLat="latitude"
    pointLng="longitude"
    pointAltitude={getAlt}
    pointRadius={getRadius}
    pointColor={getColor}
    pointsMerge={false}
    onPointClick={handleClick}
    pointLabel={makeLabel}
    arcsData={arcsData}
    arcStartLat="startLat"
    arcStartLng="startLng"
    arcEndLat="endLat"
    arcEndLng="endLng"
    arcColor="color"
    arcDashLength={0.5}
    arcDashGap={0.2}
    arcDashAnimateTime={1500}
    arcStroke={0.8}
    waitForGlobeReady={true}
    animateIn={true}
  />
);
}
