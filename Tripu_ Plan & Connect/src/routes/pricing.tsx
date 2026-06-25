import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Sparkles } from "lucide-react";
import { useState } from "react";
import { PageTransition } from "../components/page-transition";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Tripu" },
      { name: "description", content: "Simple plans for solo travelers, power-planners and teams." },
    ],
  }),
  component: PricingPage,
});

const plans = [
  { name: "Free", desc: "For your next weekend.", monthly: 0, yearly: 0, features: ["1 active tripboard", "Basic AI itinerary", "Public tripboards", "PDF export"] },
  { name: "Pro", desc: "For frequent travelers.", monthly: 9, yearly: 7, popular: true, features: ["Unlimited tripboards", "Advanced AI + revisions", "Companion matching", "Offline / PWA", "Priority support"] },
  { name: "Teams", desc: "For agencies & crews.", monthly: 29, yearly: 24, features: ["Up to 10 seats", "Shared workspaces", "Brand-branded PDFs", "Admin & SSO", "API access"] },
];

function PricingPage() {
  const [yearly, setYearly] = useState(true);

  return (
    <PageTransition>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-20">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--teal)]">Pricing</p>
          <h1 className="mt-3 text-4xl sm:text-5xl font-bold">Simple plans. Big trips.</h1>
          <p className="mt-4 text-muted-foreground">Start free. Upgrade when you're planning more than vacations.</p>

          <div className="mt-7 inline-flex p-1 rounded-full border border-border bg-surface">
            <button onClick={() => setYearly(false)} className={`px-4 py-1.5 rounded-full text-sm font-medium ${!yearly ? "bg-primary text-primary-foreground text-white" : "text-muted-foreground"}`}>Monthly</button>
            <button onClick={() => setYearly(true)} className={`px-4 py-1.5 rounded-full text-sm font-medium ${yearly ? "bg-primary text-primary-foreground text-white" : "text-muted-foreground"}`}>Yearly · save 20%</button>
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {plans.map((p) => (
            <div key={p.name} className={`relative rounded-3xl border bg-surface p-7 ${p.popular ? "border-[color:var(--primary)] shadow-glow" : "border-border"}`}>
              {p.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold text-white shadow-glow">
                  <Sparkles className="h-3 w-3" /> Most popular
                </span>
              )}
              <h3 className="font-display text-2xl font-bold">{p.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
              <div className="mt-5">
                <span className="text-5xl font-display font-bold">${yearly ? p.yearly : p.monthly}</span>
                <span className="text-sm text-muted-foreground">/mo</span>
              </div>
              <Link to="/login" className={`mt-6 h-11 w-full inline-flex items-center justify-center rounded-xl text-sm font-semibold ${p.popular ? "bg-primary text-primary-foreground text-white shadow-glow" : "border border-border hover:bg-secondary"}`}>
                Get {p.name}
              </Link>
              <ul className="mt-6 space-y-2.5 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-[color:var(--teal)] mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </PageTransition>
  );
}
