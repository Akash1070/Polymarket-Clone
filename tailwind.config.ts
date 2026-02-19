import type { Config } from "tailwindcss";
// Imports the official Tailwind configuration type.
// This helps catch mistakes and gives editor autocomplete.

const config: Config = {
  darkMode: ["class"],
  // Enables dark mode using a CSS class (not system settings).
  // When a "dark" class is added to the app, dark mode activates.
  // This gives full control over when and how dark mode is applied.

  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    // Scan all page files to find which Tailwind classes are used.

    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    // Scan all reusable UI components.

    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    // Scan the App Router directory (modern Next.js structure).
  ],
  // Tailwind ONLY generates CSS for classes found in these files.
  // This keeps the final CSS small and fast.

  theme: {
    extend: {
      // Extends Tailwind’s default theme instead of replacing it.
      // This keeps built-in styles while adding custom design tokens.

      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        // Base background and text colors.
        // Values come from CSS variables, not hardcoded colors.

        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        // Card UI colors (containers, panels, boxes).

        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        // Popover and dropdown UI colors.

        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        // Primary brand color and its text color.

        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        // Secondary brand color.

        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        // Muted / subtle UI elements (disabled states, hints).

        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        // Accent colors for highlights and emphasis.

        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        // Used for errors, warnings, and destructive actions.

        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        // Standardized colors for borders, inputs, and focus rings.

        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        }
        // Dedicated color palette for charts and data visualizations.
      },

      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      }
      // Defines consistent rounded corners across the app.
      // Controlled using a single CSS variable for easy global changes.
    }
  },

  plugins: [require("tailwindcss-animate")],
  // Adds animation utilities (fade, slide, accordion, etc.).
  // Used for smooth UI transitions and interactions.
};

export default config;
// Exports the configuration so Tailwind can use it during build.
