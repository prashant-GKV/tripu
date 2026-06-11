// ─── Navigation ───────────────────────────────────────────────────────────────
export interface NavLink {
  label: string;
  href: string;
}

// ─── Features ─────────────────────────────────────────────────────────────────
export interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
  stat?: string;
  statLabel?: string;
}

// ─── How It Works Steps ───────────────────────────────────────────────────────
export interface Step {
  id: number;
  icon: string;
  title: string;
  description: string;
}

// ─── Traveler / Profile ────────────────────────────────────────────────────────
export interface Traveler {
  id: string;
  name: string;
  location: string;
  bio: string;
  travelStyle: string[];
  compatibilityScore?: number;
  avatar: string;
  coverImage?: string;
  isVerified: boolean;
}

// ─── Testimonial ──────────────────────────────────────────────────────────────
export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  location: string;
  avatar: string;
  rating: number;
}

// ─── Destination Card ─────────────────────────────────────────────────────────
export interface DestinationCard {
  id: string;
  name: string;
  country: string;
  image: string;
  travelers?: number;
}

// ─── Newsletter ───────────────────────────────────────────────────────────────
export interface NewsletterFormData {
  email: string;
}

// ─── Footer Links ─────────────────────────────────────────────────────────────
export interface FooterColumn {
  heading: string;
  links: { label: string; href: string }[];
}
