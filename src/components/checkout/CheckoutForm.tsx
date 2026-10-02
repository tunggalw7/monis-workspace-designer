"use client";

import { useState, type ReactNode } from "react";
import { DELIVERY_AREAS } from "@/data/areas";
import {
  createOrderId,
  EMPTY_FORM,
  normalizePhone,
  startDateBounds,
  validateCheckout,
  validateField,
  type CheckoutErrors,
  type CheckoutForm as Form,
} from "@/lib/checkout";
import { formatDate } from "@/lib/format";
import { useSetup } from "@/store/setup";
import { buildOrder, type Order } from "./order";

const input =
  "w-full rounded-xl border-2 border-border bg-background px-3 py-2.5 text-base transition outline-none focus:border-ocean aria-invalid:border-terracotta";

function Field(props: {
  id: keyof Form;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={props.id} className="text-sm font-semibold">
        {props.label}
        {props.optional && <span className="font-normal text-muted"> (optional)</span>}
      </label>
      {props.children}
      {props.hint && !props.error && (
        <p id={`${props.id}-hint`} className="text-xs text-muted">
          {props.hint}
        </p>
      )}
      {props.error && (
        <p id={`${props.id}-error`} className="text-xs font-medium text-terracotta-dark">
          {props.error}
        </p>
      )}
    </div>
  );
}

export function CheckoutForm({ onPlaced }: { onPlaced: (order: Order) => void }) {
  const [today] = useState(() => new Date());
  const [form, setForm] = useState<Form>(EMPTY_FORM);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Form, boolean>>>({});
  const [submitting, setSubmitting] = useState(false);
  const { min, max } = startDateBounds(today);

  function update(field: keyof Form, value: string) {
    const next = { ...form, [field]: value };
    setForm(next);
    // Once a field has been visited, re-validate as the user types so errors clear promptly.
    if (touched[field]) setErrors((e) => ({ ...e, [field]: validateField(field, next, today) }));
  }

  function blur(field: keyof Form) {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((e) => ({ ...e, [field]: validateField(field, form, today) }));
  }

  function describedBy(field: keyof Form, hasHint = false) {
    if (errors[field]) return `${field}-error`;
    return hasHint ? `${field}-hint` : undefined;
  }

  const a11y = (field: keyof Form, hasHint = false) => ({
    id: field,
    name: field,
    value: form[field],
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": describedBy(field, hasHint),
    onBlur: () => blur(field),
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const found = validateCheckout(form, today);
    setErrors(found);
    setTouched({
      name: true,
      email: true,
      whatsapp: true,
      area: true,
      address: true,
      startDate: true,
    });
    const first = (Object.keys(EMPTY_FORM) as (keyof Form)[]).find((f) => found[f]);
    if (first) {
      document.getElementById(first)?.focus();
      return;
    }
    setSubmitting(true);
    // No real payment or backend: simulate a short request.
    await new Promise((r) => setTimeout(r, 700));
    const { deskId, chairId, accessories, rentalMonths } = useSetup.getState();
    const clean = { ...form, whatsapp: normalizePhone(form.whatsapp), name: form.name.trim() };
    onPlaced(buildOrder(createOrderId(), clean, { deskId, chairId, accessories, rentalMonths }));
  }

  return (
    <form
      noValidate
      onSubmit={submit}
      aria-labelledby="details-heading"
      className="flex flex-col gap-4 rounded-3xl border border-border bg-surface p-4 shadow-sm sm:p-6"
    >
      <div>
        <h2 id="details-heading" className="font-display text-2xl font-semibold">
          Delivery details
        </h2>
        <p className="text-sm text-muted">
          We deliver and set everything up at your villa. No payment needed now.
        </p>
      </div>

      <Field id="name" label="Full name" error={errors.name}>
        <input
          {...a11y("name")}
          autoComplete="name"
          className={input}
          onChange={(e) => update("name", e.target.value)}
        />
      </Field>

      <Field id="email" label="Email" error={errors.email}>
        <input
          {...a11y("email")}
          type="email"
          autoComplete="email"
          inputMode="email"
          className={input}
          onChange={(e) => update("email", e.target.value)}
        />
      </Field>

      <Field
        id="whatsapp"
        label="WhatsApp number"
        error={errors.whatsapp}
        hint="With country code if not Indonesian, e.g. +44 7700 900123."
      >
        <input
          {...a11y("whatsapp", true)}
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          placeholder="+62 812 3456 7890"
          className={input}
          onChange={(e) => update("whatsapp", e.target.value)}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="area" label="Delivery area" error={errors.area}>
          <select
            {...a11y("area")}
            className={input}
            onChange={(e) => update("area", e.target.value)}
          >
            <option value="">Choose an area…</option>
            {DELIVERY_AREAS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </Field>

        <Field
          id="startDate"
          label="Start date"
          error={errors.startDate}
          hint={`Earliest ${formatDate(min)}.`}
        >
          <input
            {...a11y("startDate", true)}
            type="date"
            min={min}
            max={max}
            className={input}
            onChange={(e) => update("startDate", e.target.value)}
          />
        </Field>
      </div>

      <Field id="address" label="Villa name or address" error={errors.address} optional>
        <textarea
          {...a11y("address")}
          rows={2}
          autoComplete="street-address"
          className={input}
          onChange={(e) => update("address", e.target.value)}
        />
      </Field>

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 rounded-full bg-terracotta px-5 py-3.5 font-semibold text-white shadow-sm transition hover:bg-terracotta-dark focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-wait disabled:opacity-70"
      >
        {submitting ? "Placing your order…" : "Confirm rental"}
      </button>
    </form>
  );
}
