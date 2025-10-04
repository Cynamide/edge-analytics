import { NextResponse, type NextRequest } from "next/server"
import { handlePrimes } from "@/lib/actions";


export async function GET(request: NextRequest): Promise<Response> {
    try {
        return handlePrimes(request);
    } catch (error) {
        console.error("Error in GET /api/primes:", error);
        return NextResponse.json({ ok: false, error: 'Internal Server Error' }, { status: 500 });
    }
}