import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Button from "../common/Button";

type AppShellProps = {
  children: React.ReactNode;
};

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/products", label: "Products" },
  { to: "/services", label: "Services" },
  { to: "/sales", label: "Sales" },
  { to: "/reservations", label: "Reservations" },
];

export default function AppShell({ children }: AppShellProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="panel-solid p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-content/50">Barber</p>
              <h1 className="text-2xl font-semibold">Admin Studio</h1>
            </div>
            <span className="badge">EMP</span>
          </div>
          <nav className="mt-8 flex flex-col gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    isActive ? "bg-primary text-white shadow-float" : "bg-white/60 text-content hover:bg-surface"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-10 rounded-2xl bg-surfaceAlt/30 p-4 text-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-content/50">Signed in</p>
            <p className="mt-2 font-semibold text-content">{user?.name || "Employee"}</p>
            <p className="text-xs text-content/60">{user?.email || "employee@shop.com"}</p>
          </div>
        </aside>

        <section className="flex flex-col gap-6">
          <header className="panel flex flex-wrap items-center justify-between gap-4 p-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-content/50">Operations</p>
              <h2 className="text-xl font-semibold">Command Center</h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="chip">Live inventory</span>
              <Button
                variant="ghost"
                onClick={() => {
                  logout();
                  navigate("/login", { replace: true });
                }}
              >
                Log out
              </Button>
            </div>
          </header>

          <main className="flex flex-col gap-6">{children}</main>
        </section>
      </div>
    </div>
  );
}
