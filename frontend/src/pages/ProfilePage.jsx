import { useState } from "react";

function ProfilePage() {
  const [user] = useState({
    name: "Иван Петров",
    email: "ivan@email.com",
    phone: "+7 999 123 45 67",
    joined: "Март 2024"
  });

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Профиль</h1>

      <div className="profile-container">
        <div className="widget profile-card">
          <div className="profile-header">
            <div className="avatar">
              {user.name.charAt(0)}
            </div>
            <h2>{user.name}</h2>
          </div>

          <div className="profile-info">
            <div className="profile-row">
              <span>Email</span>
              <span>{user.email}</span>
            </div>

            <div className="profile-row">
              <span>Телефон</span>
              <span>{user.phone}</span>
            </div>

            <div className="profile-row">
              <span>Клиент с</span>
              <span>{user.joined}</span>
            </div>
          </div>

          <div className="profile-actions">
            <button className="login-btn">Изменить данные</button>
            <button className="logout-btn">Выйти</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;