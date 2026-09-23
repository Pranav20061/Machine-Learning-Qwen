import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const UserLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { error } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      error('Logout failed');
    }
  };

  const navItems = [
    { path: '/dashboard', icon: 'bi-speedometer2', label: 'Dashboard' },
    { path: '/parking', icon: 'bi-p-circle', label: 'Find Parking' },
    { path: '/bookings', icon: 'bi-calendar-check', label: 'My Bookings' },
    { path: '/profile', icon: 'bi-person', label: 'Profile' },
  ];

  return (
    <div className="min-vh-100 d-flex">
      {/* Sidebar - Desktop */}
      <aside
        className={`sidebar d-none d-lg-block p-3`}
        style={{ width: '260px', flexShrink: 0 }}
      >
        <div className="mb-4 px-2">
          <Link to="/dashboard" className="text-white text-decoration-none">
            <h4 className="fw-bold mb-0">
              <i className="bi bi-p-circle-fill me-2"></i>
              ParkEase
            </h4>
          </Link>
        </div>

        <nav className="nav flex-column">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${
                window.location.pathname === item.path ? 'active' : ''
              }`}
            >
              <i className={`bi ${item.icon}`}></i>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-4 border-top border-secondary">
          <div className="px-2 mb-3">
            <p className="text-white fw-semibold mb-0">{user?.name}</p>
            <small className="text-muted">{user?.email}</small>
          </div>
          <button className="btn btn-outline-light w-100" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-2"></i>
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="flex-grow-1 d-flex flex-column">
        <header className="bg-white shadow-sm d-lg-none p-3">
          <div className="d-flex justify-content-between align-items-center">
            <button
              className="btn btn-link"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <i className="bi bi-list fs-4"></i>
            </button>
            <span className="fw-bold">ParkEase</span>
            <div className="dropdown">
              <button
                className="btn btn-link"
                data-bs-toggle="dropdown"
              >
                <i className="bi bi-person-circle fs-5"></i>
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link className="dropdown-item" to={item.path}>
                      <i className={`bi ${item.icon} me-2`}></i>
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </header>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-lg-none"
            onClick={() => setSidebarOpen(false)}
          >
            <aside
              className="sidebar position-absolute top-0 start-0 h-100 p-3"
              style={{ width: '260px' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 px-2">
                <h4 className="fw-bold text-white mb-0">
                  <i className="bi bi-p-circle-fill me-2"></i>
                  ParkEase
                </h4>
              </div>

              <nav className="nav flex-column">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`nav-link ${
                      window.location.pathname === item.path ? 'active' : ''
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <i className={`bi ${item.icon}`}></i>
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto pt-4 border-top border-secondary">
                <div className="px-2 mb-3">
                  <p className="text-white fw-semibold mb-0">{user?.name}</p>
                  <small className="text-muted">{user?.email}</small>
                </div>
                <button
                  className="btn btn-outline-light w-100"
                  onClick={() => {
                    handleLogout();
                    setSidebarOpen(false);
                  }}
                >
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Logout
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-grow-1 p-3 p-lg-4" style={{ backgroundColor: '#f5f7fa' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
