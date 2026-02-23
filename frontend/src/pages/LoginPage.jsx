import { NavLink } from "react-router-dom";

function LoginPage() {
  return(
<div className="login-container">
        <div className="login-card">
            <div className="login-header">
                <h2>Привет!👋</h2>
                <p>Войдите в онлайн - банк</p>
            </div>
            <form className="login-form" id="loginForm" noValidate>
                <div className="form-group">
                    <div className="input-wrapper">
                        <input type="email" id="email" name="email" required autoComplete="email"/>
                        <label htmlFor="email">Email</label>
                    </div>
                    <span className="error-message" id="emailError"></span>
                </div>
                <div className="form-group">
                    <div className="input-wrapper password-wrapper">
                        <input type="password" id="password" name="password" required autoComplete="current-password"/>
                        <label htmlFor="password">Пароль</label>
                    </div>
                    <span className="error-message" id="passwordError"></span>
                </div>
                <button type="submit" className="login-btn">
                    <span className="btn-text">Войти</span>
                    <span className="btn-loader"></span>
                </button>
            </form>

            <div className="signup-link">
                <p>Нет аккаунта? <NavLink to="/register">Cтать клиентом банка</NavLink></p>
            </div>
        </div>
    </div>
  );
}

export default LoginPage;