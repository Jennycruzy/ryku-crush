export type TileType = "points" | "bomb" | "minus"

export interface ProfileTile {
  id: string
  label: string
  src: string
  type: TileType
  points: number
  rarity: number // 0-1, lower = rarer
}

export const PROFILE_TILES: ProfileTile[] = [
  // 200-point tile (ultra rare - 2%)
  {
    id: "solana",
    label: "Solana",
    src: "/images/solana-logo.jpg",
    type: "points",
    points: 200,
    rarity: 0.02,
  },
  // 100-point tile (very rare - 5%)
  {
    id: "raiku-logo",
    label: "Raiku",
    src: "/images/raiku-logo.jpg",
    type: "points",
    points: 100,
    rarity: 0.05,
  },
  // 50-point tiles (uncommon - 8% each)
  {
    id: "cone-guy",
    label: "Cone Guy",
    src: "/images/cone-guy.jpg",
    type: "points",
    points: 50,
    rarity: 0.08,
  },
  {
    id: "pineapple-feet",
    label: "Pineapple Feet",
    src: "/images/pineapple-feet.jpg",
    type: "points",
    points: 50,
    rarity: 0.08,
  },
  // BOMB - Ethereum (-1000 points, deceptive - looks normal but penalty - 10%)
  {
    id: "ethereum",
    label: "Ethereum",
    src: "/images/ethereum-logo.jpg",
    type: "bomb",
    points: -1000,
    rarity: 0.1,
  },
  // 5-point tiles (common - adjusted rarity)
  {
    id: "ninja-guy",
    label: "Ninja Guy",
    src: "/images/ninja-guy.jpg",
    type: "points",
    points: 5,
    rarity: 0.145,
  },
  {
    id: "frog-hoodie",
    label: "Frog Hoodie",
    src: "/images/frog-hoodie.jpg",
    type: "points",
    points: 5,
    rarity: 0.145,
  },
  {
    id: "mic-blue",
    label: "MIC",
    src: "/images/mic-blue.jpg",
    type: "points",
    points: 5,
    rarity: 0.145,
  },
  {
    id: "octopus-girl",
    label: "Octopus Girl",
    src: "/images/octopus-girl-new.jpg",
    type: "points",
    points: 5,
    rarity: 0.145,
  },
  // 2-point tiles (Gibby and Ostone - uncommon - 7% each)
  {
    id: "gibby",
    label: "Gibby",
    src: "/images/gibby.jpg",
    type: "points",
    points: 2,
    rarity: 0.07,
  },
  {
    id: "ostone",
    label: "Ostone",
    src: "/images/ostone.jpg",
    type: "points",
    points: 2,
    rarity: 0.07,
  },
]

export interface FallingTile extends ProfileTile {
  uid: string
  column: number
  y: number
  speed: number
  crushed: boolean
  missed: boolean
}

export function pickRandomTile(): ProfileTile {
  const roll = Math.random()
  let cumulative = 0
  for (const tile of PROFILE_TILES) {
    cumulative += tile.rarity
    if (roll <= cumulative) return tile
  }
  return PROFILE_TILES[PROFILE_TILES.length - 1]
}

const ETHEREUM_TILE = PROFILE_TILES.find((t) => t.id === "ethereum")!
const VALUABLE_TILES = PROFILE_TILES.filter(
  (t) => t.type === "points" && t.points >= 10
)

let uidCounter = 0

function makeFallingTile(tile: ProfileTile, columns: number, column?: number): FallingTile {
  uidCounter++
  return {
    ...tile,
    uid: `ft-${uidCounter}-${Date.now()}`,
    column: column ?? Math.floor(Math.random() * columns),
    y: -10,
    speed: 0.8 + Math.random() * 0.6,
    crushed: false,
    missed: false,
  }
}

export function spawnTile(columns: number): FallingTile {
  const tile = pickRandomTile()
  return makeFallingTile(tile, columns)
}

// Spawn a deceit pair: Ethereum bomb right next to a valuable tile
export function spawnDeceitPair(columns: number): FallingTile[] {
  const col = Math.floor(Math.random() * columns)
  const adjacentCol = col === columns - 1 ? col - 1 : col + 1
  const valuableTile =
    VALUABLE_TILES[Math.floor(Math.random() * VALUABLE_TILES.length)]
  const speed = 0.8 + Math.random() * 0.5
  const bomb = makeFallingTile(ETHEREUM_TILE, columns, col)
  const bait = makeFallingTile(valuableTile, columns, adjacentCol)
  // Same speed so they fall side-by-side
  bomb.speed = speed
  bait.speed = speed
  return [bomb, bait]
}
