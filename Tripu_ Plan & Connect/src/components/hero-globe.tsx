import { motion } from "framer-motion";

/**
 * Animated SVG globe with rotating route arcs and glowing pins.
 * Lightweight, no WebGL, respects reduced motion via CSS in styles.css.
 */
export function HeroGlobe() {
  return (
    <div className="relative w-full aspect-square max-w-[520px] mx-auto">
      <div className="absolute inset-0 rounded-full bg-primary/30" style={{ filter: "blur(40px)" }} />
      <motion.svg
        viewBox="0 0 400 400"
        className="relative z-10 w-full h-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
      >
        <circle cx="200" cy="200" r="160" fill="var(--primary)" opacity="0.85" />
        {/* meridians */}
        {[0, 30, 60, 90, 120, 150].map((r) => (
          <ellipse key={r} cx="200" cy="200" rx="160" ry={Math.max(20, 160 - r)} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" transform={`rotate(${r} 200 200)`} />
        ))}
        <ellipse cx="200" cy="200" rx="160" ry="60" fill="none" stroke="rgba(255,255,255,0.15)" />
        <ellipse cx="200" cy="200" rx="160" ry="110" fill="none" stroke="rgba(255,255,255,0.1)" />
        {/* arcs */}
        <path d="M 80 220 Q 200 80 320 200" fill="none" stroke="var(--primary)" strokeWidth="2" strokeDasharray="4 6" />
        <path d="M 110 280 Q 200 180 300 270" fill="none" stroke="var(--primary)" strokeWidth="2" strokeDasharray="4 6" opacity="0.7" />
        {/* pins */}
        {[
          [80, 220], [320, 200], [110, 280], [300, 270], [200, 80],
        ].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="6" fill="var(--coral)" />
            <circle cx={x} cy={y} r="6" fill="none" stroke="var(--coral)" strokeWidth="2" className="animate-pulse-ring" style={{ transformOrigin: `${x}px ${y}px` }} />
          </g>
        ))}
      </motion.svg>

      {/* floating cards */}
      <motion.div
        className="absolute -top-4 -left-6 hidden sm:block glass rounded-2xl p-3 shadow-soft animate-float"
        style={{ animationDelay: "0s" }}
      >
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground" />
          <div className="text-xs">
            <div className="font-semibold">Kyoto → Osaka</div>
            <div className="text-muted-foreground">6 days • $1.2k</div>
          </div>
        </div>
      </motion.div>
      <motion.div className="absolute bottom-4 -right-4 hidden sm:block glass rounded-2xl p-3 shadow-soft animate-float" style={{ animationDelay: "1.5s" }}>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary" />
          <div className="text-xs">
            <div className="font-semibold">Mara · 94% match</div>
            <div className="text-muted-foreground">Loves slow culture</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
