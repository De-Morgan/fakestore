import { Outlet, ScrollRestoration, useNavigation } from "react-router";
import { useFocusOnNavigate } from "@/hooks/useFocusOnNavigate";
import Header from "./Header";
import Footer from "./Footer";
import { OfflineBanner } from "./OfflineBanner";

export default function RootLayout() {
  const navigation = useNavigation();
  const isNavigating = navigation.state !== "idle";
  useFocusOnNavigate();

  return (
    <div className="flex min-h-svh flex-col">
      {/* First focusable element on every page. Lets keyboard users jump past the header. */}
      <a
        href="#main"
        onClick={(e) => {
          // Focus <main> directly, so the router doesn't treat #main as a navigation.
          e.preventDefault();
          document.getElementById("main")?.focus();
        }}
        className="sr-only rounded-md bg-background px-4 py-2 font-medium text-primary shadow-md outline-none focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        Skip to content
      </a>
      {isNavigating && (
        <div
          role="progressbar"
          aria-label="Loading page"
          className="fixed inset-x-0 top-0 z-50 h-0.5 bg-primary motion-safe:animate-pulse"
        />
      )}
      <Header />
      <OfflineBanner />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  );
}
