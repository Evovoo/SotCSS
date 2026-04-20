"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export function useLocalSearchParams(initialSearch: string) {
  const [search, setSearch] = useState(initialSearch);

  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    function handlePopState() {
      setSearch(window.location.search.replace(/^\?/, ""));
    }

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const searchParams = useMemo(() => new URLSearchParams(search), [search]);

  const updateParams = useCallback((next: Record<string, string>) => {
    const params = new URLSearchParams(search);

    Object.entries(next).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    const nextSearch = params.toString();
    const nextUrl = nextSearch ? `${window.location.pathname}?${nextSearch}${window.location.hash}` : `${window.location.pathname}${window.location.hash}`;

    window.history.replaceState(window.history.state, "", nextUrl);
    setSearch(nextSearch);
  }, [search]);

  return { searchParams, updateParams };
}
