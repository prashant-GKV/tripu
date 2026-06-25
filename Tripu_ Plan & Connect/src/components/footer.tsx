import { Link } from "@tanstack/react-router";
import { Github, Instagram, MapPin, Twitter } from "lucide-react";

export function Footer() {
  const cols = [
    {
      title: "Product",
      links: [
        { label: "Plan a trip", to: "/plan" },
        { label: "Tripboards", to: "/tripboards" },
        { label: "Companions", to: "/companions" },
        { label: "Pricing", to: "/pricing" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", to: "/" },
        { label: "Careers", to: "/" },
        { label: "Press", to: "/" },
        { label: "Contact", to: "/" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Help center", to: "/" },
        { label: "Travel guides", to: "/tripboards" },
        { label: "API", to: "/" },
        { label: "Status", to: "/" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy", to: "/" },
        { label: "Terms", to: "/" },
        { label: "Cookies", to: "/" },
        { label: "Licenses", to: "/" },
      ],
    },
  ];

  return (
    <footer className="border-t border-border bg-surface/40 mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
                <MapPin className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
              </span>
              <span className="text-lg font-display font-bold">Tripu</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-sm">
              Plan smarter. Travel together. AI itineraries and compatible companions — built for curious humans.
            </p>
            <form className="mt-5 flex gap-2 max-w-sm" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="you@email.com"
                className="flex-1 h-10 rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:border-primary"
              />
              <button className="h-10 rounded-lg bg-primary text-primary-foreground px-4 text-sm font-semibold text-white">
                Subscribe
              </button>
            </form>
            <div className="mt-5 flex gap-3 text-muted-foreground">
              <a aria-label="Twitter" href="#" className="hover:text-foreground"><Twitter className="h-4 w-4" /></a>
              <a aria-label="Instagram" href="#" className="hover:text-foreground"><Instagram className="h-4 w-4" /></a>
              <a aria-label="GitHub" href="#" className="hover:text-foreground"><Github className="h-4 w-4" /></a>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {cols.map((c) => (
              <div key={c.title}>
                <h4 className="text-sm font-semibold mb-3">{c.title}</h4>
                <ul className="space-y-2">
                  {c.links.map((l) => (
                    <li key={l.label}>
                      <Link to={l.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Tripu Labs. All rights reserved.</p>
          <p>Made for travelers, with care. 🌍</p>
        </div>
      </div>
    </footer>
  );
}
