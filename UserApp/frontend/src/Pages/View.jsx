import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAP_TOKEN;
const api_url = import.meta.env.VITE_API_URL;

const View = ({handleSOS}) => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get(`${api_url}/api/reports/${id}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setReport(res.data.report);
        }
      } catch (error) {
        console.error("Error fetching report:", error);
      }
    };
    fetchReport();
  }, [id]);

  useEffect(() => {
    if (!report || !report.location?.coordinates) return;

    const [lng, lat] = report.location.coordinates;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: 14,
    });

    const marker = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(mapRef.current);

    const mediaUrl = report.mediaUrls?.[0] || "";
    const isImage = /\.(jpg|jpeg|png|webp)$/i.test(mediaUrl);
    const isVideo = /\.(mp4|webm|ogg)$/i.test(mediaUrl);

    const popupHTML = isImage
      ? `<img src="${mediaUrl}" style="width:400px;border-radius:8px" />`
      : isVideo
      ? `<video src="${mediaUrl}" muted playsinline loop style="width:400px;border-radius:8px" controls></video>`
      : `<p>No preview available</p>`;

    const popup = new mapboxgl.Popup({ closeButton: false, offset: 25 }).setHTML(popupHTML);
    marker.setPopup(popup);

    const markerEl = marker.getElement();

    const showPopup = () => {
      popup.addTo(mapRef.current);
      setTimeout(() => {
        const popupContent = document.querySelector(".mapboxgl-popup-content");
        const video = popupContent?.querySelector("video");
        if (video) {
          const playPromise = video.play();
          if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(() => {
              video.muted = true;
              video.play().catch(() => {});
            });
          }
        }
      }, 50);
    };

    const hidePopup = () => {
      const popupEl = document.querySelector(".mapboxgl-popup");
      const video = popupEl?.querySelector("video");
      if (video) {
        try {
          video.pause();
          video.currentTime = 0;
        } catch(err) {
          console.log(err);
        }
      }
      popup.remove();
    };

    markerEl.addEventListener("mouseenter", showPopup);
    markerEl.addEventListener("mouseleave", hidePopup);

    return () => {
      markerEl.removeEventListener("mouseenter", showPopup);
      markerEl.removeEventListener("mouseleave", hidePopup);
      mapRef.current?.remove();
    };
  }, [report]);

  if (!report) return <p>Loading report...</p>;

  return (
    <div className="container mt-4">
      {/* Emergency SOS Button */}
      <button
        onClick={handleSOS}
        className="btn btn-danger p-3 rounded sos-btn"
      >
        <i className="fa-solid fa-bell"></i> Emergency SOS
      </button>
      <h1 style={{color: "#721a06ff",textAlign:"center"}}>Report Details</h1>
      <div className="mb-3">
        <strong>Title:</strong> {report.title}
      </div>
      <div className="mb-3">
        <strong>Description:</strong> {report.description}
      </div>
      <div className="mb-3">
        <strong>Location:</strong> {report.location.address}
      </div>
      {report.media && report.media.length > 0 && (
        <div className="mb-3">
          <strong>Media:</strong>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {report.media.map((url, idx) => {
              const isImg = /\.(jpg|jpeg|png|webp)$/i.test(url);
              const isVid = /\.(mp4|webm|ogg)$/i.test(url);
              return isImg ? (
                <img key={idx} src={url} alt="media" style={{ width: "200px", borderRadius: "8px" }} />
              ) : isVid ? (
                <video key={idx} src={url} controls style={{ width: "200px", borderRadius: "8px" }} />
              ) : null;
            })}
          </div>
        </div>
      )}
      <div className="mb-3">
        <strong>Reported At:</strong> {new Date(report.createdAt).toLocaleString()}
      </div>
      <div className="mb-3">
          <strong>Report status: </strong> <b style={{textDecoration:"underline"}}>{report.status}</b>
      </div>
      <div ref={mapContainerRef} 
      style={{ height: "450px", borderRadius: "10px", overflow: "hidden", marginBottom: "5rem" }} 
      className="shadow-lg mt-4"
      />
    </div>
  );
};

export default View;
