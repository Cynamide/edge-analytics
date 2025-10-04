import { NextResponse, type NextRequest } from "next/server"
import { handleStats } from "@/lib/actions";


export async function GET(request: NextRequest): Promise<Response> {
    try {
        return handleStats(request);
    } catch (error) {
        return NextResponse.json({ ok: false, error: error }, { status: 500 });
    }
}