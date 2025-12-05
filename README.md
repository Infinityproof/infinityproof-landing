# Infinityproof Landing Page

Decision Mastery course landing page with Formspree email capture.

## Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

The site will be available at `http://localhost:5173`

## Deployment to Vercel

### Option 1: Via GitHub (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/infinityproof-landing.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com) and sign in with GitHub
   - Click "Add New Project"
   - Import your `infinityproof-landing` repository
   - Vercel auto-detects Vite – just click "Deploy"
   - Done! Your site is live at `infinityproof-landing.vercel.app`

### Option 2: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## Custom Domain Setup

1. In Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain (e.g., `course.infinityproof.de`)
3. Vercel shows you DNS records to add
4. In your domain provider (Shopify/DNS settings):
   - Add a CNAME record pointing to `cname.vercel-dns.com`
   - Or add an A record pointing to Vercel's IP (76.76.21.21)
5. Wait for DNS propagation (usually 5-30 minutes)

## Formspree

Email submissions go to: `https://formspree.io/f/xanrbdzy`

View submissions at: [formspree.io/forms](https://formspree.io/forms)

## Project Structure

```
infinityproof-landing/
├── index.html          # Entry HTML
├── package.json        # Dependencies
├── vite.config.js      # Vite config
├── public/
│   └── favicon.svg     # Hourglass favicon
└── src/
    ├── main.jsx        # React entry
    └── App.jsx         # Main component (all pages)
```

## Customization

- **Formspree URL**: Change `FORMSPREE_URL` in `src/App.jsx`
- **Colors**: Search for `#8B9A46` (olive) and `#C4A84B` (gold)
- **Content**: Edit text directly in `App.jsx`
