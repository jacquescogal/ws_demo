export interface WebSocketPageProps {
    teamName: string
    setTeamName: (teamName: string) => void
}

export interface LandingPageProps {
    teamName: string
    setTeamName: (teamName: string) => void
}

export interface WSMessageReceive {
    type: 'team_update'
    data: any
}

export type TeamUpdate = {
    user_count: number
}


export type BookingUpdate = {
    bookings: {[gameNumber:number]:string|null}
}
