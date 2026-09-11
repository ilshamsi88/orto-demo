# Endurance Lab — Food Form

Nutrition intake questionnaire used to build an athlete's food plan.

## Files

| File | What it is |
| --- | --- |
| `Endurance-Lab-Food-Form.pdf` | 2-page A4 print-and-fill version. Send or print this. |
| `food-form-print.html` | Source for the PDF. Fonts are linked from Google Fonts. |

## Sections

1. **Your day** — name, wake/sleep, work hours, training time
2. **How you eat now** — meals per day, breakfast, late eating, a normal day of eating
3. **Allergies** — intolerances, anything that sits badly before training
4. **Who makes your food** — cooking, ordering, weekend family lunch
5. **Drinks** — water, karak/tea, sugar, coffee, soft drinks
6. **Foods** — 57 tick-box items across protein/dairy, carbs, veg/fruit, fats
7. **Habits** — weak spots, fasting, supplements
8. **Anything else** — hardest part with food, free notes

## Interactive version

The live form (auto-saves answers, builds a WhatsApp summary) is published as an Artifact:

https://claude.ai/code/artifact/5111f503-d660-4b4d-8b1d-d8bd2e75f75e

## Regenerating the PDF

The print HTML links fonts from Google Fonts. To render, inline the font files as
base64 `data:` URIs first (headless Chromium will not fetch them behind a proxy), then:

```sh
chrome --headless --disable-gpu --no-pdf-header-footer \
  --run-all-compositor-stages-before-draw --virtual-time-budget=15000 \
  --print-to-pdf=Endurance-Lab-Food-Form.pdf food-form-print.html
```
