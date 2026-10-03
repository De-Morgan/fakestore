import { useSyncExternalStore } from "react";
import { onlineManager } from "@tanstack/react-query";
import { WifiOffIcon } from "lucide-react";
import { Container } from "./Container";

const subscribe = (onChange: () => void) => onlineManager.subscribe(onChange);
const getSnapshot = () => onlineManager.isOnline();

// While offline, TanStack Query pauses fetches instead of failing them, and cached data keeps rendering.
export function OfflineBanner() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);

  // The status region is always mounted, so screen readers announce the text when it appears.
  return (
    <div role="status" className={isOnline ? undefined : "border-b bg-muted"}>
      {!isOnline && (
        <Container className="flex items-center gap-2 py-2 text-sm">
          <WifiOffIcon aria-hidden="true" className="size-4 shrink-0" />
          You're offline. Showing saved data.
        </Container>
      )}
    </div>
  );
}
