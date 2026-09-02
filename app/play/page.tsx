"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function PlayPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function ensureAuthorized() {
      try {
        const { data } = await supabase.auth.getSession();

        if (!data.session) {
          router.replace("/signin");
          return;
        }

        localStorage.setItem("raceToWinAuthUserId", data.session.user.id);
        localStorage.setItem("raceToWinAuthEmail", data.session.user.email || "");
        setReady(true);
      } catch {
        router.replace("/signin");
      }
    }

    ensureAuthorized();
  }, [router]);

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <p className="text-sm font-bold tracking-[0.4em] text-cyan-400">VERIFYING ACCESS</p>
          <p className="mt-4 text-gray-400">Please sign in to continue.</p>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        margin: 0,
        padding: 0,
        position: "relative",
        background: "black",
      }}
    >
      <Link
        href="/"
        style={{
          position: "absolute",
          top: "15px",
          right: "15px",
          zIndex: 100,
          padding: "10px 18px",
          borderRadius: "12px",
          background: "rgba(0,0,0,0.65)",
          border: "1px solid rgba(0,212,255,0.5)",
          color: "white",
          textDecoration: "none",
          fontWeight: "bold",
          fontSize: "14px",
          backdropFilter: "blur(8px)",
        }}
      >
        HOME
      </Link>

      <iframe
        src="/game/index.html"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
        title="Race To Win"
      />
    </main>
  );
}
