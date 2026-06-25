import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { AnimatePresence } from "framer-motion";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { ThemeProvider } from "../components/theme-provider";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 pt-16">
      <div className="max-w-md text-center">
        <div className="text-7xl font-display font-bold text-primary">404</div>
        <h2 className="mt-4 text-2xl font-semibold">You wandered off the map</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          That page doesn't exist — but a great trip might. Want to plan one?
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Link to="/" className="inline-flex h-10 items-center rounded-lg border border-border px-4 text-sm font-medium hover:bg-secondary">
            Go home
          </Link>
          <Link to="/plan" className="inline-flex h-10 items-center rounded-lg bg-primary text-primary-foreground px-4 text-sm font-semibold text-white">
            Plan a trip
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. Try refreshing.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="inline-flex h-10 items-center rounded-lg bg-primary text-primary-foreground px-4 text-sm font-semibold text-white"
          >
            Try again
          </button>
          <a href="/" className="inline-flex h-10 items-center rounded-lg border border-border px-4 text-sm font-medium">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Tripu — Plan smarter. Travel together." },
      { name: "description", content: "AI travel planner and companion matching. Day-by-day itineraries in minutes, plus compatible travel buddies." },
      { name: "author", content: "Tripu" },
      { property: "og:title", content: "Tripu — Plan smarter. Travel together." },
      { property: "og:description", content: "AI itineraries + travel companion matching." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function AnimatedOutlet() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <AnimatePresence mode="wait" initial={false}>
      <div key={pathname}>
        <Outlet />
      </div>
    </AnimatePresence>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <div className="flex-1">
            <AnimatedOutlet />
          </div>
          <Footer />
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
