const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-3 mb-md-0">
            <h5 className="fw-bold">
              <i className="bi bi-p-circle-fill me-2"></i>
              ParkEase
            </h5>
            <p className="text-muted small">
              Smart parking management system for modern cities. Find, reserve, and manage parking slots with ease.
            </p>
          </div>
          
          <div className="col-md-4 mb-3 mb-md-0">
            <h6 className="fw-bold mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li><a href="/" className="text-muted text-decoration-none small">Home</a></li>
              <li><a href="/parking" className="text-muted text-decoration-none small">Find Parking</a></li>
              <li><a href="/login" className="text-muted text-decoration-none small">Login</a></li>
              <li><a href="/register" className="text-muted text-decoration-none small">Register</a></li>
            </ul>
          </div>
          
          <div className="col-md-4">
            <h6 className="fw-bold mb-3">Contact</h6>
            <ul className="list-unstyled text-muted small">
              <li><i className="bi bi-envelope me-2"></i>support@parkease.com</li>
              <li><i className="bi bi-telephone me-2"></i>+1 (555) 123-4567</li>
              <li><i className="bi bi-geo-alt me-2"></i>123 Main Street, City</li>
            </ul>
          </div>
        </div>
        
        <hr className="my-4 border-secondary" />
        
        <div className="text-center text-muted small">
          <p className="mb-0">&copy; {currentYear} ParkEase. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
