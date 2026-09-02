import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import {
  checkServerRateLimit,
  getRequestIp,
  isUuid,
} from "@/lib/server-validation";

const RACE_TO_WIN_GAME_ID = "a83a0ab2-5549-4d45-95de-6b458d1142cd";

export async function POST(request: Request) {
  try {
    const clientIp = getRequestIp(request);
    const rateLimit = checkServerRateLimit(`start-game:${clientIp}`, 25, 60_000);

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
    const playerId = String(body.player_id || "").trim();

    if (!playerId || !isUuid(playerId)) {
      return NextResponse.json(
        { success: false, error: "Invalid player_id" },
        { status: 400 },
      );
    }

    const supabaseAdmin = getSupabaseAdmin();

    if (!supabaseAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: "Supabase is not configured in this environment.",
        },
        { status: 503 },
      );
    }

    const { data, error } = await supabaseAdmin.rpc("start_game_session", {
      p_player_id: playerId,
      p_game_id: RACE_TO_WIN_GAME_ID,
    });

    if (error) {
      console.error("Start game session error:", error);
      return NextResponse.json(
        { success: false, error: "Unable to start game" },
        { status: 500 },
      );
    }

    if (!data?.success) {
      return NextResponse.json(
        { success: false, error: data?.error || "Unable to start game" },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      session_id: data.session_id,
    });
  } catch (error) {
    console.error("Game session API error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}