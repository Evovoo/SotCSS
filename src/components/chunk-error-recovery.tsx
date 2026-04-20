"use client";

import { useEffect } from "react";

const RECOVERY_KEY = "soccss-chunk-recovery";

function isRecoverableChunkError(value: unknown) {
  const message =
    value instanceof Error
      ? value.message
      : typeof value === "string"
        ? value
        : typeof value === "object" && value && "message" in value && typeof value.message === "string"
          ? value.message
          : "";

  return (
    message.includes("ChunkLoadError") ||
    message.includes("Loading chunk") ||
    message.includes("Failed to fetch dynamically imported module")
  );
}

export function ChunkErrorRecovery() {
  useEffect(() => {
    function recover() {
      const marker = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      const lastAttempt = window.sessionStorage.getItem(RECOVERY_KEY);

      if (lastAttempt === marker) {
        window.sessionStorage.removeItem(RECOVERY_KEY);
        return;
      }

      window.sessionStorage.setItem(RECOVERY_KEY, marker);
      window.location.reload();
    }

    function onError(event: ErrorEvent) {
      if (isRecoverableChunkError(event.error ?? event.message)) {
        recover();
      }
    }

    function onUnhandledRejection(event: PromiseRejectionEvent) {
      if (isRecoverableChunkError(event.reason)) {
        recover();
      }
    }

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onUnhandledRejection);

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
    };
  }, []);

  return null;
}
