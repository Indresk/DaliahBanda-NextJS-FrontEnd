# Daliah Banda - Official Website

![Daliah Banda](https://assets.daliahbanda.com/brand/logos/full/logo-daliah-vector-black-v1.webp)

## Overview

This is the official front-end repository for **Daliah Banda's** website - a modern, fully server-side rendered (SSR) site built with **Next.js**. The site showcases the music, performances, and creative journey of Colombia's metalcore and pop emo punk band from Bogotá.

**Live Site:** [daliahbanda.com](https://daliahbanda.com)

## About Daliah Banda

We are a Colombian rock band based in Bogotá with over 8 years of history in the alternative music scene. Our sound is a dynamic fusion of:

- **Metalcore** - Modern and progressive metal elements
- **Pop Emo Punk** - Melodic and emotional vocal-driven rock
- **Rock Alternativo** - Contemporary alternative rock influences

### Musical Identity

We combine the melodic complexity of progressive metal with the raw energy of 90s and 2000s punk rock, resulting in energetic, emotionally-charged compositions. Lyrically, they explore emotional, social, and political themes that invite personal and collective reflection.

### Current Band Members

- **Silvia Berrio** - Lead Vocals
- **Rafael Salcedo** - Keyboards
- **Michael Villaizan** - Lead Guitar
- **Jesús Ardiles** - Rhythm Guitar & Vocals
- **Christian Ramírez** - Bass & Vocals
- **Nicolás Araújo** - Drums & Vocals

## Project Tech Stack

### Frontend Framework

- **Next.js** - React framework with full SSR/SSG capabilities
- **TypeScript** - Type-safe development
- **React** - Component-based UI
- **CSS Modules & Tailwind CSS** - Styling solution

### Development Tools

- **ESLint** - Code quality and linting
- **PNPM** - Fast, disk space-efficient package manager
- **Node.js** - JavaScript runtime

### Key Features

- ✅ **Full Server-Side Rendering (SSR)** - Optimized performance and SEO
- ✅ **Dynamic Routes** - Album pages, gallery filters, live streaming
- ✅ **Image Optimization** - Responsive images with Next.js Image component
- ✅ **Mobile-Responsive Design** - Mobile menu and adaptive layouts
- ✅ **Live Streaming Integration** - Links to Kick.com streaming
- ✅ **Music Integration** - Spotify, Apple Music, YouTube, and more
- ✅ **Gallery & Media Management** - Photo galleries filtered by events
- ✅ **Social Media Integration** - Instagram, Facebook, TikTok, YouTube, SoundCloud, Spotify

## Project Structure

```
daliahbanda-next/
├── app/                          # Next.js 13+ App Router
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Homepage
│   ├── _components/             # Page-specific components
│   │   ├── Hero.jsx
│   │   ├── Integrantes.jsx      # Band members showcase
│   │   ├── FlyersCarousel.jsx   # Event flyers carousel
│   │   ├── LiveCard.jsx          # Live streaming card
│   │   └── RecommendedSong.jsx  # Music recommendations
│   ├── albums/                  # Album listing & details
│   │   ├── page.tsx
│   │   ├── [album]/            # Dynamic album routes
│   │   └── _components/        # Album-specific components
│   ├── gallery/                 # Photo gallery
│   │   ├── page.tsx
│   │   ├── [filter]/           # Gallery filtering
│   │   └── events/             # Event photo galleries
│   └── live/                    # Live streaming page
│
├── src/
│   ├── components/             # Reusable components
│   │   ├── buttons/            # Button components
│   │   ├── DaliahClicker/      # Interactive clicker game
│   │   ├── Footer/             # Footer with email signup
│   │   ├── Header/             # Navigation header
│   │   └── util/               # Utility components
│   ├── hooks/                  # Custom React hooks
│   │   └── useBlockScroll.js
│   ├── svg/                    # SVG components
│   ├── utils/                  # Utility functions
│   │   └── dates.js
│   └── styles/                 # Global styles
│
├── public/                     # Static assets
├── next.config.ts             # Next.js configuration
├── tsconfig.json              # TypeScript configuration
├── postcss.config.mjs          # PostCSS configuration
└── eslint.config.mjs           # ESLint configuration
```

## Pages & Routes

### Main Pages

- **`/`** - Homepage with hero, band intro, and featured content
- **`/albums`** - Music albums catalog
- **`/albums/[album]`** - Individual album details
- **`/gallery`** - Photo gallery with event filtering
- **`/gallery/[filter]`** - Filtered gallery views
- **`/gallery/events/[filter]`** - Event-specific photo galleries
- **`/live`** - Live streaming information

## Installation & Setup

### Prerequisites

- Node.js 18+
- PNPM 8+

### Getting Started

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd daliahbanda-next
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables** (if needed)
   Create a `.env.local` file with any necessary API keys or configuration

4. **Run the development server**

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser

5. **Build for production**
   ```bash
   pnpm build
   pnpm start
   ```

## Development

### Available Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Key Components

#### Header/Navigation

- Responsive header with mobile menu support
- Navigation links to main sections
- Live banner for streaming notifications

#### Gallery System

- Multi-filter support (events, photos)
- Dynamic route-based filtering
- Image optimization

#### Music Recommendations

- Spotify integration
- Album showcases
- Song recommendations

#### Live Features

- Kick.com streaming integration
- Live session cards
- Performance information

## Deployment

This is a Next.js SSR application and can be deployed on:

- **Vercel** (recommended, official Next.js hosting)
- **Netlify**
- **AWS**, **Google Cloud**, **Azure**
- Any Node.js-compatible hosting platform

### Deployment Consideration

Since this is a full SSR site, ensure your hosting supports:

- Node.js server runtime
- Environment variables configuration
- Static asset optimization

## Contributing

To contribute to this project:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure code follows the ESLint configuration and maintains the project's styling standards.

## Performance & SEO

This site leverages Next.js SSR capabilities for:

- ✅ Improved SEO with server-rendered pages
- ✅ Faster initial page loads
- ✅ Better social media sharing with meta tags
- ✅ Image optimization with Next.js Image component
- ✅ Automatic code splitting and lazy loading

## Connect with Daliah Banda

- **Website:** [daliahbanda.com](https://daliahbanda.com)
- **Instagram:** [@daliah_banda](https://www.instagram.com/daliah_banda/)
- **Facebook:** [Daliah Banda](https://www.facebook.com/people/Daliah-Banda/100066621979987)
- **TikTok:** [@daliah.banda](https://www.tiktok.com/@daliah.banda)
- **Spotify:** [Daliah Banda](https://open.spotify.com/intl-es/artist/4Au3rSGOcVHXd0ufiEbmEZ)
- **YouTube:** [@daliahbanda](https://www.youtube.com/@daliahbanda)
- **SoundCloud:** [Daliah Banda](https://soundcloud.com/daliah-banda)
- **Kick (Live Streaming):** [kick.com/daliahbanda](https://kick.com/daliahbanda)
- **Email:** daliahbanda@gmail.com

## License

This project is under the MIT license, allowing for open-source contributions and usage. See the [LICENSE](LICENSE) file for details.

For inquiries, contact: daliahbanda@gmail.com or visit [daliahbanda.com/contact](https://daliahbanda.com/contact)

---

**Built with ❤️ by the Daliah Banda team** - Metalcore, Pop Emo Punk & Rock Alternativo desde Bogotá 🇨🇴
