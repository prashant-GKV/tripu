import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/sections/Hero';
import Features from '../components/sections/Features';
import Destinations from '../components/sections/Destinations';
import TravelPartners from '../components/sections/TravelPartners';
import Testimonials from '../components/sections/Testimonials';
import HowItWorks from '../components/sections/HowItWorks';
import Compatibility from '../components/sections/Compatibility';

/**
 * Public marketing landing page.
 *
 * NOTE: still on the legacy light "Traw" theme — it will be migrated to the
 * Aurora Glass system in the next M0 step. Kept self-consistent for now so the
 * page never renders half-themed.
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-traw-bg">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Destinations />
        <TravelPartners />
        <Testimonials />
        <HowItWorks />
        <Compatibility />
      </main>
      <Footer />
    </div>
  );
}
