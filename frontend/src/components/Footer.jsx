import React from "react";
import { FaFacebookF,FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-200 py-12 px-6 md:px-20">
      <div className="max-w-7xl mx-auto grid gap-8 md:grid-cols-4">
        {/* Logo & About */}
        <div>
          <Link to='/admin/adminlogin'>
          <h1 className="text-2xl font-extrabold">
              HONOR <span className="text-teal-400">FREELANCE</span>
            </h1></Link>
          <p className="text-sm text-gray-400">
            Your trusted job portal connecting talented individuals with top companies across India.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-white">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/jobs" className="hover:text-white">Jobs</Link></li>
             <li><Link to="/dashboard" className="hover:text-white">Dashboard</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-white">Resources</h3>
          <ul className="space-y-2 text-sm">
          
            <li><Link to="/login" className="hover:text-white">Login</Link></li>
            <li><Link to="/register" className="hover:text-white">Sign Up</Link></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-white">Follow Us</h3>
          <div className="flex space-x-4 text-xl">
            <a href="#" className="hover:text-blue-500"><FaFacebookF /></a>
            <a href="#" className="hover:text-gray-400"><FaXTwitter /></a>
            <a href="#" className="hover:text-pink-500"><FaInstagram /></a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-10 text-center text-sm text-white border-t border-gray-700 pt-6">
        &copy; {new Date().getFullYear()} AIZTS-Infotech.. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
