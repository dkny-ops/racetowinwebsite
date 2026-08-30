import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {

    try {

        const body = await request.json();

        const sessionId =
            String(body.session_id || "");

        const finalScore =
            Math.floor(Number(body.final_score));

        const elapsedSeconds =
            Number(body.elapsed_seconds);

        const distance =
            Number(body.distance);

        if (!sessionId) {

            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid session_id"
                },
                { status: 400 }
            );

        }

        if (
            !Number.isFinite(finalScore) ||
            finalScore < 0
        ) {

            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid final score"
                },
                { status: 400 }
            );

        }

        if (
            !Number.isFinite(elapsedSeconds) ||
            elapsedSeconds < 0
        ) {

            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid elapsed time"
                },
                { status: 400 }
            );

        }

        if (
            !Number.isFinite(distance) ||
            distance < 0
        ) {

            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid distance"
                },
                { status: 400 }
            );

        }

        const {
            data,
            error
        } = await supabaseAdmin.rpc(
            "finish_game_session",
            {
                p_session_id:
                    sessionId,

                p_final_score:
                    finalScore,

                p_elapsed_seconds:
                    elapsedSeconds,

                p_distance:
                    distance
            }
        );

        if (error) {

            console.error(
                "Finish game session RPC error:",
                error
            );

            return NextResponse.json(
                {
                    success: false,
                    error: "Unable to finish game"
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
                        "Game session rejected"
                },
                { status: 400 }
            );

        }

        return NextResponse.json({
            success: true,
            final_score:
                data.final_score
        });

    } catch (error) {

        console.error(
            "Finish game session API error:",
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