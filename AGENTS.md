# AGENTS.md

This file provides guidance for agentic coding agents working in this repository.

## Project Overview

Telegram Mini App for podcast discovery and management. Built with React 19.1.0, TypeScript 5.8, and Vite 7.0.4.

## Build Commands

```bash
bun install          # Install dependencies
bun run dev          # Start development server
bun run build        # Production build (type check + vite build)
bun run lint         # Run ESLint on all files
bun run preview      # Preview production build
```

## Code Style Guidelines

### TypeScript

- **Strict mode enabled**: All strict flags are on in tsconfig.app.json
- **No unused locals/parameters**: Disabled (`false`) to reduce noise
- **Prefer interfaces over types** for object shapes, especially API responses
- **Use explicit types** for function parameters and return types
- **Use `any` sparingly**: Prefer `unknown` when type is truly uncertain
- **Use `import type` for type-only imports**

### React Components

- **Default exports** for page components (`src/pages/**/*.tsx`)
- **Named exports** for reusable components (`src/component/**/*.tsx`)
- **Use `React.FC<Props>`** for typing function components
- **Functional components** only (no class components)
- **Use hooks**: `useState`, `useEffect`, `useRef`, `useContext`
- **Ref-based control pattern** for dialogs/modals (see `AddToPlayListDialog`, `CreatePlaylistDialog`)
- **Always destructure props**: `const { data } = props`

### Naming Conventions

- **Components**: PascalCase (e.g., `EpisodeCard`, `AudioPlayer`)
- **Files**: Match component name (e.g., `EpisodeCard.tsx`)
- **Functions/Variables**: camelCase (e.g., `getUserInfo`, `audioRef`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_URL`, `CACHE_TTL`)
- **Types/Interfaces**: PascalCase (e.g., `FeedItem`, `ServerUserInfo`)
- **Props**: camelCase for values, PascalCase for component types
- **Boolean props**: Prefix with `is`, `has`, `show`, `hide` (e.g., `showExcludeBtn`, `hideListenLaterBtn`)

### Imports

```typescript
// Order: React → external libraries → internal components → types → utilities/assets
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AudioPlayButton from './AudioPlayButton';
import type { AudioPlayerParams } from '../types/AudioPlayer';
import { parseHtmlStrinText } from '../libs/Common';
import { AvatarImage } from './PorkastImage';
```

- **Absolute imports** for internal modules (`src/libs/`, `src/types/`, `src/component/`)
- **Relative imports** for same-directory co-located files

### Error Handling

- **Console logging** for development errors (see `User.ts:99`)
- **Return structured responses** from async functions: `{ code: number, message: string, data: T }`
- **Null checks** for optional properties: `if (!data.authorName)`
- **Optional chaining**: `webApp?.initDataUnsafe?.user`

### API Integration

- **Backend API**: `https://porkast.zeabur.app/api` (from `src/libs/Constants.ts`)
- **iTunes Search API**: Used in `src/libs/Itunes.ts`
- **Fetch with async/await**: Always handle JSON response explicitly
- **Cache layer**: User info cached in memory with TTL (see `User.ts:110-111`)

### Styling

- **Tailwind CSS v4** with **DaisyUI v5** component library
- **Utility classes**: `className="w-full flex justify-center mt-6"`
- **Component classes**: `className="bg-base-100 shadow-xl rounded-box"`
- **Responsive prefixes**: `md:text-2xl`, `md:flex`, `md:mt-0`

### State Management

- **AppContext** (`src/component/AppContext.tsx`) for global state:
  - User authentication info
  - Audio player controls (via refs for external access)
  - Dialog visibility (ref-based pattern)
- **useAppContext** hook for consuming context

### File Organization

```txt
src/
  component/    # Reusable UI components (dialogs, navigation, player)
  pages/        # Route-based page components
    playlist/   # Playlist feature pages
    subscription/# Subscription feature pages
  libs/         # API clients and utilities
  types/        # TypeScript interfaces
  hooks/        # Custom React hooks
  assets/       # Static assets
```

### Routing

Routes defined in `App.tsx`:

- `/` - SearchPage
- `/search` - SearchResultPage
- `/subscription` - SubscriptionPage
- `/subscription/:teleUserId/:keyword` - Keyword subscription feed
- `/listenlater/:teleUserId` - ListenLaterPage
- `/playlist` - PlayListIndexPage
- `/playlist/:teleUserId` - PlayListPage
- `/playlist/:teleUserId/:playlistId` - PlayListDetailPage
- `/account` - AccountPage

### Common Patterns

- **EpisodeCard**: Prop-based component with audio playback, add to playlist/listen later actions
- **Dialog ref pattern**: Parent passes ref to child, child exposes `showDialog()` method
- **API caching**: In-memory cache with TTL for frequently accessed data
- **Dev mode fallback**: Check `import.meta.env.MODE === 'development'` for mock data

### Linting

ESLint configuration extends:

- ESLint recommended
- TypeScript-ESLint recommended
- React Hooks recommended-latest
- React Refresh for Vite

Run `bun run lint` before committing. No files currently in `dist/` (ignored).
