import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { API_BASE_URL, apiFetch } from "@/lib/apiClient";
import { setUserToken } from "@/lib/userAuth";
import { useToast } from "@/hooks/use-toast";
import FlipFadeText from "@/components/ui/flip-fade-text";

type GoogleAuthResponse = { ok: true; token: string };
type GoogleClientIdResponse = { ok: true; clientId: string };

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize?: (opts: {
            client_id: string;
            callback: (resp: { credential?: string }) => void;
          }) => void;
          renderButton?: (el: HTMLElement, opts: Record<string, unknown>) => void;
        };
      };
    };
  }
}

let googleScriptPromise: Promise<void> | undefined;
function loadGoogleScript(): Promise<void> {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (googleScriptPromise) return googleScriptPromise;
  googleScriptPromise = new Promise<void>((resolve, reject) => {
    const script =
      document.querySelector<HTMLScriptElement>('script[data-google-identity="true"]') ||
      document.createElement("script");
    const timeout = window.setTimeout(() => {
      script.remove();
      reject(new Error("Google sign-in took too long to load."));
    }, 12_000);
    script.onload = () => {
      window.clearTimeout(timeout);
      resolve();
    };
    script.onerror = () => {
      window.clearTimeout(timeout);
      script.remove();
      reject(new Error("Google sign-in could not load."));
    };
    if (!script.isConnected) {
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.dataset.googleIdentity = "true";
      document.head.appendChild(script);
    }
  }).catch((error) => {
    googleScriptPromise = undefined;
    throw error;
  });
  return googleScriptPromise;
}

function localRedirect(value: string | null) {
  return value && value.startsWith("/") && !value.startsWith("//") && !value.includes("\\")
    ? value
    : "/";
}

