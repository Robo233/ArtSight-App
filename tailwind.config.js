export const purge = ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"];
export const darkMode = false;
export const theme = {
  extend: {
    colors: {
      primary: "var(--color-primary)",
      secondary: "var(--color-secondary)",
      background: "var(--color-background)",
      text: "var(--color-text)",
      "background-color-shadow": "var(--color-background-shadow)",
      "background-opacity": "var(--color-background-opacity)",
      "background-opacity-contrast": "var(--color-background-opacity-contrast)",
      "text-hover": "var(--color-text-hover)",
      "primary-hover": "var(--color-primary-hover)",
    },
    screens: {
      's': '375px', 
      'xl': '1440px',

    },
  },
};
export const variants = {
  extend: {},
};
export const plugins = [];
