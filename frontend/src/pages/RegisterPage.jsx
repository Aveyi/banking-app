import { NavLink } from "react-router-dom";

function RegisterPage() {
  return(
<div className="login-container">
        <div className="login-card">
            <div className="login-header">
                <h2>Привет!👋</h2>
                <p>Заполните, чтобы продолжить.</p>
            </div>
            <form className="login-form" id="loginForm" noValidate>
                <div className="form-group">
                    <div className="input-wrapper">
                        <input type="text" id="name" name="name" required/>
                        <label htmlFor="name">Ваше имя</label>
                    </div>
                    <span className="error-message" id="nameError"></span>
                </div>
                <div className="form-group">
                    <div className="input-wrapper">
                        <input type="email" id="email" name="email" required autoComplete="email"/>
                        <label htmlFor="email">Email</label>
                    </div>
                    <span className="error-message" id="emailError"></span>
                </div>
                <div className="form-group">
                    <div className="input-wrapper">
                        <input type="tel" id="phone" name="phone" required autoComplete="tel"/>
                        <label htmlFor="phone">Телефон</label>
                    </div>
                    <span className="error-message" id="phoneError"></span>
                </div>
                <div className="form-group">
                    <div className="input-wrapper password-wrapper">
                        <input type="password" id="password" name="password" required autoComplete="new-password"/>
                        <label htmlFor="password">Пароль</label>
                    </div>
                    <span className="error-message" id="passwordError"></span>
                </div>
                <div className="form-group">
                    <div className="input-wrapper password-wrapper">
                        <input type="password" id="confirmPassword" name="confirmPassword" required autoComplete="new-password"/>
                        <label htmlFor="confirmPassword">Подтверждение пароля</label>
                    </div>
                    <span className="error-message" id="confirmPasswordError"></span>
                </div>
                <button type="submit" className="login-btn">
                    <span className="btn-text">Стать клиентом</span>
                    <span className="btn-loader"></span>
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