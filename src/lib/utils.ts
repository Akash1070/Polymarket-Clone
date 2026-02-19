import { type ClassValue, clsx } from "clsx";
// Imports utilities for conditionally combining CSS class names.

import { twMerge } from "tailwind-merge";
// Imports a helper that intelligently resolves conflicting Tailwind classes.

/* ----------------------------------
   Combine CSS classes safely
---------------------------------- */

// Combine classes with tailwind-merge
export function cn(...inputs: ClassValue[]) {
  // Accepts multiple class name inputs (strings, arrays, conditions).

  return twMerge(clsx(inputs));
  // First: clsx removes invalid or false values.
  // Then: twMerge resolves Tailwind conflicts (e.g., bg-red vs bg-blue).
}

/* ----------------------------------
   Format numbers
---------------------------------- */

// Format number to fixed decimals
export function toFixed(value: number, decimals: number) {
  // Converts a number into a string with a fixed number of decimals.
  // Example: toFixed(1.2345, 2) → "1.23"

  return value.toFixed(decimals);
}

/* ----------------------------------
   Format dates
---------------------------------- */

// Format date to readable string
export function formatDate(dateString: string) {
  // Converts a raw date string into a human-readable format.
  // Example: "2026-02-19" → "Feb 19, 2026"

  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/* ----------------------------------
   Shared utilities
---------------------------------- */

// Add any other utility functions here...
// This file acts as a central place for small reusable helpers.
