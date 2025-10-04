import { Suspense } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { StatsOverview } from "@/components/stats-overview"
import { Skeleton } from "@/components/ui/skeleton"
import { StatEntry } from "@/types/stats"
import { UserPrimeGenerator } from "@/components/user-prime-generation"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";



export default async function DashboardPage() {
  
  const STATS_URL = `${BASE_URL}/api/stats?lastMinutes=30`;
  
  const res = await fetch(STATS_URL, {cache: "no-store"});
  
  if (!res.ok) {
      console.error(`Failed to fetch stats: ${res.statusText}`);
      return <p>Failed to load dashboard data.</p>; 
  }

  const stats = await res.json() as StatEntry[];


  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-balance">Analytics Dashboard</h1>
            <p className="text-muted-foreground mt-2">Database statistics and prime number generation</p>
          </div>
        </div>

        <Suspense fallback={<StatsOverviewSkeleton />}>
          <StatsOverview stats={stats} />
        </Suspense>

        <UserPrimeGenerator />

      </main>
    </div>
  )
}

function StatsOverviewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <Skeleton className="h-96" />
    </div>
  )
}