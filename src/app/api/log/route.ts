import { type NextRequest, NextResponse } from "next/server"
import { handleLog } from "@/lib/actions";

export async function POST(request: NextRequest): Promise<Response> {
    try {
        return handleLog(request);
    } catch (error) {
        console.error("Error in POST /api/log:", error);
        return NextResponse.json({ ok: false, error: 'Internal Server Error' }, { status: 500 });
    }
}

