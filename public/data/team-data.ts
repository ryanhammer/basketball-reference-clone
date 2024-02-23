export type Abbreviation =
  | 'ATL'
  | 'BOS'
  | 'BRK'
  | 'CHA'
  | 'CHI'
  | 'CLE'
  | 'DAL'
  | 'DEN'
  | 'DET'
  | 'GSW'
  | 'HOU'
  | 'IND'
  | 'LAC'
  | 'LAL'
  | 'MEM'
  | 'MIA'
  | 'MIL'
  | 'MIN'
  | 'NOP'
  | 'NYK'
  | 'OKC'
  | 'ORL'
  | 'PHI'
  | 'PHX'
  | 'POR'
  | 'SAC'
  | 'SAS'
  | 'TOR'
  | 'UTA'
  | 'WAS';

interface TeamData {
  name: string;
  abbreviation: Abbreviation;
  isActive: boolean;
  inauguralSeason: string;
  externalId: string;
}


export const franchiseData: TeamData[] = [
  {
    name: 'Washington Wizards',
    abbreviation: 'WAS',
    isActive: true,
    inauguralSeason: '1961-62',
    externalId: '583ec8d4-fb46-11e1-82cb-f4ce4684ea4c',
  },
  {
    name: 'Charlotte Hornets',
    abbreviation: 'CHA',
    isActive: true,
    inauguralSeason: '1988-89',
    externalId: '583ec97e-fb46-11e1-82cb-f4ce4684ea4c',
  },
  {
    name: 'Atlanta Hawks',
    abbreviation: 'ATL',
    isActive: true,
    inauguralSeason: '1949-50',
    externalId: '583ecb8f-fb46-11e1-82cb-f4ce4684ea4c',
  },
  {
    name: 'Miami Heat',
    abbreviation: 'MIA',
    isActive: true,
    inauguralSeason: '1988-89',
    externalId: '583ecea6-fb46-11e1-82cb-f4ce4684ea4c',
  },
  {
    name: 'Orlando Magic',
    abbreviation: 'ORL',
    isActive: true,
    inauguralSeason: '1989-90',
    externalId: '583ed157-fb46-11e1-82cb-f4ce4684ea4c',
  },
  {
    name: 'New York Knicks',
    abbreviation: 'NYK',
    isActive: true,
    inauguralSeason: '1946-47',
    externalId: '583ec70e-fb46-11e1-82cb-f4ce4684ea4c',
  },
  {
    name: 'Philadelphia 76ers',
    abbreviation: 'PHI',
    isActive: true,
    inauguralSeason: '1949-50',
    externalId: '583ec87d-fb46-11e1-82cb-f4ce4684ea4c',
  },
  {
    name: 'Brooklyn Nets',
    abbreviation: 'BRK',
    isActive: true,
    inauguralSeason: '1967-68',
    externalId: '583ec9d6-fb46-11e1-82cb-f4ce4684ea4c',
  },
  {
    name: 'Boston Celtics',
    abbreviation: 'BOS',
    isActive: true,
    inauguralSeason: '1946-47',
    externalId: '583eccfa-fb46-11e1-82cb-f4ce4684ea4c',
  },
  {
    name: 'Toronto Raptors',
    abbreviation: 'TOR',
    isActive: true,
    inauguralSeason: '1995-96',
    externalId: '583ecda6-fb46-11e1-82cb-f4ce4684ea4c',
  },
  {
    name: 'Chicago Bulls',
    abbreviation: 'CHI',
    isActive: true,
    inauguralSeason: '1966-67',
    externalId: '583ec5fd-fb46-11e1-82cb-f4ce4684ea4c',
  },
  {
    name: 'Cleveland Cavaliers',
    abbreviation: 'CLE',
    isActive: true,
    inauguralSeason: '1970-71',
    externalId: '583ec773-fb46-11e1-82cb-f4ce4684ea4c',
  },
  {
    name: 'Indiana Pacers',
    abbreviation: 'IND',
    isActive: true,
    inauguralSeason: '1967-68',
    externalId: '583ec7cd-fb46-11e1-82cb-f4ce4684ea4c',
  },
  {
    name: 'Detroit Pistons',
    abbreviation: 'DET',
    isActive: true,
    inauguralSeason: '1948-49',
    externalId: '583ec928-fb46-11e1-82cb-f4ce4684ea4c',
  },
  {
    name: 'Milwaukee Bucks',
    abbreviation: 'MIL',
    isActive: true,
    inauguralSeason: '1968-69',
    externalId: '583ecefd-fb46-11e1-82cb-f4ce4684ea4c',
  },
  {
    name: 'Minnesota Timberwolves',
    abbreviation: 'MIN',
    isActive: true,
    inauguralSeason: '1989-90',
    externalId: '583eca2f-fb46-11e1-82cb-f4ce4684ea4c',
  },
  {
    name: 'Utah Jazz',
    abbreviation: 'UTA',
    isActive: true,
    inauguralSeason: '1974-75',
    externalId: '583ece50-fb46-11e1-82cb-f4ce4684ea4c',
  },
  {
    name: 'Oklahoma City Thunder',
    abbreviation: 'OKC',
    isActive: true,
    inauguralSeason: '1967-68',
    externalId: '583ecfff-fb46-11e1-82cb-f4ce4684ea4c',
  },
  {
    name: 'Portland Trail Blazers',
    abbreviation: 'POR',
    isActive: true,
    inauguralSeason: '1970-71',
    externalId: '583ed056-fb46-11e1-82cb-f4ce4684ea4c',
  },
  {
    name: 'Denver Nuggets',
    abbreviation: 'DEN',
    isActive: true,
    inauguralSeason: '1967-68',
    externalId: '583ed102-fb46-11e1-82cb-f4ce4684ea4c',
  },
  {
    name: 'Memphis Grizzlies',
    abbreviation: 'MEM',
    isActive: true,
    inauguralSeason: '1995-96',
    externalId: '583eca88-fb46-11e1-82cb-f4ce4684ea4c',
  },
  {
    name: 'Houston Rockets',
    abbreviation: 'HOU',
    isActive: true,
    inauguralSeason: '1967-68',
    externalId: '583ecb3a-fb46-11e1-82cb-f4ce4684ea4c',
  },
  {
    name: 'New Orleans Pelicans',
    abbreviation: 'NOP',
    isActive: true,
    inauguralSeason: '2002-03',
    externalId: '583ecc9a-fb46-11e1-82cb-f4ce4684ea4c',
  },
  {
    name: 'San Antonio Spurs',
    abbreviation: 'SAS',
    isActive: true,
    inauguralSeason: '1967-68',
    externalId: '583ecd4f-fb46-11e1-82cb-f4ce4684ea4c',
  },
  {
    name: 'Dallas Mavericks',
    abbreviation: 'DAL',
    isActive: true,
    inauguralSeason: '1980-81',
    externalId: '583ecf50-fb46-11e1-82cb-f4ce4684ea4c',
  },
  {
    name: 'Golden State Warriors',
    abbreviation: 'GSW',
    isActive: true,
    inauguralSeason: '1946-47',
    externalId: '583ec825-fb46-11e1-82cb-f4ce4684ea4c',
  },
  {
    name: 'Los Angeles Lakers',
    abbreviation: 'LAL',
    isActive: true,
    inauguralSeason: '1948-49',
    externalId: '583ecae2-fb46-11e1-82cb-f4ce4684ea4c',
  },
  {
    name: 'Los Angeles Clippers',
    abbreviation: 'LAC',
    isActive: true,
    inauguralSeason: '1970-71',
    externalId: '583ecdfb-fb46-11e1-82cb-f4ce4684ea4c',
  },
  {
    name: 'Phoenix Suns',
    abbreviation: 'PHX',
    isActive: true,
    inauguralSeason: '1968-69',
    externalId: '583ecfa8-fb46-11e1-82cb-f4ce4684ea4c',
  },
  {
    name: 'Sacramento Kings',
    abbreviation: 'SAC',
    isActive: true,
    inauguralSeason: '1948-49',
    externalId: '583ed0ac-fb46-11e1-82cb-f4ce4684ea4c',
  },
];

export const teamData: { [key in Abbreviation]: string } = {
  ATL: '1968-69',
  BOS: '1946-47',
  BRK: '2012-13',
  CHA: '2014-15',
  CHI: '1966-67',
  CLE: '1970-71',
  DAL: '1980-81',
  DEN: '1976-77',
  DET: '1957-58',
  GSW: '1971-72',
  HOU: '1971-72',
  IND: '1976-77',
  LAC: '1984-85',
  LAL: '1960-61',
  MEM: '2001-02',
  MIA: '1988-89',
  MIL: '1968-69',
  MIN: '1989-90',
  NOP: '2002-03',
  NYK: '1946-47',
  OKC: '2008-09',
  ORL: '1989-90',
  PHI: '1963-64',
  PHX: '1968-69',
  POR: '1970-71',
  SAC: '1985-86',
  SAS: '1976-77',
  TOR: '1995-96',
  UTA: '1979-80',
  WAS: '1997-98',
};
