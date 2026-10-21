import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import unusedImports from "eslint-plugin-unused-imports";
import prettier from "eslint-config-prettier";
import unicorn from "eslint-plugin-unicorn";

export default [
    {
        ignores: [
            "dist/",
            "node_modules/",
            "data/",
        ],
    },
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
    },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    prettier,
    {
        plugins: {
            "unused-imports": unusedImports,
            unicorn,
        },
        rules: {
            "unicorn/filename-case": ["error", { cases: { kebabCase: true } }],
            "react/react-in-jsx-scope": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/ban-ts-comment": "off",
            "@typescript-eslint/no-misused-new": "off",
            camelcase: "warn",
            eqeqeq: ["error", "smart"],
            curly: ["error", "all"],
            "no-nested-ternary": "warn",
            "prefer-const": "warn",
            "react/jsx-first-prop-new-line": "off",
            "react/jsx-max-props-per-line": "off",
            "arrow-body-style": ["warn", "as-needed"],
            "prefer-arrow-callback": "warn",
            "func-style": ["error", "declaration", { allowArrowFunctions: true }],
            "comma-dangle": ["warn", "always-multiline"],
            "max-len": [
                "warn",
                {
                    code: 120,
                    ignoreUrls: true,
                    ignoreStrings: true,
                    ignoreTemplateLiterals: true,
                    ignoreRegExpLiterals: true,
                },
            ],
            radix: ["error"],
            "unused-imports/no-unused-imports": "warn",
            "@typescript-eslint/consistent-type-imports": "warn",
            "@typescript-eslint/no-empty-object-type": "warn",
            "@typescript-eslint/no-inferrable-types": "off",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    args: "all",
                    argsIgnorePattern: "^_",
                    caughtErrors: "all",
                    caughtErrorsIgnorePattern: "^_",
                    destructuredArrayIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    ignoreRestSiblings: true,
                },
            ],
        },
    },
];
