export type PlayerProfile = {
  id: string;
  full_name: string;
  first_name: string;
  last_name: string;
  height: number;
  weight: number;
  position: string;
  primary_position: string;
  college: string;
  birth_place: string;
  birthdate: string;
  draft: {
    team_id: string;
    year: number;
    round: string;
    pick: string;
  };
};
