"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { isTheme, type Theme } from "./index";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export async function setTheme(next: Theme): Promise<void> {
  if (!isTheme(next)) return;
  const c = await cookies();
  c.set("theme", next, {
    path: "/",
    sameSite: "lax",
    maxAge: ONE_YEAR_SECONDS,
  });
  revalidatePath("/", "layout");
}
