import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="section-padding flex min-h-[60vh] items-center">
      <div className="container-max w-full max-w-2xl text-center">
        <p className="eyebrow">404 / Page not found</p>
        <h1 className="page-title mt-5">This page isn't here.</h1>
        <p className="mt-5 leading-7 text-muted-foreground">
          The address may have changed. Head back to the homepage or contact us for help.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
          <Link to="/" className="btn-accent">
            Back to home
          </Link>
          <Link to="/contact" className="text-sm font-semibold text-accent hover:underline">
            Contact us
          </Link>
        </div>
      </div>
    </section>
  );
}
