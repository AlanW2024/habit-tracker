"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { isAccent, type Accent } from "./index";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export async function setAccent(next: Accent): Promise<void> {
  if (!isAccent(next)) return;
  const c = await cookies();
  c.set("accent", next, {
    path: "/",
    sameSite: "lax",
    maxAge: ONE_YEAR_SECONDS,
  });
  revalidatePath("/", "layout");
}
