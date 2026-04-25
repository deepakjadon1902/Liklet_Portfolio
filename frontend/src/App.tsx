import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import WebDevelopment from "./pages/WebDevelopment";
import SocialMediaMarketing from "./pages/SocialMediaMarketing";
import DigitalMarketing from "./pages/DigitalMarketing";
import VideoEditing from "./pages/VideoEditing";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";
import ServiceContact from "./pages/ServiceContact";
import ServicePackages from "./pages/ServicePackages";
import AdminRoutes from "./admin/AdminRoutes";

const queryClient = new QueryClient();

const LayoutRoute = () => (
  <Layout>
    <Outlet />
  </Layout>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route element={<LayoutRoute />}>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/it-services" element={<WebDevelopment />} />
            <Route path="/web-development" element={<Navigate to="/it-services" replace />} />
            <Route
              path="/it-services/contact"
              element={<ServiceContact pageTitle="IT Services" defaultSubject="Frontend Development" />}
            />
            <Route path="/social-media-marketing" element={<SocialMediaMarketing />} />
            <Route
              path="/social-media-marketing/contact"
              element={<ServiceContact pageTitle="Social Media Marketing" defaultSubject="Instagram" />}
            />
            <Route path="/services/:slug" element={<ServicePackages />} />
            <Route path="/digital-marketing" element={<DigitalMarketing />} />
            <Route
              path="/digital-marketing/contact"
              element={<ServiceContact pageTitle="Digital Marketing" defaultSubject="SEO" />}
            />
            <Route path="/video-editing" element={<VideoEditing />} />
            <Route
              path="/video-editing/contact"
              element={<ServiceContact pageTitle="Video Editing & Reviews" defaultSubject="YouTube Editing" />}
            />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
