import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {

    try {

        const body = await request.json();

        const playerId =
            String(body.player_id || "").trim();

        const playerName =
            String(body.player_name || "").trim();

        if (!playerId) {

            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid player_id"
                },
                { status: 400 }
            );
        }

        if (!playerName) {

            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid player name"
                },
                { status: 400 }
            );
        }

        if (playerName.length > 30) {

            return NextResponse.json(
                {
                    success: false,
                    error: "Player name too long"
                },
                { status: 400 }
            );
        }

        const {
            data,
            error
        } = await supabaseAdmin.rpc(
            "register_player",
            {
                p_player_id: playerId,
                p_player_name: playerName
            }
        );

        if (error) {

            console.error(
                "Player registration error:",
                error
            );

            return NextResponse.json(
                {
                    success: false,
                    error: "Unable to register player"
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
                        "Unable to register player"
                },
                { status: 409 }
            );
        }

        return NextResponse.json({
            success: true
        });

    } catch (error) {

        console.error(
            "Register player API error:",
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