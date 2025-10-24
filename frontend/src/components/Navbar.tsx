import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Correctly type the props
interface NavbarProps {
  username: string;
}

const Navbar: React.FC<NavbarProps> = ({ username }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
      <Link className="navbar-brand" to="/dashboard">ProjectApp</Link>
      <div className="collapse navbar-collapse justify-content-end">
        <ul className="navbar-nav">
          <li className="nav-item me-3">
            <span className="navbar-text" style={{ fontWeight: 500 }}>
              {username}
            </span>
          </li>
          <li className="nav-item">
            <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
