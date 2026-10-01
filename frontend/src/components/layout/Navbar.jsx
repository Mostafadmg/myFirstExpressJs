import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { ROLES } from "../../utils/constants.js";
import { RoleGate } from "../common/RoleGate.jsx";

export function Navbar() {
  const { currentUser, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className={`nav ${menuOpen ? "is-open" : ""}`}>
      <Link to="/" className="brand" onClick={closeMenu}>
        <span className="brand-mark">M</span>
        Marketspace
      </Link>
      <button
        className="btn secondary menu-toggle"
        type="button"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? "Close" : "Menu"}
      </button>
      <div className="nav-panel">
        <nav className="nav-links">
          <NavLink to="/" end onClick={closeMenu}>Browse</NavLink>
          <NavLink to="/listings/new" onClick={closeMenu}>Add listing</NavLink>
        </nav>
        <div className="nav-actions">
          {currentUser ? (
            <>
              <Link to="/notifications" onClick={closeMenu}>Notifications</Link>
              <Link to="/messages" onClick={closeMenu}>Messages</Link>
              <Link to="/cart" onClick={closeMenu}>Cart</Link>
              <Link to="/orders" onClick={closeMenu}>Orders</Link>
              <Link to="/bookings/mine" onClick={closeMenu}>Bookings</Link>
              <Link to={`/profile/${currentUser.id}`} onClick={closeMenu}>Profile</Link>
              <RoleGate allow={[ROLES.ADMIN]}>
                <Link to="/admin" onClick={closeMenu}>Admin</Link>
              </RoleGate>
              <button className="btn secondary" onClick={() => { closeMenu(); logout(); }}>Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu}>Log in</Link>
              <Link to="/register" className="btn" onClick={closeMenu}>Sign up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
