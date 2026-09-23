import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section bg-primary text-white py-5">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">Find Your Perfect Parking Spot</h1>
              <p className="lead mb-4">
                ParkEase makes parking simple. Search, reserve, and manage your parking spots 
                with just a few clicks. No more circling around looking for parking!
              </p>
              <div className="d-flex gap-3">
                {!isAuthenticated ? (
                  <>
                    <Link to="/parking" className="btn btn-light btn-lg px-4">
                      Find Parking
                    </Link>
                    <Link to="/register" className="btn btn-outline-light btn-lg px-4">
                      Get Started
                    </Link>
                  </>
                ) : (
                  <Link 
                    to={isAdmin ? "/admin" : "/dashboard"} 
                    className="btn btn-light btn-lg px-4"
                  >
                    {isAdmin ? 'Admin Dashboard' : 'My Dashboard'}
                  </Link>
                )}
              </div>
            </div>
            <div className="col-lg-6 text-center mt-5 mt-lg-0">
              <i className="bi bi-p-sign display-1"></i>
              <i className="bi bi-car-front display-1 ms-4"></i>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5">How It Works</h2>
          <div className="row g-4">
            <div className="col-md-4 text-center">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <i className="bi bi-search display-4 text-primary mb-3 d-block"></i>
                  <h4 className="card-title">Search</h4>
                  <p className="card-text text-muted">
                    Find available parking locations near your destination with our easy search.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <i className="bi bi-calendar-check display-4 text-primary mb-3 d-block"></i>
                  <h4 className="card-title">Reserve</h4>
                  <p className="card-text text-muted">
                    Select your preferred slot and time. Reserve instantly with secure booking.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <i className="bi bi-key display-4 text-primary mb-3 d-block"></i>
                  <h4 className="card-title">Park</h4>
                  <p className="card-text text-muted">
                    Arrive at your spot and park hassle-free. Your reservation is guaranteed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5">Why Choose ParkEase?</h2>
          <div className="row g-4">
            <div className="col-md-6">
              <div className="d-flex align-items-start">
                <i className="bi bi-clock-history fs-3 text-primary me-3"></i>
                <div>
                  <h5>Save Time</h5>
                  <p className="text-muted">No more wasting time searching for parking spots.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex align-items-start">
                <i className="bi bi-shield-check fs-3 text-primary me-3"></i>
                <div>
                  <h5>Guaranteed Spot</h5>
                  <p className="text-muted">Your reserved spot is waiting for you.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex align-items-start">
                <i className="bi bi-wallet2 fs-3 text-primary me-3"></i>
                <div>
                  <h5>Best Prices</h5>
                  <p className="text-muted">Competitive pricing with transparent fees.</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex align-items-start">
                <i className="bi bi-phone fs-3 text-primary me-3"></i>
                <div>
                  <h5>Easy Management</h5>
                  <p className="text-muted">Manage all your bookings from one place.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4 text-center">
            <div className="col-md-3">
              <h2 className="display-4 fw-bold text-primary">50+</h2>
              <p className="text-muted">Parking Locations</p>
            </div>
            <div className="col-md-3">
              <h2 className="display-4 fw-bold text-primary">1000+</h2>
              <p className="text-muted">Parking Slots</p>
            </div>
            <div className="col-md-3">
              <h2 className="display-4 fw-bold text-primary">5000+</h2>
              <p className="text-muted">Happy Customers</p>
            </div>
            <div className="col-md-3">
              <h2 className="display-4 fw-bold text-primary">24/7</h2>
              <p className="text-muted">Customer Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-5 bg-primary text-white">
        <div className="container text-center">
          <h2 className="mb-4">Ready to Park with Ease?</h2>
          <p className="lead mb-4">Join thousands of satisfied customers today!</p>
          {!isAuthenticated && (
            <Link to="/register" className="btn btn-light btn-lg px-5">
              Create Free Account
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
