import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Button from "../../components/common/Button";
import { Link } from "react-router-dom";
import { apiFetch } from "../../services/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, user, loading } = useAuth();
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const  createDemoUsers = async () => {
    setError(null);
    setSubmitting(true)
    try {
      await apiFetch("/setup-demo", { method: "GET" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create demo users");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!loading && user) {
      const isStaff = user.roles.some((role) =>
        ["admin_role", "manager_role", "employee_role", "cashier_role", "admin", "employee"].includes(role)
      );
      navigate(isStaff ? "/dashboard" : "/home", { replace: true });
    }
  }, [loading, navigate, user]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password, remember);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-container">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="panel-dark p-8 md:p-12">
          <div className="flex h-full flex-col justify-between gap-10">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-surface/70">Barber Shop</p>
              <h1 className="mt-4 text-4xl font-semibold text-surface md:text-5xl">Focus. Flow. Fresh cuts.</h1>
              <p className="mt-4 text-sm text-surface/70">
                Manage the chair, the store, and the calendar in one live workspace.
              </p>
            </div>
            <div className="grid gap-4">
              <div className="rounded-2xl border border-surface/20 bg-surface/10 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-surface/60">Employee stack</p>
                <p className="mt-2 text-lg font-semibold text-surface">Sales, inventory, reservations</p>
              </div>
              <div className="rounded-2xl border border-surface/20 bg-surface/10 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-surface/60">Client lounge</p>
                <p className="mt-2 text-lg font-semibold text-surface">Book services in seconds</p>
              </div>
            </div>
          </div>
        </section>

        <section className="panel p-8 md:p-10">
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-content/50">Access</p>
              <h2 className="mt-2 text-3xl font-semibold">Sign in</h2>
              <p className="text-sm text-content/70">Use your employee or client account.</p>
            </div>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-content/60">
                Email
                <input
                  className="input mt-2"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </label>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-content/60">
                Password
                <div className="relative mt-2">
                  <input
                    className="input w-full"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-content/60"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </label>
              <label className="flex items-center gap-3 text-sm text-content/70">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember me
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="btn-ghost text-sm"
                  onClick={() => {
                    setEmail("employee@example.com");
                    setPassword("password123");
                    setRemember(true);
                  }}
                >
                  Fill demo employee
                </button>
                <button
                  type="button"
                  className="btn-ghost text-sm"
                  onClick={() => {
                    setEmail("client@example.com");
                    setPassword("password123");
                    setRemember(false);
                  }}
                >
                  Fill demo client
                </button>
                <button
                  type="button"
                  className="btn-outline text-sm ml-auto"
                  onClick={createDemoUsers}
  
                >
                  create demo users
                </button>
              </div>
              {error ? <p className="text-sm text-accent">{error}</p> : null}
              <div className="mt-2 text-sm">
                <Link to="/register" className="text-primary underline">Create an account</Link>
              </div>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Signing in..." : "Enter workspace"}
              </Button>
            </form>
            
          </div>
        </section>
      </div>
    </div>
  );
}
