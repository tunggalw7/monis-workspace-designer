"use client";

import { RENTAL_MONTHS } from "@/lib/setup";
import { useSetup } from "@/store/setup";

export function DurationPicker() {
  const rentalMonths = useSetup((s) => s.rentalMonths);
  const setRentalMonths = useSetup((s) => s.setRentalMonths);

  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold">Rental duration</legend>
      <div className="grid grid-cols-4 gap-1 rounded-full bg-sand p-1">
        {RENTAL_MONTHS.map((m) => (
          <label
            key={m}
            className="cursor-pointer rounded-full py-2 text-center text-sm font-semibold text-muted transition hover:text-foreground has-checked:bg-surface has-checked:text-foreground has-checked:shadow-sm has-focus-visible:ring-2 has-focus-visible:ring-ocean"
          >
            <input
              type="radio"
              name="rental-months"
              value={m}
              checked={rentalMonths === m}
              onChange={() => setRentalMonths(m)}
              className="sr-only"
            />
            {m} mo
          </label>
        ))}
      </div>
    </fieldset>
  );
}
