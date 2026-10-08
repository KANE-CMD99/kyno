"use client";

import { useEffect, useRef, useState } from "react";

export default function ReadingProgress() {
  const [pct, setPct] = useState(0);
  const frame = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      // rAF 节流：scroll 事件每秒可能触发上百次。
      if (frame.current) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = 0;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setPct(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-[200] h-[3px] bg-transparent" aria-hidden="true">
      <div className="h-full bg-blue-600 transition-[width] duration-150" style={{ width: `${pct}%` }} />
    </div>
  );
}
