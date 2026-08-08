# The Indian Table

A premium, single-page website for The Indian Table, a home-based Indian food business in the UK offering collection and local delivery. Built with HTML5, Tailwind CSS and vanilla JavaScript. No backend, no database, no cart or checkout — this is a menu showcase site with WhatsApp ordering.

## Project structure

```
the-indian-plate/
├── index.html                 Main page (all sections)
├── src/
│   ├── data/
│   │   ├── menu.json          All menu items — edit this to change the menu
│   │   └── tiffin.json        Weekly tiffin thali schedule (Mon–Sat)
│   ├── js/
│   │   ├── app.js             Site behaviour (nav, WhatsApp links, gallery, tiffin)
│   │   ├── menu.js            Renders & filters the menu from menu.json
│   │   └── config.js          Business details — edit this to change contact info
│   └── css/
│       └── styles.css         Custom styles on top of Tailwind
├── public/
│   ├── images/                Site photos (gallery, logo) — add your own here
│   ├── favicon.ico
│   ├── robots.txt
│   └── sitemap.xml
├── .github/
│   └── workflows/
│       └── deploy.yml         GitHub Actions workflow — auto-deploys to GitHub Pages on push
├── CNAME                      Custom domain for GitHub Pages (theindiantable.co.uk)
└── README.md
```

## Running locally

The site fetches `menu.json` and `tiffin.json` with `fetch()`, which requires a local web server (opening `index.html` directly via `file://` will not load the menu). Any static server works:

```bash
cd the-indian-plate

# Option A — Python
python3 -m http.server 8000

# Option B — Node
npx serve .
```

Then open `http://localhost:8000`.

## Building

There is no build step. This is a static site — Tailwind is loaded via CDN and all JavaScript is vanilla, so the project can be deployed exactly as-is.

## Deploying to Cloudflare Pages

1. Push this project to a GitHub/GitLab repository.
2. In the Cloudflare dashboard, go to **Workers & Pages → Create → Pages → Connect to Git**.
3. Select the repository.
4. Build settings:
   - **Framework preset:** None
   - **Build command:** (leave blank)
   - **Build output directory:** `/` (project root)
5. Deploy. Add `theindiantable.co.uk` as a custom domain under **Custom domains** once deployed.

## Deploying to GitHub Pages

This repo includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically deploys the site to GitHub Pages every time you push to `main`.

1. Push this project to a GitHub repository, on the `main` branch.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to "GitHub Actions" (not "Deploy from a branch").
4. Push a commit to `main` (or go to the **Actions** tab and manually run the "Deploy to GitHub Pages" workflow). The site will build and publish automatically.
5. Your site will be published at `https://<username>.github.io/<repo>/`, or at `https://theindiantable.co.uk/` once the custom domain is configured (see below).

**Custom domain (`theindiantable.co.uk`):** the repo already includes a `CNAME` file with the domain in it, so GitHub Pages will pick it up automatically once Pages is enabled. You'll still need to point your domain's DNS at GitHub Pages — add either an `ALIAS`/`ANAME` record (or `A` records pointing at GitHub's Pages IPs) for the apex domain, or a `CNAME` record for a `www` subdomain, as described in [GitHub's custom domain docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site). If you don't want to use `theindiantable.co.uk` yet, just delete or edit the `CNAME` file.

If you'd rather deploy manually without Actions, you can still go to **Settings → Pages**, set **Source** to "Deploy from a branch", and pick `main` / root — but the included workflow is the recommended, zero-maintenance option.

## Updating the menu

Open `src/data/menu.json`. Each dish is an object:

```json
{
  "id": "butter-chicken",
  "name": "Butter Chicken",
  "description": "Tender chicken cooked in a rich tomato and butter gravy.",
  "price": 9.99,
  "category": "Main Course",
  "type": "non-veg",
  "popular": true,
  "image": "public/images/butter-chicken.webp"
}
```

- `category` should be one of: `Starters`, `Chinese`, `Bread`, `Rice & Biryani`, `Main Course`, `Desserts`, `Cookie Dough & Browney`, `Drinks` (these drive the category filter buttons and table sections automatically — only categories actually present in the data show up, so you can add new ones freely).
- `type` must be `veg` or `non-veg`.
- `popular: true` adds the "⭐ Popular" tag next to the dish name.
- Set `"price": null` for an item with no fixed price (e.g. flavours you'd rather quote over WhatsApp) — the table shows "Ask on WhatsApp" instead of a price for that row.
- The menu displays as a table (dish name, price, veg/non-veg icon) rather than photo cards, matching the look of the original printed menu. `description` and `image` fields are kept in the data for future use but aren't shown on the page currently.

Add, remove or reorder items freely — the page rebuilds the menu and filters automatically. No HTML or JavaScript editing required.

## Updating the weekly tiffin

Open `src/data/tiffin.json` — it's an array of `{ "day": "Monday", "items": ["Daal Tadka", "Chilli Paneer", ...] }` objects. Add, remove, or edit days and their items freely; the Tiffin section on the page rebuilds automatically. There's no price field here since tiffin subscriptions are quoted directly over WhatsApp.

## Updating business details

Open `src/js/config.js` and edit the values — this single file controls the phone number, WhatsApp number, address, opening hours, delivery areas and social links shown across the entire site, plus the WhatsApp order message.

Important: `whatsappNumber` must be in full international format with no spaces, no `+` and no leading `0` — e.g. a UK mobile `07123 456789` becomes `"447123456789"`.

## Using your own photos

The gallery photos are stored locally in `public/images/` (`gallery-*.jpg`) rather than hotlinked from a third-party site, so they won't break. Replace them with your own photos any time — just keep the same filenames, or update the `src` paths in the Gallery section of `index.html` if you rename them. The hero and about section images still use placeholder Unsplash URLs; swap those for your own photos in `index.html` when ready. The menu itself no longer displays photos, so `menu.json` image URLs don't need updating. For best performance, export images as `.webp` or `.jpg`, roughly 800px wide for gallery photos and 1600px wide for the hero image, and keep individual files under ~200KB.

## SEO

`index.html` already includes a meta title/description, Open Graph tags, Twitter card tags, a `Restaurant` JSON-LD schema block, `robots.txt` and `sitemap.xml`. Update the JSON-LD block in `index.html` and `public/sitemap.xml`/`robots.txt` if the domain or address ever changes.

## Notes

This site intentionally has no shopping cart, checkout, payments, user accounts or backend — all ordering happens via WhatsApp or phone, matching how the business actually takes orders.
