import React, {
useRef,
useEffect,
useMemo,
useCallback,
useState
} from 'react';
import GlobeGL from 'react-globe.gl';
import * as THREE from 'three';
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
  c.minDistance = 101;
  c.maxDistance = 500;
  c.rotateSpeed = 0.5;
  c.zoomSpeed = 1.2;

  var renderer = g.renderer();
  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
  );

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
      altitude: 0.4
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
  var f = selectedFlight;
  var heading = (f.trueTrack || 0) * Math.PI / 180;
  var cosLat = Math.cos(f.latitude * Math.PI / 180);
  var arcs = [];
  arcs.push({
    startLat: f.latitude -
      Math.cos(heading) * 3,
    startLng: f.longitude -
      Math.sin(heading) * 3 / cosLat,
    endLat: f.latitude,
    endLng: f.longitude,
    color: [
      'rgba(0,212,255,0.05)',
      'rgba(0,212,255,0.8)'
    ]
  });
  arcs.push({
    startLat: f.latitude,
    startLng: f.longitude,
    endLat: f.latitude +
      Math.cos(heading) * 3,
    endLng: f.longitude +
      Math.sin(heading) * 3 / cosLat,
    color: [
      'rgba(0,212,255,0.8)',
      'rgba(0,212,255,0.05)'
    ]
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
      '//unpkg.com/three-globe@2.31.2' +
      '/example/img/earth-blue-marble.jpg'
    }
    bumpImageUrl={
      '//unpkg.com/three-globe@2.31.2' +
      '/example/img/earth-topology.png'
    }
    backgroundImageUrl={
      '//unpkg.com/three-globe@2.31.2' +
      '/example/img/night-sky.png'
    }
    showAtmosphere={true}
    atmosphereColor="#00d4ff"
    atmosphereAltitude={0.15}
    showGraticules={true}
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
