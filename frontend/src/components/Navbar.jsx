import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <div className="sidenav">
      <nav>
            <ul>
              <li><NavLink to="/dashboard">Главная</NavLink></li>
              <li><NavLink to="/accounts">Счета</NavLink></li>
              <li><NavLink to="/transfer">Переводы</NavLink></li>
              <li><NavLink to="/analytics">Аналитика</NavLink></li>
              <li><NavLink to="/profile">Профиль</NavLink></li>
            </ul>
      </nav>
    </div>
  );
}

export default Navbar;