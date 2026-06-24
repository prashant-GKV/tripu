import { createBrowserRouter } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import PlanPage from '../pages/PlanPage';
import TripboardsPage from '../pages/TripboardsPage';
import TripboardPage from '../pages/TripboardPage';
import NotFoundPage from '../pages/NotFoundPage';

/**
 * Application routes.
 *  /            marketing landing (public)
 *  /plan        4-step planning wizard (M1)
 *  /tripboards  public tripboard browser — no login required (M3)
 *  /t/:slug     single public tripboard view (M3)
 */
export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/plan', element: <PlanPage /> },
  { path: '/tripboards', element: <TripboardsPage /> },
  { path: '/t/:slug', element: <TripboardPage /> },
  { path: '*', element: <NotFoundPage /> },
]);
