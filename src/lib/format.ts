const idr = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

/** Formats a number as Indonesian Rupiah, e.g. "Rp 350.000". */
export function formatIDR(amount: number): string {
  return idr.format(amount);
}

const longDate = new Intl.DateTimeFormat("en-GB", { dateStyle: "long" });

/** Formats a yyyy-mm-dd date (local time), e.g. "4 October 2026". */
export function formatDate(isoDate: string): string {
  return longDate.format(new Date(`${isoDate}T00:00`));
}
