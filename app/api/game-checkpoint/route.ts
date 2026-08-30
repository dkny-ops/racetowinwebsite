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

        const checkpointScore =
            Math.floor(Number(body.checkpoint_score));

        const elapsedSeconds =
            Number(body.elapsed_seconds);

        const distance =
            Number(body.distance);

        const speed =
            Number(body.speed);

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
            !Number.isFinite(checkpointScore) ||
            checkpointScore <= 0 ||
            checkpointScore % 2000 !== 0
        ) {

            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid checkpoint"
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

        if (
            !Number.isFinite(speed) ||
            speed < 0
        ) {

            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid speed"
                },
                { status: 400 }
            );

        }

        const {
            data,
            error
        } = await supabaseAdmin.rpc(
            "save_game_checkpoint",
            {
                p_session_id:
                    sessionId,

                p_checkpoint_score:
                    checkpointScore,

                p_elapsed_seconds:
                    elapsedSeconds,

                p_distance:
                    distance,

                p_speed:
                    speed
            }
        );

        if (error) {

            console.error(
                "Checkpoint RPC error:",
                error
            );

            return NextResponse.json(
                {
                    success: false,
                    error: "Unable to save checkpoint"
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
                        "Checkpoint rejected"
                },
                { status: 400 }
            );

        }

        return NextResponse.json({
            success: true,
            checkpoint_score:
                data.checkpoint_score
        });

    } catch (error) {

        console.error(
            "Game checkpoint API error:",
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