"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendCode() {
    if (!email.trim()) {
      setMessage("Enter your email.");
      return;
    }

    if (!supabase || !supabase.auth || !supabase.auth.signInWithOtp) {
      setMessage("Supabase is not configured in this local environment.");
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setCodeSent(true);
    setMessage("Check your email for your verification code.");
  }

  async function verifyCode() {
    if (!code.trim()) {
      setMessage("Enter the code.");
      return;
    }

    if (!supabase || !supabase.auth || !supabase.auth.verifyOtp) {
      setMessage("Supabase is not configured in this local environment.");
      return;
    }

    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: code.trim(),
      type: "email",
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    const sessionResult = await supabase.auth.getSession();
    const sessionUserId = sessionResult?.data?.session?.user?.id || data?.user?.id || null;
    const userResult = await supabase.auth.getUser();
    const verifiedUserId = userResult?.data?.user?.id || sessionUserId || email.trim();
    const authEmail = email.trim();

    if (!verifiedUserId) {
      setMessage("Verification succeeded but we could not read the authenticated user. Please try again.");
      return;
    }

    localStorage.setItem("raceToWinAuthUserId", verifiedUserId);
    localStorage.setItem("raceToWinAuthEmail", authEmail);
    localStorage.removeItem("raceToWinPlayerId");
    localStorage.removeItem("raceToWinPlayerName");

    setMessage("Verified! Redirecting to the game...");
    router.replace("/play");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      
<div className="w-full max-w-sm rounded-3xl border border-orange-400/30 bg-zinc-950/90 p-6 text-center shadow-[0_0_40px_rgba(255,165,0,0.15)]">

        <h1 className="text-2xl font-black tracking-[0.12em]">
          RACE<span className="text-cyan-400">TO</span>WIN
        </h1>

        <p className="mt-3 text-sm font-bold tracking-[0.3em] text-orange-300">
          SIGN IN
        </p>

        <p className="mt-6 text-sm text-gray-400">
          Enter your email and we&apos;ll send you a verification code.
        </p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-6 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-orange-400"
        />

        {!codeSent ? (
          <button
            type="button"
            onClick={sendCode}
            disabled={loading}
            className="mt-4 w-full rounded-xl bg-gradient-to-r from-orange-400 to-orange-600 px-5 py-3 font-black text-black transition hover:scale-[1.02] disabled:opacity-50"
          >
            {loading ? "SENDING..." : "SEND CODE"}
          </button>
        ) : (
          <>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="Verification code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="mt-4 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-xl font-black tracking-[0.4em] text-white outline-none transition placeholder:text-gray-600 focus:border-orange-400"
            />

            <button
              type="button"
              onClick={verifyCode}
              disabled={loading}
              className="mt-4 w-full rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 font-black transition hover:scale-[1.02] disabled:opacity-50"
            >
              {loading ? "VERIFYING..." : "VERIFY CODE"}
            </button>
          </>
        )}

        {message && (
          <p className="mt-5 text-sm font-bold text-orange-300">
            {message}
          </p>
        )}

        <Link
          href="/"
          className="mt-6 inline-block text-sm font-bold text-gray-500 transition hover:text-white"
        >
          ← Back to Race To Win
        </Link>

      </div>
    </main>
  );
}
