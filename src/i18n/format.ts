// Pure formatting helper — safe to import from client and server components.
// Lives separately from index.ts (which uses next/headers and is server-only).

export function format(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) =>
    k in values ? String(values[k]) : `{${k}}`,
  );
}
