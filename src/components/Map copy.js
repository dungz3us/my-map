import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import './Map.css';
import geojson from '../data/hanoi-parks.json';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const Map = () => {
  const mapContainerRef = useRef(null);

const [lng, setLng] = useState(105.853333);
const [lat, setLat] = useState(21.028333);
const [zoom, setZoom] = useState(12);

  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom
    });

    // Add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.on('move', () => {
      setLng(map.getCenter().lng.toFixed(4));
      setLat(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(2));
    });

    // Create default markers
    geojson.features.map((feature) =>
      new mapboxgl.Marker().setLngLat(feature.geometry.coordinates).addTo(map)
    );
    // custom markers from image
    // map.on("load", function () {
    //     // Add an image to use as a custom marker
    //     map.loadImage(
    //       "../assets/icon/pin.png",
    //       function (error, image) {
    //         if (error) throw error;
    //         map.addImage("pin", image);
    //         // Add a GeoJSON source with multiple points
    //         map.addSource("points", {
    //           type: "geojson",
    //           data: {
    //             type: "FeatureCollection",
    //             features: geojson.features,
    //           },
    //         })
    //     }
    //     );
    //   });
    // Clean up on unmount
    return () => map.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <div className='sidebarStyle'>
        <div>
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
      </div>
      <div className='map-container' ref={mapContainerRef} />
    </div>
  );
};

export default Map;