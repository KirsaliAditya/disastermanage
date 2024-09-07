import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../Assets/logo.png';

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="Logo" />
        </Link>
        <span className="navbar-title">NDRF India</span>
      </div>

      <ul className="navbar-links">
        <li><Link to="/" className="navbar-item">Home</Link></li>
        <li><Link to="/about" className="navbar-item">About Us</Link></li>
        <li className="navbar-item dropdown">
          <Link to="/services" className="dropdown-toggle" style={{color:"white"}}>Services</Link>
          <ul className="dropdown-menu">
            <li><Link to="/services/rescue">Rescue Operations</Link></li>
            <li><Link to="/services/relief">Relief Management</Link></li>
            <li><Link to="/services/training">Training Programs</Link></li>
          </ul>
        </li>
        <li><Link to="/news" className="navbar-item">News</Link></li>
        <li><Link to="/contact" className="navbar-item">Contact</Link></li>
        <li><Link to="/dashboard" className="navbar-item">Dashboard</Link></li>
      </ul>

      <div className="navbar-options">
        <div className="navbar-search">
          <input type="text" placeholder="Search..." />
          <button type="button">Search</button>
        </div>
        <Link to="/disaster-form" className="navbar-login">Inform Disaster</Link>
        <Link to="/auth" className="navbar-login">Register/Login</Link>
        <Link to="/admin-login" className="navbar-login">Admin Login</Link>
      </div>
    </nav>
  );
};

export default NavBar;
