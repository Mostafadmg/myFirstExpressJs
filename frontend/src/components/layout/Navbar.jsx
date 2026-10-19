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
        <span className="brand-mark" aria-hidden="true">M</span>
        <span>Marketspace<span className="brand-period">.</span></span>
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
          <NavLink to="/" end onClick={closeMenu}>Discover</NavLink>
          <NavLink to="/search" onClick={closeMenu}>Search</NavLink>
          <NavLink to="/listings/new" onClick={closeMenu}>Sell with us</NavLink>
        </nav>
        <div className="nav-actions">
          {currentUser ? (
            <>
              <Link to="/cart" className="nav-bag" onClick={closeMenu} aria-label="Open your basket">
                <span aria-hidden="true">Bag</span>
              </Link>
              <details className="account-menu">
                <summary aria-label="Account menu">
                  <span className="account-avatar" aria-hidden="true">
                    {currentUser.name?.trim().charAt(0) || "M"}
                  </span>
                  <span className="account-name">{currentUser.name || "My account"}</span>
                  <span className="account-chevron" aria-hidden="true" />
                </summary>
                <div className="account-dropdown">
                  <NavLink to={`/profile/${currentUser.id}`} onClick={closeMenu}>My profile</NavLink>
                  <NavLink to="/notifications" onClick={closeMenu}>Notifications</NavLink>
                  <NavLink to="/messages" onClick={closeMenu}>Messages</NavLink>
                  <NavLink to="/orders" onClick={closeMenu}>Orders</NavLink>
                  <NavLink to="/bookings/mine" onClick={closeMenu}>Bookings</NavLink>
                  <RoleGate allow={[ROLES.ADMIN]}>
                    <NavLink to="/admin" onClick={closeMenu}>Admin</NavLink>
                  </RoleGate>
                  <button type="button" onClick={() => { closeMenu(); logout(); }}>Log out</button>
                </div>
              </details>
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
