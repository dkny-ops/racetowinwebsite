import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const RACE_TO_WIN_GAME_ID =
    "a83a0ab2-5549-4d45-95de-6b458d1142cd";

export async function GET() {
    try {
        const supabaseAdmin = getSupabaseAdmin();

        if (!supabaseAdmin) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Supabase is not configured in this environment."
                },
                { status: 503 }
            );
        }

        const { data, error } = await supabaseAdmin
            .from("previous_winners")
            .select(
                "position, player_name, weekly_total, week_start, week_end"
            )
            .eq("game_id", RACE_TO_WIN_GAME_ID)
            .order("position", { ascending: true })
            .limit(3);

        if (error) {
            console.error(
                "Previous winners error:",
                error
            );

            return NextResponse.json(
                {
                    success: false,
                    error: error.message
                },
                { status: 500 }
            );
        }

        // Cachear la respuesta por 60 segundos usando headers HTTP
        return NextResponse.json({
            success: true,
            data: data || []
        }, {
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
            }
        });

    } catch (error) {
        console.error(
            "Previous winners API error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                error: "Server error"
            },
            { status: 500 }
        );
    }
}
