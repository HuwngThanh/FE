import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../css/navbar.css';

function Navbar() {
  const navigate = useNavigate();
  return (
    <>
      <nav className="admin-navbar navbar-expand-lg bg-dark shadow-sm px-3">
        <h4 className="text-white" onClick={() => navigate('/admin/dashboard')}>
          <i className="fas fa-tv"></i> ADMIN
        </h4>

        <div className="ms-auto d-flex align-items-center">
          <span className="text-white me-2">Admin</span>

          {/* <!-- Dropdown Avatar --> */}
          <div className="dropdown">
            <img
              src="./image/f9486eb3ce64ea88043728ffe70f0ba1.jpg"
              className="rounded-circle dropdown-toggle"
              width="35"
              height="35"
              id="adminDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              alt="Admin"
            />

            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="adminDropdown">
              <li>
                <a className="dropdown-item" href="#">
                  Profile
                </a>
              </li>
              <li>
                <a className="dropdown-item text-danger" href="#" id="logoutBtn">
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
