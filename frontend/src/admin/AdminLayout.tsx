import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { BarChart3, Box, CreditCard, LayoutDashboard, LogOut, Menu, Package, Users } from "lucide-react";
import { clearAdminToken } from "./adminAuth";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
    isActive ? "bg-[#4169E1] text-white shadow-md" : "text-black/70 hover:bg-white hover:text-black"
  }`;

const drawerLinkClass = ({ isActive }: { isActive: boolean }) =>
  `inline-flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-black transition-all [&>svg]:text-black ${
    isActive ? "border border-[#c5c5c5] bg-[#c5c5c5]/25" : "hover:bg-[#c5c5c5]/20"
  }`;

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/services", label: "Services", icon: Box },
  { to: "/admin/packages", label: "Packages", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: BarChart3 },
  { to: "/admin/payments", label: "Payments", icon: CreditCard },
  { to: "/admin/users", label: "Users", icon: Users },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  const logout = () => {
    clearAdminToken();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="admin-shell min-h-screen text-black">
      <header className="sticky top-0 z-40 border-b border-[#c5c5c5] bg-white/95 backdrop-blur-xl">
        <div className="container-max flex items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-black text-white">
              <span className="font-display text-xl font-bold">L</span>
            </div>
            <div>
              <div className="font-display text-xl font-bold text-black">Liklet Admin</div>
              <div className="text-xs font-medium text-black/55">Premium control center</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-lg border border-[#c5c5c5] bg-white px-3 py-2 text-sm text-black hover:border-[#4169E1] md:hidden"
                  aria-label="Open admin menu"
                >
                  <Menu className="w-4 h-4" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="border-[#c5c5c5] bg-white p-4 text-black [&>button]:text-black">
                <SheetHeader className="text-left">
                  <SheetTitle className="text-black">Admin Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-4 grid gap-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                    <SheetClose asChild key={item.to}>
                      <NavLink to={item.to} className={drawerLinkClass}>
                        <Icon className="h-4 w-4 text-black" />
                        {item.label}
                      </NavLink>
                    </SheetClose>
                    );
                  })}
                </div>
                <div className="mt-4 border-t border-[#c5c5c5] pt-4">
                  <SheetClose asChild>
                    <button
                      type="button"
                      onClick={logout}
                      className="admin-btn-secondary w-full justify-start gap-2 text-black [&>svg]:text-black"
                    >
                      <LogOut className="h-4 w-4 text-black" />
                      Logout
                    </button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>

            <button
              onClick={logout}
              className="admin-btn-secondary hidden gap-2 md:inline-flex"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
        <div className="container-max hidden flex-wrap gap-2 px-4 pb-4 sm:px-6 md:flex lg:px-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
            );
          })}
        </div>
      </header>

      <main className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="container-max">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
