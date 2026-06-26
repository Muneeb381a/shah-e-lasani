# 🍕 Pizza Shop Website — Complete Build Plan

> Client brief: KFC-style design inspiration, product showcase, customers can order online, shop owner receives the order. Products/deals must be editable later without touching code. No heavy backend — keep it lean.

---

## 1. Deep Analysis — What This Project Actually Needs

Client ki request surface pe simple lagti hai ("website bna do, order ho jaye") lekin usme 4 alag requirements chupi hain:

| Requirement | Client ne kaha | Iska matlab technically |
|---|---|---|
| Design | "KFC jaisa design" | Bold colors, big food photography, grid-based menu, sticky cart |
| Ordering | "Customer order kry" | Cart system + checkout flow |
| Receiving | "Shop waly ko receive ho" | WhatsApp notification (no dashboard needed — confirmed) |
| Maintainability | "Product/deals change hongy" | **Database-driven menu + simple admin page** — NOT hardcoded HTML |

Ye aakhri point sab se important hai. Agar pizza/prices/deals seedhe HTML/JS files mein likh diye, tu har choti tabdeeli k liye client tumhe call karega aur tumhe code edit kar k redeploy karna parega — yehi "overkill" se bachne ka galat tariqa hai (overkill backend se bachna theek hai, lekin no-database approach bhi ghalat hai, kyunke phir tum khud manual labor mein phans jaoge).

**Sahi balance:**
- ❌ Full enterprise backend (microservices, separate Node/Express server, complex order management dashboard) — overkill, client ko abhi iski zaroorat nahi
- ❌ Hardcoded products in code — galat, har deal change pe redeploy karna parega
- ✅ **Next.js + free Postgres DB + ek chhota password-protected admin page** — products/deals DB se aate hain, owner khud add/edit kar sakta hai, koi dashboard ya order-tracking system nahi (jaisa confirm hua)

### Order Flow Decision (confirmed: WhatsApp-based)

Customer → Cart banayega → Checkout pe details (name, phone, address) dega → Order **database mein save hoga** (safety record, taake kuch ghalat ho to data na khoye) → Same waqt ek **WhatsApp message auto-generate** hoga jisme order details hon, aur ek click se shop k WhatsApp number pe chala jayega.

Isse dono fayde milte hain: shop owner ko apna pasandeeda WhatsApp flow milta hai, aur tumhare paas backup record bhi rehta hai (agar owner WhatsApp message delete kar de ya miss kar jaye).

### Payment Decision (confirmed: online payment chahiye)

**Zaroori reality check jo client ko batana hai:**

JazzCash aur Easypaisa ka **merchant account** business documents (CNIC, bank account details, kabhi kabhi NTN) maang ta hai aur approval mein dinon se hafton tak lag sakte hain. Hum integration code ready kar denge, lekin merchant account khud client/business ko apply karna hoga.

Jab tak woh approve nahi hota, launch k liye practical fallback:
- **Bank Transfer + Screenshot Upload** — customer order place karte waqt apna payment screenshot upload kare, ya
- **Cash on Delivery** as default, online payment "coming soon" k tor pe

Hum dono ka structure bana denge taake jaise hi merchant account mil jaye, sirf API keys add karni hon, code restructure na karna paray.

### Hosting Decision (confirmed: Vercel + free DB)

- **Vercel** — Next.js k liye built-in, free tier generous hai, custom domain bhi free tier pe attach ho sakta hai
- **Neon** (Postgres, free tier) ya **Supabase** (Postgres + extra features, free tier) — database k liye. Hum **Neon** use karenge kyunke Next.js + Vercel + Neon combo sabse smooth hai aur free tier mein koi credit card nahi maangta.

---

## 2. Final Tech Stack

```
Frontend + Backend (combined):  Next.js 14 (App Router)
Styling:                        Tailwind CSS
Database:                       PostgreSQL (Neon — free tier)
ORM:                            Prisma
Admin Auth:                     Simple password-based (NextAuth - Credentials provider)
Notifications:                  WhatsApp (click-to-chat link, no paid API needed)
Payments:                       JazzCash/Easypaisa integration stub + Bank Transfer fallback
Hosting:                        Vercel (free tier)
Image hosting:                  Vercel Blob Storage (free tier) or Cloudinary free tier
```

**Why this combination is the "right-sized" choice:**
- Next.js API routes = backend, alag se Express server ki zaroorat nahi → deployment simplify
- Prisma + Postgres = real database, lekin Prisma ka simple syntax beginner-friendly hai
- NextAuth credentials = full user-management system banane ki zaroorat nahi, sirf "is this the owner?" check karna hai
- Sab kuch ek hi repo, ek hi Vercel project — maintenance asaan

---

## 3. Database Schema (Prisma)

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Category {
  id        String    @id @default(cuid())
  name      String    // e.g. "Pizzas", "Deals", "Sides", "Drinks"
  slug      String    @unique
  order     Int       @default(0)
  products  Product[]
}

