import { useNavigate } from 'react-router-dom';
import '../cs/showlistuser.css';
import { useEffect, useState } from 'react';
import { useDeleteUserMutation } from '../../../../apis/userApi';
import { toast } from 'react-toastify';

function ListUser() {
  const navigate = useNavigate();
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const API_URL = 'https://film-dbb2.onrender.com/api/users';

  const fetchUsers = async () => {
    setIsLoading(true);
    setIsError(false);

    console.log('Đang gọi API từ:', API_URL);

    try {
      const response = await fetch(API_URL, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Đã nhận được dữ liệu:', data);
      setUserList(data);
    } catch (error) {
      console.error('Lỗi khi gọi API:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRefresh = () => {
    console.log('Đang refresh dữ liệu...');
    fetchUsers();
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này không?')) {
      try {
        await deleteUser(userId).unwrap();
        toast.success('Xóa người dùng thành công!');
        fetchUsers();
      } catch (err) {
        console.error('Lỗi khi xóa user:', err);
        toast.error(err.data?.message || 'Có lỗi xảy ra khi xóa người dùng.');
      }
    }
  };

  return (
    <>
      <div className="admin-main-content">
        <div className="user-list">
          <h4>
            <i className="fas fa-users"></i> Danh sách User
          </h4>

          <div className="d-flex justify-content-between mb-3">
            <button className="btn btn-primary" onClick={() => navigate('/admin/createuser')} disabled={isDeleting}>
              <i className="fas fa-user-plus"></i> Tạo user
            </button>
            <button className="btn btn-success" onClick={handleRefresh} disabled={isLoading || isDeleting}>
              <i className="fas fa-sync-alt"></i> Refresh
            </button>
          </div>

          {isLoading && <p>Đang tải danh sách...</p>}
          {isError && <p className="text-danger">Có lỗi xảy ra khi tải danh sách người dùng.</p>}
          {isDeleting && <p>Đang xóa người dùng...</p>}

          {!isLoading && !isError && (
            <div className="table-responsive">
              <table className="table table-bordered align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>Avatar</th>
                    <th>User</th>
                    <th>Email</th>
                    <th>Số điện thoại</th>
                    <th>Role</th>
                    <th>Update/Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {userList && userList.length > 0 ? (
                    userList.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <img
                            className="list-avata-user"
                            src={user.avatar || '../f9486eb3ce64ea88043728ffe70f0ba1.jpg'}
                            alt="avatar"
                          />
                        </td>
                        <td>
                          <a href="#">{user.username || user.email || 'N/A'}</a>
                        </td>
                        <td>{user.email || 'N/A'}</td>
                        <td>{user.phone || '---'}</td>
                        <td>
                          <span className={`badge ${user.role === 0 ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                            {user.role === 0 ? 'ADMIN' : 'USER'}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-success">
                            <i
                              className="fa-solid fa-pen update"
                              onClick={() => navigate(`/admin/updateuser/${user.id}/admin`)}
                              style={{ cursor: 'pointer' }}
                            ></i>
                          </span>{' '}
                          |{' '}
                          <span className="badge bg-danger detele">
                            <i
                              className="fa-solid fa-trash"
                              onClick={() => handleDelete(user.id)}
                              style={{ cursor: 'pointer' }}
                            ></i>
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        Không có dữ liệu người dùng
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ListUser;
