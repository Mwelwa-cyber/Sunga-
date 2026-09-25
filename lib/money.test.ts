import { describe, expect, it } from "vitest";
import { cleanMoneyInput, parseMoney } from "./money";

describe("money input", () => {
  it("keeps one decimal point and two decimal places", () => {
    expect(cleanMoneyInput("K1,200.345.6")).toBe("1200.34");
  });

  it("rejects empty, zero, negative and malformed values", () => {
    expect(parseMoney("")).toBeNull();
    expect(parseMoney("0")).toBeNull();
    expect(parseMoney("-4")).toBeNull();
    expect(parseMoney("1.2.3")).toBeNull();
  });

  it("accepts positive values with up to two decimals", () => {
    expect(parseMoney("25")).toBe(25);
    expect(parseMoney("25.50")).toBe(25.5);
  });
});
