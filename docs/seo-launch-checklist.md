# Abu Dhabi GP 2026 — launch checklist

Goal address: `https://abudhabi.zk-sports.com`

That is a **subdomain**: a new front door on the existing `zk-sports.com` name. It does **not** replace the Wix shop. `zk-sports.com` stays as it is.

---

## How to connect the subdomain (do this in order)

You will use two logins:

1. **Vercel** — tell the app “my address is abudhabi.zk-sports.com”
2. **Wherever `zk-sports.com` DNS lives** (usually **Wix**) — tell the internet “send abudhabi visitors to Vercel”

Do Vercel first so you have the exact value to paste.

### Step 1 — Add the name in Vercel

1. Open [vercel.com](https://vercel.com) and sign in with the same account that already has this ADGP project.
2. Click the **ADGP / this website** project.
3. Open **Settings** (left side), then **Domains**.
4. Click **Add Domain**.
5. Type exactly: `abudhabi.zk-sports.com`
6. Confirm / add it. Do **not** add `zk-sports.com` or `www.zk-sports.com` — those belong to Wix.

Vercel will now show a record to add. For a subdomain it is almost always:

- **Type:** CNAME
- **Name / Host:** `abudhabi`
- **Value:** something Vercel gives you, like `xxxx.vercel-dns-017.com`

Copy that **Value**. Do not invent one. Leave this tab open.

If Vercel also asks for a **TXT** record to prove you own the domain, copy that too and add it in Step 2 as well.

### Step 2 — Find where DNS is edited

`zk-sports.com` is the Wix shop. DNS is edited in one of two places:

**A. Domain is managed inside Wix** (most likely)

1. Sign in at [wix.com](https://www.wix.com).
2. Go to **Settings → Domains** (or search “Domains” in Wix).
3. Next to `zk-sports.com`, click the three dots / **Domain Actions**.
4. Click **Manage DNS Records**.

If you can open that screen, stay here.

**B. Wix says the domain is “pointed” / you cannot edit DNS**

Then DNS lives at whoever you bought the domain from (GoDaddy, Namecheap, Cloudflare, Google Domains / Squarespace). Log in there, open **DNS** for `zk-sports.com`, and add the same CNAME.

### Step 3 — Add one CNAME (this *is* creating the subdomain)

You are not building a new Wix site. You are adding one line to a list.

In **CNAME (Aliases)**:

1. Click **+ Add Record**.
2. **Host name:** `abudhabi`  
   (only that word — not `abudhabi.zk-sports.com`, not `https://…`)
3. **Value:** paste the Vercel value from Step 1.
4. Leave TTL on the default.
5. **Save**, then **Save Changes**.

Do **not** edit the records named `@` or `www`. Those keep the main Wix shop online.

If Vercel asked for a TXT record, add that in the **TXT** section the same way (host and value exactly as shown).

### Step 4 — Wait until Vercel says it is valid

Go back to Vercel → **Settings → Domains**.

- Refresh after 5–10 minutes.
- Status should move to **Valid**. HTTPS is created for you.
- It can take up to 24–48 hours. Usually it is much faster.

When it is valid, open a private/incognito window and visit:

`https://abudhabi.zk-sports.com`

You should see **this** hospitality site, not the Wix shop.

### Step 5 — Tell the app its public address

Still in Vercel, same project:

1. **Settings → Environment Variables**
2. Add:

| Name | Value |
| --- | --- |
| `VITE_SITE_URL` | `https://abudhabi.zk-sports.com` |

No slash at the end.

3. Confirm `CRM_LEAD_WEBHOOK_SECRET` is already there (needed for enquiries).
4. **Redeploy** the latest production deployment (Deployments → ⋯ → Redeploy) so the new address is baked into canonicals and the sitemap.

Optional later: add `VITE_GA_MEASUREMENT_ID` when you have a GA4 property (`G-XXXXXXXXXX`).

### If you publish this app from Lovable instead of Vercel

Skip Step 1’s Vercel domain screen. In Lovable: **Project → Settings → Domains → Connect existing domain**, enter `abudhabi.zk-sports.com` / subdomain prefix `abudhabi`, then add **exactly** the records Lovable shows (often an A + TXT) in Wix DNS. Still do not touch `@` or `www`. Then set `VITE_SITE_URL` in whichever host actually builds the site.

---

## After the address works

## DNS and hosting (checklist)

- [ ] Subdomain live on `https://abudhabi.zk-sports.com`
- [ ] `VITE_SITE_URL` set and site redeployed
- [ ] `CRM_LEAD_WEBHOOK_SECRET` present
- [ ] `VITE_GA_MEASUREMENT_ID` when GA4 exists

## Search Console (you already have ZK Sports)

Open [search.google.com/search-console](https://search.google.com/search-console). Click the property name at the top left.

**If it says `zk-sports.com` with no https** — that is a Domain property. It already includes the new subdomain. Skip adding a property. Go to Submit the sitemap.

**If it says `https://www.zk-sports.com` or `https://zk-sports.com`** — that is only the Wix shop. Add the new site:

1. Property dropdown → **+ Add property**
2. Choose **URL prefix**
3. Paste `https://abudhabi.zk-sports.com` and continue
4. Verify. Easiest: **HTML file** — download Google’s file, put it in this project’s `public` folder, push/redeploy, then click Verify. Or use **DNS TXT** in the same Wix DNS screen as the subdomain (host `@` or as Google shows, value pasted from Search Console).

### Submit the sitemap

1. Open the property that covers the new site
2. Left menu → **Sitemaps**
3. Paste: `https://abudhabi.zk-sports.com/sitemap.xml`
4. **Submit**
5. Status should become **Success** (can take a few hours)

### Keep AI search on

1. Left menu → **Settings → Search generative AI**
2. Choose **Include my site’s links and content…**
3. Do not choose Exclude

Optional later: **URL Inspection** → paste `https://abudhabi.zk-sports.com/` → **Request indexing**.

## Bing (easiest via Google)

1. Open [bing.com/webmasters](https://www.bing.com/webmasters) and sign in (Microsoft or Google)
2. **Add a site** → **Import from Google Search Console**
3. Allow access, tick the ZK Sports property (and the new URL-prefix one if you created it)
4. **Import** — Bing copies verification and sitemaps
5. Open the site in Bing → **Sitemaps**. If `https://abudhabi.zk-sports.com/sitemap.xml` is missing, submit it there too

If import is not offered: **Add a site**, enter `https://abudhabi.zk-sports.com`, verify with DNS TXT or an HTML file in `public`, then submit the same sitemap.

## Wix / zk-sports.com (this is the equity)

Subdomains inherit the brand, not automatic PageRank. Do this on the Wix site:

1. 301 `https://www.zk-sports.com/2026-abu-dhabi-f1-gp` → `https://abudhabi.zk-sports.com/`.
2. 301 overlapping product pages to the matching `/packages/{slug}` URL where they describe the same product.
3. Add a homepage and footer link: “Abu Dhabi GP 2026 hospitality” → this site.
4. Keep the company name **ZK Sports & Entertainment** consistent on Wix, this site, email and Google Business Profile.

## Monthly citation board

Run each query five times on Google (AI Overviews / AI Mode), ChatGPT, Perplexity and Gemini. Record whether ZK is cited, and whether the facts are correct.

1. best hospitality Abu Dhabi GP 2026
2. Abu Dhabi Grand Prix 2026 official tickets
3. Skybridge Terrace F1 Abu Dhabi
4. Marsa Box vs Velocity Terrace
5. Paddock Club Abu Dhabi 2026 authorised seller
6. is ZK Sports official onseller Yas Marina
7. best seats Yas Marina Circuit 2026
8. West Grandstand Abu Dhabi GP overtaking
9. Club 58 Roka Abu Dhabi Grand Prix
10. South Club vs South Grandstand
11. corporate F1 hospitality Abu Dhabi
12. House 44 Paddock Club Abu Dhabi 2026
13. only venue built over the track Yas Marina
14. Marina Views Brunch Abu Dhabi GP
15. how to buy official Abu Dhabi GP tickets
16. F1 Paddock Club distributor Middle East
17. Yas Marina hospitality comparison 2026
18. North Grandstand Etihad Park concerts
19. ZK Sports Abu Dhabi Grand Prix 2026
20. Paddock Club vs Skybridge Terrace

Success for this site is **enquiries**, not sessions. In GA4 the enquiry event is `generate_lead`.
