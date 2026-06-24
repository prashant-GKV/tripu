import { Link } from 'react-router-dom';
import AuroraBackground from '../components/ui/AuroraBackground';

export default function NotFoundPage() {
  return (
    <AuroraBackground>
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <h1 className="font-grotesk text-7xl font-bold text-aurora">404</h1>
        <p className="mt-4 text-aurora-muted">This route hasn't been charted yet.</p>
        <Link to="/" className="btn-aurora mt-8">
          Back home
        </Link>
      </div>
    </AuroraBackground>
  );
}
