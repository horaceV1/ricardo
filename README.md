# Ricardo - Online Course Platform

A modern e-commerce platform for selling online courses, built with Next.js and Drupal.

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Drupal 11 (Headless CMS)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion, Lenis
- **Icons**: Lucide React

## Features

- 🎓 Course catalog with search and filters
- 🛒 Shopping cart functionality
- ⭐ Course ratings and reviews
- 📱 Fully responsive design
- ✨ Smooth animations and transitions
- 🎨 Modern, clean UI design

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or yarn

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_DRUPAL_BASE_URL=https://your-drupal-site.com
NEXT_IMAGE_DOMAIN=your-drupal-site.com
DRUPAL_CLIENT_ID=your-client-id
DRUPAL_CLIENT_SECRET=your-client-secret
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
npm start
```

## Drupal Setup

Create a "Course" content type with these fields:
- `field_price` (Number, decimal)
- `field_rating` (Number, decimal)
- `field_students` (Number, integer)
- `field_duration` (Text)
- `field_lessons` (Number, integer)
- `field_level` (List: Beginner/Intermediate/Advanced)
- `field_category` (Entity reference to taxonomy)
- `field_image` (Image)
- `body` (Text with summary)

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions.

## Documentation

- [Next.js for Drupal](https://next-drupal.org)
- [Next.js Documentation](https://nextjs.org/docs)

