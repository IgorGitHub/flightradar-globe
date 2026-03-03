import React, { useRef, useEffect, useMemo, useCallback, useState } from 'react';
import GlobeGL from 'react-globe.gl';
import useFlightStore from '../store/useFlightStore';
import { getAltitudeColor } from '../utils/helpers';

export default function GlobeView() {
var globeRef = useRef();
var { filteredFlights, setSelectedFlight, selectedFlight } = useFlightStore();
var [dimensions, setDimensions] = useState({
  width: window.innerWidth,
  height: window.innerHeight
});

useEffect(function() {
  var handleResize = function() {
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
  };
  window.addEventListener('resize', handleResize);
  return function() { window.removeEventListener('resize', handleResize); };
}, []);

useEffect(function() {
  var globe = globeRef.current;
  if (!globe) return;

  var controls = globe.controls();
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.3;
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
  controls.minDistance = 120;
  controls.maxDistance = 500;

  globe.pointOfView({ lat: 30, lng: 10, altitude: 2.5 });
}, []);

useEffect(function() {
  var globe = globeRef.current;
  if (!globe) return;

  var stop = function() { globe.controls().autoRotate = false; };
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
    globeRef.current.pointOfView(
      { lat: selectedFlight.latitude, lng: selectedFlight.longitude, altitude: 1.0 },
      1000
    );
  }
}, [selectedFlight]);

var handleClick = useCallback(function(point) {
  setSelectedFlight(point);
}, [setSelectedFlight]);

var pointsData = useMemo(function() { return filteredFlights; }, [filteredFlights]);

return (
  <GlobeGL
    ref={globeRef}
    width={dimensions.width}
    height={dimensions.height}

    globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
    bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
    backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
    atmosphereColor="#00d4ff"
    atmosphereAltitude={0.15}

    pointsData={pointsData}
    pointLat="latitude"
    pointLng="longitude"
    pointAltitude={function(d) { return d.onGround ? 0.001 : Math.min((d.baroAltitude || 0) / 800000, 0.06); }}
    pointRadius={0.18}
    pointColor={function(d) {
      if (selectedFlight && d.icao24 === selectedFlight.icao24) return '#ffffff';
      return getAltitudeColor(d.baroAltitude);
    }}
    pointsMerge={true}
    onPointClick={handleClick}
    pointLabel={function(d) {
      return '<div style="background:rgba(13,27,42,0.95);backdrop-filter:blur(8px);border:1px solid rgba(0,212,255,0.3);border-radius:8px;padding:8px 
12px;font-family:monospace;font-size:11px;color:white;">'
        + '<div style="font-weight:bold;font-size:13px;color:#00d4ff;margin-bottom:4px;">' + d.callsign + '</div>'
        + '<div style="color:#aaa;">' + d.originCountry + (d.type ? ' · ' + d.type : '') + '</div>'
        + '<div style="margin-top:4px;">'
        + (d.altitudeFt ? d.altitudeFt.toLocaleString() + ' ft' : 'Ground')
        + ' · ' + (d.speedKnots ? d.speedKnots + ' kts' : '')
        + '</div></div>';
    }}

    waitForGlobeReady={true}
    animateIn={true}
  />
);
}