export default function Auth() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const googleButtonRef = useRef<HTMLDivElement | null>(null);
  const redirect = useMemo(() => localRedirect(searchParams.get("redirect")), [searchParams]);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isGoogleReady, setIsGoogleReady] = useState(false);
  const [isGoogleFailed, setIsGoogleFailed] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const envGoogleClientId = (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined) || "";
  const [googleClientId, setGoogleClientId] = useState(envGoogleClientId);
  const [isClientIdLoading, setIsClientIdLoading] = useState(!envGoogleClientId.trim());

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const token = params.get("token");
    if (params.get("error")) {
      toast({
        title: "Sign-in unsuccessful",
        description: "Please try again, or contact support if you need help.",
      });
      window.location.hash = "";
      return;
    }
    if (token) {
      setUserToken(token);
      const next = params.has("redirect") ? localRedirect(params.get("redirect")) : redirect;
      window.location.hash = "";
      navigate(next, { replace: true });
    }
  }, [navigate, redirect, toast]);

  useEffect(() => {
    if (envGoogleClientId.trim()) return;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 10_000);
    let cancelled = false;
    apiFetch<GoogleClientIdResponse>("/auth/google/client-id", { signal: controller.signal })
      .then((data) => {
        if (!cancelled) setGoogleClientId((data.clientId || "").trim());
      })
      .catch(() => {
        /* The server redirect flow remains available. */
      })
      .finally(() => {
        window.clearTimeout(timeout);
        if (!cancelled) setIsClientIdLoading(false);
      });
    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [envGoogleClientId]);

  useEffect(() => {
    if (!googleClientId.trim()) return;
    let cancelled = false;
    let resizeObserver: ResizeObserver | undefined;
    setIsGoogleFailed(false);
    setIsGoogleReady(false);
    loadGoogleScript()
      .then(() => {
        if (cancelled) return;
        const google = window.google?.accounts?.id;
        if (!google?.initialize || !google?.renderButton)
          throw new Error("Google sign-in is unavailable.");
        google.initialize({
          client_id: googleClientId.trim(),
          callback: async (response) => {
            if (!response.credential) {
              toast({
                title: "Sign-in unsuccessful",
                description: "Please choose your Google account again.",
              });
              return;
            }
            setIsGoogleLoading(true);
            try {
              const data = await apiFetch<GoogleAuthResponse>("/auth/google", {
                method: "POST",
                body: JSON.stringify({ idToken: response.credential }),
              });
              setUserToken(data.token);
              navigate(redirect, { replace: true });
            } catch {
              toast({
                title: "Unable to sign in",
                description: "Please try again, or contact support if the problem continues.",
              });
            } finally {
              setIsGoogleLoading(false);
            }
          },
        });
        const renderButton = () => {
          if (cancelled || !googleButtonRef.current) return;
          const width = Math.min(
            400,
            Math.max(200, Math.floor(googleButtonRef.current.clientWidth)),
          );
          googleButtonRef.current.innerHTML = "";
          google.renderButton?.(googleButtonRef.current, {
            theme: "outline",
            size: "large",
            text: "continue_with",
            shape: "rectangular",
            logo_alignment: "left",
            width,
          });
        };
        renderButton();
        if (googleButtonRef.current) {
          resizeObserver = new ResizeObserver(renderButton);
          resizeObserver.observe(googleButtonRef.current);
        }
        setIsGoogleReady(true);
      })
      .catch(() => {
        if (!cancelled) setIsGoogleFailed(true);
      });
    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
    };
  }, [googleClientId, navigate, redirect, toast]);

  const startGoogleLogin = () => {
    setIsRedirecting(true);
    window.location.href =
      API_BASE_URL + "/auth/google/start?redirect=" + encodeURIComponent(redirect);
  };
  const showFallback = !isClientIdLoading && (!googleClientId.trim() || isGoogleFailed);

  return (
    <section className="section-padding bg-background">
      <div className="container-max max-w-5xl">
        <Link
          to="/"
          className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          Back to home
        </Link>
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
          <div className="py-2">
            <p className="eyebrow">Your Liklet account</p>
            <h1 className="page-title mt-5">
              Continue with{" "}
              <span className="block">
                <FlipFadeText words={["Google", "Confidence", "Speed"]} interval={2400} />
              </span>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-8 text-muted-foreground">
              Sign in to book a service, save your details, and review your orders.
            </p>
            <dl className="mt-8 max-w-md space-y-5 border-t border-border pt-6">
              <div className="flex gap-5">
                <dt className="pt-1 text-xs tabular-nums text-accent">01</dt>
                <dd>
                  <span className="block text-sm font-semibold">Use your Google account</span>
                  <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                    Choose the account you want to link to your bookings.
                  </span>
                </dd>
              </div>
              <div className="flex gap-5">
                <dt className="pt-1 text-xs tabular-nums text-accent">02</dt>
                <dd>
                  <span className="block text-sm font-semibold">Pick up where you left off</span>
                  <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                    Continue to your selected service or your account.
                  </span>
                </dd>
              </div>
            </dl>
          </div>
          <div className="min-w-0 rounded-xl border border-border bg-card p-6 shadow-sm sm:p-9">
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              Sign <FlipFadeText words={["in", "securely", "fast"]} interval={2400} />
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Use Google to sign in or create your account. There is no separate Liklet password.
            </p>
            <div className="mt-8 min-h-11" aria-busy={isClientIdLoading || isGoogleLoading}>
              {googleClientId.trim() && !isGoogleFailed && (
                <div ref={googleButtonRef} className="min-h-10 w-full min-w-0" />
              )}
              {!showFallback && !isGoogleReady && (
                <p role="status" className="mt-3 text-sm text-muted-foreground">
                  Loading Google sign-in...
                </p>
              )}
              {isGoogleLoading && (
                <p role="status" className="mt-3 text-sm text-muted-foreground">
                  Signing you in...
                </p>
              )}
              {showFallback && (
                <button
                  type="button"
                  onClick={startGoogleLogin}
                  disabled={isRedirecting}
                  className="google-signin-button"
                >
                  <img
                    src="/brand/google-g.png"
                    width={20}
                    height={20}
                    alt=""
                    className="h-5 w-5 shrink-0 object-contain"
                  />
                  <span>{isRedirecting ? "Opening Google..." : "Continue with Google"}</span>
                </button>
              )}
            </div>
            <p className="mt-5 text-xs leading-6 text-muted-foreground">
              Google will ask you to choose an account. You can return to Liklet after signing in.
            </p>
            <p className="mt-7 border-t border-border pt-6 text-xs leading-6 text-muted-foreground">
              By continuing, you agree to our{" "}
              <Link
                to="/terms-of-service"
                className="underline underline-offset-2 hover:text-foreground"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                to="/privacy-policy"
                className="underline underline-offset-2 hover:text-foreground"
              >
                Privacy Policy
              </Link>
              .
            </p>
            <p className="mt-5 text-xs text-muted-foreground">
              Need help?{" "}
              <a
                href="mailto:support@liklet.com"
                className="font-medium text-accent hover:underline"
              >
                Contact support
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
