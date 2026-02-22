import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <h2>Banking App</h2>

      <ul>
        <li><Link to="/register">Register</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/accounts">Accounts</Link></li>
        <li><Link to="/transfer">Transfer</Link></li>
        <li><Link to="/analytics">Analytics</Link></li>
        <li><Link to="/profile">Profile</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;