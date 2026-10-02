import type { Metadata } from "next";
import Link from "next/link";
import { Checkout } from "@/components/checkout/Checkout";

export const metadata: Metadata = {
  title: "Rent your setup · Monis Workspace Designer",
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6">
      <header className="flex flex-col gap-1">
        <Link
          href="/"
          className="w-fit rounded text-sm font-semibold text-terracotta-dark hover:underline focus-visible:ring-2 focus-visible:ring-ocean focus-visible:outline-none"
        >
          ← Back to designer
        </Link>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Rent your setup
        </h1>
      </header>
      <main>
        <Checkout />
      </main>
    </div>
  );
}
