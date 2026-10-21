import { describe, expect, it } from "vitest";
import {
    calculateMathExpression,
    canEvaluateMathExpression,
    fixStringForCalculation,
} from "./index";

describe("fixStringForCalculation", () => {
    it("removes unsupported characters and keeps valid math syntax", () => {
        expect(fixStringForCalculation("2 + 3$% * sin(45)!")).toBe("2 + 3 * sin(45)");
    });
});

describe("canEvaluateMathExpression", () => {
    it("returns true when expression has operators", () => {
        expect(canEvaluateMathExpression("2 + 2")).toBe(true);
    });

    it("returns true when expression has letters (functions/constants)", () => {
        expect(canEvaluateMathExpression("pi")).toBe(true);
    });

    it("returns false for plain text without math hints", () => {
        expect(canEvaluateMathExpression("12345")).toBe(false);
    });
});

describe("calculateMathExpression", () => {
    it("handles operator precedence with parentheses", () => {
        expect(calculateMathExpression("2 + 3 * (4 + 1)")).toBe(17);
    });

    it("supports constants and trigonometric functions in degrees", () => {
        expect(calculateMathExpression("sin(30) + cos(60)")).toBeCloseTo(1, 10);
    });

    it("supports two-argument functions", () => {
        expect(calculateMathExpression("pow(2, 3) + max(2, 5)")).toBe(13);
    });

    it("supports constants aliases and arithmetic", () => {
        expect(calculateMathExpression("PI - pi + E - e")).toBeCloseTo(0, 12);
        expect(calculateMathExpression("tau / pi")).toBeCloseTo(2, 12);
        expect(calculateMathExpression("phi")).toBeCloseTo((1 + Math.sqrt(5)) / 2, 12);
    });

    it("supports decimal comma input", () => {
        expect(calculateMathExpression("1,5 + 2")).toBe(3.5);
    });

    it("supports unary negatives", () => {
        expect(calculateMathExpression("-2 + 5")).toBe(3);
    });

    it("throws on empty input", () => {
        expect(() => calculateMathExpression("   ")).toThrow("Empty expression");
    });

    it("throws on unknown functions/constants", () => {
        expect(() => calculateMathExpression("unknown(2)")).toThrow(
            'Unknown function or constant: "unknown"',
        );
    });

    it("throws on division by zero", () => {
        expect(() => calculateMathExpression("5 / 0")).toThrow("Division by zero");
    });

    it("throws on mismatched parentheses", () => {
        expect(() => calculateMathExpression("(2 + 3")).toThrow("Mismatched parentheses");
    });

    it("throws when infinite constants produce non-finite result", () => {
        expect(() => calculateMathExpression("inf")).toThrow("Result is Infinity");
        expect(() => calculateMathExpression("Inf")).toThrow("Result is Infinity");
    });
});

describe("calculateMathExpression unary functions", () => {
    it.each([
        ["sin(30)", 0.5],
        ["cos(60)", 0.5],
        ["tan(45)", 1],
        ["asin(0.5)", 30],
        ["acos(0.5)", 60],
        ["atan(1)", 45],
        ["sinh(0)", 0],
        ["cosh(0)", 1],
        ["tanh(0)", 0],
        ["log(100)", 2],
        ["ln(e)", 1],
        ["log2(8)", 3],
        ["sqrt(9)", 3],
        ["cbrt(27)", 3],
        ["abs(-3)", 3],
        ["ceil(2.1)", 3],
        ["floor(2.9)", 2],
        ["round(2.5)", 3],
        ["sign(-7)", -1],
        ["exp(1)", Math.E],
        ["deg(pi)", 180],
        ["rad(180)", Math.PI],
    ])("evaluates %s", (expression, expected) => {
        expect(calculateMathExpression(expression)).toBeCloseTo(expected, 10);
    });
});

describe("calculateMathExpression binary functions", () => {
    it.each([
        ["atan2(1, 1)", 45],
        ["log_(2, 8)", 3],
        ["min(2, 5)", 2],
        ["max(2, 5)", 5],
        ["pow(2, 3)", 8],
        ["mod(10, 3)", 1],
        ["hypot(3, 4)", 5],
    ])("evaluates %s", (expression, expected) => {
        expect(calculateMathExpression(expression)).toBeCloseTo(expected, 10);
    });
});
