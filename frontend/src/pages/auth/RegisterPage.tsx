import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import Button from "../../components/common/Button";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password })
      });

      // Auto-login after registration
      await login(email, password, true);
      navigate("/home", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-container">
      <div className="panel p-8 max-w-md mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Create account</h2>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <label className="text-sm">Name
            <input className="input mt-2" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label className="text-sm">Email
            <input className="input mt-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label className="text-sm">Password
            <input className="input mt-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          {error && <p className="text-sm text-accent">{error}</p>}
          <Button type="submit" disabled={submitting}>{submitting ? 'Creating...' : 'Create account'}</Button>
        </form>
      </div>
    </div>
  );
}
