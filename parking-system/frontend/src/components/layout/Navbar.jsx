import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          <i className="bi bi-p-circle-fill me-2"></i>
          ParkEase
        </Link>
        
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/') ? 'active' : ''}`} to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/parking') ? 'active' : ''}`} to="/parking">
                Find Parking
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/login') ? 'active' : ''}`} to="/login">
                Login
              </Link>
            </li>
            <li className="nav-item">
              <Link className="btn btn-primary ms-2" to="/register">
                Sign Up
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
