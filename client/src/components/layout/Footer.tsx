import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

const footerColumns = [
  {
    heading: 'Product',
    links: ['Features', 'Pricing', 'Integration'],
  },
  {
    heading: 'Legal',
    links: ['Terms', 'Privacy', 'Legal'],
  },
  {
    heading: 'Resources',
    links: ['Blog', 'Guides', 'Support'],
  },
  {
    heading: 'Company',
    links: ['About', 'Careers', 'Press'],
  },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer id="newsletter" className="bg-traw-bg border-t border-traw-border">
      {/* Newsletter Row */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">

          {/* Newsletter Left */}
          <div className="lg:w-80 flex-shrink-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="font-display font-bold text-2xl text-traw-primary mb-2">Newsletter</h3>
              <p className="font-sans text-sm text-traw-secondary leading-relaxed mb-6">
                There is a unique thrill in the simple act of packing a bag and stepping out
                the door, knowing a new corner of the world awaits discovery.
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="flex-1 px-4 py-2.5 rounded-full border border-traw-border bg-white text-sm font-sans text-traw-primary placeholder:text-traw-muted focus:outline-none focus:border-traw-lime focus:ring-2 focus:ring-traw-lime/20 transition-all"
                  required
                />
                <button
                  type="submit"
                  className="btn-lime gap-2 px-5"
                  aria-label="Subscribe to newsletter"
                >
                  {subscribed ? '✓' : <Send size={14} />}
                  {subscribed ? 'Done!' : 'Subscribe'}
                </button>
              </form>
              {subscribed && (
                <motion.p
                  className="text-xs text-traw-green font-sans mt-2"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  You're subscribed! 🎉
                </motion.p>
              )}
            </motion.div>
          </div>

          {/* Footer Links */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {footerColumns.map((col, i) => (
              <motion.div
                key={col.heading}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                viewport={{ once: true }}
              >
                <h4 className="font-sans font-semibold text-xs text-traw-muted uppercase tracking-wider mb-4">
                  {col.heading}
                </h4>
                <ul className="space-y-3">
                  {col.links.map(link => (
                    <li key={link}>
                      <a
                        href="#"
                        className="font-sans text-sm text-traw-secondary hover:text-traw-primary transition-colors duration-200"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Brand Wordmark Footer */}
      <div className="border-t border-traw-border py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="relative overflow-hidden">
            <motion.div
              className="relative flex items-end justify-start"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2
                className="font-display font-black text-traw-primary leading-none select-none"
                style={{ fontSize: 'clamp(80px, 14vw, 180px)' }}
              >
                traw
                <span className="text-traw-lime">.</span>
              </h2>
            </motion.div>
            <p className="font-sans text-xs text-traw-muted mt-2">
              © {new Date().getFullYear()} Traw. All rights reserved. Plan your journey, find your tribe.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
