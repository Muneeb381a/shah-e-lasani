"use client";

import { useEffect, useRef, useState, ReactNode, CSSProperties } from "react";

type Direction = "up" | "left" | "right" | "none";

const HIDDEN: Record<Direction, CSSProperties> = {
  up:    { opacity: 0, transform: "translateY(60px)" },
  left:  { opacity: 0, transform: "translateX(-60px)" },
  right: { opacity: 0, transform: "translateX(60px)" },
  none:  { opacity: 0, transform: "none" },
};

export default function FadeIn({
  children,
  delay = 0,
  direction = "up",
  className = "",
  style = {},
}: {
  children: ReactNode;
  delay?: number;
  direction?: Direction;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...(visible ? { opacity: 1, transform: "none" } : HIDDEN[direction]),
        transition: `opacity 0.8s ease ${delay}ms, transform 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        willChange: "opacity, transform",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
