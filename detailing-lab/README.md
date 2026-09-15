# Detailing Lab — car wash booking app (demo)

A clickable, iPhone-style demo of a mobile car wash / detailing booking app, built to
show the business owner the full customer journey before committing to a production build.

The headline feature: **the moment a customer confirms a booking, the owner gets a
WhatsApp message with every detail of the job.**

The UI follows the owner's supplied reference design — dark, rose-accented, photo-led,
with a mock iOS status bar and a four-tab bottom bar.

---

## Run it

```bash
npm install
npm run dev          # http://localhost:5173
```

```bash
npm run build        # production bundle in dist/
npm run preview      # serve the built bundle
```

Open it on a phone (or a browser at ~390px wide) for the intended experience. On a
desktop the app renders inside a phone frame so it still reads as a mobile app.

Add it to an iPhone home screen (Share → Add to Home Screen) and it opens full-screen
with no browser chrome — the fastest way to make a web demo feel native.

---

## The screens

| # | Screen | Route |
|---|---|---|
| 1 | Welcome — crest logo over a dark hero | `/welcome` |
| 2 | Sign up / Log in — name + UAE phone | `/login` |
| 3 | Home — city selector, hero, trust tiles | `/home` |
| 4 | Services — category filter chips, photo rows | `/services` |
| 5 | Book a Service (Step 1/5) — vehicle type, details, add-ons | `/book/service` |
| 6 | Your Location (Step 2/5) — address search, map pin, notes | `/book/location` |
| 7 | Date & Time (Step 3/5) — 14-day strip, slot grid | `/book/time` |
| 8 | Payment (Step 4/5) — summary, card / Apple Pay / cash | `/book/payment` |
| 9 | Booking Confirmed — order number, Add to Calendar | `/booking-confirmed/:id` |
| 10 | My Bookings — upcoming / past, reschedule, cancel | `/bookings` |
| 11 | Profile — avatar, saved data, settings | `/profile` |
| — | Admin — shop-side dashboard | `/admin` |

**Admin is deliberately not in the tab bar** — customers never see it. Reach it from
**Profile → Settings → Open Admin Dashboard**, or go straight to `/admin`.

Statuses run **Confirmed → On the Way → Arrived → Washing → Completed**. Changing a
status in Admin updates the customer's view immediately.

---

## WhatsApp notification

`src/lib/whatsapp.ts` has three modes, set by `VITE_WHATSAPP_MODE`:

| Mode | What happens | Setup needed |
|---|---|---|
| `link` *(default)* | WhatsApp opens pre-filled with the booking; one tap to send | Just the owner's number |
| `api` | Sent automatically, no tap | WhatsApp Cloud API or Twilio credentials |
| `simulated` | Nothing sent; the exact message is shown on screen | None |

With no owner number configured, `link` falls back to `simulated` so the demo never
dead-ends.

The message the owner receives:

```
🧼 *NEW BOOKING — Detailing Lab*
Order: *DL-4904*

👤 Customer: Mohammed Saeed
📱 Phone: +971 50 771 4400

🧴 Service: Premium Wash
➕ Add-ons: Engine Bay Clean (AED 49), Ceramic Wax (AED 149)
🚗 Car: Mercedes G 63 (SUV, Black)
🔢 Plate: D 71155

📅 Date: Tuesday 15 September 2026
⏰ Time: 2:30 PM

📍 Location: Home — Marina Gate 2, Dubai Marina
🗺️ Map: https://maps.google.com/?q=25.204800,55.270800
📝 Notes: Tower 2, basement P1

💰 Total: *AED 377*
💳 Payment: Cash on Arrival
```

### Making it fully automatic

1. Copy `.env.example` to `.env` and set `VITE_WHATSAPP_MODE=api`
2. Deploy `api/notify-whatsapp.js` as a serverless function (it works as-is on Vercel)
3. Set the server-side credentials for either Meta's WhatsApp Cloud API or Twilio —
   both are supported and documented at the top of that file

---

## Branding and imagery

Two files own the entire look:

- **`src/components/Logo.tsx`** plus **`src/components/brand/glyphs.ts`** — the logo.
- **`src/data/images.ts`** — every image in the app resolves through one map of
  generated SVG placeholders. Drop real photos into `public/img/` and change a value
  to `'/img/premium-wash.jpg'`. No other file references an image path.

### The logo

The supplied mark is reproduced as vector paths, not set in a font — the wordmark has
to render identically in the app, the favicon, the PWA icon and a social card, and a
webfont is a network dependency that silently falls back to a generic sans. Closest
typeface match is the Eurostile / Good Times family; Orbitron is the nearest free
equivalent. A vector file from the owner (SVG/AI/PDF) would let these paths be replaced
with the exact originals.

It ships as a three-cut system, because one lockup cannot cover every size — the
wordmark is roughly 12:1, so the full crest turns to mush below about 180px:

| Cut | Use | Size |
|---|---|---|
| `crest` | welcome screen, print | 180px+ |
| `lockup` | headers, nav bars | 100–260px |
| `monogram` | app icon, avatars | 24–100px |
| `monogram` + `bare` | favicon — ring dropped so the DL stays legible | under 24px |

```tsx
<Logo variant="crest" width={300} />
<Logo variant="lockup" width={118} flat />
<Logo variant="monogram" width={32} flat weight={1.7} />
```

`flat` swaps the rose-gold gradient for solid rose — the metallic banding needs area to
read and turns to noise below ~40px. `weight` thickens the strokes for small sizes.

`public/icon.svg` (app icon) and `public/favicon.svg` are generated from the same
monogram geometry.

Colours live in `tailwind.config.js` as the `blush` (rose accent) and `ink` (warm
near-black) scales.

---

## What's real and what's demo

**Real:** the whole customer journey, category filtering, priced add-ons, saved
vehicles and addresses, map pin selection, availability logic, price calculation with
vehicle-size supplements, reschedule and cancel, calendar export (.ics), the status
workflow, admin editing of services and add-ons, and WhatsApp message generation and
delivery.

**Demo-only:**

- **Payments.** The checkout screen is a visual mock. Nothing is charged. Stripe, Telr
  or Network International would slot in here.
- **Storage.** State lives in the browser's `localStorage`, so each device has its own
  copy and the owner's admin view only shows bookings made on that device. A real
  build needs a shared backend — otherwise the shop can't see a customer's booking.
- **Accounts.** No OTP or password. Real sign-in would verify the phone number by SMS.
- **Availability.** Slots come from a fixed schedule plus existing bookings, not from
  real staff rosters.
- **Address lookup.** Uses OpenStreetMap Nominatim (free, no key). Swap `src/lib/geocode.ts`
  for the Google Geocoding API if UAE address quality matters.

**Profile → Settings → Reset demo data** wipes everything back to the seeded state —
useful between presentations.

---

## Structure

```
src/
  screens/      one file per screen
  components/   layout shell, crest logo, status bar, icons, map picker, status rail
  store/        app state + localStorage persistence
  lib/          WhatsApp adapter, geocoding, slot generation, .ics export, formatting
  data/         seed.ts (services, add-ons, sample bookings), images.ts (image map)
api/            serverless WhatsApp sender
```
