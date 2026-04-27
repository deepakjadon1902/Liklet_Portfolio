import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { apiFetch } from "@/lib/apiClient";
import { setUserToken } from "@/lib/userAuth";
import { useToast } from "@/hooks/use-toast";

type GoogleAuthResponse = { ok: true; token: string };

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize?: (opts: { client_id: string; callback: (resp: { credential?: string }) => void }) => void;
          renderButton?: (el: HTMLElement, opts: Record<string, unknown>) => void;
          prompt?: () => void;
        };
      };
    };
  }
}

function loadGoogleScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) return resolve();

    const existing = document.querySelector<HTMLScriptElement>('script[data-google-identity="true"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load Google script")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.dataset.googleIdentity = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google script"));
    document.head.appendChild(script);
  });
}

export default function Auth() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const buttonRef = useRef<HTMLDivElement | null>(null);

  const redirect = useMemo(() => {
    const raw = searchParams.get("redirect");
    return raw && raw.startsWith("/") ? raw : "/";
  }, [searchParams]);

  const googleClientId = (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined) || "";
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!googleClientId.trim()) return;
    let isCancelled = false;

    loadGoogleScript()
      .then(() => {
        if (isCancelled) return;
        const google = window.google?.accounts?.id;
        if (!google?.initialize || !google?.renderButton) throw new Error("Google Identity not available");

        google.initialize({
          client_id: googleClientId.trim(),
          callback: async (resp) => {
            const idToken = resp?.credential;
            if (!idToken) {
              toast({ title: "Google sign-in failed", description: "No credential returned." });
              return;
            }

            setIsLoading(true);
            try {
              const data = await apiFetch<GoogleAuthResponse>("/auth/google", {
                method: "POST",
                body: JSON.stringify({ idToken }),
              });
              setUserToken(data.token);
              navigate(redirect, { replace: true });
            } catch (err: unknown) {
              toast({ title: "Google sign-in failed", description: err instanceof Error ? err.message : "Try again." });
            } finally {
              setIsLoading(false);
            }
          },
        });

        if (buttonRef.current) {
          buttonRef.current.innerHTML = "";
          google.renderButton(buttonRef.current, {
            theme: "outline",
            size: "large",
            text: "continue_with",
            width: 320,
            shape: "pill",
          });
        }

        setIsReady(true);
        google.prompt?.();
      })
      .catch((err: unknown) => {
        toast({ title: "Google sign-in unavailable", description: err instanceof Error ? err.message : "Try again." });
      });

    return () => {
      isCancelled = true;
    };
  }, [googleClientId, navigate, redirect, toast]);

  return (
    <div className="overflow-hidden">
      <section className="pt-28 pb-16 md:pb-24 bg-card relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-accent/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-highlight/20 blur-3xl" />
        </div>

        <div className="container-max section-padding !py-0">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="md:pt-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4 text-accent" />
                Secure checkout
              </div>

              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-4">Continue with Google</h1>
              <p className="text-muted-foreground mt-3 max-w-lg">
                We use Google Sign-In to protect your booking and keep the ordering process fast. No passwords, no email verification.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex gap-3 items-start">
                  <ShieldCheck className="w-5 h-5 text-accent mt-0.5" />
                  <div>
                    <div className="font-medium text-foreground">Safer orders</div>
                    <div className="text-sm text-muted-foreground">Your booking is linked to your Google account.</div>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <Zap className="w-5 h-5 text-accent mt-0.5" />
                  <div>
                    <div className="font-medium text-foreground">Faster checkout</div>
                    <div className="text-sm text-muted-foreground">Sign in once, then continue to payment.</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-premium p-6 md:p-8">
              <h2 className="font-display text-2xl font-bold text-foreground">Sign in</h2>
              <p className="text-muted-foreground mt-2">Click below to continue to your booking.</p>

              {!googleClientId.trim() ? (
                <div className="mt-6 rounded-lg border border-border bg-background p-4 text-sm text-muted-foreground">
                  Google sign-in is not configured. Set <span className="font-mono">VITE_GOOGLE_CLIENT_ID</span> in{" "}
                  <span className="font-mono">frontend/.env</span>.
                </div>
              ) : (
                <div className="mt-6">
                  <div ref={buttonRef} />
                  {!isReady ? <div className="text-sm text-muted-foreground mt-3">Loading Google sign-in...</div> : null}
                  {isLoading ? <div className="text-sm text-muted-foreground mt-3">Signing you in...</div> : null}
                </div>
              )}

              <div className="mt-6 text-xs text-muted-foreground">
                By continuing, you agree to our{" "}
                <Link className="underline hover:text-foreground" to="/terms-of-service">
                  Terms
                </Link>{" "}
                and{" "}
                <Link className="underline hover:text-foreground" to="/privacy-policy">
                  Privacy Policy
                </Link>
                .
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

