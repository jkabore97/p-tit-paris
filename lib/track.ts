"use client";

import { track as vercelTrack } from "@vercel/analytics";

type Props = Record<string, string | number | boolean | null>;

/**
 * Événement personnalisé Vercel Analytics.
 * Silencieux si l'analytique est indisponible (bloqueur de pub, hors production) :
 * la mesure ne doit jamais interrompre le parcours d'un client.
 */
export function track(name: string, props?: Props) {
  try {
    vercelTrack(name, props);
  } catch {
    /* analytique indisponible */
  }
}
