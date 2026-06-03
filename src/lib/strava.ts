export type StravaAthlete = {
  id: number
  firstname: string
  lastname: string
  profile_medium: string
}

export type StravaLeaderEntry = {
  athlete: StravaAthlete
  rank: number
  moving_time: number
  distance: number
  longest_activity_distance: number
  velocity_average: number
}

export type StravaLeaderboard = {
  entries: StravaLeaderEntry[]
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

function metersToMiles(meters: number): string {
  return (meters * 0.000621371).toFixed(1)
}

export { formatTime, metersToMiles }

export const MOCK_LEADERBOARD: StravaLeaderEntry[] = [
  {
    rank: 1,
    athlete: { id: 1, firstname: 'David', lastname: 'M.', profile_medium: '' },
    moving_time: 81045,
    distance: 214000,
    longest_activity_distance: 109000,
    velocity_average: 8.2,
  },
  {
    rank: 2,
    athlete: { id: 2, firstname: 'Juan Carlos', lastname: 'U.', profile_medium: '' },
    moving_time: 26336,
    distance: 145000,
    longest_activity_distance: 89000,
    velocity_average: 7.8,
  },
  {
    rank: 3,
    athlete: { id: 3, firstname: 'Michael', lastname: 'S.', profile_medium: '' },
    moving_time: 19800,
    distance: 109000,
    longest_activity_distance: 109000,
    velocity_average: 7.5,
  },
  {
    rank: 4,
    athlete: { id: 4, firstname: 'Marcus', lastname: 'T.', profile_medium: '' },
    moving_time: 18200,
    distance: 98000,
    longest_activity_distance: 75000,
    velocity_average: 7.1,
  },
  {
    rank: 5,
    athlete: { id: 5, firstname: 'Kenji', lastname: 'R.', profile_medium: '' },
    moving_time: 15600,
    distance: 87000,
    longest_activity_distance: 65000,
    velocity_average: 6.9,
  },
]
