import React, { useRef, useEffect, useMemo, useCallback, useState } from 'react';
import GlobeGL from 'react-globe.gl';
import useFlightStore from '../store/useFlightStore';
import { getAltitudeColor } from '../utils/helpers';

var planePath = 'M12 2L8 10H3L5 13L3 22L12 18L21 22L19 13L21 10H16L12 2Z';

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

var createMarker = useCallback(function(d) {
  var el = document.createElement('div');
  var isSelected = selectedFlight && d.icao24 === selectedFlight.icao24;
  var color = isSelected ? '#ffffff' : getAltitudeColor(d.baroAltitude);
  var size = isSelected ? 14 : 8;
  var rotation = d.trueTrack || 0;

  var svgNS = 'http://www.w3.org/2000/svg';
  var svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('width', String(size));
  svg.setAttribute('height', String(size));
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', color);
  svg.style.transform = 'rotate(' + rotation + 'deg)';
  svg.style.filter = 'drop-shadow(0 0 2px rgba(0,0,0,0.5))';

  var path = document.createElementNS(svgNS, 'path');
  path.setAttribute('d', planePath);
  svg.appendChild(path);

  el.appendChild(svg);
  el.style.cursor = 'pointer';
  el.style.transition = 'transform 0.3s';

  return el;
}, [selectedFlight]);

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

    htmlElementsData={pointsData}
    htmlLat="latitude"
    htmlLng="longitude"
    htmlAltitude={function(d) { return d.onGround ? 0.001 : Math.min((d.baroAltitude || 0) / 800000, 0.06); }}
    htmlElement={createMarker}
    onHtmlElementClick={handleClick}
    htmlTransitionDuration={0}

    waitForGlobeReady={true}
    animateIn={true}
  />
);
}
