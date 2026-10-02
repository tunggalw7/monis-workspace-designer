import type { CheckoutForm } from "@/lib/checkout";
import { getLineItems, getMonthlyTotal, type Setup } from "@/lib/setup";

export type Order = {
  id: string;
  form: CheckoutForm;
  setup: Setup;
  lines: { name: string; qty: number; monthly: number }[];
  monthly: number;
  total: number;
};

export function buildOrder(id: string, form: CheckoutForm, setup: Setup): Order {
  const monthly = getMonthlyTotal(setup);
  return {
    id,
    form,
    setup,
    lines: getLineItems(setup).map((l) => ({
      name: l.product.name,
      qty: l.qty,
      monthly: l.monthly,
    })),
    monthly,
    total: monthly * setup.rentalMonths,
  };
}
