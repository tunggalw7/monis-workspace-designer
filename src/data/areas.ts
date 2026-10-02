/** Areas in Bali we deliver to. */
export const DELIVERY_AREAS = [
  "Canggu",
  "Pererenan",
  "Berawa",
  "Seminyak",
  "Kerobokan",
  "Kuta & Legian",
  "Jimbaran",
  "Uluwatu & Bingin",
  "Nusa Dua",
  "Sanur",
  "Denpasar",
  "Ubud",
] as const;

export type DeliveryArea = (typeof DELIVERY_AREAS)[number];
