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
    const rateLimit = checkServerRateLimit(`checkpoint:${clientIp}`, 50, 60_000);

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
    const checkpointScore = parseFiniteNumber(body.checkpoint_score, {
      min: 2000,
      max: 10_000_000,
      integer: true,
    });
    const elapsedSeconds = parseFiniteNumber(body.elapsed_seconds, {
      min: 0,
      max: 86_400,
      integer: true,
    });
    const distance = parseFiniteNumber(body.distance, { min: 0, max: 1_000_000 });
    const speed = parseFiniteNumber(body.speed, { min: 0, max: 500 });

    if (!sessionId || !isUuid(sessionId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid session_id",
        },
        { status: 400 },
      );
    }

    if (
      checkpointScore === null ||
      elapsedSeconds === null ||
      distance === null ||
      speed === null ||
      checkpointScore % 2000 !== 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid checkpoint",
        },
        { status: 400 },
      );
    }

    const { data, error } = await supabaseAdmin.rpc("save_game_checkpoint", {
      p_session_id: sessionId,
      p_checkpoint_score: checkpointScore,
      p_elapsed_seconds: elapsedSeconds,
      p_distance: distance,
      p_speed: speed,
    });

    if (error) {
      console.error("Checkpoint RPC error:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Unable to save checkpoint",
        },
        { status: 500 },
      );
    }

    if (!data?.success) {
      return NextResponse.json(
        {
          success: false,
          error: data?.error || "Checkpoint rejected",
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      checkpoint_score: data.checkpoint_score,
    });
  } catch (error) {
    console.error("Game checkpoint API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Server error",
      },
      { status: 500 },
    );
  }
}