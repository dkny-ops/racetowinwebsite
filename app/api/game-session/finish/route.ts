import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  checkServerRateLimit,
  getRequestIp,
  isUuid,
  parseFiniteNumber,
} from "@/lib/server-validation";

export async function POST(request: Request) {
  try {
    const clientIp = getRequestIp(request);
    const rateLimit = checkServerRateLimit(`finish-game:${clientIp}`, 25, 60_000);

    if (!rateLimit.ok) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many requests. Retry in ${rateLimit.retryAfter}s.`,
        },
        { status: 429 },
      );
    }

    const body = await request.json();
    const sessionId = String(body.session_id || "").trim();
    const finalScore = parseFiniteNumber(body.final_score, { min: 0, max: 10_000_000, integer: true });
    const elapsedSeconds = parseFiniteNumber(body.elapsed_seconds, { min: 0, max: 86_400, integer: true });
    const distance = parseFiniteNumber(body.distance, { min: 0, max: 1_000_000 });

    if (!sessionId || !isUuid(sessionId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid session_id",
        },
        { status: 400 },
      );
    }

    if (finalScore === null || elapsedSeconds === null || distance === null) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid game payload",
        },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseAdmin.rpc("finish_game_session", {
      p_session_id: sessionId,
      p_final_score: finalScore,
      p_elapsed_seconds: elapsedSeconds,
      p_distance: distance,
    });

    if (error) {
      console.error("Finish game session RPC error:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Unable to finish game",
        },
        { status: 500 },
      );
    }

    if (!data?.success) {
      return NextResponse.json(
        {
          success: false,
          error: data?.error || "Game session rejected",
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      final_score: data.final_score,
    });
  } catch (error) {
    console.error("Finish game session API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Server error",
      },
      { status: 500 },
    );
  }
}