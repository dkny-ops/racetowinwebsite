import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const RACE_TO_WIN_GAME_ID = "a83a0ab2-5549-4d45-95de-6b458d1142cd";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const score = Math.floor(Number(body.score));
        const playerName = String(body.player_name || "PLAYER");

        if (!Number.isFinite(score)) {
            return NextResponse.json(
                { error: "Invalid score" },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from("scores")
            .insert({
                score,
                player_name: playerName,
                game_id: RACE_TO_WIN_GAME_ID
            })
            .select()
            .single();

        if (error) {
            console.error("Supabase score error:", error);

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
        console.error("API score error:", error);

        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const { data, error } = await supabase
            .from("scores")
            .select("id, score, player_name, created_at")
            .eq("game_id", RACE_TO_WIN_GAME_ID)
            .order("score", { ascending: false });

        if (error) {
            console.error("Supabase world scores error:", error);

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
