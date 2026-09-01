import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const RACE_TO_WIN_GAME_ID =
    "a83a0ab2-5549-4d45-95de-6b458d1142cd";

export async function GET() {
    try {
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

        return NextResponse.json({
            success: true,
            data: data || []
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