model Product {
  id          String   @id @default(cuid())
  name        String
  description String?
  price       Float
  imageUrl    String?
  isAvailable Boolean  @default(true)
  isDeal      Boolean  @default(false)   // true for combo deals
  categoryId  String
  category    Category @relation(fields: [categoryId], references: [id])
  sizes       Size[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Size {
  id        String  @id @default(cuid())
  label     String  // "Small", "Medium", "Large"
  price     Float   // overrides base price if set
  productId String
  product   Product @relation(fields: [productId], references: [id])
}

model Order {
  id            String      @id @default(cuid())
  customerName  String
  customerPhone String
  address       String
  items         OrderItem[]
  totalAmount   Float
  paymentMethod String      // "COD" | "BANK_TRANSFER" | "JAZZCASH" | "EASYPAISA"
  paymentProof  String?     // screenshot URL for bank transfer
  status        String      @default("RECEIVED") // simple status, no dashboard needed but good to log
  createdAt     DateTime    @default(now())
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id])
  productId String
  name      String  // snapshot in case product is edited/deleted later
  size      String?
  price     Float
  quantity  Int
}

model Admin {
  id       String @id @default(cuid())
  email    String @unique
  password String // hashed
}
```

**Note:** `Order` model rakhna isliye zaroori hai chahe dashboard na ho — yeh tumhara **safety net** hai. Agar WhatsApp message kisi wajah se na pohnchy, data DB mein mojood rahega aur tum/owner phir bhi dekh sakte ho (chahe direct DB browser se, Neon ka free web console use kar k).

---

## 4. Project Structure

```
pizza-shop/
├── app/
│   ├── page.tsx                      → Homepage (hero, featured deals)
│   ├── menu/
│   │   └── page.tsx                  → Full menu (categories + products from DB)
│   ├── cart/
│   │   └── page.tsx                  → Cart + checkout page
│   ├── order-success/
│   │   └── page.tsx                  → Confirmation page (with WhatsApp button)
│   ├── admin/
│   │   ├── login/page.tsx            → Admin login
│   │   ├── page.tsx                  → Admin dashboard (list products)
│   │   ├── products/
│   │   │   ├── new/page.tsx          → Add product
│   │   │   └── [id]/edit/page.tsx    → Edit product
│   │   └── deals/page.tsx            → Manage deals
│   ├── api/
│   │   ├── products/route.ts         → GET products (public)
│   │   ├── orders/route.ts           → POST new order
│   │   ├── admin/
│   │   │   ├── products/route.ts     → CRUD (protected)
│   │   │   └── upload/route.ts       → Image upload (protected)
│   │   └── auth/[...nextauth]/route.ts
│   └── layout.tsx
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   ├── DealCard.tsx
│   ├── CartDrawer.tsx
│   └── CategoryTabs.tsx
├── lib/
│   ├── prisma.ts                     → Prisma client singleton
│   ├── cart-context.tsx              → React Context for cart state
│   └── whatsapp.ts                   → WhatsApp message builder
├── prisma/
│   └── schema.prisma
├── public/
│   └── images/
├── .env.local
├── next.config.js
├── tailwind.config.ts
└── package.json
```

---

## 5. Step-by-Step Build Roadmap

### Phase 1 — Project Setup (Day 1)
1. `npx create-next-app@latest pizza-shop` (TypeScript: Yes, Tailwind: Yes, App Router: Yes)
2. Neon.tech pe free account bana k Postgres database create karo, connection string copy karo
3. Prisma install: `npm install prisma @prisma/client`
4. `npx prisma init`, schema upar wala paste karo, `npx prisma migrate dev --name init`
5. NextAuth install: `npm install next-auth`

### Phase 2 — Database + Seed Data (Day 1-2)
6. Ek `seed.ts` script likho jo client k existing menu items DB mein dal de (taake admin panel khaali na ho)
7. `npx prisma db seed` chalao

### Phase 3 — Public Website (Day 2-4)
8. Header/Footer components (KFC-style: bold red/dark theme, logo, nav)
9. Homepage — hero banner, "Today's Deals" section (DB se isDeal=true filter)
10. Menu page — categories tabs, product grid, "Add to Cart" buttons
11. Cart Context — global cart state (localStorage backup taake refresh pe cart na ude)
12. Cart/Checkout page — customer details form, order summary, payment method selection

### Phase 4 — Order Submission + WhatsApp (Day 4-5)
13. `/api/orders` route — order ko DB mein save kare
14. WhatsApp link generator — order details ko pre-filled WhatsApp message mein convert kare:
    ```
    https://wa.me/92XXXXXXXXXX?text=<encoded order details>
    ```
15. Order success page — order confirm hone k baad customer ko "WhatsApp pe confirm karein" button dikhe (auto-open bhi try karo, lekin button fallback rakho — mobile browsers pop-up block kar sakte hain)

### Phase 5 — Payment Integration (Day 5-6)
16. Checkout pe payment method radio buttons: Cash on Delivery / Bank Transfer / JazzCash / Easypaisa
17. Bank Transfer select karne pe: account details dikhao + screenshot upload field (Vercel Blob ya Cloudinary)
18. JazzCash/Easypaisa: integration ka structure bana do (merchant credentials env variables se aayengi), lekin agar client k paas abhi merchant account nahi hai to ye option UI mein "Coming Soon" disabled state mein rakho

### Phase 6 — Admin Panel (Day 6-8)
19. `/admin/login` — simple email/password form (NextAuth credentials provider)
20. `/admin` — products table (edit/delete/toggle availability buttons)
21. `/admin/products/new` aur `/edit` — form to add/update product (name, price, image upload, category, sizes)
22. `/admin/deals` — same logic, lekin isDeal flag k sath

### Phase 7 — Polish + Launch (Day 8-10)
23. Mobile responsiveness check (zyada tar customers mobile se order karenge)
24. Loading states, error handling
25. SEO basics (meta tags, Open Graph image for sharing)
26. Vercel pe deploy: GitHub repo connect karo, environment variables (DATABASE_URL, NEXTAUTH_SECRET, WhatsApp number) Vercel dashboard mein add karo
27. Custom domain attach karo (agar client ke paas hai)

---

## 6. WhatsApp Order Message — Example Logic

```typescript
// lib/whatsapp.ts

