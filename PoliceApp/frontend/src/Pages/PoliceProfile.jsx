import { useContext } from "react";
import AuthContext from "../context/authContext";

const Profile = () => {
  const { allData } = useContext(AuthContext);

  return (
    <div className="container mt-5">
      <div className="card shadow p-4 text-center">
        <h1>Police Station Details</h1>
        <h2 className="mt-3">{allData?.StationName}</h2>
        <p className="text-muted">{allData?.pincode}</p>
        <p className="text-muted">
              {allData?.phone ? allData.phone : "Phone number not available"}
        </p>
        <p className="text-muted">
             Account created at: {allData?.createdAt ? new Date(allData.createdAt).toLocaleString() : "Not available"}
  </p>
      </div>
    </div>
  );
};

export default Profile;
