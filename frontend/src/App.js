import { Routes, Route, useLocation } from "react-router-dom";
import Home from "../src/Main/Home";
import About from "../src/Main/About";
import Navbar from "./components/Navbar";
import AdminLogin from "./Admin/AdminLogin";
import AdminDashboard from "./Admin/AdminDashboard";
import UserDashboard from "./Main/UserDashboard";
import HelpRequest from "./Main/HelpRequest";
import { ScrollToTop } from "./components/scrolltoTop";
import { useEffect, useState } from "react";
import DonateNew from "./Main/DonatePage";
import RequestNew from "./Main/RequestPage";
import Register from "./Main/Register";
import Login from "./Main/Login";
import NotFound from "./components/NotFound";
import "./App.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { Toaster } from "react-hot-toast";

function Preloader() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);
  
  if (!loading) return null;
  return (
    <div className="hemo-preloader">
      <div className="hemo-preloader-spinner"></div>
      <div className="hemo-preloader-text">Loading Hemo</div>
    </div>
  );
}

export default function App() {
  const [navtoggle, setNavToggle] = useState(true);
  var path_location = useLocation();

  useEffect(() => {
    if (
      path_location.pathname === "/admin" || 
      path_location.pathname === "/admin-dashboard"
    ) {
      setNavToggle(false);
    } else {
      setNavToggle(true);
    }
  }, [path_location]);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50,
    });
  }, []);

  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />
      <Preloader />
      {navtoggle ? <Navbar /> : <></>}
      <ScrollToTop />
      <Routes>
        <Route exact path="/" index element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/donate" element={<DonateNew />} />
        <Route path="/request" element={<RequestNew />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/help/:requestId" element={<HelpRequest />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
