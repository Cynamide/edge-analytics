"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Activity, Clock, TrendingUp, TrendingDown } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { useState } from "react"
import { StatsOverviewProps } from "@/types/stats"

export function StatsOverview({ stats }: StatsOverviewProps) {
  const [selectedClient, setSelectedClient] = useState<string | null>(stats.length > 0 ? stats[0].name : null)

  const totalRequests = stats.reduce((sum, stat) => sum + stat.requests, 0)
  const avgLatency =
    stats.length > 0 ? Math.round(stats.reduce((sum, stat) => sum + stat.avg_latency, 0) / stats.length) : 0
  const maxLatency = stats.length > 0 ? Math.max(...stats.map((s) => s.max_latency)) : 0
  const minLatency = stats.length > 0 ? Math.min(...stats.map((s) => s.min_latency)) : 0

  const selectedStat = stats.find((s) => s.name === selectedClient)

  const latencyData = selectedStat
    ? [
        { metric: "Min", value: selectedStat.min_latency },
        { metric: "Avg", value: selectedStat.avg_latency },
        { metric: "Max", value: selectedStat.max_latency },
      ]
    : []

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Requests</CardTitle>
            <Activity className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalRequests.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {stats.length} client{stats.length !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Latency</CardTitle>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{avgLatency}ms</div>
            <p className="text-xs text-muted-foreground mt-1">Average response time</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Max Latency</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{maxLatency}ms</div>
            <p className="text-xs text-muted-foreground mt-1">Highest response time</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Min Latency</CardTitle>
            <TrendingDown className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{minLatency}ms</div>
            <p className="text-xs text-muted-foreground mt-1">Fastest response time</p>
          </CardContent>
        </Card>
      </div>

      {stats.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Client Performance Details</CardTitle>
            <CardDescription className="text-muted-foreground">
              Select a client to view their request and latency information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Client selector buttons */}
            <div className="flex flex-wrap gap-2">
              {stats.map((stat) => (
                <button
                  key={stat.name}
                  onClick={() => setSelectedClient(stat.name)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedClient === stat.name
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {stat.name}
                </button>
              ))}
            </div>

            {/* Selected client stats */}
            {selectedStat && (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="text-sm text-muted-foreground mb-1">Requests</div>
                    <div className="text-2xl font-bold text-foreground">{selectedStat.requests.toLocaleString()}</div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="text-sm text-muted-foreground mb-1">Min Latency</div>
                    <div className="text-2xl font-bold text-foreground">{selectedStat.min_latency}ms</div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="text-sm text-muted-foreground mb-1">Avg Latency</div>
                    <div className="text-2xl font-bold text-foreground">{selectedStat.avg_latency}ms</div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="text-sm text-muted-foreground mb-1">Max Latency</div>
                    <div className="text-2xl font-bold text-foreground">{selectedStat.max_latency}ms</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {stats.length === 0 && (
        <Card className="bg-card border-border">
          <CardContent className="py-12 text-center">
            <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Statistics Available</h3>
            <p className="text-sm text-muted-foreground">
              No request logs found in the database. Generate some prime numbers to create logs!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
