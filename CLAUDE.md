# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Telegram Mini App for podcast discovery and management. Built with React 19, TypeScript, and Vite.

## Common Commands

```bash
bun install          # Install dependencies
bun run dev          # Start development server
bun run build        # Production build (type check + vite build)
bun run lint         # Run ESLint
bun run preview      # Preview production build
```

## Architecture

### Tech Stack
- **Framework**: React 19.1.0 with TypeScript 5.8
- **Build**: Vite 7.0.4
- **Routing**: React Router DOM 7.7.1
- **Styling**: Tailwind CSS 4.1.11 + DaisyUI 5.0.50
- **Audio**: Shikwasa 2.2.1 (podcast player)
- **RSS/Podcast**: podcast 2.0.1, rss-parser 3.13.0

### Directory Structure

| Path | Purpose |
|------|---------|
| `src/component/` | Reusable UI components (dialogs, navigation, player) |
| `src/pages/` | Route-based page components |
| `src/libs/` | API client libraries and utilities |
| `src/types/` | TypeScript interfaces |

### Routing

Routes are defined in `App.tsx`:
- `/` - SearchPage (default)
- `/search` - SearchResultPage
- `/subscription` - SubscriptionPage
- `/subscription/:userId/:keyword` - Keyword subscription feed
- `/listenlater` - ListenLaterPage
- `/playlist` - PlayListPage
- `/account` - AccountPage

### State Management

Global state is managed via `AppContext` (`src/component/AppContext.tsx`):
- Audio player state (exposed via refs for external control)
- User authentication info
- Dialog visibility (controlled via refs passed to children)

### API Integration

- **Backend API**: `https://porkast.zeabur.app/api` (defined in `src/libs/Constants.ts`)
- **iTunes Search API**: Used for podcast discovery (`src/libs/Itunes.ts`)
- All API clients are centralized in `src/libs/` (User.ts, Subscription.ts, Playlist.ts, ListenLater.ts)

### Key Components

- `AudioPlayer.tsx` - Global audio player mounted at app root
- `AppDockNavigation.tsx` - Bottom navigation bar
- `AppContext.tsx` - Global state provider
- Dialogs use ref-based control pattern for parent-to-child communication
