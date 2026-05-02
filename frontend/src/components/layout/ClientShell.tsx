import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Button from "../common/Button";

type ClientShellProps = {
  children: React.ReactNode;
};

const navItems = [
  { to: "/home", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/reservations", label: "Reservations" }
];

export default function ClientShell({ children }: ClientShellProps) {
  const { user, logout } = useAuth();

  return (
    <div className="app-container">
      <header className="panel flex flex-wrap items-center justify-between gap-4 p-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-content/50">Barber</p>
          <h1 className="text-2xl font-semibold">Client Lounge</h1>
        </div>
        <nav className="flex flex-wrap items-center gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive ? "bg-accent text-white" : "bg-white/60 text-content hover:bg-surface"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <span className="chip">{user?.name || "Guest"}</span>
          <Button variant="ghost" onClick={logout}>Log out</Button>
        </div>
      </header>

      <main className="mt-6 flex flex-col gap-6">{children}</main>
    </div>
  );
}
