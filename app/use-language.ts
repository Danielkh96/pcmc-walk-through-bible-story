"use client";

import { useSyncExternalStore } from "react";

export type Language = "zh" | "en";

const key = "pcmc-language";
const event = "pcmc-language-change";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(event, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(event, callback);
  };
}

function currentLanguage(): Language {
  try { return localStorage.getItem(key) === "en" ? "en" : "zh"; }
  catch { return "zh"; }
}

export function useLanguage(): [Language, (language: Language) => void] {
  const language = useSyncExternalStore(subscribe, currentLanguage, () => "zh");
  const setLanguage = (value: Language) => {
    try { localStorage.setItem(key, value); } catch { /* Storage is optional. */ }
    window.dispatchEvent(new Event(event));
  };
  return [language, setLanguage];
}
