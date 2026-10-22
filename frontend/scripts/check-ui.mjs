import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createServer } from "vite";

// Render every route without sending enquiries, signing in, or calling production APIs.
const originalFetch = globalThis.fetch;
globalThis.fetch = () => {
  throw new Error("Network access is disabled in UI checks");
};
const originalError = console.error;
console.error = (...args) => {
  if (String(args[0]).includes("useLayoutEffect does nothing on the server")) return;
  originalError(...args);
};
const server = await createServer({ server: { middlewareMode: true }, appType: "custom" });
const load = async (path) => (await server.ssrLoadModule("/src/" + path + ".tsx")).default;
const decode = (text) =>
  text
    .replace(/&amp;/g, "&")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"');

function checkFields(html, path) {
  const labels = [...html.matchAll(/<label\b([^>]*)>([\s\S]*?)<\/label>/g)];
  const labelledIds = new Set(
    labels.map((label) => label[1].match(/\bfor="([^"]+)"/)?.[1]).filter(Boolean),
  );
  for (const [tag] of html.matchAll(/<(?:input|select|textarea)\b[^>]*>/g)) {
    if (/type="hidden"/.test(tag)) continue;
    const id = tag.match(/\bid="([^"]+)"/)?.[1];
    assert.ok(
      (id && labelledIds.has(id)) ||
        /aria-label(?:ledby)?=/.test(tag) ||
        labels.some((label) => label[2].includes(tag)),
      path + ": field needs an associated label: " + tag.slice(0, 120),
    );
  }
}

