# math-expression-parser

A lightweight TypeScript math expression parser and evaluator.

## Install

```bash
npm install math-expression-parser
```

## Usage

```ts
import {
  calculateMathExpression,
  canEvaluateMathExpression,
  fixStringForCalculation,
} from "math-expression-parser";

const raw = "2 + 3 * sin(30)";
const safe = fixStringForCalculation(raw);

if (canEvaluateMathExpression(safe)) {
  const result = calculateMathExpression(safe);
  console.log(result); // 3.5
}
```

## Supported operators

- `+`, `-`, `*`, `/`, `^`
- Parentheses: `(`, `)`

## Supported constants

- `pi`, `PI`
- `e`, `E`
- `phi`
- `tau`
- `inf`, `Inf`

## Supported functions

Unary:

- `sin`, `cos`, `tan`
- `asin`, `acos`, `atan`
- `sinh`, `cosh`, `tanh`
- `log` (base 10), `ln`, `log2`
- `sqrt`, `cbrt`
- `abs`, `ceil`, `floor`, `round`, `sign`
- `exp`, `deg`, `rad`

Binary:

- `atan2(a, b)`
- `log_(base, value)`
- `min(a, b)`, `max(a, b)`
- `pow(a, b)`
- `mod(a, b)`
- `hypot(a, b)`

## Development

```bash
npm install
npm test
npm run build
```

## License

GPL-3.0-only. See `LICENSE`.
