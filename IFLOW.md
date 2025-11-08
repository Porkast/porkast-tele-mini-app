# Porkast Telegram Mini App

## Project Overview

This is a Telegram Mini App built with React + TypeScript + Vite, specifically designed for podcast discovery, subscription, and sharing. The application provides complete podcast management functionality, including core features such as search, subscription, playlist creation, and audio playback.

### Main Technology Stack

- **Frontend Framework**: React 19.1.0 + TypeScript
- **Build Tool**: Vite 7.0.4
- **Routing**: React Router DOM 7.7.1
- **Styling**: Tailwind CSS 4.1.11 + DaisyUI 5.0.50
- **Audio Playback**: Shikwasa 2.2.1
- **Podcast Parsing**: podcast 2.0.1, rss-parser 3.13.0
- **HTML Parsing**: html-react-parser 5.2.6
- **Development Tools**: ESLint, TypeScript

### Project Architecture

```markdown
src/
├── component/          # Reusable components
│   ├── AppContext.tsx  # Global state management
│   ├── AudioPlayer.tsx # Audio player
│   └── ...             # Other UI components
├── pages/              # Page components
│   ├── SearchPage.tsx  # Search page
│   ├── SubscriptionPage.tsx # Subscription page
│   ├── ListenLaterPage.tsx  # Listen later page
│   ├── PlayListPage.tsx     # Playlist page
│   └── AccountPage.tsx      # Account page
├── libs/               # Utility libraries and APIs
│   ├── Common.ts       # Common utility functions
│   ├── User.ts         # User-related APIs
│   ├── Playlist.ts     # Playlist APIs
│   └── ...             # Other API modules
└── types/              # TypeScript type definitions
    ├── Feed.ts         # Podcast Feed types
    ├── AudioPlayer.ts  # Audio player types
    └── ...             # Other type definitions
```

## Build and Run

### Development Environment

```bash
# Install dependencies
bun install

# Start development server
bun run dev
```

### Production Build

```bash
# Build production version
bun run build

# Preview build result
bun run preview
```

### Code Checking

```bash
# Run ESLint checks
bun run lint
```

## Development Conventions

### Code Style

- Use TypeScript for type-safe development
- Follow React Hooks best practices
- Use Tailwind CSS for styling
- Component naming follows PascalCase
- File naming uses PascalCase (components) or camelCase (utility functions)

### State Management

- Use React Context (`AppContext`) for global state management
- Audio player state is exposed to the entire app through Context
- User information is cached in localStorage

### API Integration

- All API calls are centralized in the `src/libs/` directory
- Use Telegram Mini App user authentication
- Support user information retrieval in both development and production environments

### Component Development Pattern

- Use functional components + Hooks
- Access global state and methods through `useAppContext`
- Components expose methods to parent components via refs (e.g., dialogs, audio player)

### Routing Structure

- Use React Router for single-page application routing
- Main routes include: search, subscription, listen later, playlist, account
- Support nested routes and bottom navigation bar

### Special Configuration

- Vite configuration allows all host access (`allowedHosts: ['*']`)
- Support external access testing through Cloudflare Tunnel

## Core Features

### 1. Podcast Search and Discovery

- Integrated iTunes and RSS search
- Support keyword search for podcast content

### 2. Audio Playback

- Use Shikwasa audio player
- Support playback controls and progress dragging
- Global playback state management

### 3. Subscription Management

- Support podcast channel subscriptions
- Subscription content display and management

### 4. Playlists

- Create and manage custom playlists
- Support adding episodes to playlists

### 5. Listen Later

- Save interesting episodes to listen later list
- Facilitate subsequent listening management

### 6. User System

- Based on Telegram user identity
- User information caching and synchronization
