import { describe, expect, it } from "vitest";
import { nextDueDateAfterPayment } from "./dates";

describe("recurring bill dates", () => {
  it("moves a monthly bill beyond the paid date when several cycles are overdue", () => {
    expect(nextDueDateAfterPayment("2026-01-10", "monthly", "2026-04-25")).toBe("2026-05-10");
  });

  it("moves a weekly bill to its next future due date", () => {
    expect(nextDueDateAfterPayment("2026-09-01", "weekly", "2026-09-18")).toBe("2026-09-22");
  });

  it("keeps end-of-month bills at the end of shorter months", () => {
    expect(nextDueDateAfterPayment("2026-01-31", "monthly", "2026-02-01")).toBe("2026-02-28");
  });
});
