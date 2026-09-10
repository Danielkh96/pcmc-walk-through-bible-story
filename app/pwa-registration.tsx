"use client";

import { useEffect } from "react";

export default function PwaRegistration() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    // Existing installations reload once when the comic-only release takes over.
    // The exact route and page query stay intact. First-time installs do not reload.
    const previouslyControlled = Boolean(navigator.serviceWorker.controller);
    let reloading = false;
    const updated = () => {
      if (!previouslyControlled || reloading) return;
      reloading = true;
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener("controllerchange", updated);
    navigator.serviceWorker.register("/sw.js", { updateViaCache: "none" })
      .then((registration) => registration.update()).catch(() => undefined);
    return () => navigator.serviceWorker.removeEventListener("controllerchange", updated);
  }, []);
  return null;
}
