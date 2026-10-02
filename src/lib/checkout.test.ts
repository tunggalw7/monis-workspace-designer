import { describe, expect, it } from "vitest";
import {
  createOrderId,
  EMPTY_FORM,
  normalizePhone,
  startDateBounds,
  validateCheckout,
  type CheckoutForm,
} from "./checkout";

const today = new Date(2026, 9, 2); // 2 Oct 2026, local time
const valid: CheckoutForm = {
  name: "Kadek Ayu",
  email: "kadek@example.com",
  whatsapp: "+62 812-3456-7890",
  area: "Canggu",
  address: "",
  startDate: "2026-10-05",
};

describe("validateCheckout", () => {
  it("accepts a valid form", () => {
    expect(validateCheckout(valid, today)).toEqual({});
  });

  it("requires every field except the address", () => {
    expect(Object.keys(validateCheckout(EMPTY_FORM, today)).sort()).toEqual(
      ["area", "email", "name", "startDate", "whatsapp"].sort(),
    );
  });

  it("rejects bad email, phone and area", () => {
    const errors = validateCheckout(
      { ...valid, email: "nope@x", whatsapp: "12-34", area: "Mars" },
      today,
    );
    expect(Object.keys(errors).sort()).toEqual(["area", "email", "whatsapp"]);
  });

  it("accepts local and international WhatsApp numbers", () => {
    for (const whatsapp of ["0812 3456 7890", "+44 7700 900123", "(+61) 412.345.678"]) {
      expect(validateCheckout({ ...valid, whatsapp }, today).whatsapp).toBeUndefined();
    }
  });

  it("enforces the lead time and the 6-month window", () => {
    expect(startDateBounds(today)).toEqual({ min: "2026-10-04", max: "2027-03-31" });
    expect(validateCheckout({ ...valid, startDate: "2026-10-03" }, today).startDate).toMatch(
      /4 October 2026/,
    );
    expect(
      validateCheckout({ ...valid, startDate: "2026-10-04" }, today).startDate,
    ).toBeUndefined();
    expect(validateCheckout({ ...valid, startDate: "2027-04-01" }, today).startDate).toBeDefined();
  });
});

describe("helpers", () => {
  it("normalizes phone numbers", () => {
    expect(normalizePhone("+62 (812) 3456-7890")).toBe("+6281234567890");
  });

  it("creates readable order ids", () => {
    expect(createOrderId(() => 0)).toBe("MNS-AAAAAA");
    expect(createOrderId()).toMatch(/^MNS-[A-Z2-9]{6}$/);
  });
});
