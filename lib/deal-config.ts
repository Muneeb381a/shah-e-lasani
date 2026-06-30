export type PizzaGroup = { title: string; items: string[] };

export type ChoiceSection =
  | { kind: "pizza"; key: string; label: string; options: string[]; groups: PizzaGroup[] }
  | { kind: "drink"; key: string; label: string; options: string[] }
  | { kind: "pasta"; key: string; label: string; options: string[] }
  | { kind: "wings"; key: string; label: string; options: string[] }
  | { kind: "fries"; key: string; label: string; options: string[] };

// ── Pizza flavors ─────────────────────────────────────────────────────────
const CLASSIC:   string[] = ["Tikka Pizza", "Fajita Pizza", "Hot & Spicy Pizza", "BBQ Pizza"];
const SIGNATURE: string[] = ["Malai Boti Pizza", "Doner Malai Pizza", "Crown Crust Pizza", "Kabab Crust Pizza", "Kababish Pizza"];
const DEEP_PAN:  string[] = ["Hot & Spicy Deep Pan", "Malai Deep Pan", "Behari Kabab Deep Pan", "Kababish Deep Pan"];

const SMALL_PIZZA  = [...CLASSIC];
const MEDIUM_PIZZA = [...CLASSIC, ...SIGNATURE];
const LARGE_PIZZA  = [...CLASSIC, ...SIGNATURE, ...DEEP_PAN];

const GRP_SM: PizzaGroup[] = [
  { title: "Classic", items: CLASSIC },
];
const GRP_MD: PizzaGroup[] = [
  { title: "Classic",   items: CLASSIC },
  { title: "Signature", items: SIGNATURE },
];
const GRP_LG: PizzaGroup[] = [
  { title: "Classic",   items: CLASSIC },
  { title: "Signature", items: SIGNATURE },
  { title: "Deep Pan",  items: DEEP_PAN },
];

// ── Other options ─────────────────────────────────────────────────────────
const DRINKS      = ["Pepsi", "7UP", "Mirinda", "Sting", "Next Cola"];
const FRIES_OPTS  = ["Plain Fries", "Honey Mustard Fries", "Lasani Fries", "Loaded Fries", "Kababish Fries"];
const PASTA_OPTS  = ["Crispy Pasta", "Creamy Pasta", "Kababish Pasta"];
const WINGS_OPTS  = ["Chilli Garlic", "Tandoori", "Honey Garlic", "Garlic Mayo", "Hot Wings"];

// ── Helpers ───────────────────────────────────────────────────────────────
function pizza(key: string, label: string, opts: string[], groups: PizzaGroup[]): ChoiceSection {
  return { kind: "pizza", key, label, options: opts, groups };
}
function drink(label = "Choose Your Drink"): ChoiceSection {
  return { kind: "drink", key: "drink", label, options: DRINKS };
}
function fries(label = "Choose Your Fries"): ChoiceSection {
  return { kind: "fries", key: "fries", label, options: FRIES_OPTS };
}
function wings(key: string, label: string): ChoiceSection {
  return { kind: "wings", key, label, options: WINGS_OPTS };
}
function pasta(label = "Choose Pasta Type"): ChoiceSection {
  return { kind: "pasta", key: "pasta", label, options: PASTA_OPTS };
}

// ── Deal configs ──────────────────────────────────────────────────────────
export const DEAL_CONFIG: Record<string, ChoiceSection[]> = {

  // Pizza Deals
  "deal-pd1": [
    pizza("pizza1", "Pizza 1 — Small",  SMALL_PIZZA,  GRP_SM),
    pizza("pizza2", "Pizza 2 — Small",  SMALL_PIZZA,  GRP_SM),
    drink(),
  ],
  "deal-pd2": [
    pizza("pizza1", "Pizza 1 — Medium", MEDIUM_PIZZA, GRP_MD),
    pizza("pizza2", "Pizza 2 — Medium", MEDIUM_PIZZA, GRP_MD),
    drink(),
  ],
  "deal-pd3": [
    pizza("pizza1", "Pizza 1 — Large",  LARGE_PIZZA,  GRP_LG),
    pizza("pizza2", "Pizza 2 — Large",  LARGE_PIZZA,  GRP_LG),
    drink(),
  ],
  "deal-pd4": [
    pizza("pizza1", "Large Pizza",       LARGE_PIZZA,  GRP_LG),
    pizza("pizza2", "Small Pizza",       SMALL_PIZZA,  GRP_SM),
    drink(),
  ],

  // Lazano Deal
  "deal-lazano": [
    pizza("pizza1", "Large Pizza",            LARGE_PIZZA,  GRP_LG),
    wings("wings1", "Wings Flavor (10 pcs)"),
    drink(),
  ],

  // Burger / Combo Deals
  "deal-lasani": [
    wings("wings1", "Wings Flavor (5 pcs)"),
    drink(),
  ],
  "deal-wow":  [drink()],
  "deal-bd01": [drink()],
  "deal-bd02": [drink()],
  "deal-bd03": [drink()],
  "deal-bd04": [drink()],

  // Group Deals (drink only)
  "deal-friend":       [drink()],
  "deal-family":       [drink()],
  "deal-lazo-crispy":  [wings("wings1", "Wings Flavor (5 pcs)"), drink()],
  "deal-crunchy-bite": [drink()],

  // Pizza + Burger
  "deal-crispy-cheese": [
    pizza("pizza1", "Medium Pizza", MEDIUM_PIZZA, GRP_MD),
    drink(),
  ],

  // Pasta Deal
  "deal-bake-cheese": [pasta(), drink()],

  // Kids Deal
  "deal-kids": [drink("Choose Juice / Drink")],
};
