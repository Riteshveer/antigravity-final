# Welcome to your Lovable project

TODO: Document your project here

## Deployment

Two ways to deploy this site to Vercel:

- **Via Vercel dashboard (recommended)**: Push this repository to GitHub, then on Vercel import the repo and select the root project. Vercel will use the `build` script (`npm run build`) and the `dist` output directory.

- **Via Vercel CLI (local deploy)**:

```bash
# install Vercel CLI (if not installed)
npm i -g vercel

# login to your Vercel account
vercel login

# deploy to production from project root
vercel --prod

# or use the npm script
npm run deploy
```

Notes:
- `vercel.json` is included and configures the static build to use `dist` as the output directory.
- Ensure `npm run build` works locally before deploying.
