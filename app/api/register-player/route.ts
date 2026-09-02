import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import {
  checkServerRateLimit,
  getRequestIp,
  isUuid,
  sanitizePlayerName,
} from "@/lib/server-validation";

export async function POST(request: Request) {
  try {
    const clientIp = getRequestIp(request);
    const rateLimit = checkServerRateLimit(`register-player:${clientIp}`, 20, 60_000);

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
    const playerName = sanitizePlayerName(String(body.player_name || ""));

    if (!playerId || !isUuid(playerId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid player_id",
        },
        { status: 400 },
      );
    }

    if (!playerName) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid player name",
        },
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

    const { data, error } = await supabaseAdmin.rpc("register_player", {
      p_player_id: playerId,
      p_player_name: playerName,
    });

    if (error) {
      console.error("Player registration error:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Unable to register player",
        },
        { status: 500 },
      );
    }

    if (!data?.success) {
      return NextResponse.json(
        {
          success: false,
          error: data?.error || "Unable to register player",
        },
        { status: 409 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Register player API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Server error",
      },
      { status: 500 },
    );
  }
}