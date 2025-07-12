import { useState, useRef, useEffect } from "react";
import { MoveHorizontal } from "lucide-react";

import _2025_03_28_23_03_19 from "@assets/2025-03-28_23.03.19.webp";

interface ComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export default function ComparisonSlider({
  beforeImage,
  afterImage,
  beforeLabel = "Before",
  afterLabel = "After",
  className = ""
}: ComparisonSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "grabbing";
    } else {
      document.body.style.cursor = "default";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "default";
    };
  }, [isDragging]);

  return (
    <div 
      ref={sliderRef}
      className={`comparison-slider bg-slate-700 rounded-xl overflow-hidden relative h-96 ${className}`}
    >
      {/* Before Image */}
      <img 
        src={_2025_03_28_23_03_19} 
        alt="Before comparison"
        className="w-full h-full object-cover"
        draggable={false}
      />
      {/* After Image */}
      <div 
        className="after-image"
        style={{ width: `${sliderPosition}%` }}
      >
        <img 
          src="https://oyster.ignimgs.com/mediawiki/apis.ign.com/minecraft/8/8e/Ruined_Portal_-_Small.png" 
          alt="After comparison"
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>
      {/* Slider Handle */}
      <div 
        className="comparison-handle"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={handleMouseDown}
      >
        <MoveHorizontal className="text-white" size={20} />
      </div>
      {/* Labels */}
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 px-3 py-1 rounded-md text-sm pointer-events-none">
        {beforeLabel}
      </div>
      <div className="absolute bottom-4 right-4 bg-teal-600 bg-opacity-90 px-3 py-1 rounded-md text-sm font-semibold pointer-events-none">
        {afterLabel}
      </div>
    </div>
  );
}
