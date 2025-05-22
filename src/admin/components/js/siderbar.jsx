import { useNavigate } from 'react-router-dom';
import '../css/siderbar.css';

function Sidebar() {
  const navigate = useNavigate();

  return (
    <>
      <div className="admin-sidebar" id="adminSidebar">
        <h4 className="text-center" onClick={() => navigate('/admin')}>
          <i className="fas fa-tv"></i> MOTCHILL ADMIN
        </h4>

        <a href="#" className="active" onClick={() => navigate('/admin/dashboard')}>
          <i className="fas fa-chart-line"></i> Dashboard
        </a>

        {/* <!-- Dropdown Phim --> */}
        <div className="dropdown">
          <a href="#" className="dropdown-toggle sidebar-link" data-bs-toggle="collapse" data-bs-target="#phimDropdown">
            <i className="fas fa-clapperboard"></i> Phim
          </a>
          <div className="collapse" id="phimDropdown">
            <a href="#" className="dropdown-item" onClick={() => navigate('/admin/listfilm')}>
              Danh sách phim
            </a>
            <a href="#" className="dropdown-item">
              Tạo phim
            </a>
          </div>
        </div>

        {/* <!-- Dropdown User --> */}
        <div className="dropdown">
          <a href="#" className="dropdown-toggle sidebar-link" data-bs-toggle="collapse" data-bs-target="#userDropdown">
            <i className="fas fa-user"></i> User
          </a>
          <div className="collapse" id="userDropdown">
            <a href="#" className="dropdown-item" onClick={() => navigate('/admin/listuser')}>
              Danh sách user
            </a>
            <a href="#" className="dropdown-item" onClick={() => navigate('/admin/createuser')}>
              Tạo user
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
