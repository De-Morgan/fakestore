import { Outlet, ScrollRestoration, useNavigation } from "react-router";
import Header from "./Header";
import Footer from "./Footer";

export default function RootLayout() {
  const navigation = useNavigation();
  const isNavigating = navigation.state !== "idle";
  return (
    <div className="flex min-h-svh flex-col">
      {isNavigating && (
        <div
          role="progressbar"
          aria-label="Loading page"
          className="fixed inset-x-0 top-0 z-50 h-0.5 animate-pulse bg-primary"
        />
      )}
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  );
}
