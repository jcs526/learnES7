/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-typescript"
  ],
  parserOptions: {
    parser: "@typescript-eslint/parser",
    sourceType: "module",
    extraFileExtensions: [".vue"],
    ecmaVersion: "latest"
  },
  plugins: [
    "vue",
    "@typescript-eslint"
  ],
  rules: {
    quotes: ["error", "double"], // 쌍따옴표 사용
    semi: ["error", "always"], // 마지막 세미콜론 붙이기
    "prefer-const": "error", // 명시적인 const 사용
    "quote-props": ["error", "as-needed"], // 오브젝트 키에서 불필요한 쌍따옴표 제거
    "arrow-parens": ["error", "as-needed"], // 화살표 함수의 변수가 1개일 때 괄호 제거
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/typedef": [
      "error",
      {
        variableDeclaration: false,
        arrowParameter: false,
      },
    ],
    "max-len": ["error", {
      code: 120, // 최대 줄 길이
      ignoreUrls: true, // URL 무시
      ignoreStrings: true, // 문자열 무시
      ignoreComments: true, // 주석 무시
      ignoreTemplateLiterals: true // 템플릿 리터럴 무시
    }]
  }, overrides: [
    {
      files: ["*.ts"],
      rules: {
        "max-len": ["error", {
          code: 120,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreComments: true,
          ignoreTemplateLiterals: true
        }]
      }
    }
  ]
};
