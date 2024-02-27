import { PlayerProfile } from '../types/sportradar/player-profile';

export async function getPlayerProfileBySportradarId(sportradarPlayerId: string): Promise<PlayerProfile> {
  const apiUrl = `http://api.sportradar.us/nba/trial/v8/en/players/${sportradarPlayerId}/profile.json?api_key=${process.env.SPORTRADAR_API_KEY}`;

  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch player profile data. Response status: ${response.status}. Response status text: ${response.statusText}`
    );
  }

  const data = await response.json();

  return data as PlayerProfile;
}
