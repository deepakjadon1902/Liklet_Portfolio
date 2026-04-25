import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminApiFetch } from "../adminApi";
import { setAdminToken } from "../adminAuth";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("liket108admin@gmail.com");
  const [password, setPassword] = useState("liket108admin@");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const data = await adminApiFetch<{ ok: boolean; token: string }>("/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setAdminToken(data.token);
      navigate("/admin/dashboard", { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md card-premium p-6">
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">Admin Login</h1>
        <p className="text-muted-foreground mb-6">Sign in to manage services and packages.</p>

        {error ? (
          <div className="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-foreground">
            {error}
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-accent"
              autoComplete="username"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-accent"
              autoComplete="current-password"
              required
            />
          </div>
          <button disabled={isLoading} className="btn-accent w-full">
            {isLoading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
