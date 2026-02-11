# Ryku Crush Game - Frontend

A fast-paced clicking game built with Next.js where players crush falling profile pictures to score points. Features include progressive difficulty, special avatars, sound effects, and weekly leaderboards.

## Features

### Game Mechanics
- **Progressive Difficulty**: Game speed increases as the timer counts down
- **Profile Pictures**: Click falling avatars to earn points
- **Special Tiles**:
  - **Solana** (100 pts) - Ultra rare
  - **Raiku Logo** (20 pts) - Very rare
  - **Cone Guy & Pineapple Feet** (10 pts each) - Uncommon
  - **Gibby & Ostone** (2 pts each) - New additions
  - **Regular avatars** (5 pts each) - Common
  - **Ethereum Bomb** (-500 pts) - Resets score
  - **ETH Trap** (-3000 pts) - Deceptive penalty hidden among normal avatars

### Visual Theme
- **Raiku-inspired**: Dark theme with neon green (#BFFF00) accents
- **Dark Backgrounds**: Black and dark gray backgrounds throughout
- **Glowing Effects**: Subtle neon green particles and borders
- **Urgency Indicators**: Screen shake and intensified glow when time is low
- **Circular Avatars**: All profile pictures perfectly cropped into circles

### Audio System
- **Sound Toggle**: Persistent ON/OFF setting saved across sessions
- **Click Sounds**: Satisfying feedback on avatar crush
- **Bomb Sounds**: Special audio for penalties
- **End Game Messages**:
  - **≥5,000 pts**: "Great Chad" + excited sound
  - **3,000-4,999 pts**: "Keep it up Chad" + handclap sound
  - **1,000-2,999 pts**: "Try harder" + fail sound
  - **<1,000 pts**: "You are a role farmer" (no sound)

### User Features
- **Authentication**: Sign up/Login system
- **Weekly Leaderboard**: Automatically resets every Monday
- **Score Tracking**: Personal best and weekly scores
- **Profile Pictures**: Custom avatars for each user

## Prerequisites

- Node.js 18+ or higher
- npm, yarn, or pnpm package manager

## Installation

### 1. Install Dependencies

Using npm:
```bash
npm install
```

Using pnpm:
```bash
pnpm install
```

Using yarn:
```bash
yarn install
```

### 2. Add Required Assets

#### Profile Images
Place the following images in `/public/images/`:

**✅ Actual Game Images (Provided):**
- `raiku-logo.jpg` - Raiku logo (20 pts) ✅
- `rykuan-mascot.jpg` - Rykuan mascot (front page) ✅
- `mic-blue.jpg` - MIC (5 pts) ✅
- `gibby.jpg` - Gibby (2 pts) ✅ NEW
- `ostone.jpg` - Ostone (2 pts) ✅ NEW
- `octopus-girl-new.jpg` - Octopus Girl (5 pts) ✅ UPDATED

**🔳 Placeholder Images (Replace with your actual game images):**
- `solana-logo.jpg` - Solana avatar (100 pts) 🔳
- `ethereum-logo.jpg` - Ethereum bomb (-500 pts) & ETH trap (-3000 pts) 🔳
- `cone-guy.jpg` - Cone Guy (10 pts) 🔳
- `pineapple-feet.jpg` - Pineapple Feet (10 pts) 🔳
- `ninja-guy.jpg` - Ninja Guy (5 pts) 🔳
- `frog-hoodie.jpg` - Frog Hoodie (5 pts) 🔳

**Note**: Colored placeholder images are included for testing. Replace them with your actual game images by keeping the same filename. See `/public/images/README.md` for details.

#### Sound Files
Place the following sound files in `/public/sounds/`:
- `click.mp3` - Click/tap sound for crushing avatars
- `bomb.mp3` - Explosion sound for bombs and traps
- `great-chad.mp3` - Victory sound for scores ≥10,000
- `keep-it-up.mp3` - Handclap sound for scores 5,000-9,999
- `try-harder.mp3` - Fail sound for scores 3,000-4,999

**Note**: You can use any MP3 files for sounds. Free sound effects can be found on:
- [Freesound.org](https://freesound.org/)
- [Zapsplat.com](https://www.zapsplat.com/)
- [Mixkit.co](https://mixkit.co/free-sound-effects/)

## Running the Game

### Development Mode
```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm start
# or
pnpm build && pnpm start
# or
yarn build && yarn start
```

## Connecting to Backend

### 1. Create API Service

Create `/lib/api.ts` to connect to your backend:

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function register(username: string, password: string, profilePicture?: string) {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, profilePicture })
  });
  return response.json();
}

