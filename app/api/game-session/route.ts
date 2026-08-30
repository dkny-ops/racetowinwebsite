import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const RACE_TO_WIN_GAME_ID =
    "a83a0ab2-5549-4d45-95de-6b458d1142cd";

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {

    try {

        const body = await request.json();

        const playerId =
            String(body.player_id || "");

        if (!playerId) {

            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid player_id"
                },
                { status: 400 }
            );

        }

        const { data, error } =
            await supabaseAdmin.rpc(
                "start_game_session",
                {
                    p_player_id: playerId,
                    p_game_id: RACE_TO_WIN_GAME_ID
                }
            );

        if (error) {

            console.error(
                "Start game session error:",
                error
            );

            return NextResponse.json(
                {
                    success: false,
                    error: "Unable to start game"
                },
                { status: 500 }
            );

        }

        if (!data?.success) {

            return NextResponse.json(
                {
                    success: false,
                    error:
                        data?.error ||
                        "Unable to start game"
                },
                { status: 400 }
            );

        }

        return NextResponse.json({
            success: true,
            session_id: data.session_id
        });

    } catch (error) {

        console.error(
            "Game session API error:",
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
