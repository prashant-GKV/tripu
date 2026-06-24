import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import profile1 from '../../assets/images/profile1.png';
import profile2 from '../../assets/images/profile2.png';
import profile3 from '../../assets/images/profile3.png';
import profile4 from '../../assets/images/profile4.png';

const testimonials = [
  {
    id: '1',
    quote:
      'traw. completely changed how I plan my trips. I found my perfect travel companion for a 3-week Himalayan trek. The compatibility matching is spot-on — we had the same pace, budget, and love for photography.',
    author: 'Alex Rivera',
    location: 'Patagonia, Argentina',
    avatar: profile1,
    rating: 5,
    tripTag: '🏔️ Himalayan Trek',
  },
  {
    id: '2',
    quote:
      'As a solo female traveler, safety is everything. traw. gave me the peace of mind I needed — verified profiles, real reviews, and a community that actually cares. My Bali trip was magical and worry-free.',
    author: 'Priya Sharma',
    location: 'Mumbai, India',
    avatar: profile2,
    rating: 5,
    tripTag: '🌴 Bali Adventure',
  },
  {
    id: '3',
    quote:
      'The smart trip planning feature saved me hours of research. It built a complete Kyoto itinerary in minutes — temples, hidden cafes, day trips. My travel mate and I had zero friction the entire trip.',
    author: 'Kenji Nakamura',
    location: 'Tokyo, Japan',
    avatar: profile3,
    rating: 5,
    tripTag: '⛩️ Kyoto Journey',
  },
  {
    id: '4',
    quote:
      'I\'ve been traveling for 20 years and this is the first app that truly understood what I was looking for. Met two brilliant travel companions through traw. — we\'ve since done Iceland and Patagonia together.',
    author: 'Henrik Strand',
    location: 'Oslo, Norway',
    avatar: profile4,
    rating: 5,
    tripTag: '🧊 Iceland & Patagonia',
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  const featured = testimonials[current];

  return (
    <section id="testimonials" className="bg-traw-bg py-24 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <span className="inline-block bg-traw-lime/20 text-traw-green font-sans font-semibold text-xs px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">
            Real Travelers, Real Stories
          </span>
          <h2 className="section-heading text-4xl md:text-5xl text-balance">
            Loved By Explorers<br />Worldwide
          </h2>
          <p className="mt-4 font-sans text-traw-secondary text-sm max-w-sm mx-auto leading-relaxed">
            Over 50,000 travelers have found their perfect journey partner through traw.
          </p>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          className="grid grid-cols-3 gap-4 mb-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          {[
            { value: '50K+', label: 'Happy Travelers' },
            { value: '4.9★', label: 'Average Rating' },
            { value: '120+', label: 'Countries Covered' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-traw-surface border border-traw-border rounded-2xl p-5 text-center shadow-card"
            >
              <p className="font-display font-bold text-2xl md:text-3xl text-traw-primary">{stat.value}</p>
              <p className="font-sans text-xs text-traw-muted mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Featured testimonial carousel */}
        <motion.div
          className="relative bg-traw-surface border border-traw-border rounded-3xl p-8 md:p-12 shadow-card-lg overflow-hidden mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          {/* Lime glow */}
          <div className="absolute bottom-0 right-0 w-80 h-64 bg-traw-lime/20 blur-[70px] rounded-full pointer-events-none" />

          {/* Quote icon */}
          <div className="absolute top-8 right-8 text-traw-lime opacity-30">
            <Quote size={64} strokeWidth={1} />
          </div>

          <div className="relative z-10 grid md:grid-cols-[auto_1fr] gap-8 items-start">
            {/* Avatar column */}
            <div className="flex-shrink-0">
              <AnimatePresence mode="wait">
                <motion.img
                  key={featured.id}
                  src={featured.avatar}
                  alt={featured.author}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover border-2 border-traw-lime shadow-card"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.35 }}
                />
              </AnimatePresence>

              {/* Stars */}
              <div className="flex gap-1 mt-3">
                {Array.from({ length: featured.rating }).map((_, i) => (
                  <Star key={i} size={14} className="fill-traw-lime text-traw-lime" />
                ))}
              </div>

              {/* Trip tag */}
              <span className="inline-block mt-2 bg-traw-bg border border-traw-border text-traw-secondary font-sans text-xs px-3 py-1 rounded-full">
                {featured.tripTag}
              </span>
            </div>

            {/* Quote content */}
            <div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={featured.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35 }}
                >
                  <blockquote className="font-display text-xl md:text-2xl text-traw-primary leading-relaxed font-semibold italic mb-6">
                    "{featured.quote}"
                  </blockquote>
                  <div>
                    <p className="font-sans font-semibold text-sm text-traw-primary">{featured.author}</p>
                    <p className="font-sans text-xs text-traw-muted">{featured.location}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation controls */}
          <div className="relative z-10 flex items-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-traw-border bg-traw-bg flex items-center justify-center text-traw-secondary hover:text-traw-primary hover:border-traw-primary transition-all duration-200"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-traw-border bg-traw-bg flex items-center justify-center text-traw-secondary hover:text-traw-primary hover:border-traw-primary transition-all duration-200"
              aria-label="Next testimonial"
            >
              <ChevronRight size={18} />
            </button>

            {/* Dot indicators */}
            <div className="flex gap-2 ml-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === current ? 'w-6 bg-traw-lime' : 'w-1.5 bg-traw-border'
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <span className="ml-auto font-sans text-xs text-traw-muted">
              {String(current + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}
            </span>
          </div>
        </motion.div>

        {/* Thumbnail row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {testimonials.map((t, i) => (
            <motion.button
              key={t.id}
              onClick={() => setCurrent(i)}
              className={`relative text-left rounded-2xl p-4 border transition-all duration-300 ${
                i === current
                  ? 'bg-traw-surface border-traw-lime shadow-lime-glow-sm'
                  : 'bg-traw-surface border-traw-border hover:border-traw-primary/30 shadow-card'
              }`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <img
                  src={t.avatar}
                  alt={t.author}
                  className="w-8 h-8 rounded-full object-cover border border-traw-border"
                />
                <div>
                  <p className="font-sans font-semibold text-traw-primary text-xs leading-tight">{t.author}</p>
                  <p className="font-sans text-traw-muted text-xs leading-tight">{t.location}</p>
                </div>
              </div>
              <p className="font-sans text-traw-secondary text-xs leading-relaxed line-clamp-2">{t.quote}</p>
              <div className="flex gap-0.5 mt-2">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={10} className="fill-traw-lime text-traw-lime" />
                ))}
              </div>
              {i === current && (
                <div className="absolute bottom-3 right-3 w-2 h-2 rounded-full bg-traw-lime" />
              )}
            </motion.button>
          ))}
        </div>

      </div>
    </section>
  );
}
