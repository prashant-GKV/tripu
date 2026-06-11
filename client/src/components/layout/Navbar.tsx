import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useNavScroll } from '../../hooks/useScrollAnimation';
import profileImg from '../../assets/images/profile1.png';

const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'Tour Mates', href: '#travel-partners' },
  { label: 'Destination', href: '#compatibility' },
  { label: 'Reviews', href: '#testimonials' },
  { label: 'Contact Us', href: '#newsletter' },
];

export default function Navbar() {
  const scrolled = useNavScroll(30);
  const [activeLink, setActiveLink] = useState('Home');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'features', 'travel-partners', 'how-it-works', 'compatibility', 'newsletter'];
      for (const id of sections.reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          const link = navLinks.find(l => l.href === `#${id}`);
          if (link) setActiveLink(link.label);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, label: string) => {
    e.preventDefault();
    setActiveLink(label);
    setMobileOpen(false);
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.nav
        id="navbar"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-traw-bg/90 backdrop-blur-md shadow-card border-b border-traw-border' : 'bg-transparent'
        }`}
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-6">

          {/* Logo */}
          <a
            href="#hero"
            onClick={e => handleNavClick(e, '#hero', 'Home')}
            className="font-display font-bold text-2xl text-traw-primary tracking-tight flex-shrink-0 hover:opacity-80 transition-opacity"
          >
            traw
            <span className="text-traw-lime">.</span>
          </a>

          {/* Pill Nav — desktop */}
          <div className="hidden md:flex items-center bg-traw-primary/5 border border-traw-border rounded-full px-1.5 py-1.5 gap-0.5">
            {navLinks.map(link => (
              <a
                key={link.label}
                href={link.href}
                onClick={e => handleNavClick(e, link.href, link.label)}
                className={`relative px-4 py-1.5 rounded-full text-sm font-sans font-medium transition-all duration-200 ${
                  activeLink === link.label
                    ? 'bg-white text-traw-primary shadow-sm'
                    : 'text-traw-secondary hover:text-traw-primary'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Avatar */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <img
              src={profileImg}
              alt="User profile"
              className="w-9 h-9 rounded-full object-cover border-2 border-traw-border shadow-sm"
            />
            {/* Mobile toggle */}
            <button
              className="md:hidden p-1.5 rounded-full bg-traw-bg border border-traw-border text-traw-primary"
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-traw-bg/95 backdrop-blur-sm flex flex-col items-center justify-center gap-6 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                onClick={e => handleNavClick(e, link.href, link.label)}
                className="font-display font-bold text-3xl text-traw-primary hover:text-traw-green transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
