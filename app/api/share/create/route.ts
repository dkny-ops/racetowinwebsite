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

        if (!playerId) {

            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid player"
                },
                {
                    status: 400
                }
            );
        }

        const {
            data: player,
            error: playerError
        } = await supabaseAdmin
            .from("players")
            .select("player_id, player_name")
            .eq("player_id", playerId)
            .maybeSingle();

        if (playerError) {

            console.error(
                "Share player lookup error:",
                playerError
            );

            return NextResponse.json(
                {
                    success: false,
                    error: "Unable to verify player"
                },
                {
                    status: 500
                }
            );
        }

        if (!player) {

            return NextResponse.json(
                {
                    success: false,
                    error: "Player not registered"
                },
                {
                    status: 404
                }
            );
        }

        const {
            data,
            error
        } = await supabaseAdmin.rpc(
            "create_share_referral",
            {
                p_referrer_player_id:
                    player.player_id
            }
        );

        if (error) {

            console.error(
                "Share referral error:",
                error
            );

            return NextResponse.json(
                {
                    success: false,
                    error: "Unable to create share link"
                },
                {
                    status: 500
                }
            );
        }

        if (!data?.success) {

            return NextResponse.json(
                {
                    success: false,
                    error:
                        data?.error ||
                        "Unable to create share link"
                },
                {
                    status: 400
                }
            );
        }

        return NextResponse.json({

            success: true,

            referral_code:
                data.referral_code,

            player_name:
                player.player_name

        });

    } catch (error) {

        console.error(
            "Share create request error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                error: "Invalid request"
            },
            {
                status: 400
            }
        );
    }
}