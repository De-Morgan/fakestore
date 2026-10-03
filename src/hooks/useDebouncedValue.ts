import { useEffect, useState } from "react";

// Returns `value` once it has stopped changing for `delay` ms.
export function useDebouncedValue<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    // Each new value cancels the previous timer. That cleanup is the whole debounce.
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
