export async function loadRazorpayCheckout() {
  if (typeof window === "undefined") return;
  if ((window as unknown as { Razorpay?: unknown }).Razorpay) return;

  const existingScript = document.querySelector<HTMLScriptElement>('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
  if (existingScript) {
    await new Promise<void>((resolve, reject) => {
      if ((window as unknown as { Razorpay?: unknown }).Razorpay) {
        resolve();
        return;
      }
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Failed to load Razorpay Checkout")), { once: true });
    });
    return;
  }

  await new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay Checkout"));
    document.body.appendChild(script);
  });
}
