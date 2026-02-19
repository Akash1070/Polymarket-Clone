/** @type {import('postcss-load-config').Config} */
// Tells the editor and tooling that this file follows PostCSS configuration rules.
// This enables autocomplete, validation, and safer configuration changes.

const config = {
  plugins: {
    tailwindcss: {},
    // Enables Tailwind CSS as a PostCSS plugin.
    // This allows Tailwind’s utility classes to be processed into real CSS.
  },
};
// Defines how PostCSS should process CSS files in the project.

export default config;
// Exports the configuration so the build system can apply it.
// Without this, Tailwind styles would not work at all.
