import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminApiFetch } from "../adminApi";
import { setAdminToken } from "../adminAuth";
import Brand from "@/components/brand/Brand";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const data = await adminApiFetch<{ ok: boolean; token: string }>("/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setAdminToken(data.token);
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <Link to="/" aria-label="Liklet home" className="mb-8">
        <Brand />
      </Link>
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-sm sm:p-9">
        <p className="eyebrow">Team access</p>
        <h1 className="mt-4 font-display text-3xl font-semibold">Admin sign-in</h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          Sign in with your team account to manage services, packages, orders, and payments.
        </p>
        {error && (
          <p
            role="alert"
            className="mt-5 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
          >
            {error}
          </p>
        )}
        <form onSubmit={onSubmit} className="mt-7 space-y-5">
          <div>
            <label htmlFor="admin-email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-field"
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-field"
            />
          </div>
          <button type="submit" disabled={isLoading} className="btn-accent w-full">
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
      <Link to="/" className="mt-7 text-sm text-muted-foreground hover:text-foreground">
        Return to website
      </Link>
    </div>
  );
}
