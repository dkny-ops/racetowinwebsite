import { supabase } from "@/lib/supabase";

export default async function TestSupabase() {
  const { data, error } = await supabase
    .from("games")
    .select("name, slug");

  return (
    <main className="min-h-screen bg-black p-10 text-white">
      <h1 className="text-3xl font-bold">
        Supabase Test
      </h1>

      {error && (
        <p className="mt-6 text-red-400">
          ERROR: {error.message}
        </p>
      )}

      {data && (
        <pre className="mt-6 text-green-400">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </main>
  );
}