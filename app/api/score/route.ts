import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const RACE_TO_WIN_GAME_ID = "a83a0ab2-5549-4d45-95de-6b458d1142cd";

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const playerId = String(body.player_id || "");
        const playerName = String(body.player_name || "PLAYER");
        const score = Math.floor(Number(body.score));

        if (!playerId) {
            return NextResponse.json(
                { error: "Invalid player_id" },
                { status: 400 }
            );
        }

        if (!Number.isFinite(score) || score < 0 || score > 10000000) {
            return NextResponse.json(
                { error: "Invalid score" },
                { status: 400 }
            );
        }

        const { data, error } = await supabaseAdmin.rpc(
            "submit_verified_score",
            {
                p_player_id: playerId,
                p_player_name: playerName,
                p_score: score,
                p_game_id: RACE_TO_WIN_GAME_ID
            }
        );

        if (error) {
            console.error("Verified score error:", error);

            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data
        });

    } catch (error) {
        console.error("Score API error:", error);

        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const { data, error } = await supabaseAdmin
            .from("daily_scores")
            .select(
                "player_id, player_name, daily_total, score_date, game_id"
            )
            .eq("game_id", RACE_TO_WIN_GAME_ID)
            .order("daily_total", { ascending: false });

        if (error) {
            console.error("World scores error:", error);

            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data
        });

    } catch (error) {
        console.error("World scores API error:", error);

        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}

