import { ImageResponse } from "next/og";
import { OWNER } from "@/lib/config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Raghavsai Tirupati – Résumé";

// A Docs-style thumbnail of the résumé page for link sharing.
export default function OpengraphImage() {
  const line = (w: number, o = 0.16) => (
    <div style={{ height: 12, width: w, borderRadius: 6, background: `rgba(31,31,31,${o})` }} />
  );
  const chip = (label: string) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: 30,
        padding: "0 14px",
        borderRadius: 999,
        background: "#e8f0fe",
        color: "#0b57d0",
        fontSize: 20,
        fontWeight: 600,
      }}
    >
      {label}
    </div>
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg,#eef3fb,#f9fbfd)",
          padding: 64,
        }}
      >
        <div
          style={{
            width: 1000,
            height: 500,
            background: "#ffffff",
            borderRadius: 14,
            boxShadow: "0 24px 60px rgba(31,41,55,0.18)",
            display: "flex",
            flexDirection: "column",
            padding: 56,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 34 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                background: "#0b57d0",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              {OWNER.initials}
            </div>
            <div style={{ fontSize: 22, color: "#5f6368" }}>Raghavsai Tirupati – Résumé</div>
          </div>

          <div style={{ fontSize: 62, fontWeight: 700, color: "#1f1f1f", letterSpacing: -1 }}>
            {OWNER.name}
          </div>
          <div style={{ fontSize: 28, color: "#444746", marginTop: 8 }}>
            Software Engineer · Dallas, TX
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 30 }}>
            {chip("Brinks Home")}
            {chip("ClinicalHours")}
            {chip("ACSI")}
            {chip("Iris")}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 40 }}>
            {line(820)}
            {line(760)}
            {line(800, 0.1)}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
