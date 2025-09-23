import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAP_TOKEN;

const LocateService = ({handleSOS}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const userMarker = useRef(null);
  const [userCoords, setUserCoords] = useState(null);
  const servicesFetched = useRef(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const coords = [longitude, latitude];

        if (accuracy <= 50) {
          setUserCoords(coords);
        }

        if (!map.current) {
          map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v11",
            center: coords,
            zoom: 14,
          });

          map.current.addControl(new mapboxgl.NavigationControl());

          map.current.on("load", () => {
            setMapLoaded(true);
          });
        }

        if (map.current && coords) {
          map.current.flyTo({ center: coords, essential: true });
        }

        if (mapLoaded) {
          if (userMarker.current) {
            userMarker.current.setLngLat(coords);
          } else {
            const el = document.createElement("div");
            el.className = "marker marker-user";
            el.innerHTML = "U";
            userMarker.current = new mapboxgl.Marker(el)
              .setLngLat(coords)
              .addTo(map.current);
          }
        }

        if (mapLoaded && !servicesFetched.current) {
          const types = ["hospital", "police", "fire_station"];
          types.forEach((type) => fetchNearby(type, coords));
          servicesFetched.current = true;
        }
      },
      (err) => console.error(err),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [mapLoaded]);

  const fetchNearby = async (type, [lng, lat]) => {
    const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${type}.json?proximity=${lng},${lat}&access_token=${mapboxgl.accessToken}&limit=5`;
    const res = await fetch(endpoint);
    const data = await res.json();

    data.features.forEach((place) => {
      const el = document.createElement("div");
      el.className = `marker marker-${type}`;
      el.innerHTML = type === "hospital" ? "H" : type === "police" ? "P" : "F";

      const marker = new mapboxgl.Marker(el)
        .setLngLat(place.geometry.coordinates)
        .setPopup(new mapboxgl.Popup().setText(place.place_name))
        .addTo(map.current);

      marker.getElement().addEventListener("click", () => {
        if (userCoords) {
          getRoute(userCoords, place.geometry.coordinates);
        }
      });
    });
  };

  const getRoute = async (start, end) => {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data.routes || !data.routes.length) return;

    const route = data.routes[0].geometry;

    if (map.current.getSource("route")) {
      map.current.getSource("route").setData({
        type: "Feature",
        properties: {},
        geometry: route,
      });
    } else {
      map.current.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: route,
        },
      });

      map.current.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#ff0000", "line-width": 4 },
      });
    }

    const bounds = new mapboxgl.LngLatBounds();
    route.coordinates.forEach((c) => bounds.extend(c));
    map.current.fitBounds(bounds, { padding: 50 });
  };

  return (
    <div className="col-10 offset-1 mt-4 d-flex justify-content-center mb-5">
      {/* Emergency SOS Button */}
      <button
        onClick={handleSOS}
        className="btn btn-danger p-3 rounded sos-btn"
      >
        <i className="fa-solid fa-bell"></i> Emergency SOS
      </button>
      <div>
        <h1 className="text-center mb-3" style={{color: "#721a06ff"}}>Nearby Emergency Services</h1>
        <div
          ref={mapContainer}
          className="map-container shadow-lg mt-4"
          style={{ height: "450px", width: "600px" }}
        />
      </div>
    </div>
  );
};

export default LocateService;
