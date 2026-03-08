import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { register } from "../api/auth";

function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    
    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const phone = e.target.phone.value.trim();
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;
    
    // Валидация
    const newErrors = {};
    if (!name) newErrors.name = 'Введите имя';
    if (!email) newErrors.email = 'Введите email';
    if (!phone) newErrors.phone = 'Введите телефон';
    if (!password) newErrors.password = 'Введите пароль';
    if (password.length < 8) newErrors.password = 'Пароль минимум 8 символов';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Пароли не совпадают';
    
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    try {
      await register(name, email, phone, password);
      navigate('/');
    } catch (err) {
      const serverError = err.response?.data?.error;
      if (serverError) {
        setErrors({ general: serverError });
      } else {
        setErrors({ general: 'Ошибка при регистрации. Попробуйте позже' });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Привет!👋</h2>
          <p>Заполните, чтобы продолжить.</p>
        </div>
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          
          {errors.general && (
            <div className="error-message" style={{ marginBottom: '12px' }}>
              {errors.general}
            </div>
          )}
          
          <div className="form-group">
            <div className="input-wrapper">
              <input type="text" id="name" name="name" required />
              <label htmlFor="name">Ваше имя</label>
            </div>
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>
          
          <div className="form-group">
            <div className="input-wrapper">
              <input type="email" id="email" name="email" required autoComplete="email" />
              <label htmlFor="email">Email</label>
            </div>
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <div className="input-wrapper">
              <input type="tel" id="phone" name="phone" required autoComplete="tel" />
              <label htmlFor="phone">Телефон</label>
            </div>
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>
          
          <div className="form-group">
            <div className="input-wrapper password-wrapper">
              <input type="password" id="password" name="password" required autoComplete="new-password" />
              <label htmlFor="password">Пароль</label>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
          
          <div className="form-group">
            <div className="input-wrapper password-wrapper">
              <input type="password" id="confirmPassword" name="confirmPassword" required autoComplete="new-password" />
              <label htmlFor="confirmPassword">Подтверждение пароля</label>
            </div>
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>
          
          <button type="submit" className="login-btn" disabled={loading}>
            <span className="btn-text">{loading ? 'Регистрируем...' : 'Стать клиентом'}</span>
            {loading && <span className="btn-loader"></span>}
          </button>
        </form>
        
        <div className="signup-link">
          <p>Уже есть аккаунт? <NavLink to="/">Войти</NavLink></p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;