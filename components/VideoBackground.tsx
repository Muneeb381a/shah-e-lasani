"use client";

import { useRef, useEffect } from "react";

type Props = {
  src: string;
  overlay?: number;
  children?: React.ReactNode;
  height?: string;
  style?: React.CSSProperties;
};

export default function VideoBackground({
  src,
  overlay = 0.55,
  children,
  height = "100%",
  style,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height, overflow: "hidden", background: "#080808", ...style }}>

      {/* Video — visible right away, no opacity trick */}
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          objectFit: "cover",
        }}
      />

      {/* Dark overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: `rgba(0,0,0,${overlay})`,
      }} />

      {/* Bottom gradient */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: "35%",
        background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
        pointerEvents: "none",
      }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2, height: "100%" }}>
        {children}
      </div>
    </div>
  );
}
