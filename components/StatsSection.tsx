"use client";

import { useEffect, useRef, useState } from "react";

const STATS = [
  { target: 15, suffix: "k+",   label: "Orders Delivered",  icon: "📦", isDecimal: false },
  { target: 4.9, suffix: "★",   label: "Customer Rating",   icon: "⭐", isDecimal: true  },
  { target: 30,  suffix: "min", label: "Avg Delivery Time", icon: "⚡", isDecimal: false },
  { target: 50,  suffix: "+",   label: "Menu Items",        icon: "🍽️", isDecimal: false },
];

function CountUp({ target, suffix, isDecimal, trigger }: {
  target: number; suffix: string; isDecimal: boolean; trigger: boolean;
}) {
  const [value, setValue] = useState(isDecimal ? "0.0" : "0");

  useEffect(() => {
    if (!trigger) return;
    const duration = 2000;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(isDecimal ? (eased * target).toFixed(1) : Math.round(eased * target).toString());
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [trigger, target, isDecimal]);

  return <span>{value}{suffix}</span>;
}

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} style={{ background: "var(--bg-surface)", padding: "4rem 1.5rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
        }}>
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className="card-lift glass"
              style={{
                borderRadius: 20, padding: "2rem 1.5rem", textAlign: "center",
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(40px)",
                transition: `opacity 0.7s ease ${i * 120}ms, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${i * 120}ms`,
              }}
            >
              <div style={{ fontSize: "2.2rem", marginBottom: 12 }}>{stat.icon}</div>
              <div style={{
                fontFamily: "var(--font-oswald)", fontWeight: 800,
                fontSize: "clamp(2rem,5vw,2.8rem)", color: "#F5A623",
                lineHeight: 1, marginBottom: 4,
              }}>
                <CountUp target={stat.target} suffix={stat.suffix} isDecimal={stat.isDecimal} trigger={visible} />
              </div>
              <div style={{
                color: "var(--text-muted)",
                fontSize: "0.68rem", textTransform: "uppercase",
                letterSpacing: "0.2em", marginTop: 8,
                transition: "color 0.3s ease",
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
