import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isPathMatching = (
  currentPath: string,
  targetPath: string,
  strict?: boolean
) => {
  if (strict) {
    return currentPath === targetPath;
  } else {
    return (
      currentPath === targetPath ||
      (targetPath !== "/" && currentPath.startsWith(targetPath))
    );
  }
};