import type { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function AdminLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();

  return (
    <div className="admin-root min-vh-100 bg-light text-body">
      <header className="admin-header border-bottom bg-white">
        <nav className="navbar navbar-expand-md navbar-light bg-white">
          <div className="container-fluid px-3 px-md-4">
            <Link to="/dashboard" className="navbar-brand d-flex align-items-center gap-2">
              <span className="badge rounded-pill bg-success text-white small px-3 py-2">
                NammaKadai Admin
              </span>
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#adminNavbar"
              aria-controls="adminNavbar"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="adminNavbar">
              <ul className="navbar-nav me-auto mb-2 mb-md-0">
                <li className="nav-item">
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      `nav-link small ${isActive ? "text-success fw-semibold" : ""}`
                    }
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/products"
                    className={({ isActive }) =>
                      `nav-link small ${isActive ? "text-success fw-semibold" : ""}`
                    }
                  >
                    Products
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/users"
                    className={({ isActive }) =>
                      `nav-link small ${isActive ? "text-success fw-semibold" : ""}`
                    }
                  >
                    Users
                  </NavLink>
                </li>
              </ul>
              <div className="admin-header-right d-flex align-items-center gap-2 small">
                {user && (
                  <span className="text-muted admin-header-user text-truncate d-none d-sm-inline">
                    {user.email} · <span className="text-uppercase">{user.roles.join(", ")}</span>
                  </span>
                )}
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={logout}
                >
                  Log out
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>
      <div className="admin-shell container-fluid py-3 py-md-4">
        <main className="admin-main mx-auto bg-white rounded-3 shadow-sm p-3 p-md-4">
          <NavLink
            to="/users"
            className={({ isActive }) =>
              `d-none ${isActive ? "" : ""}` // keep NavLink import used; actual nav lives in header
            }
          >
            Users
          </NavLink>
          {children}
        </main>
      </div>
    </div>
  );
}

