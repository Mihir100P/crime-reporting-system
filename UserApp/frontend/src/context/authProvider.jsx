import AuthContext from "../context/authContext"; 
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allData, setAllData] = useState(null);

  const api_url = import.meta.env.VITE_API_URL;

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${api_url}/api/users/me`, {
        withCredentials: true,
      });

      if (res.data.success) {
        setUser(res.data.user);
        fetchUserProfile(res.data.user._id);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // On load: check user
  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      const { data } = await axios.get(
        `${api_url}/api/users/profile/${userId}`,
        { withCredentials: true }
      );
      setAllData(data);
    } catch (err) {
      console.error("Profile fetch error:", err);
    }
  };

  const loginUser = async (email, password) => {
    try {
      const { data } = await axios.post(
        `${api_url}/api/users/login`,
        { email, password },
        { withCredentials: true }
      );

      if (data.success) {
        setUser(data.user);
        fetchUserProfile(data.user._id);
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

  const registerUser = async (userData) => {
    try {
      const { data } = await axios.post(
        `${api_url}/api/users/register`,
        userData,
        { withCredentials: true }
      );
      setUser(data.user);
      fetchUserProfile(data.user._id);
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
      await fetch(`${api_url}/api/users/logout`, {
        method: "get",
        credentials: "include",
      });
      setUser(null);
      setAllData(null);
      toast.success("Logout successfully.");
      navigate("/login");
    } catch (err) {
      toast.error("Logout failed:", err);
    }
  };

  const updateUserPoints = async (userId, points) => {
    try {
      const { data } = await axios.put(
        `${api_url}/api/users/update-points/${userId}`,
        { points },
        { withCredentials: true }
      );

      setUser((prev) => ({ ...prev, credits: data.credits }));
      setAllData((prev) => ({ ...prev, credits: data.credits }));

      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Update failed" };
    }
  };

  return (
    <AuthContext.Provider value={{ user, allData, loading, loginUser, registerUser, logout, updateUserPoints }}>
      {children}
    </AuthContext.Provider>
  );
};
