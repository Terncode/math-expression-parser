type UnaryFn = (a: number) => number;
type BinaryFn = (a: number, b: number) => number;

interface UnaryFnMathFunction {
    arity: 1;
    fn: UnaryFn;
}

interface BinaryFnMathFunction {
    arity: 2;
    fn: BinaryFn;
}

type MathFunction = UnaryFnMathFunction | BinaryFnMathFunction;

const mathFunctions = new Map<string, MathFunction>([
    ["sin", { arity: 1, fn: (a) => Math.sin(toRad(a)) }],
    ["cos", { arity: 1, fn: (a) => Math.cos(toRad(a)) }],
    ["tan", { arity: 1, fn: (a) => Math.tan(toRad(a)) }],
    ["asin", { arity: 1, fn: (a) => toDeg(Math.asin(a)) }],
    ["acos", { arity: 1, fn: (a) => toDeg(Math.acos(a)) }],
    ["atan", { arity: 1, fn: (a) => toDeg(Math.atan(a)) }],
    ["sinh", { arity: 1, fn: (a) => Math.sinh(a) }],
    ["cosh", { arity: 1, fn: (a) => Math.cosh(a) }],
    ["tanh", { arity: 1, fn: (a) => Math.tanh(a) }],
    ["log", { arity: 1, fn: (a) => Math.log10(a) }],
    ["ln", { arity: 1, fn: (a) => Math.log(a) }],
    ["log2", { arity: 1, fn: (a) => Math.log2(a) }],
    ["sqrt", { arity: 1, fn: (a) => Math.sqrt(a) }],
    ["cbrt", { arity: 1, fn: (a) => Math.cbrt(a) }],
    ["abs", { arity: 1, fn: (a) => Math.abs(a) }],
    ["ceil", { arity: 1, fn: (a) => Math.ceil(a) }],
    ["floor", { arity: 1, fn: (a) => Math.floor(a) }],
    ["round", { arity: 1, fn: (a) => Math.round(a) }],
    ["sign", { arity: 1, fn: (a) => Math.sign(a) }],
    ["exp", { arity: 1, fn: (a) => Math.exp(a) }],
    ["deg", { arity: 1, fn: (a) => toDeg(a) }],
    ["rad", { arity: 1, fn: (a) => toRad(a) }],
    ["atan2", { arity: 2, fn: (a, b) => toDeg(Math.atan2(a, b)) }],
    ["log_", { arity: 2, fn: (a, b) => Math.log(b) / Math.log(a) }],
    ["min", { arity: 2, fn: (a, b) => Math.min(a, b) }],
    ["max", { arity: 2, fn: (a, b) => Math.max(a, b) }],
    ["pow", { arity: 2, fn: (a, b) => Math.pow(a, b) }],
    ["mod", { arity: 2, fn: (a, b) => a % b }],
    ["hypot", { arity: 2, fn: (a, b) => Math.hypot(a, b) }],
]);

const mathConstants = new Map<string, number>([
    ["pi", Math.PI],
    ["PI", Math.PI],
    ["e", Math.E],
    ["E", Math.E],
    ["phi", (1 + Math.sqrt(5)) / 2], // golden ratio
    ["tau", Math.PI * 2],
    ["inf", Infinity],
    ["Inf", Infinity],
]);

function toRad(deg: number) {
    return deg * (Math.PI / 180);
}
function toDeg(rad: number) {
    return rad * (180 / Math.PI);
}

const priorities = new Map<string, number>([
    ["(", 5],
    [")", 5],
    ["^", 4],
    ["*", 3],
    ["/", 3],
    ["+", 2],
    ["-", 2],
    [",", 1],
]);

function last<T>(array: T[] | null | undefined): T | undefined {
    if (!array || array.length === 0) {
        return undefined;
    }
    return array[array.length - 1];
}

function getPriority(token: string): number {
    if (mathFunctions.has(token)) {
        return 6;
    }
    return priorities.get(token) ?? -1;
}

type Token = string;

