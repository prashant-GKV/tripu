import { motion } from 'framer-motion';
import { MapPin, Users, ArrowRight, TrendingUp } from 'lucide-react';
import destinationBali from '../../assets/images/destination_bali.png';
import destinationPatagonia from '../../assets/images/destination_patagonia.png';
import destinationKyoto from '../../assets/images/destination_kyoto.png';
import destinationIceland from '../../assets/images/destination_iceland.png';
import destination1 from '../../assets/images/destination1.png';

const destinations = [
  {
    id: 'bali',
    name: 'Bali',
    country: 'Indonesia',
    image: destinationBali,
    travelers: 2840,
    tags: ['Tropical', 'Culture', 'Surf'],
    trending: true,
    description: 'Rice terraces, temples, and world-class surf breaks.',
  },
  {
    id: 'patagonia',
    name: 'Patagonia',
    country: 'Chile & Argentina',
    image: destinationPatagonia,
    travelers: 1620,
    tags: ['Trekking', 'Wild', 'Remote'],
    trending: false,
    description: 'Jagged granite towers and pristine wilderness at the end of the world.',
  },
  {
    id: 'kyoto',
    name: 'Kyoto',
    country: 'Japan',
    image: destinationKyoto,
    travelers: 3210,
    tags: ['Culture', 'Temples', 'Zen'],
    trending: true,
    description: 'Ancient temples, bamboo forests, and timeless Japanese tradition.',
  },
  {
    id: 'iceland',
    name: 'Iceland',
    country: 'Iceland',
    image: destinationIceland,
    travelers: 1890,
    tags: ['Northern Lights', 'Waterfalls', 'Volcanic'],
    trending: false,
    description: 'Majestic waterfalls, geysers, and ethereal northern lights.',
  },
  {
    id: 'swiss-alps',
    name: 'Swiss Alps',
    country: 'Switzerland',
    image: destination1,
    travelers: 2100,
    tags: ['Skiing', 'Hiking', 'Alpine'],
    trending: false,
    description: 'Iconic peaks, pristine skiing, and charming mountain villages.',
  },
];

export default function Destinations() {
  return (
    <section id="destinations" className="bg-traw-bg py-24 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <span className="inline-block bg-traw-lime/20 text-traw-green font-sans font-semibold text-xs px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">
              Popular Right Now
            </span>
            <h2 className="section-heading text-4xl md:text-5xl text-balance">
              Discover Your<br />Next Destination
            </h2>
          </motion.div>

          <motion.button
            id="explore-all-destinations"
            className="btn-outline flex-shrink-0 self-start md:self-auto"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Explore All <ArrowRight size={14} />
          </motion.button>
        </div>

        {/* Destination grid — bento style */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

          {/* Large card — Bali */}
          <motion.div
            className="md:col-span-7 relative rounded-3xl overflow-hidden group cursor-pointer shadow-card-lg min-h-[380px]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.01 }}
          >
            <img
              src={destinations[0].image}
              alt={destinations[0].name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 absolute inset-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Trending badge */}
            {destinations[0].trending && (
              <div className="absolute top-4 left-4">
                <span className="flex items-center gap-1.5 bg-traw-lime text-traw-green font-sans font-bold text-xs px-3 py-1.5 rounded-full shadow">
                  <TrendingUp size={11} /> Trending
                </span>
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex flex-wrap gap-2 mb-3">
                {destinations[0].tags.map(tag => (
                  <span key={tag} className="bg-white/15 backdrop-blur-sm text-white font-sans text-xs px-2.5 py-1 rounded-full border border-white/20">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <h3 className="font-display font-bold text-white text-3xl leading-tight">{destinations[0].name}</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <MapPin size={12} className="text-traw-lime" />
                    <span className="font-sans text-white/80 text-sm">{destinations[0].country}</span>
                  </div>
                  <p className="font-sans text-white/70 text-xs mt-1 max-w-xs">{destinations[0].description}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-1.5 justify-end">
                    <Users size={12} className="text-traw-lime" />
                    <span className="font-sans text-white font-medium text-sm">{destinations[0].travelers.toLocaleString()}</span>
                  </div>
                  <p className="font-sans text-white/60 text-xs">travelers</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right column — 2 stacked */}
          <div className="md:col-span-5 flex flex-col gap-4">
            {destinations.slice(1, 3).map((dest, i) => (
              <motion.div
                key={dest.id}
                className="relative rounded-3xl overflow-hidden group cursor-pointer shadow-card-lg flex-1 min-h-[176px]"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.01 }}
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 absolute inset-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                {dest.trending && (
                  <div className="absolute top-3 left-3">
                    <span className="flex items-center gap-1.5 bg-traw-lime text-traw-green font-sans font-bold text-xs px-2.5 py-1 rounded-full shadow">
                      <TrendingUp size={10} /> Trending
                    </span>
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="font-display font-bold text-white text-xl leading-tight">{dest.name}</h3>
                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin size={10} className="text-traw-lime" />
                        <span className="font-sans text-white/70 text-xs">{dest.country}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users size={11} className="text-traw-lime" />
                      <span className="font-sans text-white font-medium text-xs">{dest.travelers.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom row — 2 cards */}
          {destinations.slice(3).map((dest, i) => (
            <motion.div
              key={dest.id}
              className="md:col-span-6 relative rounded-3xl overflow-hidden group cursor-pointer shadow-card-lg min-h-[220px]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 + 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.01 }}
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 absolute inset-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {dest.tags.map(tag => (
                    <span key={tag} className="bg-white/15 backdrop-blur-sm text-white font-sans text-xs px-2 py-0.5 rounded-full border border-white/20">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="font-display font-bold text-white text-2xl leading-tight">{dest.name}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <MapPin size={11} className="text-traw-lime" />
                      <span className="font-sans text-white/80 text-sm">{dest.country}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users size={12} className="text-traw-lime" />
                    <span className="font-sans text-white font-medium text-sm">{dest.travelers.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA strip */}
        <motion.div
          className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-traw-surface border border-traw-border rounded-2xl px-6 py-4 shadow-card"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p className="font-sans text-traw-secondary text-sm text-center sm:text-left">
            <span className="font-semibold text-traw-primary">120+ destinations</span> waiting for you — find your travel match and start planning today.
          </p>
          <button id="browse-destinations-cta" className="btn-lime flex-shrink-0">
            Browse Destinations <ArrowRight size={14} />
          </button>
        </motion.div>

      </div>
    </section>
  );
}
