import "server-only";
import { cookies } from "next/headers";
import { STAFF_COOKIE, db } from "./db";

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
