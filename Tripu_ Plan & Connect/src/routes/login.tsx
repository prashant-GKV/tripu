import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, MapPin, Send } from "lucide-react";
import { useState } from "react";
import { PageTransition } from "../components/page-transition";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — Tripu" },
      { name: "description", content: "Continue planning with a magic link or Google." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <PageTransition>
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-12 pb-20 grid lg:grid-cols-2 gap-10 items-center">
        <div className="relative aspect-square rounded-3xl overflow-hidden bg-primary text-primary-foreground p-10 text-white hidden lg:flex flex-col justify-between">
          <Link to="/" className="relative flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/15 backdrop-blur">
              <MapPin className="h-4.5 w-4.5" strokeWidth={2.5} />
            </span>
            <span className="font-display font-bold">Tripu</span>
          </Link>
          <div className="relative">
            <h2 className="text-4xl font-display font-bold leading-tight">Your trip is waiting where you left off.</h2>
            <p className="mt-3 text-white/80 text-sm">Sign in to sync tripboards across devices and meet your travel companions.</p>
          </div>
          <div className="relative grid grid-cols-3 gap-2">
            {["10k+ travelers", "84 countries", "4.9★ rated"].map((s) => (
              <div key={s} className="rounded-xl bg-white/10 backdrop-blur p-3 text-xs text-center">{s}</div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-surface p-8 sm:p-10">
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Continue with email or Google. We'll send a magic link.</p>

          <button className="mt-7 h-11 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background hover:bg-secondary text-sm font-semibold">
            <svg viewBox="0 0 24 24" className="h-4 w-4"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.57c2.08-1.92 3.28-4.74 3.28-8.07z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.75c-.99.66-2.25 1.05-3.71 1.05-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.84 14.11A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.11V7.05H2.18A11 11 0 0 0 1 12c0 1.78.43 3.46 1.18 4.95l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.46 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
            Continue with Google
          </button>

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex-1 h-px bg-border" /> or <div className="flex-1 h-px bg-border" />
          </div>

          {sent ? (
            <div className="rounded-xl border border-[color:var(--teal)]/40 bg-[color:var(--teal)]/10 p-4 text-sm">
              ✨ Magic link sent to <span className="font-semibold">{email}</span>. Check your inbox.
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); if (email) setSent(true); }} className="space-y-3">
              <label className="text-sm font-medium block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="w-full h-11 pl-10 pr-3 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary"
                />
              </div>
              <button className="h-11 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground text-white text-sm font-semibold shadow-glow">
                <Send className="h-4 w-4" /> Send magic link
              </button>
            </form>
          )}

          <p className="mt-6 text-xs text-muted-foreground text-center">By continuing you agree to Tripu's Terms and Privacy.</p>
        </div>
      </section>
    </PageTransition>
  );
}
