const idr = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

/** Formats a number as Indonesian Rupiah, e.g. "Rp 350.000". */
export function formatIDR(amount: number): string {
  return idr.format(amount);
}
