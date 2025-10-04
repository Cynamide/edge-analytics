"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Loader2, CheckCircle2 } from "lucide-react"

export function UserPrimeGenerator() {
  const [name, setName] = useState("")
  const [primes, setPrimes] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const [latency, setLatency] = useState<number | null>(null)
  const [logged, setLogged] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!name.trim()) {
      setError("Please enter your name")
      return
    }

    setLoading(true)
    setError(null)
    setLogged(false)

    const startTime = performance.now()

    try {
      const response = await fetch(`/api/primes?name=${name}`).then((res) => {
        if (!res.ok) {
          if (res.status === 429) {
            throw new Error("Rate limit exceeded. Please try again later.")
          }
          throw new Error(`Error: ${res.status} ${res.statusText}`)
        }
        setLoading(false)
        return res
      })

    const data: { ok: boolean, data: { primes: number[] } } = await response.json()
    const endTime = performance.now()
    const requestLatency = Math.round(endTime - startTime)
    setPrimes(data.data.primes || [])
    setLatency(requestLatency)

    // log the request
    await fetch("/api/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          latency: requestLatency,
        }),
    })

    setLogged(true)
    } catch (err) {
      console.error("[v0] Error generating primes:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
    }
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <User className="w-5 h-5 text-primary" />
          User Prime Generator
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your name to generate primes and log your request
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="userName" className="text-foreground">
            Your Name
          </Label>
          <div className="flex gap-4 flex-wrap">
            <Input
              id="userName"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              className="max-w-[250px] bg-secondary border-border text-foreground"
              disabled={loading}
            />
            <Button
              onClick={handleGenerate}
              disabled={loading || !name.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Primes"
              )}
            </Button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {primes.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm">
              <div className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg font-medium">Latency: {latency}ms</div>
              {logged && (
                <div className="flex items-center gap-1.5 text-green-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-sm">Logged successfully</span>
                </div>
              )}
            </div>

            <div className="p-4 bg-secondary rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-2">
                Generated <span className="text-primary font-semibold">{primes.length}</span> prime numbers for{" "}
                <span className="text-foreground font-semibold">{name}</span>
              </p>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {primes.map((prime, idx) => (
                  <span key={idx} className="px-2 py-1 bg-primary/10 text-primary rounded text-sm font-mono">
                    {prime}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
