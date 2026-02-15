const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function register(username: string, password: string) {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return res.json();
}

export async function login(username: string, password: string) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return res.json();
}

export async function submitScore(token: string, score: number, crushed: number) {
  const res = await fetch(`${API_URL}/api/scores`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ score, crushed })
  });
  return res.json();
}

export async function getLeaderboard() {
  const res = await fetch(`${API_URL}/api/leaderboard/weekly`);
  return res.json();
}

export async function getMe(token: string) {
  const res = await fetch(`${API_URL}/api/auth/me`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return res.json();
}
