import { motion } from 'framer-motion';
import { Star, ChevronRight } from 'lucide-react';
import polaroid1 from '../../assets/images/polaroid1.png';
import polaroid2 from '../../assets/images/polaroid2.png';
import polaroid3 from '../../assets/images/polaroid3.png';
import polaroid4 from '../../assets/images/polaroid4.png';
import polaroid5 from '../../assets/images/polaroid5.png';
import profile1 from '../../assets/images/profile1.png';

export default function TravelPartners() {
  return (
    <section id="travel-partners" className="bg-traw-bg py-24 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">

        {/* ── Section Heading ── */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display font-bold text-traw-primary text-4xl md:text-5xl text-balance">
            Feedback Trusted<br />Travel Partners
          </h2>
        </motion.div>

        {/* ── Testimonial + Polaroids ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">

          {/* Left: Stacked polaroid photos */}
          <motion.div
            className="relative h-72 flex items-center justify-center"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            {/* Lime blob glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-72 h-52 bg-traw-lime/20 blur-3xl rounded-full" />
            </div>

            {/* Polaroid 1 — left, rotated */}
            <motion.div
              className="absolute left-4 top-8 polaroid-card w-36 h-40 overflow-hidden shadow-card-lg z-10"
              style={{ rotate: -8 }}
              initial={{ opacity: 0, rotate: -15, y: 20 }}
              whileInView={{ opacity: 1, rotate: -8, y: 0 }}
              whileHover={{ rotate: 0, scale: 1.06, zIndex: 30 }}
              transition={{ duration: 0.6, delay: 0 }}
              viewport={{ once: true }}
            >
              <img src={polaroid1} alt="Skier on alpine slope" className="w-full h-full object-cover rounded-lg" />
            </motion.div>

            {/* Polaroid 2 — center, slightly rotated */}
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 top-4 polaroid-card w-44 h-48 overflow-hidden shadow-card-lg z-20"
              style={{ rotate: 3 }}
              initial={{ opacity: 0, rotate: 8, y: 20 }}
              whileInView={{ opacity: 1, rotate: 3, y: 0 }}
              whileHover={{ rotate: 0, scale: 1.06, zIndex: 30 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              viewport={{ once: true }}
            >
              <img src={polaroid2} alt="Traveler in orange jacket" className="w-full h-full object-cover rounded-lg" />
            </motion.div>

            {/* Polaroid 3 — right, rotated */}
            <motion.div
              className="absolute right-4 top-12 polaroid-card w-36 h-40 overflow-hidden shadow-card-lg z-10"
              style={{ rotate: 6 }}
              initial={{ opacity: 0, rotate: 12, y: 20 }}
              whileInView={{ opacity: 1, rotate: 6, y: 0 }}
              whileHover={{ rotate: 0, scale: 1.06, zIndex: 30 }}
              transition={{ duration: 0.6, delay: 0.16 }}
              viewport={{ once: true }}
            >
              <img src={polaroid3} alt="Hiker in green jacket" className="w-full h-full object-cover rounded-lg" />
            </motion.div>
          </motion.div>

          {/* Right: Testimonial */}
          <motion.div
            className="flex flex-col items-start"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            {/* Stars */}
            <div className="flex gap-1 mb-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} className="fill-traw-lime text-traw-lime" />
              ))}
            </div>

            <blockquote className="font-display text-xl md:text-2xl text-traw-primary leading-relaxed font-semibold italic mb-6">
              "Meet real travelers who share your vibe. Match on interests, travel style, and start
              planning adventures together"
            </blockquote>

            <div className="flex items-center gap-3 mb-8">
              <img
                src={profile1}
                alt="Alex Rivera"
                className="w-11 h-11 rounded-full object-cover border-2 border-traw-border"
              />
              <div>
                <p className="font-sans font-semibold text-sm text-traw-primary">Alex Rivera</p>
                <p className="font-sans text-xs text-traw-muted">Patagonia, Argentina</p>
              </div>
            </div>

            <button
              id="all-testimonials-btn"
              className="inline-flex items-center gap-2 font-sans text-sm font-medium text-traw-secondary hover:text-traw-primary transition-colors border-b border-traw-border pb-0.5 hover:border-traw-primary"
            >
              All Testimonials <ChevronRight size={14} />
            </button>
          </motion.div>
        </div>

        {/* ── Join the Global Network CTA ── */}
        <motion.div
          className="relative rounded-3xl bg-gradient-to-br from-traw-surface to-traw-card border border-traw-border px-8 md:px-14 pt-12 pb-16 flex flex-col lg:flex-row items-center gap-10 overflow-visible"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          {/* Lime blobs */}
          <div className="absolute bottom-0 right-0 w-80 h-64 bg-traw-lime/25 blur-[70px] rounded-full pointer-events-none" />
          <div className="absolute top-8 right-32 w-40 h-40 bg-traw-lime/15 blur-[40px] rounded-full pointer-events-none" />

          {/* Text */}
          <div className="relative z-10 flex-1">
            <h2 className="font-display font-bold text-traw-primary text-3xl md:text-4xl text-balance mb-6">
              Join The Global<br />Traveler Network
            </h2>
            <button id="join-network-cta" className="btn-dark">
              Get Started
            </button>
          </div>

          {/* Fan of polaroids — fixed absolute positioning */}
          <div className="relative z-10 flex-shrink-0 w-72 h-56">
            {/* Fan photo 1 */}
            <motion.div
              className="absolute polaroid-card w-32 h-36 overflow-hidden shadow-card-lg"
              style={{ rotate: -14, left: 0, top: 20 }}
              initial={{ opacity: 0, rotate: -20, y: 10 }}
              whileInView={{ opacity: 1, rotate: -14, y: 0 }}
              whileHover={{ rotate: 0, scale: 1.06, zIndex: 20 }}
              transition={{ duration: 0.5, delay: 0 }}
              viewport={{ once: true }}
            >
              <img src={polaroid3} alt="Adventure hiker" className="w-full h-full object-cover rounded-lg" />
            </motion.div>

            {/* Fan photo 2 */}
            <motion.div
              className="absolute polaroid-card w-36 h-40 overflow-hidden shadow-card-lg"
              style={{ rotate: -5, left: 40, top: 10 }}
              initial={{ opacity: 0, rotate: -10, y: 10 }}
              whileInView={{ opacity: 1, rotate: -5, y: 0 }}
              whileHover={{ rotate: 0, scale: 1.06, zIndex: 20 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              viewport={{ once: true }}
            >
              <img src={polaroid1} alt="Skier portrait" className="w-full h-full object-cover rounded-lg" />
            </motion.div>

            {/* Fan photo 3 */}
            <motion.div
              className="absolute polaroid-card w-40 h-44 overflow-hidden shadow-card-lg"
              style={{ rotate: 6, left: 90, top: 0 }}
              initial={{ opacity: 0, rotate: 12, y: 10 }}
              whileInView={{ opacity: 1, rotate: 6, y: 0 }}
              whileHover={{ rotate: 0, scale: 1.06, zIndex: 20 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              viewport={{ once: true }}
            >
              <img src={polaroid5} alt="Female traveler smiling" className="w-full h-full object-cover rounded-lg" />
            </motion.div>

            {/* Fan photo 4 */}
            <motion.div
              className="absolute polaroid-card w-32 h-36 overflow-hidden shadow-card-lg"
              style={{ rotate: 16, left: 150, top: 20 }}
              initial={{ opacity: 0, rotate: 22, y: 10 }}
              whileInView={{ opacity: 1, rotate: 16, y: 0 }}
              whileHover={{ rotate: 0, scale: 1.06, zIndex: 20 }}
              transition={{ duration: 0.5, delay: 0.24 }}
              viewport={{ once: true }}
            >
              <img src={polaroid4} alt="Winter mountaineer" className="w-full h-full object-cover rounded-lg" />
            </motion.div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
