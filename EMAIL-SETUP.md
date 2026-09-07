# Company email setup — knowyourright.ng

Two separate things:

1. **Mailbox (send & receive)** — a real inbox you log into (`you@knowyourright.ng`).
2. **App sending (Resend)** — the website's contact form + newsletter email you from the domain.

---

## 1) Mailbox (send & receive)

The domain already shows WhoGoHost email hosting in DNS, so a mailbox is very likely already available — no DNS changes needed.

1. Log in to **WhoGoHost → My Services / cPanel**.
2. Open **Email Accounts**.
3. **Create** an address, e.g. `hello@knowyourright.ng` (and/or `micheal@knowyourright.ng`).
4. Read/reply in **Webmail** (`https://webmail.knowyourright.ng`) or connect it to Gmail/Outlook/phone using the IMAP/SMTP settings cPanel shows.

If your WhoGoHost plan has **no** email hosting, use **Zoho Mail (free)** instead: add the domain in Zoho, verify it, and switch the MX records to Zoho's (`mx.zoho.com`, `mx2.zoho.com`, `mx3.zoho.com`) — ask and I'll give exact records.

---

## 2) App sending via Resend

Front-end + Edge Function are already built. Finish the connection:

### a. Resend account + domain
1. Create an account at https://resend.com and add domain **`updates.knowyourright.ng`** (a dedicated subdomain, so it won't clash with the existing `send.` relay).
2. Resend shows 3 DNS records (MX + 2 TXT: SPF + DKIM). Add them at **WhoGoHost DNS** exactly as shown.
3. Wait for Resend to mark the domain **Verified**.
4. **API Keys → Create** → copy the key (starts with `re_`).

### b. Deploy the Edge Function (Supabase CLI)
```bash
npm i -g supabase
supabase login
supabase link --project-ref xnzdocycebcitjytgxlp
supabase secrets set RESEND_API_KEY=re_xxx CONTACT_TO=hello@knowyourright.ng FROM_EMAIL="Subana Holding <hello@updates.knowyourright.ng>"
supabase functions deploy send-email --no-verify-jwt
```

That's it. The contact form and newsletter will then deliver to `hello@knowyourright.ng`.
Until the function is deployed, both forms **fall back to opening the visitor's email app** addressed to `hello@knowyourright.ng`, so they never break.
