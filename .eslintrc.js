module.exports = exports = {
  "root": true,
  "parser": '@typescript-eslint/parser',
  "plugins": ['@typescript-eslint'],
  "extends": [
    'prettier/@typescript-eslint',
    'plugin:@typescript-eslint/recommended',
    'airbnb-base'
  ],
  "parserOptions": {
    "project": './tsconfig.json'
  },
  "rules": {
    "quotes": [0, "single"],
    "trailing-comma": 0,
    "default-case": 0,
    "semi": 0,
    "consistent-return": 0,
    "class-methods-use-this": 0,
    "import/prefer-default-export": 0,
    "prefer-promise-reject-errors": 0,
    "import/extensions": 0,
    "import/no-unresolved": 0,
    "no-inferrable-types": 0,
    "no-increment-decrement": 0,
    "no-await-in-loop": 0,
    "no-console": 0,
    "no-explicit-any": 0,
    "no-unused-vars": 0,
    "no-restricted-syntax": 0,
    "max-line-length": [0, {
      "limit": 180,
      "ignore-pattern": '^import |^export {(.*?)}"}]',
      }
    ],
    "max-len": 0,
    "no-plusplus": 1,
    "no-implicit-dependencies": [0, "dev", "optional"],
    "no-bitwise": 1,
    "no-console": 0,
    "no-continue": 0,
    "no-useless-constructor": 0,
    "array-type": [0, "array-simple"],
    "quotemark": [0, "single", "backtick", "avoid-escape", "avoid-template"],
    "interface-name": [0, "always-prefix"],
    "align": [0, "parameters", "arguments", "members", "elements", "statemments"],
    "space-before-function-paren": [0, "never"],
    "import-name": [0, {
      "lodash": "_",
      "web3": "Web3",
      "graphqlTag": "gql"
    }]
  }
}
