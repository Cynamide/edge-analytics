export interface StatEntry {
    name: string
    requests: number
    avg_latency: number
    max_latency: number
    min_latency: number
}

export interface StatsOverviewProps {
    stats: StatEntry[]
}
