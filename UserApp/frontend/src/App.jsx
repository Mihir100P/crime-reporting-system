import { useEffect,useState } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from './Navbar'
import Footer from './Footer'
import Home from './Pages/Home'
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ReportForm from "./Pages/Report";
import Dashboard from './Pages/Dashboard';
import Profile from "./Pages/Profile";
import LocateService from "./Pages/LocateService";
import AlertList from "./Pages/Alert";
import Community from "./Pages/Community"
import NotFound from "./Pages/NotFound";
import View from "./Pages/View";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import io from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
const api_url = import.meta.env.VITE_API_URL;

const socket = io(SOCKET_URL, { withCredentials: true });

const handleSOS = () => {
  navigator.geolocation.getCurrentPosition(position => {
    const { longitude, latitude } = position.coords;

    fetch(`${api_url}/api/sos/alert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lng: longitude , lat: latitude})
    })
      .then(res => res.json())
      .then(data => {
        toast.success(`${data.notified} community members alerted via SMS`);
      })
      .catch(error =>{
        toast.error(error);
      });
  });
};

function App() {
  const [alerts, setAlerts] = useState([]);
  
  useEffect(() => {
      navigator.geolocation.getCurrentPosition((pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
  
        socket.emit("register-location", coords);
      });
    }, []);

    useEffect(() => {
        socket.on("new-alert", (alert) => {
           setAlerts((prev) => [alert, ...prev]);
          toast.info(
              <>
                {alert.message} <br />
                Location: {alert.locationName || "Unknown location"}
              </>,
              {
                position: "top-right",
                autoClose: false,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
              }
            );
        });
    
        return () => {
          socket.off("new-alert");
        };
      }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1 home-container">
        <Routes>
          <Route path="/" element={<Home handleSOS={handleSOS}/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard/user" element={<Dashboard handleSOS={handleSOS}/>} />
            <Route path="/report/user" element={<ReportForm handleSOS={handleSOS}/>} />
            <Route path="/profile/user" element={<Profile handleSOS={handleSOS}/>} />
            <Route path="/map/user" element={<LocateService handleSOS={handleSOS}/>} />
            <Route path="/alert/user" element={<AlertList handleSOS={handleSOS} alerts={alerts}/>} /> 
            <Route path="/join/user" element={<Community handleSOS={handleSOS}/>} />
            <Route path="/report/:id" element={<View handleSOS={handleSOS}/>} />
          </Route>
          <Route path="*" element={<NotFound handleSOS={handleSOS}/>} /> 
        </Routes>
         <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </main>
      <Footer />
    </div>
  )
}

export default App
