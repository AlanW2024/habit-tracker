"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { isLocale, type Locale } from "./index";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export async function setLocale(next: Locale): Promise<void> {
  if (!isLocale(next)) return;
  const c = await cookies();
  c.set("locale", next, {
    path: "/",
    sameSite: "lax",
    maxAge: ONE_YEAR_SECONDS,
  });
  revalidatePath("/", "layout");
}
