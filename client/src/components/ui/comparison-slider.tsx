// components/ui/comparison-slider.tsx
"use client";

import { useRef, useState, useCallback } from "react";
import { MoveHorizontal } from "lucide-react";

interface ComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
  initial?: number;     // 0..100
  aspectRatio?: number; // e.g. 16/9
  altBefore?: string;
  altAfter?: string;
}

export default function ComparisonSlider({
  beforeImage,
  afterImage,
  beforeLabel = "Before",
  afterLabel = "After",
  className = "",
  initial = 50,
  aspectRatio,
  altBefore = "Before comparison",
  altAfter = "After comparison",
}: ComparisonSliderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(() => Math.max(0, Math.min(100, initial)));

  const setFromClientX = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, pct)));
  }, []);

  const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setFromClientX(e.clientX);
  };
  const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) setFromClientX(e.clientX);
  };
  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    const step = e.shiftKey ? 10 : 2;
    if (e.key === "ArrowLeft") { e.preventDefault(); setPos((p) => Math.max(0, p - step)); }
    if (e.key === "ArrowRight") { e.preventDefault(); setPos((p) => Math.min(100, p + step)); }
    if (e.key === "Home") { e.preventDefault(); setPos(0); }
    if (e.key === "End") { e.preventDefault(); setPos(100); }
  };

  // For clip-path: reveal from left → right
  const rightInset = 100 - pos; // % to hide from the right side

  return (
    <div
      ref={ref}
      className={[
        "relative select-none overflow-hidden rounded-xl bg-slate-800",
        aspectRatio ? "w-full" : "h-96",
        className,
      ].join(" ")}
      style={aspectRatio ? { aspectRatio: String(aspectRatio) } : undefined}
    >
      {/* Both images occupy the exact same rect, never resized differently */}
      <img
        src={beforeImage}
        alt={altBefore}
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      {/* Top image is FULL size, clipped—so it never shifts */}
      <img
        src={afterImage}
        alt={altAfter}
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover object-center will-change-[clip-path]"
        style={{
          // Hide from the right by (100 - pos)%
          clipPath: `inset(0% ${rightInset}% 0% 0%)`,
        }}
      />

      {/* Divider line stays at the same percentage */}
      <div
        className="pointer-events-none absolute top-0 bottom-0 w-px bg-white/70"
        style={{ left: `${pos}%`, transform: "translateX(-0.5px)" }}
        aria-hidden="true"
      />

      {/* Handle */}
      <div
        role="slider"
        aria-label="Comparison slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-col-resize touch-none"
        style={{ left: `${pos}%` }}
      >
        <div className="grid h-10 w-10 place-items-center rounded-full bg-black/60 shadow ring-1 ring-white/30 backdrop-blur">
          <MoveHorizontal className="text-white" size={18} />
        </div>
      </div>

      {/* Labels */}
      <div className="absolute bottom-3 left-3 rounded-md bg-black/55 px-2.5 py-1 text-xs font-medium text-white">
        {beforeLabel}
      </div>
      <div className="absolute bottom-3 right-3 rounded-md bg-teal-600/90 px-2.5 py-1 text-xs font-semibold text-white">
        {afterLabel}
      </div>
    </div>
  );
}
