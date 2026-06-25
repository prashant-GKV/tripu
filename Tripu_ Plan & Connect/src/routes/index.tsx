import type { ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";

import { motion } from "framer-motion";
import {
  ArrowRight, MapPin, Users, Sparkles, Layers, Wifi, FileDown,
  Calendar, Compass, Wand2, Star, Search, Home as HomeIcon, UserRound,
} from "lucide-react";
import { PageTransition } from "../components/page-transition";
import { trips } from "../lib/sample-data";
import { fadeUp, stagger } from "../lib/motion";
import heroComposite from "../assets/hero-composite-light.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tripu — Plan smarter. Travel together." },
      { name: "description", content: "AI itineraries in minutes, plus travel companions matched to your style, dates and budget." },
      { property: "og:title", content: "Tripu — AI trip planning & companion matching" },
      { property: "og:description", content: "Your trip, planned in minutes." },
    ],
  }),
  component: Home,
});

const popular = [
  { name: "Trip to Greece", going: 90, img: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=600&q=80" },
  { name: "Trip to Egypt", going: 77, img: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=600&q=80" },
  { name: "Trip to Scotland", going: 31, img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80" },
];

function Home() {
  return (
    <PageTransition>
      {/* HERO — split panel */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="hero-glow" />
        <div className="relative mx-auto max-w-7xl rounded-[2rem] overflow-hidden shadow-soft">
          {/* Single composite background image: terracotta + wavy sage + ocean */}
          <img
            src={heroComposite}
            alt="Bright terracotta sand meeting turquoise ocean"
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Solid warm overlay on the left to keep text airy and readable */}
          <div className="absolute inset-y-0 left-0 w-full lg:w-1/2 bg-coral/35 pointer-events-none" />

          {/* Overlaid content — text sits on the terracotta side */}
          <div className="relative min-h-[640px] grid grid-cols-1 lg:grid-cols-2">
            <div className="text-white p-8 sm:p-12 lg:p-14 flex flex-col">
              <motion.div initial="hidden" animate="show" variants={stagger} className="flex-1 flex flex-col">
                <motion.p variants={fadeUp} className="text-[11px] tracking-[0.3em] font-semibold text-white/95">
                  MOUNTAINS &nbsp;|&nbsp; PLAINS &nbsp;|&nbsp; BEACHES
                </motion.p>
                <motion.h1 variants={fadeUp} className="mt-6 text-4xl sm:text-5xl lg:text-[3.25rem] font-bold leading-[1.05] tracking-tight drop-shadow-sm">
                  Spend your vacation<br />with our activites
                </motion.h1>

                <motion.div variants={fadeUp} className="mt-10 max-w-md">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[12px] tracking-[0.3em] font-bold text-white">MOST POPULAR</p>
                    <button aria-label="More" className="grid h-8 w-8 place-items-center rounded-full border border-white/80 text-white hover:bg-white/20 transition">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {popular.map((p) => (
                      <Link key={p.name} to="/tripboards" className="group block rounded-xl overflow-hidden bg-white/25 backdrop-blur-md border border-white/40 hover:bg-white/35 transition shadow-soft">
                        <div className="aspect-[4/3] overflow-hidden">
                          <img src={p.img} alt={p.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        </div>
                        <div className="p-2.5">
                          <div className="text-[13px] font-bold leading-tight text-white drop-shadow-sm">{p.name}</div>
                          <div className="mt-0.5 flex items-center gap-1 text-[10px] text-white/90">
                            <UserRound className="h-2.5 w-2.5" /> {p.going} people going
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Right side intentionally empty — image shows through */}
            <div className="relative hidden lg:block" />
          </div>

          {/* SEARCH BAR — overlapping bottom */}
          <div className="relative mx-6 sm:mx-10 -mt-6 mb-8 rounded-2xl bg-white/95 backdrop-blur shadow-soft border border-white/40 p-2 sm:p-3 grid grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto] gap-2 z-10">
            <SearchField icon={<HomeIcon className="h-4 w-4" />} label="Accommodation" value="6730 Luna Land North" />
            <SearchField icon={<Calendar className="h-4 w-4" />} label="Check-in" value="19.06.2019" />
            <SearchField icon={<Calendar className="h-4 w-4" />} label="Check-Out" value="24.06.2019" />
            <SearchField icon={<UserRound className="h-4 w-4" />} label="Guests" value="4 adults" />
            <Link to="/plan" className="col-span-2 lg:col-span-1 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-coral text-primary-foreground px-8 text-sm font-bold text-white shadow-soft hover:scale-[1.02] transition-transform">
              Search
            </Link>
          </div>
        </div>



        {/* trust strip below hero */}
        <div className="relative mx-auto max-w-7xl mt-10 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
          <div className="flex -space-x-2">
            {[47, 12, 32, 44].map((i) => (
              <img key={i} src={`https://i.pravatar.cc/40?img=${i}`} className="h-7 w-7 rounded-full border-2 border-background" alt="" />
            ))}
          </div>
          Trusted by <span className="font-semibold text-foreground">10,000+ travelers</span> in 84 countries
        </div>
      </section>





      {/* TRUST STRIP */}
      <section className="border-y border-border bg-surface/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-wrap items-center justify-between gap-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">As used by travelers from</p>
          <div className="flex flex-wrap items-center gap-6 sm:gap-10 opacity-70">
            {["NOMAD CO", "WANDERLY", "OFF-MAP", "HORIZON", "TERRA", "VOYAGR"].map((l) => (
              <span key={l} className="text-sm font-display font-semibold tracking-wider text-muted-foreground">{l}</span>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--teal)]">How it works</p>
          <h2 className="mt-3 text-4xl sm:text-5xl font-bold">Four answers. One great trip.</h2>
          <p className="mt-4 text-muted-foreground">Tell us who's coming, when, where, and how you like to travel. We handle the rest.</p>
        </div>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger} className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { n: "01", t: "Who", d: "Adults, kids, occasion.", icon: Users },
            { n: "02", t: "When", d: "Pick your range.", icon: Calendar },
            { n: "03", t: "Where", d: "Add cities and nights.", icon: MapPin },
            { n: "04", t: "How", d: "Budget, pace, style.", icon: Compass },
          ].map((s) => (
            <motion.div key={s.n} variants={fadeUp} className="rounded-2xl border border-border bg-surface p-6 card-hover">
              <div className="flex items-center justify-between">
                <span className="text-xs font-display font-bold text-muted-foreground">{s.n}</span>
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-secondary">
                  <s.icon className="h-5 w-5 text-[color:var(--primary)]" />
                </span>
              </div>
              <h3 className="mt-5 text-xl font-semibold">{s.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* FEATURE GRID */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-[1fr_2fr] gap-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--coral)]">Built-in</p>
              <h2 className="mt-3 text-4xl font-bold">Everything you need, nothing you don't.</h2>
              <p className="mt-4 text-muted-foreground">A focused toolkit for planning, sharing, and traveling together.</p>
            </div>
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="grid sm:grid-cols-2 gap-4">
              {[
                { i: MapPin, t: "Live maps", d: "Routes and pins update as you plan." },
                { i: Wand2, t: "AI itinerary", d: "Day-by-day plans, balanced for pace." },
                { i: Users, t: "Companion matching", d: "Transparent score, real reasons." },
                { i: Layers, t: "Collaboration", d: "Plan with friends in real time." },
                { i: Wifi, t: "Offline / PWA", d: "Open your plan on the road, anywhere." },
                { i: FileDown, t: "PDF export", d: "Beautiful, printable day-by-day." },
              ].map((f) => (
                <motion.div key={f.t} variants={fadeUp} className="rounded-2xl border border-border bg-surface p-5 card-hover">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-glow">
                    <f.i className="h-5 w-5 text-white" />
                  </span>
                  <h3 className="mt-4 font-semibold">{f.t}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{f.d}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* TRIPBOARDS CAROUSEL */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--teal)]">Tripboards</p>
            <h2 className="mt-3 text-4xl font-bold">Real trips, ready to remix.</h2>
          </div>
          <Link to="/tripboards" className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--primary)]">
            See all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 -mx-4 px-4 overflow-x-auto pb-4 scroll-smooth">
          <div className="flex gap-5 min-w-max">
            {trips.map((t) => (
              <Link key={t.slug} to="/t/$slug" params={{ slug: t.slug }} className="group block w-[300px] sm:w-[340px] rounded-2xl border border-border bg-surface overflow-hidden card-hover">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={t.cover} alt={t.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <span className="absolute top-3 left-3 rounded-full glass px-2.5 py-1 text-xs font-semibold">{t.country}</span>
                </div>
                <div className="p-5">
                  <h3 className="font-display font-semibold text-lg">{t.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{t.summary}</p>
                  <div className="mt-4 flex items-center gap-2 text-xs">
                    <span className="rounded-full bg-secondary px-2.5 py-1 font-semibold">{t.days} days</span>
                    <span className="rounded-full bg-secondary px-2.5 py-1 font-semibold">{t.budget}</span>
                    <span className="rounded-full bg-secondary px-2.5 py-1 font-semibold">{t.cities.length} cities</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center">Loved by curious humans.</h2>
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {[
            { n: "Sara K.", q: "Planned our honeymoon in 20 minutes. The map view sold it.", img: 25 },
            { n: "Jules P.", q: "Met two friends I now actually travel with. The match score is real.", img: 33 },
            { n: "Owen R.", q: "Replaced 6 tabs and a spreadsheet. The PDF export is gorgeous.", img: 56 },
          ].map((r) => (
            <div key={r.n} className="rounded-2xl border border-border bg-surface p-6">
              <div className="flex gap-1 text-[color:var(--amber)]">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="mt-4 text-sm">{r.q}</p>
              <div className="mt-5 flex items-center gap-3">
                <img src={`https://i.pravatar.cc/80?img=${r.img}`} alt="" className="h-10 w-10 rounded-full" />
                <div>
                  <div className="text-sm font-semibold">{r.n}</div>
                  <div className="text-xs text-muted-foreground">Traveler</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BAND */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-coral text-primary-foreground p-10 sm:p-14 text-white">
          <div className="relative grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h3 className="text-4xl sm:text-5xl font-bold">Your next trip is one brief away.</h3>
              <p className="mt-4 text-white/85 max-w-lg">Spend less time tab-juggling. More time wandering.</p>
              <Link to="/plan" className="mt-7 inline-flex h-12 items-center gap-2 rounded-xl bg-white text-[color:var(--primary-deep)] px-5 text-sm font-semibold hover:bg-white/90">
                Plan a trip <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { v: "10k+", l: "Travelers" },
                { v: "84", l: "Countries" },
                { v: "4.9★", l: "Avg rating" },
              ].map((s) => (
                <div key={s.l} className="rounded-2xl bg-white/10 backdrop-blur p-5 text-center">
                  <div className="text-3xl font-display font-bold">{s.v}</div>
                  <div className="text-xs text-white/80 mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}

function SearchField({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-secondary/60 transition cursor-pointer">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-secondary text-[color:var(--primary-deep)]">
        {icon}
      </span>
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</div>
        <div className="text-sm font-semibold truncate">{value}</div>
      </div>
    </div>
  );
}