function tokenize(expression: string): Token[] {
    const tokens: Token[] = [];
    let i = 0;

    while (i < expression.length) {
        const char = expression[i] as string;

        if (/\s/.test(char)) {
            i++;
            continue;
        }

        if (/[a-zA-Z_]/.test(char)) {
            let word = "";
            while (i < expression.length && /[a-zA-Z0-9_]/.test(expression[i] as string)) {
                word += expression[i++];
            }
            if (mathConstants.has(word)) {
                tokens.push(String(mathConstants.get(word)!));
            } else if (mathFunctions.has(word)) {
                tokens.push(word);
            } else {
                throw new Error(`Unknown function or constant: "${word}"`);
            }
            continue;
        }

        if (
            /[0-9.]/.test(char) ||
            (char === "-" &&
                (tokens.length === 0 || priorities.has(last(tokens)!) || last(tokens) === "("))
        ) {
            let num = "";
            if (char === "-") {
                num += "-";
                i++;
            }
            while (i < expression.length && /[0-9.,]/.test(expression[i] as string)) {
                num += expression[i] === "," ? "." : expression[i];
                i++;
            }
            if (num === "-") {
                tokens.push("-");
            } else {
                tokens.push(num);
            }
            continue;
        }

        if (priorities.has(char)) {
            tokens.push(char);
            i++;
            continue;
        }

        throw new Error(`Unexpected character: "${char}"`);
    }

    return tokens;
}

function toPostfix(tokens: Token[]): Token[] {
    const output: Token[] = [];
    const stack: Token[] = [];

    for (const token of tokens) {
        if (!isNaN(parseFloat(token))) {
            output.push(token);
        } else if (mathFunctions.has(token)) {
            stack.push(token);
        } else if (token === ",") {
            while (stack.length && last(stack) !== "(") {
                output.push(stack.pop()!);
            }
            if (!stack.length) {
                throw new Error("Misplaced comma or missing parenthesis");
            }
        } else if (token === "(") {
            stack.push(token);
        } else if (token === ")") {
            while (stack.length && last(stack) !== "(") {
                output.push(stack.pop()!);
            }
            if (!stack.length) {
                throw new Error("Mismatched parentheses");
            }
            stack.pop();
            if (stack.length && mathFunctions.has(last(stack)!)) {
                output.push(stack.pop()!);
            }
        } else {
            // Operator
            while (
                stack.length &&
                last(stack) !== "(" &&
                getPriority(token) <= getPriority(last(stack)!)
            ) {
                output.push(stack.pop()!);
            }
            stack.push(token);
        }
    }

    while (stack.length) {
        const top = stack.pop()!;
        if (top === "(" || top === ")") {
            throw new Error("Mismatched parentheses");
        }
        output.push(top);
    }

    return output;
}

function evaluatePostfix(postfix: Token[]): number {
    const stack: number[] = [];

    for (const token of postfix) {
        const num = parseFloat(token);

        if (!isNaN(num)) {
            stack.push(num);
            continue;
        }

        // Binary operators
        if (priorities.has(token) && token !== "(" && token !== ")" && token !== ",") {
            if (stack.length < 2) {
                throw new Error(`Insufficient operands for operator "${token}"`);
            }
            const second = stack.pop()!;
            const first = stack.pop()!;

            switch (token) {
                case "+":
                    stack.push(first + second);
                    break;
                case "-":
                    stack.push(first - second);
                    break;
                case "*":
                    stack.push(first * second);
                    break;
                case "/":
                    if (second === 0) {
                        throw new Error("Division by zero");
                    }
                    stack.push(first / second);
                    break;
                case "^":
                    stack.push(Math.pow(first, second));
                    break;
                default:
                    throw new Error(`Unknown operator "${token}"`);
            }
            continue;
        }

        // Math functions
        const fn = mathFunctions.get(token);
        if (fn) {
            if (fn.arity === 1) {
                if (stack.length < 1) {
                    throw new Error(`Missing argument for "${token}"`);
                }
                const a = stack.pop()!;
                stack.push((fn.fn as UnaryFn)(a));
            } else {
                if (stack.length < 2) {
                    throw new Error(`Missing arguments for "${token}"`);
                }
                const b = stack.pop()!;
                const a = stack.pop()!;
                stack.push((fn.fn as BinaryFn)(a, b));
            }
            continue;
        }

        throw new Error(`Unknown token in postfix: "${token}"`);
    }

    if (stack.length !== 1) {
        throw new Error("Malformed expression");
    }
    const result = stack[0] as number;
    if (!isFinite(result)) {
        throw new Error(`Result is ${result}`);
    }
    return result;
}

export function fixStringForCalculation(expression: string): string {
    return expression.replace(/[^0-9a-zA-Z_()^*/+\-.,\s]/g, "");
}

export function canEvaluateMathExpression(expression: string): boolean {
    return /[()^*/+-]|[a-zA-Z]/.test(expression);
}

export function calculateMathExpression(expression: string): number {
    expression = fixStringForCalculation(expression);
    if (!expression.trim()) {
        throw new Error("Empty expression");
    }

    const tokens = tokenize(expression);
    const postfix = toPostfix(tokens);
    return evaluatePostfix(postfix);
}
