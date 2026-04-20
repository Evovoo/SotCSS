"use client";

import { createContext, ReactNode, useContext } from "react";
import { SiteData } from "@/lib/site-data";

const ContentDataContext = createContext<SiteData | null>(null);

export function ContentDataProvider({ children, siteData }: { children: ReactNode; siteData: SiteData }) {
  return <ContentDataContext.Provider value={siteData}>{children}</ContentDataContext.Provider>;
}

export function useSiteData() {
  const context = useContext(ContentDataContext);
  if (!context) {
    throw new Error("useSiteData must be used within ContentDataProvider.");
  }

  return context;
}
