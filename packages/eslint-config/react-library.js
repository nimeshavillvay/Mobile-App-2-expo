module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "plugin:@tanstack/eslint-plugin-query/recommended",
    "plugin:jsx-a11y/strict",
    "prettier",
    "eslint-config-turbo",
  ],
  plugins: ["react-compiler"],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "react-compiler/react-compiler": "error",
  },
};
