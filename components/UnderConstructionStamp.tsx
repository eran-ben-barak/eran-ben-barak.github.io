"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface UnderConstructionStampProps {
  size?: number;
  className?: string;
  maxRotation?: number;
  offsetRange?: number;
}

export default function UnderConstructionStamp({ 
  size = 140, 
  className = "", 
  maxRotation = 15,
  offsetRange = 15 
}: UnderConstructionStampProps) {
  const [stampStyle, setStampStyle] = useState<React.CSSProperties | null>(null);

  useEffect(() => {
    // Randomized rotation and offset for "stamped" feel
    const rotation = (Math.random() * (maxRotation * 2)) - maxRotation;
    const topOffset = (Math.random() * offsetRange) - (offsetRange / 2);
    const rightOffset = (Math.random() * offsetRange) - (offsetRange / 2);

    setStampStyle({
      transform: `rotate(${rotation}deg)`,
      top: `${topOffset}px`,
      right: `${rightOffset}px`,
      position: "absolute",
      pointerEvents: "none",
      zIndex: 20,
      filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))",
      transition: "transform 0.3s ease-out", // Smooth entry
    });
  }, [maxRotation, offsetRange]);

  // Handle SSR by initially returning a hidden or default-positioned state
  // to avoid large layout shifts if possible, though absolute positioning helps.
  if (!stampStyle) return <div style={{ position: "absolute", opacity: 0 }} />;

  return (
    <div className={`under-construction-stamp ${className}`} style={stampStyle}>
      <Image 
        src="/assets/under_construction.svg" 
        alt="Under Construction" 
        width={size} 
        height={size}
        priority
      />
    </div>
  );
}
