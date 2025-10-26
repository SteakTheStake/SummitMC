// components/ui/image-viewer.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export interface ViewerImage {
  src: string;
  alt?: string;
}

interface ImageViewerProps {
  images: ViewerImage[];
  index: number;                     // starting index
  onClose: () => void;
  onIndexChange?: (i: number) => void;
}

export default function ImageViewer({
  images,
  index,
  onClose,
  onIndexChange,
}: ImageViewerProps) {
  const [i, setI] = useState(index);
  const [dx, setDx] = useState(0);          // drag delta
  const [dragging, setDragging] = useState(false);
  const startX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const clamp = (n: number) => (n + images.length) % images.length;

  const go = (dir: -1 | 1) => {
    const next = clamp(i + dir);
    setI(next);
    onIndexChange?.(next);
  };

  // Body scroll lock + key handlers
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
    };

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [i, images.length, onClose]);

  // Close on backdrop click
  const onBackdropClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === containerRef.current) onClose();
  };

  // Pointer swipe
  const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    startX.current = e.clientX;
    setDragging(true);
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (!dragging || startX.current == null) return;
    setDx(e.clientX - startX.current);
  };
  const onPointerUp: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (!dragging) return;
    setDragging(false);
    const threshold = Math.min(160, window.innerWidth * 0.12);
    if (dx > threshold) go(-1);
    else if (dx < -threshold) go(1);
    setDx(0);
    startX.current = null;
  };

  const current = images[i];

  // Preload neighbors
  useEffect(() => {
    const prev = new Image();
    const next = new Image();
    prev.src = images[clamp(i - 1)].src;
    next.src = images[clamp(i + 1)].src;
  }, [i, images]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[999] bg-black/90 backdrop-blur-sm flex items-center justify-center"
      onClick={onBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      {/* Close */}
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
      >
        <X size={20} />
      </button>

      {/* Prev / Next */}
      <button
        onClick={() => go(-1)}
        aria-label="Previous image"
        className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={() => go(1)}
        aria-label="Next image"
        className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white"
      >
        <ChevronRight size={24} />
      </button>

      {/* Stage */}
      <div
        className="max-w-[min(95vw,1400px)] max-h-[90vh] w-[95vw] h-[80vh] flex items-center justify-center select-none touch-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <img
          src={current.src}
          alt={current.alt ?? "Screenshot"}
          className="max-h-full max-w-full object-contain will-change-transform"
          style={{
            transform: dragging ? `translateX(${dx}px)` : "translateX(0)",
            transition: dragging ? "none" : "transform 180ms ease",
          }}
          draggable={false}
        />
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/70">
        Swipe or use arrows • {i + 1}/{images.length}
      </div>
    </div>
  );
}
