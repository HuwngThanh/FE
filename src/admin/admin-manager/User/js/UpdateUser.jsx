// src/admin/admin-manager/User/js/UpdateUser.jsx

import '../cs/createuser.css';
import { useNavigate, useParams } from 'react-router-dom';
import React, { useState, useRef, useEffect } from 'react';
import { useGetUserByIdQuery, useUpdateUserMutation, useDeleteUserMutation } from '../../../../apis/userApi';
import { toast } from 'react-toastify';

function UpdateUser() {
  const navigate = useNavigate();
  const { id: userId } = useParams();
  console.log('ID từ URL:', userId);

  const fileInputRef = useRef(null);

  // 1. Fetch existing user data
  const { data: userData, isLoading: isLoadingUser, isError: isUserError } = useGetUserByIdQuery(userId);
  console.log('User ID từ URL:', userId);
  console.log('User Data:', userData);
  console.log('Đang loading:', isLoadingUser);
  console.log('Có lỗi không:', isUserError);

  // 2. Setup mutations
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  // 3. Local form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 1,
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [message, setMessage] = useState({ type: '', content: '' });

  // 4. When userData arrives, populate form
  useEffect(() => {
    if (userData && userData.user) {
      setFormData({
        username: userData.user.username || '',
        email: userData.user.email || '',
        password: '',
        confirmPassword: '',
        phone: userData.user.phone || '',
        role: userData.user.role ?? 0,
      });
      setSelectedImage(userData.user.avatar || '/images/default-avatar.jpg');
    }
  }, [userData]);

  // 5. Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'role' ? parseInt(value, 10) : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const openFilePicker = () => fileInputRef.current.click();

  // Hàm xử lý lỗi trùng lặp từ backend
  const handleDuplicateError = (error, changedFields) => {
    const errorMessage = error.data?.message || error.message || '';
    const original = userData.user;

    // Kiểm tra lỗi trùng username
    if (
      errorMessage.toLowerCase().includes('username') &&
      (errorMessage.toLowerCase().includes('exists') ||
        errorMessage.toLowerCase().includes('duplicate') ||
        errorMessage.toLowerCase().includes('trùng'))
    ) {
      // Nếu có thay đổi email, thử cập nhật với username gốc + email mới
      if (changedFields.email && Object.keys(changedFields).length > 1) {
        const newFields = {
          username: original.username, // Giữ nguyên username gốc
          email: changedFields.email,
        };
        if (changedFields.password) newFields.password = changedFields.password;
        if (changedFields.phone) newFields.phone = changedFields.phone;
        if (changedFields.role !== undefined) newFields.role = changedFields.role;

        return {
          shouldRetry: true,
          newFields: newFields,
          warningMessage: 'Username đã tồn tại. Đã cập nhật các thông tin khác (giữ nguyên username cũ).',
        };
      }
    }

    // Kiểm tra lỗi trùng email
    if (
      errorMessage.toLowerCase().includes('email') &&
      (errorMessage.toLowerCase().includes('exists') ||
        errorMessage.toLowerCase().includes('duplicate') ||
        errorMessage.toLowerCase().includes('trùng'))
    ) {
      // Nếu có thay đổi username, thử cập nhật với email gốc + username mới
      if (changedFields.username && Object.keys(changedFields).length > 1) {
        const newFields = {
          username: changedFields.username,
          email: original.email, // Giữ nguyên email gốc
        };
        if (changedFields.password) newFields.password = changedFields.password;
        if (changedFields.phone) newFields.phone = changedFields.phone;
        if (changedFields.role !== undefined) newFields.role = changedFields.role;

        return {
          shouldRetry: true,
          newFields: newFields,
          warningMessage: 'Email đã tồn tại. Đã cập nhật các thông tin khác (giữ nguyên email cũ).',
        };
      }
    }

    return { shouldRetry: false };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', content: '' });

    if (!userData || !userData.user) {
      setMessage({ type: 'error', content: 'Không tìm thấy thông tin người dùng để so sánh.' });
      return;
    }

    const original = userData.user;

    // Kiểm tra mật khẩu xác nhận
    if (formData.password && formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', content: 'Mật khẩu xác nhận không khớp!' });
      return;
    }

    const changedFields = {};

    if (formData.username && formData.username !== original.username) {
      changedFields.username = formData.username;
    }

    if (formData.email && formData.email !== original.email) {
      changedFields.email = formData.email;
    }

    if (formData.phone && formData.phone !== original.phone) {
      changedFields.phone = formData.phone;
    }

    if (formData.role !== original.role) {
      changedFields.role = formData.role;
    }

    if (formData.password) {
      changedFields.password = formData.password;
    }

    if (Object.keys(changedFields).length === 0 && !avatarFile) {
      setMessage({ type: 'info', content: 'Không có thay đổi nào để cập nhật.' });
      return;
    }

    // Hàm thực hiện update - LUÔN GỬI TẤT CẢ THÔNG TIN
    const performUpdate = async (fieldsToUpdate, isRetry = false) => {
      let payload;

      // Tạo payload với TẤT CẢ thông tin hiện tại, chỉ thay đổi những field được update
      const fullData = {
        username: fieldsToUpdate.username || original.username,
        email: fieldsToUpdate.email || original.email,
        phone: fieldsToUpdate.phone || original.phone,
        role: fieldsToUpdate.role !== undefined ? fieldsToUpdate.role : original.role,
        ...(fieldsToUpdate.password ? { password: fieldsToUpdate.password } : {}),
      };

      if (avatarFile) {
        payload = new FormData();
        payload.append('id', userId);
        Object.entries(fullData).forEach(([key, val]) => payload.append(key, val));
        payload.append('avatar', avatarFile);
      } else {
        payload = {
          id: userId,
          ...fullData,
        };
      }

      try {
        await updateUser({ id: userId, data: payload }).unwrap();

        if (isRetry) {
          setMessage({ type: 'warning', content: 'Cập nhật một phần thành công! Một số thông tin có thể đã tồn tại.' });
        } else {
          setMessage({ type: 'success', content: 'Cập nhật người dùng thành công!' });
        }

        setTimeout(() => {
          navigate('/admin/listuser');
        }, 2000);
      } catch (err) {
        console.error('Lỗi cập nhật user:', err);

        if (!isRetry) {
          // Thử xử lý lỗi trùng lặp
          const duplicateHandler = handleDuplicateError(err, fieldsToUpdate);

          if (duplicateHandler.shouldRetry) {
            // Hiển thị warning và thử lại với fields mới
            setMessage({ type: 'warning', content: duplicateHandler.warningMessage });

            setTimeout(async () => {
              await performUpdate(duplicateHandler.newFields, true);
            }, 1000);
            return;
          }
        }

        // Nếu không thể xử lý hoặc đã retry, hiển thị lỗi
        const errMsg = err.data?.message || err.message || 'Có lỗi khi cập nhật.';
        setMessage({ type: 'error', content: errMsg });
        toast.error(errMsg);
      }
    };

    // Bắt đầu quá trình update
    await performUpdate(changedFields);
  };

  const handleDeleteUser = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này không?')) return;
    try {
      await deleteUser(userId).unwrap();
      setMessage({ type: 'success', content: 'Xóa người dùng thành công!' });
      setTimeout(() => {
        navigate('/admin/listuser');
      }, 1500);
    } catch (err) {
      console.error('Lỗi khi xóa user:', err);
      const errMsg = err.data?.message || 'Có lỗi khi xóa user.';
      toast.error(errMsg);
    }
  };

  // 6. Error state
  if (isUserError) {
    return <p className="text-danger">Lỗi khi tải thông tin người dùng.</p>;
  }

  return (
    <div className="admin-main-content">
      <div className="Create-user">
        <div className="card p-4">
          <div className="d-flex justify-content-between mb-3">
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/admin/listuser')}
              disabled={isUpdating || isDeleting}
            >
              <i className="fas fa-arrow-left"></i> Quay lại
            </button>
            <div>
              <button
                type="submit"
                form="updateUserForm"
                className="btn btn-primary me-2"
                disabled={isUpdating || isDeleting}
              >
                {isUpdating ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save"></i> Lưu Update
                  </>
                )}
              </button>
              <button className="btn btn-danger" onClick={handleDeleteUser} disabled={isUpdating || isDeleting}>
                {isDeleting ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Đang xóa...
                  </>
                ) : (
                  <>
                    <i className="fas fa-trash"></i> Xóa User
                  </>
                )}
              </button>
            </div>
          </div>

          {isLoadingUser && <p>Đang tải thông tin người dùng...</p>}

          {message.content && (
            <div
              className={`alert ${
                message.type === 'error'
                  ? 'alert-danger'
                  : message.type === 'warning'
                    ? 'alert-warning'
                    : message.type === 'info'
                      ? 'alert-info'
                      : 'alert-success'
              }`}
            >
              {message.content}
            </div>
          )}

          <form id="updateUserForm" onSubmit={handleSubmit}>
            <div className="input-create mb-3">
              <label className="form-label">User</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="form-control"
                placeholder="Nhập họ tên"
                required
              />
            </div>

            <div className="input-create mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
                placeholder="Nhập Email"
                required
              />
            </div>

            <div className="input-create mb-3">
              <label className="form-label">Mật Khẩu Mới (để trống nếu không đổi)</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control"
                placeholder="Nhập mật khẩu mới"
              />
            </div>

            <div className="input-create mb-3">
              <label className="form-label">Xác nhận Mật Khẩu Mới</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-control"
                placeholder="Nhập lại mật khẩu mới"
              />
            </div>

            <div className="input-create mb-3">
              <label className="form-label">Số điện thoại</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-control"
                placeholder="Nhập số điện thoại"
              />
            </div>

            <div className="input-create mb-3">
              <label className="form-label">Role</label>
              <select name="role" value={formData.role} onChange={handleChange} className="form-select">
                <option value={1}>USER</option>
                <option value={0}>ADMIN</option>
              </select>
            </div>

            <div className="input-create mb-3 text-center">
              <label className="form-label d-block">Avatar</label>
              <div className="update-avatar-container" onClick={openFilePicker} style={{ cursor: 'pointer' }}>
                {selectedImage ? (
                  <img src={selectedImage} alt="avatar" className="avatar-preview" />
                ) : (
                  <img src="/images/default-avatar.jpg" alt="avatar" />
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateUser;
