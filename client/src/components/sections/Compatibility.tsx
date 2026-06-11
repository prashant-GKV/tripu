import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { MapPin, MessageCircle, Plus } from 'lucide-react';
import compatBg from '../../assets/images/compat_bg.png';
import traveler1 from '../../assets/images/traveler1.png';
import traveler2 from '../../assets/images/traveler2.png';
import traveler3 from '../../assets/images/traveler3.png';
import profile1 from '../../assets/images/profile1.png';
import destination1 from '../../assets/images/destination1.png';

const destinationCards = [
  { name: 'Swiss Alps', country: 'Switzerland', image: destination1 },
  { name: 'Patagonia', country: 'Argentina', image: traveler3 },
  { name: 'Dolomites', country: 'Italy', image: traveler2 },
];

export default function Compatibility() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  return (
    <section id="compatibility" ref={sectionRef} className="relative py-24 px-6 overflow-hidden bg-traw-bg">
      <div className="max-w-6xl mx-auto">

        {/* Section heading above the card */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="section-heading text-4xl md:text-5xl text-balance">
            Match Based On<br />Compatibility
          </h2>
          <p className="mt-4 font-sans text-traw-secondary text-sm max-w-xs mx-auto">
            Find travelers who truly complement your journey.
          </p>
          <motion.div
            className="mt-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            <button id="find-travelers-cta" className="btn-outline">
              Find Travelers
            </button>
          </motion.div>
        </motion.div>

        {/* Full-bleed image card with floating UI overlays */}
        <div className="relative rounded-3xl overflow-hidden min-h-[520px] shadow-card-lg">
          {/* Parallax background */}
          <motion.div className="absolute inset-0" style={{ y: bgY }}>
            <img
              src={compatBg}
              alt="Dramatic foggy mountain valley with lone hiker"
              className="w-full h-[120%] object-cover object-center"
              loading="lazy"
            />
          </motion.div>

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Floating UI Cards */}
          <div className="relative z-10 p-6 md:p-10 flex flex-col md:flex-row gap-4 items-start min-h-[520px]">

            {/* Left — Profile Card */}
            <motion.div
              className="card-glass p-5 w-60 flex-shrink-0"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={profile1}
                  alt="Traveler profile"
                  className="w-12 h-12 rounded-full object-cover border-2 border-traw-lime"
                />
                <div>
                  <p className="font-sans font-semibold text-traw-primary text-sm">Marco Vélez</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin size={10} className="text-traw-lime" />
                    <p className="font-sans text-xs text-traw-muted">Barcelona, Spain</p>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex gap-1.5 flex-wrap">
                  {['Hiking', 'Photography', 'Solo trips'].map(tag => (
                    <span
                      key={tag}
                      className="bg-traw-bg text-traw-secondary font-sans text-xs px-2.5 py-1 rounded-full border border-traw-border"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Compatibility score */}
              <div className="bg-traw-lime/15 rounded-xl p-3 mb-3 flex items-center justify-between">
                <span className="font-sans text-xs text-traw-green font-semibold">Match Score</span>
                <span className="font-display font-bold text-traw-green text-lg">94%</span>
              </div>

              <button className="btn-primary w-full text-xs py-2.5 gap-1.5">
                <MessageCircle size={13} /> Start Chat
              </button>
            </motion.div>

            {/* Center — large photo card */}
            <motion.div
              className="flex-1 rounded-2xl overflow-hidden shadow-card-lg min-h-[280px] md:min-h-0 self-stretch"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
              viewport={{ once: true }}
            >
              <img
                src={traveler1}
                alt="Hiker in cyan jacket on mountain trail"
                className="w-full h-full object-cover object-top"
              />
            </motion.div>

            {/* Right — Destination cards stack */}
            <motion.div
              className="flex flex-col gap-3 w-48 flex-shrink-0"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.3 }}
              viewport={{ once: true }}
            >
              {destinationCards.map((dest, i) => (
                <motion.div
                  key={dest.name}
                  className="card-glass overflow-hidden flex-shrink-0"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.03 }}
                >
                  <div className="h-20 overflow-hidden">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-2.5 flex items-center justify-between">
                    <div>
                      <p className="font-sans font-semibold text-traw-primary text-xs">{dest.name}</p>
                      <p className="font-sans text-traw-muted text-xs">{dest.country}</p>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-traw-lime flex items-center justify-center flex-shrink-0">
                      <Plus size={10} className="text-traw-green" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
}
