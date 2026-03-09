import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../api/auth";
import api from "../api/axios"

function ProfilePage() {

  const navigate = useNavigate();

  // const [user] = useState({
  //   name: "Иван Петров",
  //   email: "ivan@email.com",
  //   phone: "+7 999 123 45 67",
  //   joined: "Март 2024"
  // });

  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [phone, setPhone] = useState(null);
  const [joined, setJoined] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [usersRes] = await Promise.all([
          api.get('/users/me'),

        ])
        setName(usersRes.data.name);
        setEmail(usersRes.data.email);
        setPhone(usersRes.data.phone);
        setJoined(usersRes.data.joined);
      } catch (err) {
        setError("Не удалось загрузить данные");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="dashboard"><p>Загрузка...</p></div>;
  }

  if (error) {
    return <div className="dashboard"><p>{error}</p></div>;
  }
  
  async function handleClick(e) {
    e.preventDefault();
    logout();
    navigate('/');
  }

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Профиль</h1>
        <div className="profile-container">
        <div className="widget profile-card">
          <div className="profile-header">
            <div className="avatar">
              {name.charAt(0)}
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

          <div className="profile-actions">
            <button className="login-btn">Изменить данные</button>
            <button onClick={handleClick} className="logout-btn">Выйти</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;