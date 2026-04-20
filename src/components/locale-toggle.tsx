"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Locale, resolveLocale, t } from "@/lib/i18n";

const STORAGE_KEY = "soccss-locale";

export function LocaleToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = resolveLocale(searchParams.get("locale"));
  const copy = t(locale);

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
    window.localStorage.setItem(STORAGE_KEY, locale);
  }, [locale]);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored || stored === locale) {
      return;
    }

    if (stored !== "zh" && stored !== "en") {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("locale", stored);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [locale, pathname, router, searchParams]);

  function setLocale(nextLocale: Locale) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("locale", nextLocale);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="fixed right-4 top-4 z-[60] flex items-center gap-1 rounded-full border border-ink/10 bg-white/90 p-1 shadow-panel backdrop-blur md:right-6 md:top-6">
      <button
        aria-label={`${copy.switchTo} 中文`}
        className={`rounded-full px-4 py-2 text-sm font-medium transition ${locale === "zh" ? "bg-ink text-sand" : "text-moss hover:text-ink"}`}
        onClick={() => setLocale("zh")}
        type="button"
      >
        中文
      </button>
      <button
        aria-label={`${copy.switchTo} English`}
        className={`rounded-full px-4 py-2 text-sm font-medium transition ${locale === "en" ? "bg-ink text-sand" : "text-moss hover:text-ink"}`}
        onClick={() => setLocale("en")}
        type="button"
      >
        EN
      </button>
    </div>
  );
}
