import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../api/auth";
import api from "../api/axios";

function ProfilePage() {
  const navigate = useNavigate();

  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [phone, setPhone] = useState(null);
  const [joined, setJoined] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Состояние формы редактирования
  const [editing, setEditing] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.get('/users/me/');
        setName(res.data.name);
        setEmail(res.data.email);
        setPhone(res.data.phone);
        setJoined(res.data.joined);
      } catch (err) {
        setError("Не удалось загрузить данные");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Открываем форму — заполняем текущими значениями
  function handleEditClick() {
    setNewEmail(email);
    setNewPhone(phone);
    setUpdateError(null);
    setUpdateSuccess(null);
    setEditing(true);
  }

  async function handleUpdate() {
    setUpdateError(null);
    setUpdateSuccess(null);
    setUpdating(true);

    try {
      const res = await api.patch('/users/me/update/', {
        email: newEmail,
        phone: newPhone,
      });

      // Обновляем данные на странице
      setEmail(res.data.email);
      setPhone(res.data.phone);
      setUpdateSuccess('Данные успешно обновлены');
      setEditing(false);

    } catch (err) {
      setUpdateError(err.response?.data?.error ?? 'Ошибка при обновлении');
    } finally {
      setUpdating(false);
    }
  }

  async function handleLogout(e) {
    e.preventDefault();
    logout();
    navigate('/');
  }

  if (loading) return <div className="dashboard"><p>Загрузка...</p></div>;
  if (error) return <div className="dashboard"><p>{error}</p></div>;

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Профиль</h1>
      <div className="profile-container">
        <div className="widget profile-card">
          <div className="profile-header">
            <div className="avatar">
              {name?.charAt(0) ?? '?'}
            </div>
            <h2>{name}</h2>
          </div>

          <div className="profile-info">
            <div className="profile-row">
              <span>Email</span>
              <span>{email}</span>
            </div>
            <div className="profile-row">
              <span>Телефон</span>
              <span>{phone}</span>
            </div>
            <div className="profile-row">
              <span>Клиент с</span>
              <span>{joined}</span>
            </div>
          </div>

          {/* Форма редактирования — показывается только когда editing=true */}
          {editing && (
            <div className="edit-form">
              <div className="form-group">
                <div className="input-wrapper">
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                  <label>Новый Email</label>
                </div>
              </div>
              <div className="form-group">
                <div className="input-wrapper">
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                  />
                  <label>Новый телефон</label>
                </div>
              </div>

              {updateError && <p style={{ color: 'red' }}>{updateError}</p>}
              {updateSuccess && <p style={{ color: 'green' }}>{updateSuccess}</p>}

              <div className="profile-actions">
                <button className="login-btn" onClick={handleUpdate} disabled={updating}>
                  {updating ? 'Сохраняем...' : 'Сохранить'}
                </button>
                <button className="logout-btn" onClick={() => setEditing(false)}>
                  Отмена
                </button>
              </div>
            </div>
          )}

          <div className="profile-actions">
            {!editing && (
              <button className="login-btn" onClick={handleEditClick}>
                Изменить данные
              </button>
            )}
            <button className="logout-btn" onClick={handleLogout}>
              Выйти
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProfilePage;