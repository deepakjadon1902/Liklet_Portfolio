import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { clearAdminToken } from "./adminAuth";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
    isActive ? "bg-accent text-accent-foreground" : "text-foreground/80 hover:text-foreground hover:bg-muted"
  }`;

export default function AdminLayout() {
  const navigate = useNavigate();

  const logout = () => {
    clearAdminToken();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="container-max py-4 flex items-center justify-between">
          <div className="font-display font-bold text-lg">Liklet Admin</div>
          <button onClick={logout} className="text-sm px-3 py-2 rounded-lg bg-muted hover:bg-muted/80">
            Logout
          </button>
        </div>
        <div className="container-max pb-4 flex flex-wrap gap-2">
          <NavLink to="/admin/dashboard" className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/services" className={linkClass}>
            Services
          </NavLink>
          <NavLink to="/admin/packages" className={linkClass}>
            Packages
          </NavLink>
          <NavLink to="/admin/orders" className={linkClass}>
            Orders
          </NavLink>
          <NavLink to="/admin/payments" className={linkClass}>
            Payments
          </NavLink>
          <NavLink to="/admin/users" className={linkClass}>
            Users
          </NavLink>
        </div>
      </header>

      <main className="section-padding pt-8">
        <div className="container-max">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

