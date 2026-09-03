import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { checkServerRateLimit, getRequestIp } from "@/lib/server-validation";

const RACE_TO_WIN_GAME_ID = "a83a0ab2-5549-4d45-95de-6b458d1142cd";

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

        if (
            !Number.isFinite(score) ||
            score < 0 ||
            score > 10000000
        ) {
            return NextResponse.json(
                { error: "Invalid score" },
                { status: 400 }
            );
        }

        const supabaseAdmin = getSupabaseAdmin();

        if (!supabaseAdmin) {
            return NextResponse.json(
                { error: "Supabase is not configured in this environment." },
                { status: 503 }
            );
        }

        const {
            data: registration,
            error: registrationError
        } = await supabaseAdmin.rpc(
            "register_player",
            {
                p_player_id: playerId,
                p_player_name: playerName
            }
        );

        if (registrationError) {
            console.error(
                "Player registration error:",
                registrationError
            );

            return NextResponse.json(
                { error: registrationError.message },
                { status: 500 }
            );
        }

        if (!registration?.success) {
            return NextResponse.json(
                {
                    error:
                        registration?.error ||
                        "Name already taken"
                },
                { status: 409 }
            );
        }

        const {
            data,
            error
        } = await supabaseAdmin.rpc(
            "submit_verified_score",
            {
                p_player_id: playerId,
                p_player_name: playerName,
                p_score: score,
                p_game_id: RACE_TO_WIN_GAME_ID
            }
        );

        if (error) {
            console.error(
                "Verified score error:",
                error
            );

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
        console.error(
            "Score API error:",
            error
        );

        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        // Rate limiting para prevenir saturación
        const clientIp = getRequestIp(request);
        const rateLimit = checkServerRateLimit(`score-get:${clientIp}`, 30, 60_000);

        if (!rateLimit.ok) {
            return NextResponse.json(
                { error: `Too many requests. Retry in ${rateLimit.retryAfter}s.` },
                { status: 429 }
            );
        }

        const supabaseAdmin = getSupabaseAdmin();

        if (!supabaseAdmin) {
            return NextResponse.json(
                { error: "Supabase is not configured in this environment." },
                { status: 503 }
            );
        }

        const { searchParams } =
            new URL(request.url);

        const limit = Math.min(
            Math.max(
                Number(searchParams.get("limit")) || 50,
                1
            ),
            50
        );

        const offset = Math.max(
            Number(searchParams.get("offset")) || 0,
            0
        );

        const playerId =
            searchParams.get("player_id");

        // Pedimos 1 jugador extra para saber
        // con certeza si existe otra página.
        const { data, error } =
            await supabaseAdmin
                .from<{ player_id: string; player_name: string; total_score: number; days_played: number; game_id: string }>("world_players")
                .select(
                    "player_id, player_name, total_score, days_played, game_id"
                )
                .eq(
                    "game_id",
                    RACE_TO_WIN_GAME_ID
                )
                .order(
                    "total_score",
                    { ascending: false }
                )
                .range(
                    offset,
                    offset + limit
                );

        if (error) {
            console.error(
                "World scores error:",
                error
            );

            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        const safeData = data ?? [];
        const hasMore = safeData.length > limit;
        const pageData = safeData.slice(0, limit);

        let playerPosition = null;
        let playerData = null;

        // OPTIMIZACIÓN: Usar función SQL en Supabase en lugar de cargar todos los jugadores
        if (playerId) {
            try {
                // Primero obtener los datos del jugador
                const {
                    data: playerScoreData,
                    error: playerScoreError
                } = await supabaseAdmin
                    .from<{ player_id: string; player_name: string; total_score: number; days_played: number; game_id: string }>("world_players")
                    .select(
                        "player_id, player_name, total_score, days_played, game_id"
                    )
                    .eq("player_id", playerId)
                    .eq("game_id", RACE_TO_WIN_GAME_ID)
                    .single();

                if (!playerScoreError && playerScoreData) {
                    playerData = playerScoreData;

                    // Usar RPC para obtener la posición sin cargar todos los jugadores
                    const {
                        data: positionResult,
                        error: positionError
                    } = await supabaseAdmin.rpc(
                        "get_player_position",
                        {
                            p_player_id: playerId,
                            p_game_id: RACE_TO_WIN_GAME_ID
                        }
                    );

                    if (!positionError && positionResult) {
                        playerPosition = positionResult.position;
                    }
                }
            } catch (err) {
                console.error("Error fetching player position:", err);
                // No fallar la petición si esto falla, solo no devolver posición
            }
        }

        return NextResponse.json({
            success: true,
            data: pageData,
            player_position:
                playerPosition,
            player_data:
                playerData,
            has_more:
                hasMore
        });

    } catch (error) {
        console.error(
            "World scores API error:",
            error
        );

        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}
