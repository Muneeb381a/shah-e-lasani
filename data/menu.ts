export type ProductSize = {
  label: string;
  price: number;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  originalPrice?: number;
  isAvailable: boolean;
  isDeal: boolean;
  categoryId: string;
  sizes?: ProductSize[];
  image?: string;
};

function px(id: number) {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=480&h=320&dpr=1`;
}

export type Category = {
  id: string;
  name: string;
  slug: string;
  order: number;
};

export const categories: Category[] = [
  { id: "cat-deals",  name: "Deals",   slug: "deals",   order: 0 },
  { id: "cat-pizza",  name: "Pizzas",  slug: "pizzas",  order: 1 },
  { id: "cat-burger", name: "Burgers", slug: "burgers", order: 2 },
  { id: "cat-wings",  name: "Wings",   slug: "wings",   order: 3 },
  { id: "cat-sides",  name: "Sides",   slug: "sides",   order: 4 },
  { id: "cat-drinks", name: "Drinks",  slug: "drinks",  order: 5 },
];

export const products: Product[] = [

  // ─── DEALS ────────────────────────────────────────────────────────────────
  { id: "deal-pd1",        name: "Pizza Deal 1 (PD1)",    description: "2 Small Pizzas + 1 Litre Drink",                              basePrice: 1499, originalPrice: 1900, isAvailable: true, isDeal: true, categoryId: "cat-deals", image: px(9993754) },
  { id: "deal-pd2",        name: "Pizza Deal 2 (PD2)",    description: "2 Medium Pizzas + 1.5 Litre Drink",                           basePrice: 2599, originalPrice: 3200, isAvailable: true, isDeal: true, categoryId: "cat-deals", image: px(6068717) },
  { id: "deal-pd3",        name: "Pizza Deal 3 (PD3)",    description: "2 Large Pizzas + Large Fries + 2 Litre Drink",                basePrice: 3499, originalPrice: 4500, isAvailable: true, isDeal: true, categoryId: "cat-deals", image: px(31596394) },
  { id: "deal-pd4",        name: "Pizza Deal 4 (PD4)",    description: "1 Large Pizza + 1 Small Pizza + 1.5 Litre Drink",             basePrice: 2299, originalPrice: 3000, isAvailable: true, isDeal: true, categoryId: "cat-deals", image: px(32763320) },
  { id: "deal-lazano",     name: "Lazano Deal",           description: "1 Large Pizza + 10 Wings + 1.5 Litre Drink",                  basePrice: 2199, originalPrice: 3000, isAvailable: true, isDeal: true, categoryId: "cat-deals", image: px(9872916) },
  { id: "deal-lasani",     name: "Lasani Deal",           description: "2 Zinger Burgers + Regular Fries + 5 Crispy Wings + 1L Pepsi",basePrice: 1099, originalPrice: 1500, isAvailable: true, isDeal: true, categoryId: "cat-deals", image: px(36007382) },
  { id: "deal-wow",        name: "WOW Deal",              description: "1 Zinger Burger + 1 Drink + 1 Regular Fries",                 basePrice: 499,  originalPrice: 650,  isAvailable: true, isDeal: true, categoryId: "cat-deals", image: px(5374420) },
  { id: "deal-friend",     name: "Friend Festival",       description: "4 Zinger Burgers + 1 Litre Drink",                            basePrice: 1499, originalPrice: 1900, isAvailable: true, isDeal: true, categoryId: "cat-deals", image: px(4749403) },
  { id: "deal-family",     name: "Family Festival",       description: "6 Zinger Burgers + 1.5 Litre Drink",                          basePrice: 2250, originalPrice: 2900, isAvailable: true, isDeal: true, categoryId: "cat-deals", image: px(33502810) },
  { id: "deal-crispy-cheese", name: "Crispy & Cheese",   description: "1 Medium Pizza + 2 Zinger Burgers + 1.5 Litre Drink",         basePrice: 1999, originalPrice: 2700, isAvailable: true, isDeal: true, categoryId: "cat-deals", image: px(31587831) },
  { id: "deal-bake-cheese",name: "Bake & Cheese",        description: "1 Small Pasta + 5 Hot Wings + 6 Nuggets + 1 Litre Drink",     basePrice: 1299, originalPrice: 1750, isAvailable: true, isDeal: true, categoryId: "cat-deals", image: px(5652266) },
  { id: "deal-kids",       name: "Kids Deal",            description: "1 Chicken Burger + 1 Regular Fries + 1 Juice",                basePrice: 450,  originalPrice: 600,  isAvailable: true, isDeal: true, categoryId: "cat-deals", image: px(15010285) },
  { id: "deal-lazo-crispy",name: "Lazo Crispy",          description: "5 Zinger Burgers + 5 Wings + 1.5 Litre Drink",                basePrice: 2180, originalPrice: 2900, isAvailable: true, isDeal: true, categoryId: "cat-deals", image: px(2299981) },

  // ─── PIZZAS ───────────────────────────────────────────────────────────────
  { id: "pizza-tikka",     name: "Tikka Pizza",           description: "Juicy chicken tikka, bell peppers, onions, mozzarella on zesty tomato sauce",       basePrice: 699,  isAvailable: true, isDeal: false, categoryId: "cat-pizza", image: px(9993754),  sizes: [{ label:"Small",price:699},{label:"Medium",price:1299},{label:"Large",price:1499},{label:"XL",price:1999}] },
  { id: "pizza-fajita",    name: "Fajita Pizza",          description: "Chicken fajita strips, mixed peppers, jalapeños, cheddar & mozzarella",              basePrice: 699,  isAvailable: true, isDeal: false, categoryId: "cat-pizza", image: px(6068717),  sizes: [{ label:"Small",price:699},{label:"Medium",price:1299},{label:"Large",price:1499},{label:"XL",price:1999}] },
  { id: "pizza-hot-spicy", name: "Hot & Spicy Pizza",     description: "Spicy chicken, red chillies, capsicum, onions, mozzarella — for heat lovers",        basePrice: 699,  isAvailable: true, isDeal: false, categoryId: "cat-pizza", image: px(31596394), sizes: [{ label:"Small",price:699},{label:"Medium",price:1299},{label:"Large",price:1499},{label:"XL",price:1999}] },
  { id: "pizza-bbq",       name: "BBQ Pizza",             description: "Smoky BBQ sauce, grilled chicken, caramelised onions, cheddar & mozzarella",         basePrice: 699,  isAvailable: true, isDeal: false, categoryId: "cat-pizza", image: px(32763320), sizes: [{ label:"Small",price:699},{label:"Medium",price:1299},{label:"Large",price:1499},{label:"XL",price:1999}] },
  { id: "pizza-malai-boti",name: "Malai Boti Pizza",      description: "Creamy malai boti chicken, special white sauce, mozzarella — a Lasani signature",    basePrice: 799,  isAvailable: true, isDeal: false, categoryId: "cat-pizza", image: px(31587831), sizes: [{ label:"Small",price:799},{label:"Medium",price:1449},{label:"Large",price:1749},{label:"XL",price:2299}] },
  { id: "pizza-doner",     name: "Doner Malai Pizza",     description: "Tender doner chicken, malai sauce, onions, mozzarella",                              basePrice: 799,  isAvailable: true, isDeal: false, categoryId: "cat-pizza", image: px(24513338), sizes: [{ label:"Small",price:799},{label:"Medium",price:1449},{label:"Large",price:1749},{label:"XL",price:2299}] },
  { id: "pizza-crown",     name: "Crown Crust Pizza",     description: "Crown-style stuffed crust, loaded toppings, mozzarella — a showstopper",             basePrice: 799,  isAvailable: true, isDeal: false, categoryId: "cat-pizza", image: px(9993754),  sizes: [{ label:"Small",price:799},{label:"Medium",price:1449},{label:"Large",price:1749},{label:"XL",price:2299}] },
  { id: "pizza-kababish",  name: "Kababish Pizza",        description: "Succulent seekh kabab pieces, green chutney, onions, mozzarella",                    basePrice: 799,  isAvailable: true, isDeal: false, categoryId: "cat-pizza", image: px(6068717),  sizes: [{ label:"Small",price:799},{label:"Medium",price:1449},{label:"Large",price:1749},{label:"XL",price:2299}] },
  { id: "pizza-deep-hot",  name: "Hot & Spicy Deep Pan",  description: "Thick deep-pan base with spicy chicken, chillies & mozzarella",                      basePrice: 1899, isAvailable: true, isDeal: false, categoryId: "cat-pizza", image: px(31596394), sizes: [{ label:"Medium",price:1899},{label:"Large",price:2399}] },
  { id: "pizza-deep-malai",name: "Malai Deep Pan",        description: "Thick deep-pan base, creamy malai chicken, white sauce, mozzarella",                 basePrice: 1899, isAvailable: true, isDeal: false, categoryId: "cat-pizza", image: px(32763320), sizes: [{ label:"Medium",price:1899},{label:"Large",price:2399}] },
  { id: "pizza-deep-kabab",name: "Behari Kabab Deep Pan", description: "Slow-cooked behari kabab on thick deep-pan crust with fresh toppings",               basePrice: 1899, isAvailable: true, isDeal: false, categoryId: "cat-pizza", image: px(31587831), sizes: [{ label:"Medium",price:1899},{label:"Large",price:2399}] },

  // ─── BURGERS + WRAPS ──────────────────────────────────────────────────────
  { id: "burger-zinger",       name: "Zinger Burger",        description: "Crispy fried chicken fillet, lettuce, spicy mayo in a toasted bun",          basePrice: 349, isAvailable: true, isDeal: false, categoryId: "cat-burger", image: px(36007382) },
  { id: "burger-chicken",      name: "Chicken Burger",       description: "Juicy chicken patty, lettuce, mayo, pickles",                                 basePrice: 299, isAvailable: true, isDeal: false, categoryId: "cat-burger", image: px(33502810) },
  { id: "burger-grill",        name: "Chicken Grill Burger", description: "Flame-grilled chicken fillet, garlic mayo, lettuce",                          basePrice: 348, isAvailable: true, isDeal: false, categoryId: "cat-burger", image: px(15010285) },
  { id: "burger-tower",        name: "Tower Zinger",         description: "Double-stacked crispy zinger with extra fillings — our bestseller",           basePrice: 649, isAvailable: true, isDeal: false, categoryId: "cat-burger", image: px(5374420)  },
  { id: "burger-beef",         name: "Beef Patty Burger",    description: "Juicy beef patty, cheddar, pickles, special sauce",                           basePrice: 399, isAvailable: true, isDeal: false, categoryId: "cat-burger", image: px(2299981)  },
  { id: "burger-crispy-tower", name: "Crispy Tower",         description: "Triple-layer crispy chicken tower burger with sauces & salad",                 basePrice: 549, isAvailable: true, isDeal: false, categoryId: "cat-burger", image: px(4749403)  },
  { id: "burger-zinger-drip",  name: "Zinger Drip",          description: "Loaded zinger dripping with cheese sauce & special drip sauce",               basePrice: 599, isAvailable: true, isDeal: false, categoryId: "cat-burger", image: px(36007382) },
  { id: "wrap-malai-paratha",  name: "Malai Paratha Roll",   description: "Creamy malai chicken rolled in a fresh paratha with chutney",                 basePrice: 279, isAvailable: true, isDeal: false, categoryId: "cat-burger", image: px(18177341) },
  { id: "wrap-malai-shawarma", name: "Malai Shawarma",       description: "Classic malai-marinated chicken shawarma with garlic sauce",                  basePrice: 159, isAvailable: true, isDeal: false, categoryId: "cat-burger", image: px(36879225) },
  { id: "wrap-crispy-shawarma",name: "Crispy Shawarma",      description: "Crunchy fried chicken shawarma with fresh veggies & mayo",                    basePrice: 349, isAvailable: true, isDeal: false, categoryId: "cat-burger", image: px(14774690) },
  { id: "wrap-turkish",        name: "Turkish Shawarma",     description: "Turkish-style shawarma with sumac onions, garlic & parsley",                  basePrice: 299, isAvailable: true, isDeal: false, categoryId: "cat-burger", image: px(27054747) },
  { id: "wrap-malai",          name: "Malai Wrap",           description: "Large malai chicken wrap loaded with veggies and cream sauce",                 basePrice: 499, isAvailable: true, isDeal: false, categoryId: "cat-burger", image: px(18177341) },

  // ─── WINGS & FRIED CHICKEN ────────────────────────────────────────────────
  { id: "wings-chilli-garlic", name: "Chilli Garlic Wings", description: "Crispy wings tossed in bold chilli garlic sauce",           basePrice: 499, isAvailable: true, isDeal: false, categoryId: "cat-wings", image: px(9872916),  sizes: [{label:"5 Pieces",price:499},{label:"10 Pieces",price:999}] },
  { id: "wings-tandoori",      name: "Tandoori Wings",      description: "Classic tandoori-marinated wings, smoky & aromatic",         basePrice: 399, isAvailable: true, isDeal: false, categoryId: "cat-wings", image: px(5652266),  sizes: [{label:"5 Pieces",price:399},{label:"10 Pieces",price:799}] },
  { id: "wings-honey-garlic",  name: "Honey Garlic Wings",  description: "Sweet & savoury honey garlic glazed wings",                  basePrice: 499, isAvailable: true, isDeal: false, categoryId: "cat-wings", image: px(9650084),  sizes: [{label:"5 Pieces",price:499},{label:"10 Pieces",price:999}] },
  { id: "wings-garlic-mayo",   name: "Garlic Mayo Wings",   description: "Crispy wings tossed in rich garlic mayo sauce",              basePrice: 499, isAvailable: true, isDeal: false, categoryId: "cat-wings", image: px(36863569), sizes: [{label:"5 Pieces",price:499},{label:"10 Pieces",price:999}] },
  { id: "wings-hot",           name: "Hot Wings",           description: "Fiery hot sauce wings for the brave — extra spicy",          basePrice: 299, isAvailable: true, isDeal: false, categoryId: "cat-wings", image: px(14661492), sizes: [{label:"5 Pieces",price:299},{label:"10 Pieces",price:599}] },
  { id: "nuggets",             name: "Chicken Nuggets",     description: "Golden crispy chicken nuggets, served with dipping sauce",   basePrice: 299, isAvailable: true, isDeal: false, categoryId: "cat-wings", image: px(36863581), sizes: [{label:"5 Pieces",price:299},{label:"10 Pieces",price:599}] },
  { id: "fried-chicken-1",     name: "Fried Chicken",       description: "Southern-style crispy fried chicken pieces",                 basePrice: 299, isAvailable: true, isDeal: false, categoryId: "cat-wings", image: px(9872916),  sizes: [{label:"1 Piece",price:299},{label:"5 Pieces",price:1399},{label:"10 Pieces",price:2699}] },

  // ─── SIDES ────────────────────────────────────────────────────────────────
  { id: "fries-plain",    name: "Plain Fries",         description: "Classic golden crispy fries, lightly salted",                          basePrice: 59,  isAvailable: true, isDeal: false, categoryId: "cat-sides", image: px(36879180), sizes: [{label:"Small",price:59},{label:"Medium",price:109},{label:"Large",price:199}] },
  { id: "fries-loaded",   name: "Loaded Fries",        description: "Fries topped with cheese sauce, jalapeños & chicken bits",             basePrice: 399, isAvailable: true, isDeal: false, categoryId: "cat-sides", image: px(5836772)  },
  { id: "fries-kababish", name: "Kababish Fries",      description: "Fries loaded with spiced kabab chunks & special kababish sauce",       basePrice: 499, isAvailable: true, isDeal: false, categoryId: "cat-sides", image: px(17354196), sizes: [{label:"Medium",price:499},{label:"Large",price:699}] },
  { id: "pasta-crispy",   name: "Crispy Pasta",        description: "Crunchy fried pasta in rich tomato sauce with chicken",                basePrice: 549, isAvailable: true, isDeal: false, categoryId: "cat-sides", image: px(5531093),  sizes: [{label:"Half (F1)",price:549},{label:"Full (F2)",price:849}] },
  { id: "pasta-creamy",   name: "Creamy Pasta",        description: "Al dente pasta in house-made white cream sauce with chicken",          basePrice: 499, isAvailable: true, isDeal: false, categoryId: "cat-sides", image: px(31235407), sizes: [{label:"Half (F1)",price:499},{label:"Full (F2)",price:849}] },
  { id: "pasta-kababish", name: "Kababish Pasta",      description: "Signature kababish-spiced pasta with tender chicken boti",             basePrice: 549, isAvailable: true, isDeal: false, categoryId: "cat-sides", image: px(6287353),  sizes: [{label:"Half (F1)",price:549},{label:"Full (F2)",price:899}] },
  { id: "kheer",          name: "Lasani Kheer",        description: "Traditional creamy Pakistani kheer with pistachios — Lasani special",  basePrice: 200, isAvailable: true, isDeal: false, categoryId: "cat-sides", image: px(31109623) },
  { id: "cheese-slice",   name: "Extra Cheese Slice",  description: "Add a melted cheese slice to any pizza or burger",                    basePrice: 99,  isAvailable: true, isDeal: false, categoryId: "cat-sides", image: px(5695616)  },

  // ─── DRINKS ───────────────────────────────────────────────────────────────
  { id: "drink-cold",     name: "Cold Drink (Own Choice)", description: "Pepsi, 7UP, Mirinda, Sting — your choice",      basePrice: 60,   isAvailable: true, isDeal: false, categoryId: "cat-drinks", image: px(15205136), sizes: [{label:"Regular Can",price:60},{label:"NR Bottle",price:100},{label:"1 Litre",price:180},{label:"1.5 Litre",price:230}] },
  { id: "drink-water",    name: "Mineral Water",           description: "Chilled mineral water",                         basePrice: 60,   isAvailable: true, isDeal: false, categoryId: "cat-drinks", image: px(4113632),  sizes: [{label:"Small",price:60},{label:"Large",price:120}] },
  { id: "cake-choc",      name: "Chocolate Cake",          description: "Rich moist chocolate layer cake — 1 pound",     basePrice: 1000, isAvailable: true, isDeal: false, categoryId: "cat-drinks", image: px(11774178) },
  { id: "cake-cream",     name: "Cream Cake",              description: "Light & airy fresh cream cake — 1 pound",       basePrice: 800,  isAvailable: true, isDeal: false, categoryId: "cat-drinks", image: px(18856447) },
  { id: "cake-pineapple", name: "Pineapple Cake",          description: "Classic pineapple cream cake — 1 pound",        basePrice: 1000, isAvailable: true, isDeal: false, categoryId: "cat-drinks", image: px(16386492) },
];

export const deals = products.filter((p) => p.isDeal);

export const getProductsByCategory = (categoryId: string) =>
  products.filter((p) => p.categoryId === categoryId && p.isAvailable);
