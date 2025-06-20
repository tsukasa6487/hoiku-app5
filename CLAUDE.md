# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint to check code quality

## Project Architecture

This is a Next.js 15 application using the App Router with TypeScript and Tailwind CSS v4.

### Technology Stack
- **Framework**: Next.js 15.3.4 with App Router
- **Language**: TypeScript 5 with strict mode enabled
- **Styling**: Tailwind CSS v4 with PostCSS
- **Fonts**: Geist Sans and Geist Mono (Google Fonts)
- **Linting**: ESLint with Next.js TypeScript configuration

### Project Structure
```
src/
├── app/                    # App Router pages and layouts
│   ├── layout.tsx         # Root layout with font configuration
│   ├── page.tsx           # Home page component
│   ├── globals.css        # Global styles with Tailwind
│   └── favicon.ico        # App favicon
```

### Key Configurations
- **TypeScript**: Configured with path aliases (`@/*` → `./src/*`)
- **ESLint**: Uses Next.js core web vitals and TypeScript rules
- **Tailwind**: PostCSS plugin configuration for v4
- **Next.js**: Default configuration with no custom settings

### Development Notes
- The app uses React 19 with Next.js 15
- Font optimization is handled through `next/font/google`
- Tailwind CSS classes follow utility-first methodology
- All components are written in TypeScript with proper type definitions