import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function Community({handleSOS}) {
  const [input, setInput] = useState({
    name: "",
    phone: "",
    email: "",
    location: ""
  });

  const api_url = import.meta.env.VITE_API_URL;

  const getCoordFromAddress = async (address) => {
    try {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json`;
      const response = await axios.get(url, {
        params: {
          access_token: import.meta.env.VITE_MAP_TOKEN,
          limit: 1
        }
      });
  
      if (
        response.data &&
        response.data.features &&
        response.data.features.length > 0
      ) {
        const [lng, lat] = response.data.features[0].center;
        return { lat, lng };
      } else {
        return { lat: null, lng: null, error: "Coordinates not found" };
      }
    } catch (error) {
      console.error("Mapbox forward geocoding failed:", error.message);
      return { lat: null, lng: null, error: "Error fetching coordinates" };
    }
  };

  function inptChange(event) {
    const { name, value } = event.target;
    setInput((prevInput) => ({
      ...prevInput,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const coord = await getCoordFromAddress(input.location);
    try {
      const result = await axios.post(
        `${api_url}/api/join`,
        {...input,coord},
        { withCredentials: true }
      );
      toast.success(result.data.message);
      setInput({
        name: "",
        phone: "",
        email: "",
        location: ""
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Something went wrong. Please try again."
      );
    }
  }

  return (
    <div className="container mt-5">
      {/* Emergency SOS Button */}
      <button
        onClick={handleSOS}
        className="btn btn-danger p-3 rounded sos-btn"
      >
        <i className="fa-solid fa-bell"></i> Emergency SOS
      </button>
      <div className="row justify-content-center">
        <div className="col-md-6 col-sm-10">
          <div className="card shadow-lg p-4 box">
            <h1 className="text-center mb-4" style={{color: "#721a06ff"}}>Join the Community</h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  type="text"
                  name="name"
                  value={input.name}
                  onChange={inptChange}
                  className="form-control box"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={input.email}
                  onChange={inptChange}
                  className="form-control box"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="phone" className="form-label">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={input.phone}
                  onChange={inptChange}
                  className="form-control box"
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="location" className="form-label">Location</label>
                <input
                  type="text"
                  name="location"
                  value={input.location}
                  onChange={inptChange}
                  className="form-control box"
                  placeholder="Enter your address"
                  required
                />
              </div>
              <div className="text-center">
              <button type="submit" className="btn btn-style gradient-text">
                Join Now
              </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Community;
