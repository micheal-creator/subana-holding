# Subana Holding

The company website for Subana Holding, built with React, Vite and Tailwind.
It uses a classic consulting / holding-company structure with a restrained
navy, teal and gold theme, responsive layouts and reduced-motion-friendly
reveal animations.

## Included pages

- Home
- About Us
- Our Team
- Team Details
- Projects
- Project Details
- Services
- Service Details
- FAQ
- Gallery
- Pricing
- Blog Grid
- Blog List
- Blog Details
- Contact
- 404
- Contact and newsletter forms

Know Your Right is featured as a Subana Holding project with links to:

- https://knowyourright.ng/
- https://app.knowyourright.ng/

## Run locally

```bash
npm install
npm run dev
npm run build
```

The GitHub Actions workflow deploys the `dist/` folder to GitHub Pages on every
push to `main`.

## CMS

Open `/#/admin` on the deployed site. Demo mode supports an admin login with
any email/password and stores edits in the browser. The workspace includes
editors for settings, pages, team, projects, services, FAQs, blog posts,
gallery and pricing. The Supabase starting schema is in `supabase/schema.sql`.

For production, create a Supabase project, run that SQL, add authentication
and storage configuration, and replace the demo persistence with the Supabase
client credentials and adapters. Do not use demo mode as a production access
control system.
