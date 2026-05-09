// Utilidad mínima para combinar clases CSS (similar a clsx)
export function cn(...classes: Array<string | undefined | null | false>): string {
  return classes.filter(Boolean).join(' ');
}
