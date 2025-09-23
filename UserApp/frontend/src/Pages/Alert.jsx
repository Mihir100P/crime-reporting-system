import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAP_TOKEN;

function Alert({ handleSOS, alerts }) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const coords = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };

      mapRef.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [coords.lng, coords.lat],
        zoom: 13,
      });

      new mapboxgl.Marker({ color: "blue" })
        .setLngLat([coords.lng, coords.lat])
        .setPopup(new mapboxgl.Popup().setText("You are here"))
        .addTo(mapRef.current);
    });
  }, []);

  function addAlertMarkers([alertList]) {
    if (!mapRef.current) return;
    alertList.forEach((alert) => {
      if (alert.location?.lat && alert.location?.lng) {
        new mapboxgl.Marker({ color: "red" })
          .setLngLat([alert.location.lng, alert.location.lat])
          .setPopup(
            new mapboxgl.Popup().setHTML(
              `<strong>${alert.message}</strong><br>${new Date(
                alert.timestamp
              ).toLocaleString()}`
            )
          )
          .addTo(mapRef.current);
      }
    });
  }

  useEffect(() => {
    if (alerts.length > 0) {
      addAlertMarkers(alerts);
    }
  }, [alerts]);

  return (
    <div className="container mt-4">
      {/* Emergency SOS Button */}
      <div className="d-flex justify-content-center mb-4">
        <button onClick={handleSOS} className="btn btn-danger p-3 rounded sos-btn">
          <i className="fa-solid fa-bell"></i> Emergency SOS
        </button>
      </div>

      <h1 className="text-center mb-4" style={{ color: "#721a06ff" }}>
        Nearby Alerts
      </h1>

      <div className="row justify-content-center">
        {/* Map Section */}
        <div className="col-12 col-md-6 d-flex justify-content-center mb-4">
          <div
            ref={mapContainer}
            className="map-container shadow-lg rounded mt-4"
            style={{ height: "450px", width: "100%", maxWidth: "600px" }}
          />
        </div>

        {/* Alerts List */}
        <div className="col-12 col-md-6 mb-5">
          {alerts.length === 0 && (
            <p className="text-center mt-4">
              <b>No current alerts</b>
            </p>
          )}
          <ul className="list-unstyled">
            {alerts.map((a, idx) => (
              <li key={idx} className="mb-2 text-center mt-4">
                <p className="mb-0 fw-bold">Location - {a.locationName}</p>
                {a.message} —{" "}
                {a.timestamp ? new Date(a.timestamp).toLocaleString() : ""}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Alert;
