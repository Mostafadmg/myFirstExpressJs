import { useState, useEffect } from "react";

// Delays updating `debouncedValue` until the caller stops changing `value`
// for `delayMs`. Used on the search input so we don't fire a network
// request on every single keystroke.
export function useDebounce(value, delayMs = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debouncedValue;
}
