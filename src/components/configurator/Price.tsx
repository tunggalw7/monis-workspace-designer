import { formatIDR } from "@/lib/format";

export function Price({ amount }: { amount: number }) {
  return (
    <span className="text-sm text-muted">
      <span className="font-semibold whitespace-nowrap text-foreground">{formatIDR(amount)}</span>
      <wbr />
      /mo
    </span>
  );
}