export function buildWhatsAppOrderMessage(order: {
  customerName: string;
  customerPhone: string;
  address: string;
  items: { name: string; size?: string; quantity: number; price: number }[];
  totalAmount: number;
  paymentMethod: string;
}) {
  const lines = [
    `🍕 *Naya Order Aaya Hai!*`,
    ``,
    `*Customer:* ${order.customerName}`,
    `*Phone:* ${order.customerPhone}`,
    `*Address:* ${order.address}`,
    ``,
    `*Order Details:*`,
    ...order.items.map(
      (item) =>
        `- ${item.name}${item.size ? ` (${item.size})` : ""} x${item.quantity} — Rs. ${item.price * item.quantity}`
    ),
    ``,
    `*Total: Rs. ${order.totalAmount}*`,
    `*Payment Method:* ${order.paymentMethod}`,
  ];

  const message = encodeURIComponent(lines.join("\n"));
  const shopWhatsAppNumber = "92XXXXXXXXXX"; // shop ka number, country code k sath, no + or 0

  return `https://wa.me/${shopWhatsAppNumber}?text=${message}`;
}
```

---

## 7. Cost Breakdown (Free Tier Limits — Important for Client Conversation)

| Service | Free Tier Limit | Jab limit cross ho |
|---|---|---|
| Vercel Hosting | 100GB bandwidth/month | ~$20/month Pro plan |
| Neon Database | 0.5GB storage, generous compute | ~$19/month for more |
| Vercel Blob (images) | 1GB storage | Pay-as-you-go after |

Ek chhoti pizza shop k liye ye free limits **mahinon tak kaafi** rahenge. Client ko ye bata dena transparent rakhega — agar business grow kare to thora monthly cost aayega, but abhi launch pe zero hosting cost hai.

---

## 8. What's Deliberately NOT Included (and why)

- ❌ Order-tracking dashboard for shop staff — confirmed not needed, WhatsApp sufficient
- ❌ Customer login/accounts — adds complexity, zyada tar local food orders guest checkout se hi chalte hain
- ❌ Delivery rider tracking — separate product altogether, future scope
- ❌ Multi-branch support — agar future mein client k multiple shops khulen, schema mein `Branch` model add kar sakte ho, abhi ek hi location k liye design hai

Agar client future mein in mein se koi feature maange, schema aur structure already isi tarah design hai k inko **add kiya ja sake bina sab dobara likhe** — yehi is plan ki strength hai.

---

## 9. Client Conversation Points (Important)

In baaton ko client ko clearly explain karna:

1. **JazzCash/Easypaisa merchant account khud client ko lena hoga** — hum sirf integrate karenge
2. **Domain name aur business WhatsApp number** client se chahiye honge setup k liye
3. **Product photos** — high quality images dene honge, design ka KFC-jaisa look isi pe depend karta hai
4. **Admin panel training** — launch k baad 15-20 min ka walkthrough dena hoga taake owner khud products/deals manage kar sake

---

## 10. Immediate Next Steps (Tumhare liye)

1. [ ] Client se shop ka naam, logo, color preference, aur sample menu (items + prices) collect karo
2. [ ] WhatsApp business number confirm karo
3. [ ] `create-next-app` se project initialize karo (Phase 1, Step 1)
4. [ ] Neon account bana k DB connect karo
5. [ ] Mujhe batao jab Phase 1 complete ho jaye — phir hum Phase 2 (seed data + categories) pe actual code likhna shuru karenge