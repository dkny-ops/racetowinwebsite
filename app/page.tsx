"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type PreviousWinner = {
  position: number;
  player_name: string;
  weekly_total: number;
};

export default function Home() {
  const [winners, setWinners] = useState<PreviousWinner[]>([]);
  const [loadingWinners, setLoadingWinners] = useState(true);

  useEffect(() => {
    async function loadWinners() {
      try {
        const response = await fetch("/api/previous-winners");
        const result = await response.json();

        if (!response.ok || !result.success) {
          setWinners([]);
          return;
        }

        setWinners(result.data || []);
      } catch (error) {
        console.error("Previous winners error:", error);
        setWinners([]);
      } finally {
        setLoadingWinners(false);
      }
    }

    loadWinners();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">

    

      {/* NAVBAR */}
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">

        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">

          <Link
            href="/"
            className="text-xl font-black tracking-[0.15em]"
          >
            RACE<span className="text-cyan-400">TO</span>WIN
          </Link>

          <div className="hidden items-center gap-8 text-sm font-bold md:flex">

            <Link
              href="/"
              className="text-white transition hover:text-cyan-400"
            >
              HOME
            </Link>

            <a
              href="/play"
              className="text-gray-400 transition hover:text-cyan-400"
            >
              PLAY
            </a>

            <a
              href="#about"
              className="text-gray-400 transition hover:text-cyan-400"
            >
              ABOUT
            </a>

          </div>

          <Link
            href="/signin"
            className="rounded-xl border border-orange-400/60 bg-orange-400/10 px-5 py-2.5 text-sm font-black tracking-wider text-orange-300 shadow-[0_0_20px_rgba(255,165,0,0.35)] transition hover:scale-105 hover:border-orange-300 hover:bg-orange-400/20 hover:text-white hover:shadow-[0_0_30px_rgba(255,165,0,0.6)]"
          >
            SIGN IN
          </Link>

        </div>

      </nav>


      {/* HERO */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-20">

        {/* Background glow */}
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[140px]" />

        <div className="relative z-10 px-6 text-center">

          <p className="mb-5 text-sm font-bold tracking-[0.6em] text-cyan-400">
            DRIVE • COMPETE • WIN
          </p>

          <h1 className="text-6xl font-black tracking-[0.08em] sm:text-8xl">
            RACE TO WIN
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-400">
            Dodge the traffic, push your limits and chase the highest score.
            How far can you go?
          </p>

          <Link
            href="/play"
            className="mt-10 inline-block rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-12 py-4 text-xl font-black tracking-wider shadow-[0_0_35px_rgba(0,212,255,0.45)] transition hover:scale-105 hover:shadow-[0_0_55px_rgba(0,212,255,0.7)]"
          >
            PLAY NOW
          </Link>

          <p className="mt-7 text-sm text-gray-600">
            Free to play • No download required
          </p>

          <a
  href="#share"
  className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-cyan-400/40 bg-zinc-900/70 px-8 py-3.5 text-sm font-black tracking-[0.2em] text-white shadow-[0_0_25px_rgba(0,212,255,0.18)] backdrop-blur-md transition hover:scale-105 hover:border-cyan-400 hover:text-cyan-300 hover:shadow-[0_0_40px_rgba(0,212,255,0.4)]"
>
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="2" />
    <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
    <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="2" />
    <path
      d="M8.6 10.7L15.4 6.3M8.6 13.3L15.4 17.7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>

  SHARE TO WIN 
</a>

<div
  id="share"
  className="mx-auto mt-8 w-full max-w-sm rounded-3xl border border-cyan-400/20 bg-zinc-950/70 p-5 text-center shadow-[0_0_35px_rgba(0,212,255,0.12)] backdrop-blur-md"
>
  <p className="text-xs font-black tracking-[0.3em] text-cyan-400">
    SHARE LEADERBOARD
  </p>

  <div
  id="shareLeaderboard"
  className="mt-4 space-y-2 text-sm font-bold text-white"
>
  {loadingWinners ? (
    <p>Loading leaderboard...</p>
  ) : winners.length > 0 ? (
    winners.map((winner) => (
      <p key={winner.position} className="text-cyan-300">
        #{winner.position} {winner.player_name} — {winner.weekly_total}
      </p>
    ))
  ) : (
    <p className="text-gray-400">No weekly winners yet.</p>
  )}
</div>

  <p className="mt-4 text-xs font-bold text-gray-500">
    🏆 $10 WEEKLY PRIZE
  </p>
</div>

        </div>

      </section>


      {/* GAME FEATURES */}
      <section
        id="about"
        className="border-t border-white/10 bg-zinc-950 px-6 py-24"
      >

        <div className="mx-auto max-w-6xl">

          <div className="mb-14 text-center">

            <p className="text-sm font-bold tracking-[0.4em] text-cyan-400">
              THE EXPERIENCE
            </p>

            <h2 className="mt-4 text-4xl font-black sm:text-5xl">
              BUILT TO RACE
            </h2>

          </div>


          <div className="grid gap-6 md:grid-cols-3">

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition hover:-translate-y-1 hover:border-cyan-400/40">

              <div className="mb-5 text-4xl">
                🏁
              </div>

              <h3 className="text-xl font-black">
                ENDLESS RACING
              </h3>

              <p className="mt-4 leading-relaxed text-gray-400">
                Stay on the road and survive as long as possible while the
                speed keeps increasing.
              </p>

            </div>


            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition hover:-translate-y-1 hover:border-cyan-400/40">

              <div className="mb-5 text-4xl">
                🏆
              </div>

              <h3 className="text-xl font-black">
                CHASE THE SCORE
              </h3>

              <p className="mt-4 leading-relaxed text-gray-400">
                Every second matters. Push your score higher and compete for
                the top positions.
              </p>

            </div>


            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition hover:-translate-y-1 hover:border-cyan-400/40">

              <div className="mb-5 text-4xl">
                🔥
              </div>

              <h3 className="text-xl font-black">
                GET FASTER
              </h3>

              <p className="mt-4 leading-relaxed text-gray-400">
                The longer you survive, the harder the race becomes. Can you
                handle the pressure?
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* CTA */}
      <section className="border-t border-white/10 px-6 py-24 text-center">

        <p className="text-sm font-bold tracking-[0.4em] text-cyan-400">
          READY?
        </p>

        <h2 className="mt-4 text-4xl font-black sm:text-5xl">
          START YOUR RACE
        </h2>

        <a
          href="/play"
          className="mt-8 inline-block rounded-2xl border border-cyan-400/40 bg-cyan-400/10 px-10 py-4 font-black transition hover:bg-cyan-400/20"
        >
          ENTER THE GAME
        </a>

      </section>


      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-black px-6 py-10">

        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 text-sm text-gray-500 md:flex-row">

          <p>
            © 2026 Race To Win
          </p>

          <div className="flex gap-6">

            <a
  href="/privacy"
  className="transition hover:text-white"
>
  Privacy Policy
</a>

            <a
  href="/terms"
  className="transition hover:text-white"
>
  Terms
</a>

          </div>

        </div>

      </footer>

    </main>
  );
}