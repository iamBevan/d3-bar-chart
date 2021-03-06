module.exports = {
	env: {
		browser: true,
		node: true,
		es2020: true,
	},
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: "module",
		ecmaFeatures: {
			jsx: true,
		},
		project: "./tsconfig.json",
	},
	extends: [
		"plugin:react/recommended",
		"plugin:import/errors",
		"plugin:import/warnings",
		"plugin:import/typescript",
		"plugin:@typescript-eslint/recommended",
		"plugin:jsx-a11y/recommended",
		"plugin:@typescript-eslint/recommended-requiring-type-checking",
		"prettier",
	],
	plugins: [
		"react",
		"react-hooks",
		"@typescript-eslint",
		"jsx-a11y",
		"prettier",
	],
	rules: {
		"no-console": [
			"warn",
			{
				allow: ["warn", "error"],
			},
		],
		"@typescript-eslint/explicit-function-return-type": [
			"warn",
			{
				allowExpressions: true,
			},
		],
		"react/jsx-filename-extension": [1, { extensions: [".ts", ".tsx"] }],
		"import/extensions": "off",
		"react/prop-types": "off",
		"jsx-a11y/anchor-is-valid": "off",
		"react/jsx-props-no-spreading": ["error", { custom: "ignore" }],
		"prettier/prettier": [
			"error",
			{
				endOfLine: "auto",
			},
		],
		"react/no-unescaped-entities": "off",
		"import/no-cycle": [0, { ignoreExternal: true }],
		"prefer-const": "off",
		"react/react-in-jsx-scope": "off",
		"no-use-before-define": "off",
		"react-hooks/rules-of-hooks": "error",
		"react-hooks/exhaustive-deps": "warn",
		"@typescript-eslint/no-use-before-define": [
			"error",
			{ functions: false, classes: false, variables: true },
		],
		"@typescript-eslint/no-unsafe-assignment": "off",
		"@typescript-eslint/no-unsafe-member-access": "off",
		"@typescript-eslint/no-unsafe-call": "off",
		// "@typescript-eslint/await-thenable": "off",
		// "@typescript-eslint/no-floating-promises": "off",
		// "@typescript-eslint/no-implied-eval": "off",
		// "@typescript-eslint/no-misused-promises": "off",
	},
	settings: {
		react: {
			version: "detect",
		},
	},
}
