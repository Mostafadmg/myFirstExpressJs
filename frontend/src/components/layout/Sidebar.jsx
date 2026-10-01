import { NavLink } from "react-router-dom";

// Reused by both the seller dashboard area and the admin area — pass in
// whatever set of links applies.
export function Sidebar({ links }) {
  return (
    <nav className="card side-nav">
      {links.map((link) => (
        <NavLink key={link.to} to={link.to} end>
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}
