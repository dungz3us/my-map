import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import './Map.css';
// import places from '../data/hanoi-parks.json';
import pin from '../assets/icon/pin.png';
import { isAuthenticated } from '../utils/auth';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const Map = () => {
    const mapContainerRef = useRef(null);
    const [data, setData] = useState([]);
    const [lng, setLng] = useState(105.853333);
    const [lat, setLat] = useState(21.028333);
    const [zoom, setZoom] = useState(12);
    const navigate = useNavigate();
  // Fetch GeoJSON data from Flask API when the component mounts
  useEffect(() => {
    fetch("/get_geojson_data")
        .then((response) => response.json())
        .then((fetchedData) => {
            setData(fetchedData);
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
    }, []);
  
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
    // Add the control to the map.
    map.addControl(new MapboxGeocoder({ accessToken: mapboxgl.accessToken, mapboxgl: mapboxgl}), 'top-left');

    map.on('move', () => {
      setLng(map.getCenter().lng.toFixed(4));
      setLat(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(2));
    });

    // Add layer
    map.on('load', function () {
        map.addSource('places', {
            'type': 'geojson',
            'data': {
              'type': 'FeatureCollection',
              'features': data // Use the fetched data here
              }
            });
            
        map.loadImage(pin, (error, image) => {
            if (error) throw error;
            map.addImage('pin', image);
            // Add a layer showing the places.
            map.addLayer({
                'id': 'places',
                'type': 'symbol',
                'source': 'places',
                'layout': {
                    'icon-image': 'pin',
                    'icon-allow-overlap': true,
                    'icon-size': 0.6
                }
              });
            }
          );
        // When a click event occurs on a feature in the places layer, open a popup at the
        // location of the feature, with description HTML from its properties.
        map.on('click', 'places', (e) => {
            // Copy coordinates array.
            const coordinates = e.features[0].geometry.coordinates.slice();
            const imageUrl = e.features[0].properties.image;
            const titles = e.features[0].properties.title;
            const description = e.features[0].properties.description;
            
            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }
        
            new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML('<h3>' + titles + '</h3><p>' + description + '</p><img src="' + imageUrl + '" alt="' + titles + '" style="width: 100%;">')
                .addTo(map);
        });
        
        // Change the cursor to a pointer when the mouse is over the places layer.
        map.on('mouseenter', 'places', () => {
            map.getCanvas().style.cursor = 'pointer';
        });
        
        // Change it back to a pointer when it leaves.
        map.on('mouseleave', 'places', () => {
            map.getCanvas().style.cursor = '';
        });
    });
    // Clean up on unmount
    return () => map.remove();
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAdminAccess = () => {
    if (isAuthenticated()) {
      navigate('/admin/location');
    } else {
      navigate('/login');
    }
  };

  return (
    <div>
      <header className='map-header'>
        <div className="logo">Hệ thống thông tin địa lý (GIS)</div>
        <div className="admin-login">
          <button onClick={handleAdminAccess}>Admin</button>
        </div>
      </header>
      <div className='sidebarStyle'>
        <div>
          {/* Longitude: {lng} | Latitude: {lat} | Zoom: {zoom} */}
          Longitude: {lng} | Latitude: {lat} 
        </div>
      </div>
      <div className='map-container' ref={mapContainerRef} />
    </div>
  );
};

export default Map;