import { describe, expect, test } from "bun:test";

describe("Utility functions and calculations", () => {

  test("should calculate product total revenue correctly", () => {
    const quantity = 3;
    const price = 25.50;
    const revenue = quantity * price;
    expect(revenue).toBe(76.5);
  });

  test("should correctly validate email format", () => {
    const validateEmail = (email: string) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    };

    expect(validateEmail("user@example.com")).toBe(true);
    expect(validateEmail("userexample.com")).toBe(false);
    expect(validateEmail("user@example")).toBe(false);
  });

  test("should calculate percentage correctly", () => {
    const calcPercentage = (partial: number, total: number) => {
      if (total === 0) return 0;
      return (partial / total) * 100;
    };

    expect(calcPercentage(25, 100)).toBe(25);
    expect(calcPercentage(0, 100)).toBe(0);
    expect(calcPercentage(50, 0)).toBe(0);
  });
});
