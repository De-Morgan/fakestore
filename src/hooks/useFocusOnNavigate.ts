import { useEffect, useRef } from "react";
import { useLocation } from "react-router";

// After a client-side route change, focus stays on the link that was clicked and screen readers
// announce nothing. Move focus to the new page's <h1> (or <main>) instead.
// Keyed on pathname only: changing ?q= or ?page= must not pull focus out of the search box.
export function useFocusOnNavigate() {
  const { pathname } = useLocation();
  const previous = useRef(pathname);

  useEffect(() => {
    // Skips the first load (the browser handles that) and StrictMode's second effect run.
    if (previous.current === pathname) return;
    previous.current = pathname;

    const main = document.getElementById("main");
    const target = main?.querySelector<HTMLElement>("h1") ?? main;
    if (!target) return;
    // tabindex=-1: focusable from script, but not added to the Tab order.
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true }); // ScrollRestoration owns the scroll position
  }, [pathname]);
}
