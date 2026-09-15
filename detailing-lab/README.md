# Detailing Lab — car wash booking app (demo)

A clickable, iPhone-style demo of a mobile car wash / detailing booking app, built to
show the business owner the full customer journey before committing to a production build.

The headline feature: **the moment a customer confirms a booking, the owner gets a
WhatsApp message with every detail of the job.**

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

## The demo journey

1. **Sign up** — name + UAE phone number, no password
2. **Home** — branding, "Book a Wash", service list, next appointment
3. **Choose a service** — price, duration, expandable "what's included"
4. **Your car** — make/model, type, plate, colour (saved for next time)
5. **Location** — typed address, address lookup, drag-a-pin map, access notes
6. **Pick a time** — 14-day strip, slots grouped by morning/afternoon/evening,
   unavailable slots struck through
7. **Summary** — everything in one place with an itemised price, each row editable
8. **Checkout** — Apple Pay / card, clearly marked as a demo, nothing charged
9. **Confirmed** — order number, and a receipt showing the owner's WhatsApp went out
10. **My Bookings** — upcoming and previous, with live status
11. **Admin** — every booking, one-tap status changes, editable services and prices

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

👤 Customer: Omar Saeed
📱 Phone: +971 55 900 1234

🧴 Service: Premium Hand Wash & Wax
🚗 Car: Mercedes G 63 (SUV, White)
🔢 Plate: D 71155

📅 Date: Tuesday 15 September 2026
⏰ Time: 1:30 PM

📍 Location: Home — Marina Gate 2, Dubai Marina
🗺️ Map: https://maps.google.com/?q=25.204800,55.270800
📝 Notes: Gate on the left, white villa

💰 Total: *AED 250*
```

### Making it fully automatic

1. Copy `.env.example` to `.env` and set `VITE_WHATSAPP_MODE=api`
2. Deploy `api/notify-whatsapp.js` as a serverless function (it works as-is on Vercel)
3. Set the server-side credentials for either Meta's WhatsApp Cloud API or Twilio —
   both are supported and documented at the top of that file

---

## Deploying

Vercel picks this up with no configuration (`vercel.json` handles SPA routing and the
API route). Netlify works too — `public/_redirects` covers client-side routing, and
`api/notify-whatsapp.js` needs moving to `netlify/functions/`.

---

## What's real and what's demo

**Real:** the whole customer journey, saved cars and addresses, map pin selection,
availability logic, price calculation including vehicle-size supplements, status
workflow, admin editing, WhatsApp message generation and delivery.

**Demo-only:**

- **Payments.** The checkout screen is a visual mock. Nothing is charged, card fields
  are disabled. Stripe, Telr or Network International would slot in here.
- **Storage.** State lives in the browser's `localStorage`, so each device has its own
  copy and the owner's admin view only shows bookings made on that device. A real
  build needs a shared backend — otherwise the shop can't see a customer's booking.
- **Accounts.** No OTP or password. Real sign-in would verify the phone number by SMS.
- **Availability.** Slots are generated from a fixed schedule plus existing bookings,
  not from real staff rosters.

"Reset demo data" on the Profile tab wipes everything back to the seeded state —
useful between presentations.

---

## Structure

```
src/
  screens/      one file per screen
  components/   layout shell, icons, map picker, status rail, shared rows
  store/        app state + localStorage persistence
  lib/          WhatsApp adapter, geocoding, slot generation, formatting
  data/seed.ts  services, prices, sample bookings
api/            serverless WhatsApp sender
```

Branding lives in one place — `src/components/Logo.tsx` and the `aqua` colours in
`tailwind.config.js`. Swap those and the whole app re-skins.
