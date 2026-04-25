import { motion } from "framer-motion";

const TermsOfService = () => {
  return (
    <div className="overflow-hidden">
      <section className="hero-gradient section-padding pt-32">
        <div className="container-max text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Terms of Service
          </motion.h1>
          <p className="text-primary-foreground/80">Last updated: December 2024</p>
        </div>
      </section>
      <section className="bg-card section-padding">
        <div className="container-max max-w-4xl">
          <div className="prose prose-lg max-w-none space-y-8 text-muted-foreground">
            <div><h2 className="font-display text-2xl font-bold text-foreground">1. Acceptance of Terms</h2><p>By accessing and using Liklet's services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p></div>
            <div><h2 className="font-display text-2xl font-bold text-foreground">2. Services Description</h2><p>Liklet provides IT services, digital marketing, social media marketing, and content creation services. The specific scope of services will be defined in individual project agreements.</p></div>
            <div><h2 className="font-display text-2xl font-bold text-foreground">3. Client Responsibilities</h2><p>Clients must provide accurate information, timely feedback, and necessary materials for project completion. Delays caused by client non-responsiveness may affect project timelines.</p></div>
            <div><h2 className="font-display text-2xl font-bold text-foreground">4. Payment Terms</h2><p>Payment terms are specified in individual project proposals. Late payments may incur additional charges and project suspension.</p></div>
            <div><h2 className="font-display text-2xl font-bold text-foreground">5. Intellectual Property</h2><p>Upon full payment, clients receive ownership of deliverables unless otherwise specified. Liklet retains the right to showcase work in portfolios.</p></div>
            <div><h2 className="font-display text-2xl font-bold text-foreground">6. Limitation of Liability</h2><p>Liklet's liability is limited to the amount paid for services. We are not liable for indirect, incidental, or consequential damages.</p></div>
            <div><h2 className="font-display text-2xl font-bold text-foreground">7. Contact</h2><p>For questions regarding these terms, contact us at legal@liklet.com.</p></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsOfService;
