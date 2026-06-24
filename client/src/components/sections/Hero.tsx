import { motion, type Variants } from 'framer-motion';
import SwooshLine from '../ui/SwooshLine';
import heroBg from '../../assets/images/hero_bg.png';
import traveler1 from '../../assets/images/traveler1.png';
import traveler2 from '../../assets/images/traveler2.png';
import traveler3 from '../../assets/images/traveler3.png';
import traveler4 from '../../assets/images/traveler4.png';

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

const gridPhotoVariants: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: 'easeOut', delay: 0.3 + i * 0.1 },
  }),
};

const gridPhotos = [
  { src: traveler1, alt: 'Hiker in cyan jacket on rocky mountain terrain' },
  { src: traveler2, alt: 'Traveler in orange puffer jacket at mountain peak' },
  { src: traveler3, alt: 'Backpacker hiking through misty alpine forest' },
  { src: traveler4, alt: 'Woman in beanie at alpine viewpoint' },
];

export default function Hero() {
  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative">
      {/* ── Hero Image Band ── */}
      <div className="relative h-[70vh] min-h-[480px] max-h-[620px] overflow-hidden">
        <img
          src={heroBg}
          alt="Dramatic mountain landscape with blue sky and alpine meadows"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-500/40 via-sky-300/20 to-traw-bg/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        {/* Hero copy */}
        <motion.div
          className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 pt-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            variants={fadeUp}
            className="font-display font-black text-white leading-[1.05] text-balance"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', textShadow: '0 2px 24px rgba(0,0,0,0.18)' }}
          >
            Your Next Journey
            <br />
            Starts Here
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-5 font-sans text-white/90 text-sm md:text-base max-w-md leading-relaxed"
            style={{ textShadow: '0 1px 8px rgba(0,0,0,0.2)' }}
          >
            Plan your next trip with confidence and ease. Connect with like-minded travelers, match
            your schedule and travel style, and turn simple plans into meaningful journeys.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-7">
            <button
              id="hero-cta"
              onClick={scrollToFeatures}
              className="btn-primary text-base px-8 py-3.5 shadow-card-lg"
            >
              Get Started
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Photo Grid ── */}
      <div className="relative bg-traw-bg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 px-3 md:px-4 mt-0 relative z-10">
          {gridPhotos.map((photo, i) => (
            <motion.div
              key={photo.alt}
              custom={i}
              variants={gridPhotoVariants}
              initial="hidden"
              animate="visible"
              className="relative overflow-hidden rounded-2xl aspect-[3/4] shadow-card-lg"
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                loading="eager"
              />
              {/* Individual gradient overlay per photo */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl pointer-events-none" />
            </motion.div>
          ))}
        </div>

        {/* Swoosh line overlaying the photo grid */}
        <div className="absolute inset-x-0 bottom-0 h-full pointer-events-none z-20">
          <SwooshLine />
        </div>
      </div>
    </section>
  );
}
