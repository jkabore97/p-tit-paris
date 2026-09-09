import "server-only";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, STAFF_COOKIE, db } from "./db";

/** PIN du personnel lu dans le cookie httpOnly ; null s'il est absent ou invalide. */
export async function staffPin(): Promise<string | null> {
  const jar = await cookies();
  const pin = jar.get(STAFF_COOKIE)?.value;
  if (!pin) return null;
  try {
    return (await db.verifyPin(pin)) ? pin : null;
  } catch {
    return null;
  }
}

/** Mot de passe du centre de contrôle lu dans le cookie httpOnly ; null s'il est absent ou invalide. */
export async function adminPassword(): Promise<string | null> {
  const jar = await cookies();
  const pwd = jar.get(ADMIN_COOKIE)?.value;
  if (!pwd) return null;
  try {
    return (await db.adminVerify(pwd)) ? pwd : null;
  } catch {
    return null;
  }
}
