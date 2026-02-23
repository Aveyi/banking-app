import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <div className="sidenav">
      <nav>
            <ul>
              <li><NavLink to="/dashboard">Dashboard</NavLink></li>
              <li><NavLink to="/accounts">Accounts</NavLink></li>
              <li><NavLink to="/transfer">Transfer</NavLink></li>
              <li><NavLink to="/analytics">Analytics</NavLink></li>
              <li><NavLink to="/profile">Profile</NavLink></li>
            </ul>
      </nav>
    </div>
  );
}

export default Navbar;