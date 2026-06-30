"use client";

import { useEffect, useRef, useState } from "react";

const STAT_ICONS = [
  <svg key="pkg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 32, height: 32 }}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  <svg key="star" viewBox="0 0 24 24" fill="currentColor" stroke="none" style={{ width: 32, height: 32 }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  <svg key="clock" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 32, height: 32 }}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  <svg key="menu" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 32, height: 32 }}><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
];

const STATS = [
  { target: 15, suffix: "k+",   label: "Orders Delivered",  isDecimal: false },
  { target: 4.9, suffix: "★",   label: "Customer Rating",   isDecimal: true  },
  { target: 30,  suffix: "min", label: "Avg Delivery Time", isDecimal: false },
  { target: 50,  suffix: "+",   label: "Menu Items",        isDecimal: false },
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
              <div style={{ color: "#F5A623", marginBottom: 12, display: "flex", justifyContent: "center" }}>{STAT_ICONS[i]}</div>
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
