"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { globalSearch } from "@/lib/api/search";

export function useDebouncedValue(value, delay = 250) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export function useGlobalSearch(query, open) {
  const normalized = useDebouncedValue(query.trim().replace(/\s+/g, " "));
  return useQuery({
    queryKey: ["global-search", normalized],
    queryFn: ({ signal }) => globalSearch(normalized, signal),
    enabled: open && normalized.length >= 2,
    staleTime: 30_000,
  });
}
