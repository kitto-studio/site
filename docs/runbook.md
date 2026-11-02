# Runbook: Cloudflare

Plain steps for everything the site needs on Cloudflare. All of it lives in one Cloudflare account,
on the zones `kitto.studio` and `kitto-studio.com`.

A merge to `main` deploys by itself (CI). A deploy from your machine is only for an emergency.

## State

| Thing | State |
|---|---|
| Pages project `kitto-studio`, production branch `main` | done |
| Custom domains `kitto.studio` and `www.kitto.studio` on the project | done |
| DNS: `kitto.studio` and `www` `CNAME kitto-studio.pages.dev`, Proxied | done |
| Email Routing on `kitto.studio` (MX, SPF, DKIM records) | done |
| Destination address: Hanna's mailbox | verified |
| Rules `support@kitto.studio` and `delete@kitto.studio` | done |
| Email Address Obfuscation on `kitto.studio` | off, see step 6 |
| `kitto-studio.com` and `www.kitto-studio.com` → `https://kitto.studio` (301) | done |
| `www.kitto.studio` → `https://kitto.studio` (301) | done |
| Secrets `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` in GitHub | done, CI deploys on `main` |

---

## 1. Credentials

You need them for a deploy from your machine (or `bunx wrangler login`) and always for CI.

**API token.**

1. Dashboard → My Profile → API Tokens → Create Token → Custom token.
2. Permission: Account → Cloudflare Pages → Edit.
3. Account resources: the Kitto account. Create, copy the token.

**Account ID.** Dashboard → Workers & Pages → Account ID in the right column. Or run
`bunx wrangler whoami`.

**On your machine**, in `.env` at the repo root (git ignores it):

```sh
CLOUDFLARE_API_TOKEN=...
CLOUDFLARE_ACCOUNT_ID=...
```

**In GitHub**, repo `kitto-studio/site` → Settings → Secrets and variables → Actions → New
repository secret, once for each name. Or:

```sh
gh secret set CLOUDFLARE_API_TOKEN --repo kitto-studio/site
gh secret set CLOUDFLARE_ACCOUNT_ID --repo kitto-studio/site
```

---

## 2. Deploy

### From your machine

1. Log in once, or put the two values from step 1 in `.env`:

   ```sh
   bunx wrangler login
   ```

2. Build and deploy:

   ```sh
   bun run build
   bun run deploy -- --cli
   ```

3. Answer `y` to the prompt. It runs `wrangler pages deploy dist --project-name kitto-studio
   --branch main`, so the deploy goes to production.

The first run writes `wrangler.jsonc` and `.github/workflows/deploy.yml` when they are missing.
Commit `wrangler.jsonc`: the deploy checks for it. Do not commit `deploy.yml`: `ci.yml` already
deploys, and two workflows would deploy twice.

`bun run deploy` without `--cli` runs the guided setup: it checks every prerequisite and explains
what is missing.

### From CI

`.github/workflows/ci.yml` calls `moku-labs/ci` `app-deploy.yml`:

- every pull request: the checks (lint, build, tests with `test:coverage`);
- every push to `main`: the same checks, then `bun run deploy`.

It needs the two secrets from step 1. Without them the deploy job fails.

### Check

```sh
curl -sI https://kitto.studio/en/ | head -1          # HTTP/2 200
curl -sI https://kitto.studio/about/ | grep -i location   # /en/about/
curl -s https://kitto.studio/sitemap.xml | head -3
```

---

## 3. Roll back

Cloudflare keeps every deployment.

1. Dashboard → Workers & Pages → `kitto-studio` → Deployments.
2. Find the last good **Production** deployment in the list.
3. Its `⋯` menu → Rollback to this deployment → confirm.

The rollback is live at once. The next push to `main` deploys again over it, so also revert the bad
commit on `main`:

```sh
git revert <sha>
git push
```

To list deployments from the terminal:

```sh
bunx wrangler pages deployment list --project-name kitto-studio
```

---

## 4. Mail: support@ and delete@

Email Routing forwards mail to Hanna's mailbox. Cloudflare only receives and forwards; it sends
nothing.

### 4.1 Verify the destination

Hanna's mailbox is added as a destination and shows **Pending**.

1. Hanna opens the email Cloudflare sent to her mailbox ("Verify email address").
2. She clicks the verify link.
3. Dashboard → `kitto.studio` → Email → Email Routing → Destination addresses: the status is now
   **Verified**.

No email? Check spam. Or click Resend verification next to the address.

### 4.2 Create the two rules

Dashboard → `kitto.studio` → Email → Email Routing → Routing rules → Custom addresses → Create
address.

| Custom address | Action | Destination |
|---|---|---|
| `support` | Send to an email | Hanna's mailbox |
| `delete` | Send to an email | Hanna's mailbox |

Save each one. Leave the catch-all off.

### 4.3 Test

1. From another mailbox, write to `support@kitto.studio`, then to `delete@kitto.studio`.
2. Both arrive in Hanna's mailbox. Look in spam the first time.
3. Activity log under Email Routing → Overview shows each message as Forwarded.

Replies go out from Hanna's own address, not from `support@`.

---

## 5. Redirects

### 5.1 kitto-studio.com → kitto.studio (done)

On the zone `kitto-studio.com`:

- DNS: `AAAA` records for `@` and `www`, content `100::`, **Proxied**. They only exist so the
  traffic reaches Cloudflare.
- Rules → Redirect Rules: one Single Redirect. Both hostnames go to `https://kitto.studio` with
  the same path, status 301.

Check:

```sh
curl -sI https://kitto-studio.com/en/about/ | grep -iE "^HTTP|location"
# HTTP/2 301
# location: https://kitto.studio/en/about/
```

### 5.2 www.kitto.studio → kitto.studio (done)

First check:

```sh
curl -sI https://www.kitto.studio/en/about/ | grep -iE "^HTTP|location"
```

A `301` with `location: https://kitto.studio/en/about/` means it is done. A `200` means do this:

1. Dashboard → `kitto.studio` → Rules → Redirect Rules → Create rule.
2. Name: `www to apex`.
3. When incoming requests match: Custom filter expression, Hostname equals `www.kitto.studio`.
4. Then: Type **Dynamic**, expression `concat("https://kitto.studio", http.request.uri.path)`,
   status **301**, Preserve query string **on**.
5. Deploy. Run the check again.

Keep `www.kitto.studio` attached to the Pages project: its DNS record stays proxied and the rule
answers before Pages does.

---

## 6. Email Address Obfuscation stays off

Security → Settings → Email Address Obfuscation is **Off** on `kitto.studio`. Keep it off.

Cloudflare rewrites each address in the HTML to `[email protected]` and decodes it with a script
that runs once, on a full page load. The site loads the next page as HTML and swaps it in, so after
any link inside the site the addresses stayed `[email protected]`, links went to a 404, and the copy
button copied the placeholder. The Cloudflare docs give no way to decode swapped-in HTML: their
advice for dynamic pages is to switch the feature off. The addresses are public anyway (the stores
require them), and Email Routing filters the spam.

Check after a change on the zone:

```sh
curl -s https://kitto.studio/en/support/ | grep -c "email-protection"
# 0
```

---

## 6. Where things are

| What | Where |
|---|---|
| Pages project | Workers & Pages → `kitto-studio` |
| Custom domains | `kitto-studio` → Custom domains |
| Mail | `kitto.studio` → Email → Email Routing |
| Redirect rules | each zone → Rules → Redirect Rules |
| Security and cache headers | `public/_headers` in this repo |
| Bare path → `/en/` redirects | `dist/_redirects`, written by the build |
