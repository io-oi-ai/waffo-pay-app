export function cn(
  ...classes: Array<string | undefined | null | false>
): string {
  return classes.filter(Boolean).join(" ");
}

export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
