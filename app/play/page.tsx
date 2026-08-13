export default function PlayPage() {
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

      <a
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
        ← HOME
      </a>

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