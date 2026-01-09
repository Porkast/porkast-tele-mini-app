# Porkast Telegram Mini App

## Project Overview
Porkast is a Telegram Mini App designed for podcast discovery, subscription, and management. It provides a complete set of features including searching for podcasts (via iTunes and RSS), subscribing to channels, creating custom playlists, "listen later" functionality, and audio playback.

## Tech Stack
*   **Framework**: React 19.1.0 (with TypeScript 5.8)
*   **Build Tool**: Vite 7.0.4
*   **Routing**: React Router DOM 7.7.1
*   **Styling**: Tailwind CSS 4.1.11 + DaisyUI 5.0.50
*   **Audio**: Shikwasa 2.2.1 (for podcast playback)
*   **Podcast/RSS**: `podcast` 2.0.1, `rss-parser` 3.13.0
*   **Utilities**: `html-react-parser`

## Building and Running
The project uses `bun` for package management and script execution.

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Production build (TypeScript check + Vite build)
bun run build

# Preview production build
bun run preview

# Run ESLint
bun run lint
```

## Architecture

### Directory Structure
| Path | Purpose |
|------|---------|
| `src/component/` | Reusable UI components (Dialogs, Player, Navigation) |
| `src/pages/` | Route-based page components |
| `src/libs/` | API clients (User, Playlist, Subscription) and utilities |
| `src/types/` | TypeScript interfaces and type definitions |
| `src/assets/` | Static assets like images |
| `src/hooks/` | Custom React hooks (e.g., `useTelegramBackButton`) |

### Key Components
*   **`App.tsx`**: Defines application routes and main layout structure.
*   **`AppContext.tsx`**: Global state provider managing user auth, audio player state, and dialog visibility.
*   **`AudioPlayer.tsx`**: The global audio player component, mounted at the app root to persist across navigation.
*   **`AppDockNavigation.tsx`**: Bottom navigation bar for easy access to main sections.

### Routing
*   `/`: Search Page (default)
*   `/search`: Search Results
*   `/subscription`: Subscriptions
*   `/listenlater/:teleUserId`: Listen Later list
*   `/playlist`: Playlist Index
*   `/playlist/:teleUserId/:playlistId`: Playlist Detail
*   `/account`: User Account

## Development Conventions
*   **State Management**: Global state is handled via React Context (`AppContext`).
*   **API Integration**: All backend API interactions are centralized in `src/libs/`. The app connects to `https://porkast.zeabur.app/api`.
*   **Styling**: Use Tailwind CSS for utility-first styling and DaisyUI for pre-built components.
*   **Component Communication**: Parent-to-child communication for things like Dialogs and the Audio Player often uses `refs` to expose methods.
*   **User Auth**: Integrates with Telegram's user identity system.
