"use server"

import { getConsecutivePrimes } from "@/utils/prime"
import { rateLimit } from "@/utils/rateLimit"
import { NextRequest, NextResponse } from "next/server"
import { getCloudflareContext } from "@opennextjs/cloudflare";


export async function generatePrimes(limit: number): Promise<number[]> {
    // Simulate some processing time
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (limit < 2) return []

    const primes: number[] = []
    const isPrime = new Array(limit + 1).fill(true)
    isPrime[0] = isPrime[1] = false

    for (let i = 2; i <= limit; i++) {
        if (isPrime[i]) {
            primes.push(i)
            for (let j = i * i; j <= limit; j += i) {
                isPrime[j] = false
            }
        }
    }

    return primes
}

export async function handleStats(request: NextRequest): Promise<Response> {
    try {
        const lastMinutes = parseInt(new URL(request.url).searchParams.get("lastMinutes") || "30");
        const env = (await getCloudflareContext({ async: true })).env as Env;
        const query = `
    SELECT name,
           COUNT(*) as requests,
           AVG(latency) as avg_latency,
           MAX(latency) as max_latency,
           MIN(latency) as min_latency
    FROM request_logs
    WHERE ts >= datetime('now', ?)
    GROUP BY name
    ORDER BY avg_latency ASC;
  `;

        const rows = await env.prod_d1_analytics.prepare(query)
            .bind(`-${lastMinutes} minutes`)
            .all();

        return NextResponse.json(rows.results ?? []);
    } catch (error) {
        console.error("Error in handleStats:", error);
        return NextResponse.json({ ok: false, error: 'Internal Server Error' }, { status: 500 });
    }

}

export async function handleLog(request: NextRequest): Promise<Response> {
    try {
        const env = (await getCloudflareContext({ async: true })).env as Env;
        const body = await request.json<{ name: string, latency: number }>();
        const ts = new Date().toISOString();
        await env.prod_d1_analytics.prepare(
            `INSERT INTO request_logs (name, latency, ts) VALUES (?, ?, ?)`
        )
            .bind(body.name, body.latency, ts)
            .run();
        // return back the data received with timestamp
        return NextResponse.json({ ok: true, data: { ...body, ts } });
    } catch (error) {
        console.error("Error in handleLog:", error);
        return NextResponse.json({ ok: false, error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function handlePrimes(request: NextRequest): Promise<Response> {
    try {
        const env = (await getCloudflareContext({ async: true })).env as Env;
        const url = new URL(request.url);
        const body = { name: url.searchParams.get("name") || "unknown" };

        if (!body.name.trim()) {
            return new Response("Name is required", { status: 400 });
        }


        // rate limit
        const allowed = await rateLimit(env.RATE_LIMIT, body.name);
        if (!allowed) {
            return NextResponse.json({ ok: false, error: "Rate limit exceeded. Please try again later." }, { status: 429 });
        }

        const primes = getConsecutivePrimes(2, 5);

        return NextResponse.json({ ok: true, data: { primes } });

    } catch (error) {
        console.error("Error in GET /api/primes:", error);
        return NextResponse.json({ ok: false, error: 'Internal Server Error' }, { status: 500 });
    }
}