import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockKeyhole, LogIn } from "lucide-react";
import { adminApiFetch } from "../adminApi";
import { setAdminToken } from "../adminAuth";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="admin-shell flex min-h-screen items-center justify-center px-4 py-10 text-black">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-lg border border-[#c5c5c5] bg-white shadow-lg lg:grid-cols-[1fr_0.9fr]">
        <div className="bg-[#4169E1] p-8 text-white md:p-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white text-[#4169E1]">
            <LockKeyhole className="h-6 w-6" />
          </div>
          <h1 className="mt-8 font-display text-4xl font-bold">Liklet Admin</h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-white/80">
            A focused command center for services, packages, orders, payments, and user management.
          </p>
          <div className="mt-10 grid gap-3 text-sm font-semibold">
            {["White surfaces", "#c5c5c5 structure", "#4169E1 actions"].map((item) => (
              <div key={item} className="rounded-lg border border-white/20 bg-white/10 px-4 py-3">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 md:p-10">
          <div className="admin-kicker mb-2">Secure access</div>
          <h2 className="font-display text-3xl font-bold text-black">Sign in</h2>
          <p className="mt-2 text-sm leading-6 text-black/60">Manage your platform with a premium, modern workspace.</p>

          {error ? (
            <div className="mt-6 rounded-lg border border-black bg-black px-4 py-3 text-sm font-medium text-white">
              {error}
            </div>
          ) : null}

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-semibold text-black">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="admin-input mt-2"
                autoComplete="username"
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-black">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-input mt-2"
                autoComplete="current-password"
                required
              />
            </div>
            <button disabled={isLoading} className="admin-btn-primary w-full gap-2">
              <LogIn className="h-4 w-4" />
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
