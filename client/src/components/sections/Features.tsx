import { motion } from 'framer-motion';
import { DollarSign, Users, MapPin, Shield } from 'lucide-react';
import traveler3 from '../../assets/images/traveler3.png';
import traveler4 from '../../assets/images/traveler4.png';

const features = [
  {
    id: 'costing',
    icon: <DollarSign size={20} />,
    title: 'Travel Costing',
    description:
      'Coordinate travel plans effortlessly. Input your ideal dates, dream destinations, and budget — get a smart cost breakdown instantly.',
    stat: '$10,226+',
    statLabel: 'Average trip savings identified',
  },
  {
    id: 'planning',
    icon: <MapPin size={20} />,
    title: 'Smart Trip Planning',
    description:
      'Build complete itineraries in minutes. Our intelligent planner suggests routes, accommodations, and local experiences tailored to you.',
  },
  {
    id: 'mates',
    icon: <Users size={20} />,
    title: 'Travel Mates',
    description:
      'Connect with verified, like-minded travelers who share your travel style, interests, and schedule.',
  },
  {
    id: 'safety',
    icon: <Shield size={20} />,
    title: 'Travel Safer',
    description:
      'We ensure safer travel through verified profiles, transparent interactions, and real-time safety alerts.',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function Features() {
  return (
    <section id="features" className="bg-traw-bg py-24 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Section heading */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          <h2 className="section-heading text-4xl md:text-5xl text-balance">
            Everything You Need
            <br />
            In One Service
          </h2>
        </motion.div>

        {/* Featured split card — Travel Costing */}
        <motion.div
          className="grid md:grid-cols-2 gap-4 mb-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          {/* Left: text + finance widget */}
          <div className="bg-traw-surface rounded-3xl p-8 border border-traw-border shadow-card flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-xl bg-traw-bg border border-traw-border flex items-center justify-center text-traw-primary mb-5">
                <DollarSign size={20} />
              </div>
              <h3 className="font-display font-bold text-2xl text-traw-primary mb-3">Travel Costing</h3>
              <p className="font-sans text-traw-secondary text-sm leading-relaxed max-w-sm">
                Coordinate travel plans effortlessly. Input your ideal dates, dream destinations,
                and budget — get a smart cost breakdown instantly.
              </p>
            </div>

            {/* Finance widget mock */}
            <div className="mt-8 bg-traw-bg rounded-2xl p-5 border border-traw-border">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-sans text-xs text-traw-muted uppercase tracking-wider mb-1">Total Spend</p>
                  <p className="font-display font-bold text-3xl text-traw-primary">$10,226
                    <span className="text-traw-lime text-2xl">+</span>
                  </p>
                </div>
                <span className="bg-traw-lime/20 text-traw-green text-xs font-sans font-semibold px-3 py-1 rounded-full">
                  Saved 18%
                </span>
              </div>
              <div className="space-y-2.5">
                {[
                  { label: 'Flights', amount: '$3,840', pct: 75 },
                  { label: 'Hotels', amount: '$2,960', pct: 55 },
                  { label: 'Activities', amount: '$1,680', pct: 35 },
                  { label: 'Food & Travel', amount: '$1,746', pct: 40 },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="font-sans text-xs text-traw-secondary w-20 flex-shrink-0">{item.label}</span>
                    <div className="flex-1 h-1.5 bg-traw-border rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-traw-lime rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.pct}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                        viewport={{ once: true }}
                      />
                    </div>
                    <span className="font-sans text-xs font-medium text-traw-primary w-14 text-right flex-shrink-0">
                      {item.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: moody travel photo */}
          <div className="relative overflow-hidden rounded-3xl shadow-card-lg min-h-[320px] md:min-h-0">
            <img
              src={traveler3}
              alt="Backpacker hiking through misty alpine forest"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <span className="bg-white/90 backdrop-blur-sm text-traw-primary font-sans font-semibold text-xs px-4 py-2 rounded-full shadow-card">
                📍 Swiss Alps Trail
              </span>
            </div>
          </div>
        </motion.div>

        {/* Bottom feature cards */}
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '0px 0px -60px 0px' }}
        >
          {features.slice(1).map((feature, i) => (
            <motion.div
              key={feature.id}
              className="bg-traw-surface rounded-2xl p-6 border border-traw-border shadow-card hover:shadow-card-lg transition-shadow duration-300 flex flex-col"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="w-11 h-11 rounded-xl bg-traw-bg border border-traw-border flex items-center justify-center text-traw-primary mb-4">
                {feature.icon}
              </div>
              <h3 className="font-display font-bold text-traw-primary text-lg mb-2">{feature.title}</h3>
              <p className="font-sans text-traw-secondary text-sm leading-relaxed flex-1">{feature.description}</p>
              {i === 1 && (
                <div className="mt-4 relative overflow-hidden rounded-xl h-28">
                  <img src={traveler4} alt="Travel companion" className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