export async function login(username: string, password: string) {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return response.json();
}

export async function submitScore(token: string, score: number, crushed: number) {
  const response = await fetch(`${API_URL}/api/scores`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ score, crushed })
  });
  return response.json();
}

export async function getWeeklyLeaderboard() {
  const response = await fetch(`${API_URL}/api/leaderboard/weekly`);
  return response.json();
}
```

### 2. Add Environment Variable

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

For production, update to your backend URL:
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### 3. Integrate Auth in Components

Update `components/ryku-crush-game.tsx` to add authentication:

```typescript
// Add login/register screens
// Store JWT token in localStorage
// Call submitScore() on game over
// Fetch and display leaderboard
```

## Project Structure

```
├── app/
│   ├── globals.css          # Global styles with neon animations
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main page
├── components/
│   ├── game-board.tsx       # Main game logic
│   ├── game-header.tsx      # Score, timer, combo display
│   ├── game-start-screen.tsx    # Welcome screen with footer
│   ├── game-over-screen.tsx     # End screen with messages
│   └── ryku-crush-game.tsx      # Game state manager
├── lib/
│   ├── game-data.ts         # Avatar definitions & spawning
│   └── sounds.ts            # Sound utility functions
└── public/
    ├── images/              # All profile pictures
    └── sounds/              # All sound effects
```

## Game Configuration

### Adjusting Difficulty

In `components/game-board.tsx`:
```typescript
const GAME_TIME = 60;  // Game duration in seconds
const GROUND_Y = 95;   // Where avatars "hit ground" (95% from top)

// Speed multiplier: 1x at start, 2.5x at end
function getSpeedMultiplier(timeLeft: number): number {
  const progress = 1 - timeLeft / GAME_TIME;
  return 1 + progress * 1.5;
}

// Spawn interval: 450ms at start, 180ms at end
function getSpawnInterval(timeLeft: number): number {
  const progress = 1 - timeLeft / GAME_TIME;
  return Math.max(180, 450 - progress * 270);
}
```

### Modifying Point Values

In `lib/game-data.ts`, update the `PROFILE_TILES` array:
```typescript
{
  id: "solana",
  label: "Solana",
  src: "/images/solana-logo.jpg",
  type: "points",
  points: 1000,  // Change this
  rarity: 0.02,  // Lower = rarer (0-1 scale)
}
```

### Changing Theme Color

Replace `#BFFF00` (neon green) with your color in:
- `app/globals.css` - CSS variables
- Component inline styles
- Tailwind config

## Deployment

### Vercel (Recommended for Next.js)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Deploy the .next folder
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Troubleshooting

### Images Not Loading
- Ensure all images are in `/public/images/`
- Check file names match exactly (case-sensitive)
- Verify image extensions (.jpg vs .png)

### Sounds Not Playing
- Check browser console for errors
- Some browsers block autoplay - user must interact first
- Verify sound files are valid MP3 format
- Check file paths in `/lib/sounds.ts`

### Game Too Easy/Hard
- Adjust `GAME_TIME`, speed multiplier, or spawn interval
- Modify rarity values in `game-data.ts`
- Change point values for avatars

### Performance Issues
- Reduce particle count in `game-board.tsx`
- Lower animation frame rate
- Optimize image sizes (compress with TinyPNG)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT

## Credits

Made with ❤️ by jennycruzy