try {
  const Layout = await load("components/layout/Layout");
  const AdminLayout = await load("admin/AdminLayout");
  const clients = [];
  const rendered = new Map();
  async function render(path, componentPath, props = {}, seed = [], errorKey) {
    const Component = await load(componentPath);
    const client = new QueryClient({
      defaultOptions: {
        queries: { retry: false, retryOnMount: false, refetchOnMount: false, staleTime: Infinity },
      },
    });
    clients.push(client);
    for (const [key, data] of seed) client.setQueryData(key, data);
    if (errorKey) {
      const query = client.getQueryCache().build(client, { queryKey: errorKey });
      query.setState({
        status: "error",
        error: new Error("Fixture service unavailable"),
        fetchStatus: "idle",
      });
    }
    const route = path.startsWith("/services/")
      ? "/services/:slug"
      : path.startsWith("/checkout/")
        ? "/checkout/:packageId"
        : path.split("?")[0];
    const content = React.createElement(Component, props);
    const element = path.startsWith("/admin/")
      ? path === "/admin/login"
        ? React.createElement(Route, { path: route, element: content })
        : React.createElement(
            Route,
            { element: React.createElement(AdminLayout) },
            React.createElement(Route, { path: route, element: content }),
          )
      : React.createElement(Route, {
          path: route,
          element: React.createElement(Layout, null, content),
        });
    const html = renderToStaticMarkup(
      React.createElement(
        QueryClientProvider,
        { client },
        React.createElement(
          MemoryRouter,
          { initialEntries: [path] },
          React.createElement(Routes, null, element),
        ),
      ),
    );
    assert.equal((html.match(/<h1\b/g) || []).length, 1, path + ": expected one page heading");
    assert.ok(
      !/Tip: set|VITE_GOOGLE_CLIENT_ID|TechStart India|Avg ROAS|Client Satisfaction|Platform health|Ready for review/.test(
        html,
      ),
      path + ": unexpected placeholder or developer content",
    );
    for (const match of html.matchAll(/<img\b[^>]*src="(\/[^\"]+)"/g)) {
      assert.ok(
        existsSync(resolve("public", decodeURIComponent(match[1].slice(1)))),
        path + ": missing image " + match[1],
      );
    }
    checkFields(html, path);
    if (!path.startsWith("/admin")) {
      assert.ok(html.includes("/images/logo.jpg"), path + ": keep the existing Liklet logo");
      assert.ok(html.includes('id="main-content"'), path + ": main landmark");
      assert.ok(html.includes("Skip to content"), path + ": skip link");
    }
    rendered.set(path, html);
    console.log("PASS " + path);
    return html;
  }

  for (const [path, page] of [
    ["/", "Index"],
    ["/about", "About"],
    ["/it-services", "WebDevelopment"],
    ["/digital-marketing", "DigitalMarketing"],
    ["/video-editing", "VideoEditing"],
    ["/contact", "Contact"],
    ["/auth?redirect=%2F", "Auth"],
    ["/privacy-policy", "PrivacyPolicy"],
    ["/terms-of-service", "TermsOfService"],
    ["/my-orders", "MyOrders"],
    ["/missing-page", "NotFound"],
  ])
    await render(path, "pages/" + page);

  for (const [path, pageTitle, defaultSubject] of [
    ["/it-services/contact", "IT Services", "Business Website"],
    ["/social-media-marketing/contact", "Social Media Marketing", "Instagram"],
    ["/digital-marketing/contact", "Digital Marketing", "SEO"],
    ["/video-editing/contact", "Video Editing & Reviews", "YouTube Editing"],
  ]) {
    await render(path, "pages/ServiceContact", { pageTitle, defaultSubject });
  }
  const crmHtml = await render(
    "/it-services/contact?subject=CRM%20%26%20Customer%20Management",
    "pages/ServiceContact",
    { pageTitle: "IT Services", defaultSubject: "Business Website" },
  );
  assert.match(crmHtml, /<option[^>]*value="CRM &amp; Customer Management"[^>]*selected/);

  const platforms = [
    "youtube",
    "facebook",
    "instagram",
    "twitter-x",
    "linkedin",
    "tiktok",
    "telegram",
    "whatsapp-business",
  ].map((slug, index) => ({ _id: "fixture-" + index, slug, name: slug }));
  const socialHtml = await render("/social-media-marketing", "pages/SocialMediaMarketing", {}, [
    [["public-services", "social-media"], { services: platforms }],
  ]);
  for (const platform of platforms)
    assert.ok(socialHtml.includes('href="/services/' + platform.slug + '"'));
  const failedSocial = await render(
    "/social-media-marketing?unavailable",
    "pages/SocialMediaMarketing",
    {},
    [],
    ["public-services", "social-media"],
  );
  assert.ok(failedSocial.includes("Packages are temporarily unavailable"));
  assert.ok(failedSocial.includes("Ask about services"));

  const service = { _id: "fixture-service", slug: "instagram", name: "Instagram" };
  const packages = ["Basic", "Premium", "Elite"].map((name, index) => ({
    _id: "fixture-package-" + index,
    serviceId: service._id,
    name,
    priceInr: 1000 * (index + 1),
    interval: "mo",
    features: ["Fixture deliverable"],
    isPopular: index === 1,
  }));
  const packageHtml = await render("/services/instagram", "pages/ServicePackages", {}, [
    [["public-service", "instagram"], { service, packages }],
  ]);
  assert.equal((packageHtml.match(/href="\/checkout\/fixture-package-/g) || []).length, 3);
  await render("/services/empty", "pages/ServicePackages", {}, [
    [["public-service", "empty"], { service: { ...service, slug: "empty" }, packages: [] }],
  ]);
  await render(
    "/services/unavailable",
    "pages/ServicePackages",
    {},
    [],
    ["public-service", "unavailable"],
  );
  await render("/checkout/fixture-package-0", "pages/Checkout", {}, [
    [["public-package", "fixture-package-0"], { service, package: packages[0] }],
  ]);
  await render("/profile", "pages/Profile", {}, [
    [
      ["account-profile"],
      {
        ok: true,
        profile: {
          id: "fixture-user",
          name: "Test account",
          email: "test@example.invalid",
          isEmailVerified: true,
        },
      },
    ],
    [["account-orders"], { ok: true, orders: [] }],
  ]);

  await render(
    "/checkout/unavailable",
    "pages/Checkout",
    {},
    [],
    ["public-package", "unavailable"],
  );

  await render("/admin/login", "admin/pages/AdminLogin");
  await render("/admin/dashboard", "admin/pages/AdminDashboard", {}, [
    [["admin-dashboard"], { ok: true, stats: { users: 1, services: 8, orders: 0, payments: 0 } }],
  ]);
  for (const [path, page] of [
    ["services", "AdminServices"],
    ["packages", "AdminPackages"],
    ["orders", "AdminOrders"],
    ["payments", "AdminPayments"],
    ["users", "AdminUsers"],
  ])
    await render("/admin/" + path, "admin/pages/" + page);

  await render("/admin/services?populated", "admin/pages/AdminServices", {}, [
    [
      ["admin-services"],
      { services: [{ ...service, type: "social-media", isActive: true, features: [] }] },
    ],
  ]);
  await render("/admin/packages?populated", "admin/pages/AdminPackages", {}, [
    [["admin-services"], { services: [service] }],
    [["admin-packages", ""], { packages }],
  ]);

  // Every service-specific enquiry link must select a real, client-friendly option.
  const optionValues = new Set(
    [...crmHtml.matchAll(/<option\b[^>]*value="([^"]+)"/g)].map((match) => decode(match[1])),
  );
  for (const [path, html] of rendered)
    for (const match of html.matchAll(/href="([^"]+\?subject=[^"]+)"/g)) {
      const url = new URL(decode(match[1]), "https://example.invalid");
      assert.ok(
        optionValues.has(url.searchParams.get("subject")),
        path + ": enquiry subject must exist",
      );
    }
  const { withCallingCode } = await server.ssrLoadModule("/src/lib/countries.ts");
  assert.equal(withCallingCode("IN", "9634359003"), "+91 9634359003");
  assert.equal(withCallingCode("US", "202 555 0123"), "+1 202 555 0123");
  assert.equal(withCallingCode("GB", "7700 900123"), "+44 7700 900123");
  assert.equal(
    withCallingCode("IN", "+44 7700 900123"),
    "+44 7700 900123",
    "Do not duplicate a pasted international prefix",
  );
  assert.equal(withCallingCode("US", "0044 7700 900123"), "+44 7700 900123");
  assert.equal(withCallingCode("IN", "  "), "", "An optional empty phone must stay empty");
  const CountryPhoneInput = await load("components/ui/country-phone-input");
  for (const [countryId, code] of [
    ["IN", "+91"],
    ["US", "+1"],
    ["GB", "+44"],
  ]) {
    const phoneHtml = renderToStaticMarkup(
      React.createElement(CountryPhoneInput, {
        id: "phone-fixture",
        countryId,
        value: "1234567890",
        onChange() {},
        onCountryChange() {},
      }),
    );
    assert.ok(
      phoneHtml.includes("https://flagcdn.com/w40/" + countryId.toLowerCase() + ".png"),
      "Selected country needs its flag image",
    );
    assert.ok(phoneHtml.includes("(" + code + ")"), "Selected country needs its calling code");
  }
  const contactHtml = rendered.get("/contact");
  for (const detail of [
    "2020 Forestview Road, Apt#206",
    "Rockford, IL-61108",
    "Uttar Pradesh",
    "281121",
    "Monday - Friday: 9AM - 6PM",
    "Saturday: 10AM - 4PM",
    "Sunday: Closed",
  ])
    assert.ok(contactHtml.includes(detail), "Restore the supplied contact details: " + detail);
  assert.ok(contactHtml.includes('id="enquiry-address"'), "Contact form includes an address field");
  assert.ok(
    contactHtml.includes('autoComplete="tel-national"'),
    "Contact form includes the international phone control",
  );
  const homeHtml = rendered.get("/");
  const heroVideos = [...homeHtml.matchAll(/<video\b[^>]*src="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(
    heroVideos,
    [
      "/hero%20section/development.mp4",
      "/hero%20section/Socialmedia.mp4",
      "/hero%20section/digitalmarketing.mp4",
    ],
    "Keep the original three hero videos in their original order",
  );
  assert.ok(
    homeHtml.indexOf("<video") < homeHtml.indexOf("<h1"),
    "Videos belong behind the homepage hero heading",
  );
  for (const src of heroVideos)
    assert.ok(
      existsSync(resolve("public", decodeURIComponent(src.slice(1)))),
      "Missing hero video " + src,
    );
  assert.ok(existsSync("public/brand/google-g.png"), "Official Google logo must be present");
  for (const client of clients) client.clear();
  console.log(
    "UI checks passed for " + rendered.size + " routes and states. No external requests were made.",
  );
} finally {
  await server.close();
  globalThis.fetch = originalFetch;
  console.error = originalError;
}
