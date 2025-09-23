import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from './Navbar'
import Footer from './Footer'
import Home from './Pages/Home'
import Login from "./Pages/LoginPolice";
import Register from "./Pages/RegisterPolice";
import Reports from "./Pages/Reports";
import Profile from "./Pages/PoliceProfile";
import View from "./Pages/View";
import AlertSend from "./Pages/Alert";
import NotFound from "./Pages/NotFound";
import "./app.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1 home-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/report/police" element={<Reports />} />
            <Route path="/profile/police" element={<Profile />} />
            <Route path="/report/:id" element={<View />} />
            <Route path="/alert/send" element={<AlertSend />} />
          </Route>
          <Route path="*" element={<NotFound />} /> 
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
