import type { Metadata } from "next";
import { Suspense } from "react";
import { ChunkErrorRecovery } from "@/components/chunk-error-recovery";
import { ContentDataProvider } from "@/components/content-data-provider";
import { ConceptDrawerProvider } from "@/components/concept-drawer";
import { LocaleToggle } from "@/components/locale-toggle";
import { getSiteData } from "@/lib/site-data.server";
import "./globals.css";

export const metadata: Metadata = {
  title: "SocCSS",
  description: "Structured language comparison workspace powered by Markdown."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const siteData = getSiteData();

  return (
    <html lang="zh-CN">
      <body>
        <ChunkErrorRecovery />
        <ContentDataProvider siteData={siteData}>
          <Suspense fallback={null}>
            <ConceptDrawerProvider>
              <LocaleToggle />
              {children}
            </ConceptDrawerProvider>
          </Suspense>
        </ContentDataProvider>
      </body>
    </html>
  );
}
