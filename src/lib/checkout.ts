import { DELIVERY_AREAS } from "@/data/areas";
import { formatDate } from "./format";

export type CheckoutForm = {
  name: string;
  email: string;
  whatsapp: string;
  area: string;
  address: string;
  startDate: string; // yyyy-mm-dd
};

export type CheckoutErrors = Partial<Record<keyof CheckoutForm, string>>;

export const EMPTY_FORM: CheckoutForm = {
  name: "",
  email: "",
  whatsapp: "",
  area: "",
  address: "",
  startDate: "",
};

/** We need a couple of days to prepare and deliver a setup. */
export const LEAD_DAYS = 2;
export const MAX_DAYS_AHEAD = 180;

/** Local calendar date as yyyy-mm-dd. */
export function toDateInput(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function startDateBounds(today: Date) {
  return {
    min: toDateInput(addDays(today, LEAD_DAYS)),
    max: toDateInput(addDays(today, MAX_DAYS_AHEAD)),
  };
}

/** Strips spaces, dashes, dots and parentheses: "+62 812-3456-789" → "+628123456789". */
export function normalizePhone(value: string): string {
  return value.replace(/[\s\-.()]/g, "");
}

export function validateField(
  field: keyof CheckoutForm,
  form: CheckoutForm,
  today: Date,
): string | undefined {
  const value = form[field].trim();
  switch (field) {
    case "name":
      if (!value) return "Please enter your name.";
      if (value.length < 2) return "Name looks too short.";
      return;
    case "email":
      if (!value) return "Please enter your email.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value))
        return "Enter a valid email, e.g. you@mail.com.";
      return;
    case "whatsapp":
      if (!value) return "Please enter your WhatsApp number.";
      if (!/^\+?\d{8,15}$/.test(normalizePhone(value)))
        return "Enter a valid number, e.g. +62 812 3456 7890.";
      return;
    case "area":
      if (!(DELIVERY_AREAS as readonly string[]).includes(value)) return "Choose a delivery area.";
      return;
    case "address":
      if (value.length > 200) return "Keep it under 200 characters.";
      return;
    case "startDate": {
      if (!value) return "Choose a start date.";
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return "Enter a valid date.";
      const { min, max } = startDateBounds(today);
      // yyyy-mm-dd strings compare correctly as text.
      if (value < min)
        return `We need ${LEAD_DAYS} days to prepare, so pick ${formatDate(min)} or later.`;
      if (value > max) return "Pick a date within the next 6 months.";
      return;
    }
  }
}

export function validateCheckout(form: CheckoutForm, today: Date): CheckoutErrors {
  const errors: CheckoutErrors = {};
  for (const field of Object.keys(form) as (keyof CheckoutForm)[]) {
    const error = validateField(field, form, today);
    if (error) errors[field] = error;
  }
  return errors;
}

export function createOrderId(random: () => number = Math.random): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let id = "";
  for (let i = 0; i < 6; i++) id += chars[Math.floor(random() * chars.length)];
  return `MNS-${id}`;
}
