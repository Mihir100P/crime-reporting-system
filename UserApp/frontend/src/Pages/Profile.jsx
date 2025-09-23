import { useContext } from "react";
import AuthContext from "../context/authContext";
import { Link } from "react-router-dom";

const Profile = ({handleSOS}) => {
  const { allData } = useContext(AuthContext);

  return (
    <div className="container mt-5">
      {/* Emergency SOS Button */}
      <button
        onClick={handleSOS}
        className="btn btn-danger p-3 rounded sos-btn"
      >
        <i className="fa-solid fa-bell"></i> Emergency SOS
      </button>
      <div className="card shadow-lg p-4 text-center box">
        <h2 className="mt-3">{allData?.name}</h2>
        <p className="text-muted">{allData?.email} | {allData?.phoneNumber ? allData.phoneNumber : "Phone number not available"}</p>
        <p className="text-muted">
             Account created at: {allData?.createdAt ? new Date(allData.createdAt).toLocaleString() : "Not available"}
        </p>

        <h5 className="mt-3">
          Credit Points: <span className="badge bg-success">{allData?.credits || 0}</span>
        </h5>
      <div className="text-center mt-3">
        <Link to="/credit/user" className="btn btn-style gradient-text fw-bold px-4 py-2 shadow-sm">
            Convert Credit Points
        </Link>
      </div>
      </div>
    </div>
  );
};

export default Profile;
