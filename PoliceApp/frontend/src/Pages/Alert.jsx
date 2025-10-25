import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function AlertSend() {
  const [message, setMessage] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const api_url = import.meta.env.VITE_API_URL; 

  const sendAlert = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${api_url}/api/trigger-alert`, {
        location,
        message
      });

      toast.success("Alert sent successfully!");
      setMessage("");
      setLocation("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send alert");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-sm-10">
          <div className="card shadow border-0 box">
            <div className="card-header text-white text-center py-3">
              <h1 className="mb-0" style={{color: "#721a06ff"}}>
                Send Alert
              </h1>
            </div>
            <div className="card-body p-4">
              <form onSubmit={sendAlert}>
                <div className="mb-3">
                  <label htmlFor="loc" className="form-label fw-semibold">
                    Location
                  </label>
                  <input
                    type="text"
                    name="loc"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="form-control box"
                    placeholder="Enter alert location"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="msg" className="form-label fw-semibold">
                    Message
                  </label>
                  <textarea
                    name="msg"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="form-control box"
                    placeholder="Enter your message"
                    rows="3"
                    required
                  />
                </div>
                <div className="text-center">
                <button
                  type="submit"
                  className="btn btn-style gradient-text w-50"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  ) : (
                    <i className="bi bi-megaphone-fill me-2"></i>
                  )}
                  {loading ? "Sending..." : "Send Alert"}
                </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
