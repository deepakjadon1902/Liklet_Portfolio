import { motion } from "framer-motion";

const PrivacyPolicy = () => {
  return (
    <div className="overflow-hidden">
      <section className="hero-gradient section-padding pt-32">
        <div className="container-max text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Privacy Policy
          </motion.h1>
          <p className="text-primary-foreground/80">Last updated: December 2024</p>
        </div>
      </section>
      <section className="bg-card section-padding">
        <div className="container-max max-w-4xl">
          <div className="prose prose-lg max-w-none space-y-8 text-muted-foreground">
            <div><h2 className="font-display text-2xl font-bold text-foreground">1. Information We Collect</h2><p>We collect information you provide directly: name, email, phone number, and project details. We also collect usage data through cookies and analytics.</p></div>
            <div><h2 className="font-display text-2xl font-bold text-foreground">2. How We Use Information</h2><p>We use your information to provide services, communicate about projects, send updates, and improve our offerings.</p></div>
            <div><h2 className="font-display text-2xl font-bold text-foreground">3. Data Protection</h2><p>We implement industry-standard security measures to protect your data. However, no method of transmission is 100% secure.</p></div>
            <div><h2 className="font-display text-2xl font-bold text-foreground">4. Third-Party Sharing</h2><p>We do not sell your data. We may share information with service providers who assist in our operations under strict confidentiality agreements.</p></div>
            <div><h2 className="font-display text-2xl font-bold text-foreground">5. Your Rights</h2><p>You have the right to access, correct, or delete your personal data. Contact us at privacy@liklet.com to exercise these rights.</p></div>
            <div><h2 className="font-display text-2xl font-bold text-foreground">6. Cookies</h2><p>We use cookies to enhance your experience. You can manage cookie preferences through your browser settings.</p></div>
            <div><h2 className="font-display text-2xl font-bold text-foreground">7. Contact</h2><p>For privacy inquiries, contact our Data Protection Officer at privacy@liklet.com.</p></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
