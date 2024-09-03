import React from 'react';
import './Ngo-Login.css';  // Import the CSS file

const NgoLogin = () => {
  return (
    <div className="login-container">
      <h1 className="login-title">NGO Login</h1>
      <form className="login-form">
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email:</label>
          <input type="email" id="email" name="email" className="form-input" required />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">Password:</label>
          <input type="password" id="password" name="password" className="form-input" required />
        </div>
        <button type="submit" className="submit-btn">Login</button>
      </form>
    </div>
  );
};

export default NgoLogin;
