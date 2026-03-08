import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { login } from "../api/auth";

function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    
    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    
    const newErrors = {};
    if (!email) newErrors.email = 'Введите email';
    if (!password) newErrors.password = 'Введите пароль';
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.status === 401) {
        setErrors({ general: 'Неверный email или пароль' });
      } else {
        setErrors({ general: 'Ошибка сервера. Попробуйте позже' });
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
          <p>Войдите в онлайн-банк</p>
        </div>
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          
          {/* Общая ошибка */}
          {errors.general && (
            <div className="error-message" style={{ marginBottom: '12px' }}>
              {errors.general}
            </div>
          )}
          
          <div className="form-group">
            <div className="input-wrapper">
              <input type="email" id="email" name="email" required autoComplete="email" />
              <label htmlFor="email">Email</label>
            </div>
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <div className="input-wrapper password-wrapper">
              <input type="password" id="password" name="password" required autoComplete="current-password" />
              <label htmlFor="password">Пароль</label>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
          
          <button type="submit" className="login-btn" disabled={loading}>
            <span className="btn-text">{loading ? 'Входим...' : 'Войти'}</span>
            {loading && <span className="btn-loader"></span>}
          </button>
        </form>
        
        <div className="signup-link">
          <p>Нет аккаунта? <NavLink to="/register">Стать клиентом банка</NavLink></p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;