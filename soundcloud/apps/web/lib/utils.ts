// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn() = className merge utility
 * Kết hợp clsx (xử lý điều kiện) + tailwind-merge (tránh conflict class)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
