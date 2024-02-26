export interface GameSummary {
  id: string;
  status: string;
  scheduled: string;
  duration: string;
  attendance: number;
  inseason_tournament?: boolean;
  venue: Venue;
  home: TeamGameSummary;
  away: TeamGameSummary;
  officials: Official[];
}

export interface Venue {
  id: string;
  name: string;
  capacity: number;
  address: string;
  city: string;
  state?: string;
  zip?: string;
  country: string;
}

export interface TeamGameSummary {
  name: string;
  alias: string;
  market: string;
  id: string;
  points: number;
  scoring: GameScoring[];
  statistics: TeamGameStatistics;
  coaches: CoachData[];
  players: PlayerGameSummary[];
}

interface GameScoring {
  type: string;
  number: number;
  seqeunce: number;
  points: number;
}

interface GameStatistics {
  minutes: string;
  field_goals_made: number;
  field_goals_att: number;
  field_goals_pct: number;
  three_points_made: number;
  three_points_att: number;
  three_points_pct: number;
  two_points_made: number;
  two_points_att: number;
  two_points_pct: number;
  blocked_att: number;
  free_throws_made: number;
  free_throws_att: number;
  free_throws_pct: number;
  offensive_rebounds: number;
  defensive_rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  assists_turnover_ratio: number;
  personal_fouls: number;
  points: number;
  effective_fg_pct: number;
  true_shooting_pct: number;
  defensive_rating: number;
  offensive_rating: number;
  pls_min: number;
}

interface PlayerGameStatistics extends GameStatistics {
  rebounds: number;
  turnovers: number;
  double_double: boolean;
  triple_double: boolean;
  plus: number;
  minus: number;
  defensive_rebounds_pct: number;
  offensive_rebounds_pct: number;
  rebounds_pct: number;
}

export interface TeamGameStatistics extends GameStatistics {
  team_turnovers: number;
  points_off_turnovers: number;
  team_rebounds: number;
  team_offensive_rebounds: number;
  team_defensive_rebounds: number;
  total_rebounds: number;
  player_turnovers: number;
  total_turnovers: number;
  bench_points: number;
  points_against: number;
  possessions: number;
  opponent_possessions: number;
}

export interface CoachData {
  id?: string;
  full_name: string;
  position: string;
  reference: number;
}

export interface PlayerGameSummary {
  id: string;
  full_name: string;
  jersey_number: string;
  position: string;
  primary_position: string;
  played?: boolean;
  active?: boolean;
  starter?: boolean;
  on_court: boolean;
  reference: number;
  statistics: PlayerGameStatistics;
}

export interface Official {
  id: string;
  full_name: string;
  number: string;
  assignment: string;
}
