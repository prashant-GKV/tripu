import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import Features from './components/sections/Features';
import TravelPartners from './components/sections/TravelPartners';
import HowItWorks from './components/sections/HowItWorks';
import Compatibility from './components/sections/Compatibility';

function App() {
  return (
    <div className="min-h-screen bg-traw-bg">
      <Navbar />

      <main>
        <Hero />
        <Features />
        <TravelPartners />
        <HowItWorks />
        <Compatibility />
      </main>

      <Footer />
    </div>
  );
}

export default App;
