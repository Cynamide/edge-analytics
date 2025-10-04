import { Activity } from "lucide-react"

export function DashboardHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Observability</h2>
              <p className="text-xs text-muted-foreground">Production Environment</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-muted-foreground">Live</span>
            </div>
            <select className="bg-secondary text-foreground px-3 py-1.5 rounded-md text-sm border border-border">
              <option>Last 12 hours</option>
              <option>Last 24 hours</option>
              <option>Last 7 days</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  )
}
