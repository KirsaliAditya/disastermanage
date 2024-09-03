import React from 'react';
import './Admin-Login.css';  // Import the CSS file

const AdminLogin = () => {
  return (
    <div className="admin-login-container">
      <h1 className="admin-login-title">Admin Login</h1>
      <form className="admin-login-form">
        <div className="form-group">
          <label htmlFor="username" className="form-label">Username:</label>
          <input type="text" id="username" name="username" className="form-input" required />
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">Password:</label>
          <input type="password" id="password" name="password" className="form-input" required />
        </div>
        <button type="submit" className="admin-submit-btn">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;
