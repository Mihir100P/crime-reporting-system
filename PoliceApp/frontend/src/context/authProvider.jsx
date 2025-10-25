import AuthContext from "../context/authContext"; 
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AuthProvider = ({ children }) => {
  const [police, setPolice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allData, setAllData] = useState(null);

  const api_url = import.meta.env.VITE_API_URL; 

  // Fetch logged-in Police from session cookie
  const fetchPolice = async () => {
    try {
      const res = await axios.get(`${api_url}/api/police/me`, {
        withCredentials: true,
      });

      if (res.data.success) {
        setPolice(res.data.police);
        fetchPoliceProfile(res.data.police._id);
      } else {
        setPolice(null);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      setPolice(null);
    } finally {
      setLoading(false);
    }
  };

  // On load: check Police
  useEffect(() => {
    fetchPolice();
  }, []);

  const fetchPoliceProfile = async (policeId) => {
    try {
      const { data } = await axios.get(
        `${api_url}/api/police/profile/${policeId}`,
        { withCredentials: true }
      );
      setAllData(data);
    } catch (err) {
      console.error("Profile fetch error:", err);
    }
  };

  const loginPolice = async (StationName, password) => {
    try {
      const { data } = await axios.post(
        `${api_url}/api/police/login`,
        { StationName, password },
        { withCredentials: true }
      );

      if (data.success) {
        setPolice(data.police);
        fetchPoliceProfile(data.police._id);
        return { success: true };
      }

      return { success: false, message: "Invalid credentials" };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const registerPolice = async (policeData) => {
    try {
      const { data } = await axios.post(
        `${api_url}/api/police/register`,
        policeData,
        { withCredentials: true }
      );
      setPolice(data.police);
      fetchPoliceProfile(data.police._id);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = async (navigate) => {
    try {
      await fetch(`${api_url}/api/police/logout`, {
        method: "get",
        credentials: "include",
      });
      setPolice(null);
      setAllData(null);
      toast.success("Logout successful.");
      navigate("/login");
    } catch (err) {
      toast.error("Logout failed:", err);
    }
  };


  return (
    <AuthContext.Provider value={{ police, allData, loading, loginPolice, registerPolice, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
