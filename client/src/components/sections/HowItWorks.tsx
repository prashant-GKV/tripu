import { motion } from 'framer-motion';
import { Search, MessageCircle, Clock, ShieldCheck } from 'lucide-react';
import StepCard from '../ui/StepCard';

const steps = [
  {
    id: 1,
    icon: <Search size={18} />,
    title: 'Find Travelers Like You',
    description: 'Explore verified travelers based on destination, interests, and compatibility. Filter by travel style and dates.',
    highlighted: true,
  },
  {
    id: 2,
    icon: <MessageCircle size={18} />,
    title: 'Message Your Match',
    description: 'Start a conversation with your matched traveler to discuss any plans, preferences — no pressure, no surprises.',
    highlighted: false,
  },
  {
    id: 3,
    icon: <Clock size={18} />,
    title: 'Start On The Time',
    description: 'Chat, like profiles, and connect before you travel — no pressure, no surprises. Just great adventures.',
    highlighted: false,
  },
  {
    id: 4,
    icon: <ShieldCheck size={18} />,
    title: 'Trusted Travelers Like You',
    description: 'Explore verified travelers based on destination, interests, and compatibility with trust scores.',
    highlighted: false,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-traw-bg py-24 px-6">
      <div className="max-w-6xl mx-auto">

        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="section-heading text-4xl md:text-5xl">How It Works</h2>
          <p className="mt-4 font-sans text-traw-secondary text-sm max-w-sm mx-auto leading-relaxed">
            Getting started is simple. Four steps to your perfect travel match.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, i) => (
            <StepCard
              key={step.id}
              step={step.id}
              icon={step.icon}
              title={step.title}
              description={step.description}
              highlighted={step.highlighted}
              delay={i * 0.1}
            />
          ))}
        </div>

        <motion.div
          className="mt-10 flex justify-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <button id="how-it-works-cta" className="btn-primary">
            Get Started
          </button>
        </motion.div>

      </div>
    </section>
  );
}
