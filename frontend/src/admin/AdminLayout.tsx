import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import { clearAdminToken } from "./adminAuth";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
    isActive ? "bg-accent text-accent-foreground" : "text-foreground/80 hover:text-foreground hover:bg-muted"
  }`;

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/services", label: "Services" },
  { to: "/admin/packages", label: "Packages" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/payments", label: "Payments" },
  { to: "/admin/users", label: "Users" },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  const logout = () => {
    clearAdminToken();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="container-max px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-3">
          <div className="font-display font-bold text-lg">Liklet Admin</div>
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="md:hidden inline-flex items-center justify-center rounded-lg border border-border bg-background px-3 py-2 text-sm hover:bg-muted"
                  aria-label="Open admin menu"
                >
                  <Menu className="w-4 h-4" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="p-4">
                <SheetHeader className="text-left">
                  <SheetTitle>Admin Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-4 grid gap-1">
                  {navItems.map((item) => (
                    <SheetClose asChild key={item.to}>
                      <NavLink to={item.to} className={linkClass}>
                        {item.label}
                      </NavLink>
                    </SheetClose>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <SheetClose asChild>
                    <button
                      type="button"
                      onClick={logout}
                      className="w-full text-left text-sm px-3 py-2 rounded-lg bg-muted hover:bg-muted/80"
                    >
                      Logout
                    </button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>

            <button
              onClick={logout}
              className="hidden md:inline-flex text-sm px-3 py-2 rounded-lg bg-muted hover:bg-muted/80"
            >
              Logout
            </button>
          </div>
        </div>
        <div className="container-max px-4 sm:px-6 lg:px-8 pb-4 hidden md:flex flex-wrap gap-2">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
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
