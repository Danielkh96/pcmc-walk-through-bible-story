"use client";

import { useSyncExternalStore } from "react";

type Appearance = "light" | "dark";
const key = "pcmc-appearance";
const event = "pcmc-appearance-change";
let fallback: Appearance = "light";
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(event, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(event, callback);
  };
}
function snapshot(): Appearance {
  try { return localStorage.getItem(key) === "dark" ? "dark" : "light"; }
  catch { return fallback; }
}
function serverSnapshot(): Appearance { return "light"; }
function setAppearance(value: Appearance) {
  fallback = value;
  try { localStorage.setItem(key, value); } catch { /* Storage is optional. */ }
  window.dispatchEvent(new Event(event));
}
export function useAppearance(): [Appearance, typeof setAppearance] {
  return [useSyncExternalStore(subscribe, snapshot, serverSnapshot), setAppearance];
}
